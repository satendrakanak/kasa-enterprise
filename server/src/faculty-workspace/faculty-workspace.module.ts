import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from 'src/courses/course.entity';
import { EmailTemplatesModule } from 'src/email-templates/email-templates.module';
import { Enrollment } from 'src/enrollments/enrollment.entity';
import { ExamAttempt } from 'src/exams/exam-attempt.entity';
import { Exam } from 'src/exams/exam.entity';
import { User } from 'src/users/user.entity';
import { BatchStudent } from './batch-student.entity';
import { ClassSession } from './class-session.entity';
import { ClassSessionsController } from './class-sessions.controller';
import { CourseBatch } from './course-batch.entity';
import { FacultyWorkspaceController } from './faculty-workspace.controller';
import { FacultySessionEmailProvider } from './providers/faculty-session-email.provider';
import { FacultySessionReminderScheduler } from './providers/faculty-session-reminder.scheduler';
import { FacultyWorkspaceService } from './providers/faculty-workspace.service';

@Module({
  imports: [
    EmailTemplatesModule,
    TypeOrmModule.forFeature([
      Course,
      Enrollment,
      Exam,
      ExamAttempt,
      User,
      CourseBatch,
      BatchStudent,
      ClassSession,
    ]),
  ],
  controllers: [FacultyWorkspaceController, ClassSessionsController],
  providers: [
    FacultyWorkspaceService,
    FacultySessionEmailProvider,
    FacultySessionReminderScheduler,
    {
      provide: 'FACULTY_SESSION_REMINDER_SCHEDULER_BOOTSTRAP',
      inject: [FacultySessionReminderScheduler],
      useFactory: (scheduler: FacultySessionReminderScheduler) => {
        scheduler.start();
        return true;
      },
    },
  ],
})
export class FacultyWorkspaceModule {}
