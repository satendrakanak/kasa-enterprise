import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailTemplatesService } from 'src/email-templates/providers/email-templates.service';
import { MailService } from 'src/mail/providers/mail.service';
import { parseTemplate } from 'src/mail/utils/template-parser';
import { ClassSession } from '../class-session.entity';

@Injectable()
export class FacultySessionEmailProvider {
  private readonly logger = new Logger(FacultySessionEmailProvider.name);

  constructor(
    private readonly mailService: MailService,
    private readonly emailTemplatesService: EmailTemplatesService,
    private readonly configService: ConfigService,
  ) {}

  async sendSessionReminder(session: ClassSession, offsetMinutes: number) {
    const batchStudents = session.batch?.students ?? [];
    const activeStudents = batchStudents.filter(
      (item) => item.status === 'active' && item.student?.email,
    );
    const recipients = [
      ...activeStudents.map((item) => ({
        type: 'student' as const,
        email: item.student.email,
        name:
          [item.student.firstName, item.student.lastName]
            .filter(Boolean)
            .join(' ') || item.student.email,
      })),
      ...(session.faculty?.email
        ? [
            {
              type: 'teacher' as const,
              email: session.faculty.email,
              name:
                [session.faculty.firstName, session.faculty.lastName]
                  .filter(Boolean)
                  .join(' ') || session.faculty.email,
            },
          ]
        : []),
    ];

    if (!recipients.length) {
      return;
    }

    const [studentTemplate, teacherTemplate] = await Promise.all([
      this.getTemplate('faculty_class_student_reminder'),
      this.getTemplate('faculty_class_teacher_reminder'),
    ]);
    const startsAt = session.startsAt.toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: session.timezone || 'Asia/Kolkata',
    });

    await Promise.all(
      recipients.map((recipient) => {
        const template =
          recipient.type === 'teacher' ? teacherTemplate : studentTemplate;
          const variables = {
            name: recipient.name,
            courseTitle: session.course.title,
            batchName: session.batch.name,
            sessionTitle: session.title,
            startsAt,
            reminderLabel: this.formatReminderOffset(offsetMinutes),
            meetingUrl: session.meetingUrl || this.getFrontendUrl(),
            location: session.location || 'Online',
            year: new Date().getFullYear().toString(),
          };

          return this.mailService.sendMail({
            to: recipient.email,
            subject: parseTemplate(template.subject, variables),
            html: parseTemplate(template.body, variables),
          });
      }),
    );
  }

  sendSessionReminderSafely(session: ClassSession, offsetMinutes: number) {
    void this.sendSessionReminder(session, offsetMinutes).catch((error) =>
      this.logger.error(
        `Failed to send class reminder for session ${session.id}`,
        error,
      ),
    );
  }

  private async getTemplate(templateName: string) {
    try {
      return await this.emailTemplatesService.getByName(templateName);
    } catch {
      return this.emailTemplatesService.getByName('faculty_class_reminder');
    }
  }

  private getFrontendUrl() {
    return (
      this.configService.get<string>('appConfig.fronEndUrl') ||
      this.configService.get<string>('appConfig.appUrl') ||
      ''
    ).replace(/\/$/, '');
  }

  private formatReminderOffset(minutes: number) {
    if (minutes % 1440 === 0) {
      const days = minutes / 1440;
      return `${days} day${days > 1 ? 's' : ''} before`;
    }

    if (minutes % 60 === 0) {
      const hours = minutes / 60;
      return `${hours} hour${hours > 1 ? 's' : ''} before`;
    }

    return `${minutes} minutes before`;
  }
}
