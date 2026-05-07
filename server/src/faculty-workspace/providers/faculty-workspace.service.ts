import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { Course } from 'src/courses/course.entity';
import { Enrollment } from 'src/enrollments/enrollment.entity';
import { ExamAttempt } from 'src/exams/exam-attempt.entity';
import { Exam } from 'src/exams/exam.entity';
import { ExamAttemptStatus } from 'src/exams/enums/exam-attempt-status.enum';
import { ExamStatus } from 'src/exams/enums/exam-status.enum';
import { User } from 'src/users/user.entity';
import { Brackets, Repository } from 'typeorm';
import { AddBatchStudentDto } from '../dtos/add-batch-student.dto';
import { CreateClassSessionDto } from '../dtos/create-class-session.dto';
import { CreateCourseBatchDto } from '../dtos/create-course-batch.dto';
import { GradeExamAttemptDto } from '../dtos/grade-exam-attempt.dto';
import { UpdateClassSessionDto } from '../dtos/update-class-session.dto';
import { UpdateCourseBatchDto } from '../dtos/update-course-batch.dto';
import { BatchStudent } from '../batch-student.entity';
import { ClassSession } from '../class-session.entity';
import { CourseBatch } from '../course-batch.entity';
import { BatchStudentStatus } from '../enums/batch-student-status.enum';
import { ClassSessionStatus } from '../enums/class-session-status.enum';
import { CourseBatchStatus } from '../enums/course-batch-status.enum';

@Injectable()
export class FacultyWorkspaceService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,

    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,

    @InjectRepository(Exam)
    private readonly examRepository: Repository<Exam>,

    @InjectRepository(ExamAttempt)
    private readonly examAttemptRepository: Repository<ExamAttempt>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(CourseBatch)
    private readonly courseBatchRepository: Repository<CourseBatch>,

    @InjectRepository(BatchStudent)
    private readonly batchStudentRepository: Repository<BatchStudent>,

    @InjectRepository(ClassSession)
    private readonly classSessionRepository: Repository<ClassSession>,
  ) {}

  async getWorkspace(user: ActiveUserData) {
    this.assertFaculty(user);
    await this.markPastSessionsCompleted(new Date());

    const facultyId = user.sub;
    const courses = await this.getAssignedCourses(facultyId);
    const courseIds = courses.map((course) => course.id);
    const [
      studentsCount,
      exams,
      recentAttempts,
      upcomingSessions,
      batches,
    ] = await Promise.all([
      this.getStudentsCount(courseIds),
      this.getAssignedExams(facultyId, courseIds),
      this.getRecentAttempts(courseIds),
      this.getUpcomingSessions(facultyId),
      this.getDashboardBatches(facultyId),
    ]);
    const reminderCount = upcomingSessions.reduce(
      (total, session) => total + this.getPendingReminderOffsets(session).length,
      0,
    );

    return {
      summary: {
        assignedCourses: courses.length,
        publishedCourses: courses.filter((course) => course.isPublished).length,
        activeStudents: studentsCount,
        assignedExams: exams.length,
        pendingManualReviews: recentAttempts.filter(
          (attempt) => attempt.status === ExamAttemptStatus.PendingManualGrading,
        ).length,
        upcomingClasses: upcomingSessions.length,
        activeBatches: batches.filter(
          (batch) => this.getBatchLifecycle(batch) === 'active',
        ).length,
        upcomingBatches: batches.filter(
          (batch) => this.getBatchLifecycle(batch) === 'upcoming',
        ).length,
        pendingReminders: reminderCount,
      },
      courses: courses.slice(0, 6).map((course) => ({
        id: course.id,
        title: course.title,
        slug: course.slug,
        isPublished: course.isPublished,
        mode: course.mode,
        duration: course.duration,
        studentsCount: course.enrollments?.filter((item) => item.isActive).length ?? 0,
      })),
      exams: exams.slice(0, 6).map((exam) => ({
        id: exam.id,
        title: exam.title,
        slug: exam.slug,
        status: exam.status,
        courses: exam.courses?.map((course) => ({
          id: course.id,
          title: course.title,
          slug: course.slug,
        })) ?? [],
        attemptsCount: exam.attempts?.filter(
          (attempt) => attempt.status !== ExamAttemptStatus.InProgress,
        ).length ?? 0,
      })),
      recentAttempts: recentAttempts.slice(0, 8).map((attempt) => ({
        id: attempt.id,
        learnerName:
          [attempt.user?.firstName, attempt.user?.lastName]
            .filter(Boolean)
            .join(' ') ||
          attempt.user?.email ||
          'Learner',
        courseTitle: attempt.course?.title || 'Course',
        examTitle: attempt.exam?.title || 'Exam',
        percentage: Number(attempt.percentage || 0),
        passed: attempt.passed,
        status: attempt.status,
        submittedAt: attempt.submittedAt,
      })),
      upcomingSessions: upcomingSessions.slice(0, 6).map((session) => ({
        id: session.id,
        title: session.title,
        batchName: session.batch.name,
        courseTitle: session.course.title,
        startsAt: session.startsAt,
        endsAt: session.endsAt,
        status: session.status,
        meetingUrl: session.meetingUrl,
        reminderOffsetsMinutes: this.getReminderOffsets(session),
        sentReminderOffsetsMinutes: session.sentReminderOffsetsMinutes ?? [],
      })),
      batches: batches.slice(0, 6).map((batch) => ({
        id: batch.id,
        name: batch.name,
        status: this.getBatchLifecycle(batch),
        rawStatus: batch.status,
        courseTitle: batch.course.title,
        startDate: batch.startDate,
        endDate: batch.endDate,
        studentsCount:
          batch.students?.filter((student) => student.status === BatchStudentStatus.Active)
            .length ?? 0,
        sessionsCount: batch.sessions?.length ?? 0,
      })),
    };
  }

  async getBatches(user: ActiveUserData) {
    this.assertFaculty(user);

    return this.courseBatchRepository.find({
      where: this.isAdmin(user) ? {} : { faculty: { id: user.sub } },
      relations: ['course', 'faculty', 'students', 'students.student', 'sessions'],
      order: { createdAt: 'DESC' },
    });
  }

  async getCourses(user: ActiveUserData) {
    this.assertFaculty(user);
    const courses = await this.getAssignedCourses(user.sub);

    return courses.map((course) => ({
      id: course.id,
      title: course.title,
      slug: course.slug,
      isPublished: course.isPublished,
      mode: course.mode,
      duration: course.duration,
      studentsCount: course.enrollments?.filter((item) => item.isActive).length ?? 0,
    }));
  }

  async getCourseStudents(courseId: number, user: ActiveUserData) {
    await this.getCourseForFaculty(courseId, user);

    const enrollments = await this.enrollmentRepository.find({
      where: {
        course: { id: courseId },
        isActive: true,
      },
      relations: ['user'],
      order: { enrolledAt: 'DESC' },
    });

    return enrollments.map((enrollment) => ({
      enrollmentId: enrollment.id,
      progress: enrollment.progress,
      enrolledAt: enrollment.enrolledAt,
      user: {
        id: enrollment.user.id,
        firstName: enrollment.user.firstName,
        lastName: enrollment.user.lastName,
        email: enrollment.user.email,
      },
    }));
  }

  async getLearnerSessions(user: ActiveUserData) {
    const sessions = await this.classSessionRepository
      .createQueryBuilder('session')
      .leftJoinAndSelect('session.batch', 'batch')
      .leftJoinAndSelect('session.course', 'course')
      .leftJoinAndSelect('session.faculty', 'faculty')
      .leftJoin('batch.students', 'batchStudent')
      .leftJoin('batchStudent.student', 'student')
      .where('student.id = :userId', { userId: user.sub })
      .andWhere('batchStudent.status = :studentStatus', {
        studentStatus: BatchStudentStatus.Active,
      })
      .andWhere('session.status != :cancelled', {
        cancelled: ClassSessionStatus.Cancelled,
      })
      .andWhere('session.endsAt >= :now', { now: new Date() })
      .orderBy('session.startsAt', 'ASC')
      .getMany();

    return sessions.map((session) => ({
      id: session.id,
      title: session.title,
      description: session.description,
      startsAt: session.startsAt,
      endsAt: session.endsAt,
      timezone: session.timezone,
      meetingUrl: session.meetingUrl,
      location: session.location,
      status: session.status,
      reminderBeforeMinutes: session.reminderBeforeMinutes,
      reminderOffsetsMinutes: this.getReminderOffsets(session),
      batch: {
        id: session.batch.id,
        name: session.batch.name,
      },
      course: {
        id: session.course.id,
        title: session.course.title,
        slug: session.course.slug,
      },
      faculty: {
        id: session.faculty.id,
        firstName: session.faculty.firstName,
        lastName: session.faculty.lastName,
      },
    }));
  }

  async createBatch(user: ActiveUserData, dto: CreateCourseBatchDto) {
    this.assertFaculty(user);

    const course = await this.getCourseForFaculty(dto.courseId, user);
    const facultyId = this.isAdmin(user) ? dto.facultyId || user.sub : user.sub;
    const faculty = await this.userRepository.findOne({
      where: { id: facultyId },
      relations: ['roles'],
    });

    if (!faculty) {
      throw new NotFoundException('Faculty not found');
    }

    const batch = this.courseBatchRepository.create({
      name: dto.name,
      code: dto.code || null,
      description: dto.description || null,
      course,
      faculty,
      status: dto.status ?? CourseBatchStatus.Draft,
      startDate: dto.startDate || null,
      endDate: dto.endDate || null,
      capacity: dto.capacity ?? null,
    });

    return this.courseBatchRepository.save(batch);
  }

  async updateBatch(
    id: number,
    user: ActiveUserData,
    dto: UpdateCourseBatchDto,
  ) {
    const batch = await this.getBatchForFaculty(id, user);

    if (dto.courseId) {
      batch.course = await this.getCourseForFaculty(dto.courseId, user);
    }

    if (dto.facultyId && this.isAdmin(user)) {
      const faculty = await this.userRepository.findOne({
        where: { id: dto.facultyId },
      });

      if (!faculty) {
        throw new NotFoundException('Faculty not found');
      }

      batch.faculty = faculty;
    }

    if (dto.name !== undefined) batch.name = dto.name;
    if (dto.code !== undefined) batch.code = dto.code || null;
    if (dto.description !== undefined) batch.description = dto.description || null;
    if (dto.status !== undefined) batch.status = dto.status;
    if (dto.startDate !== undefined) batch.startDate = dto.startDate || null;
    if (dto.endDate !== undefined) batch.endDate = dto.endDate || null;
    if (dto.capacity !== undefined) batch.capacity = dto.capacity ?? null;

    return this.courseBatchRepository.save(batch);
  }

  async deleteBatch(id: number, user: ActiveUserData) {
    await this.getBatchForFaculty(id, user);
    await this.courseBatchRepository.softDelete(id);

    return { message: 'Batch deleted successfully' };
  }

  async addBatchStudent(
    batchId: number,
    user: ActiveUserData,
    dto: AddBatchStudentDto,
  ) {
    const batch = await this.getBatchForFaculty(batchId, user);
    this.assertBatchCanManageStudents(batch);

    const enrollment = await this.enrollmentRepository.findOne({
      where: {
        course: { id: batch.course.id },
        user: { id: dto.userId },
        isActive: true,
      },
      relations: ['course', 'user'],
    });

    if (!enrollment) {
      throw new BadRequestException(
        'Student must be actively enrolled in this course before joining the batch',
      );
    }

    const existing = await this.batchStudentRepository.findOne({
      where: { batch: { id: batch.id }, student: { id: dto.userId } },
      relations: ['batch', 'student', 'enrollment'],
    });

    if (existing) {
      existing.status = BatchStudentStatus.Active;
      existing.enrollment = enrollment;
      return this.batchStudentRepository.save(existing);
    }

    if (batch.capacity) {
      const activeCount = await this.batchStudentRepository.count({
        where: {
          batch: { id: batch.id },
          status: BatchStudentStatus.Active,
        },
      });

      if (activeCount >= batch.capacity) {
        throw new BadRequestException('Batch capacity is full');
      }
    }

    return this.batchStudentRepository.save(
      this.batchStudentRepository.create({
        batch,
        student: enrollment.user,
        enrollment,
        status: BatchStudentStatus.Active,
      }),
    );
  }

  async removeBatchStudent(
    batchId: number,
    studentId: number,
    user: ActiveUserData,
  ) {
    const batch = await this.getBatchForFaculty(batchId, user);
    this.assertBatchCanManageStudents(batch);

    const student = await this.batchStudentRepository.findOne({
      where: { batch: { id: batchId }, student: { id: studentId } },
      relations: ['batch', 'student'],
    });

    if (!student) {
      throw new NotFoundException('Batch student not found');
    }

    student.status = BatchStudentStatus.Removed;
    return this.batchStudentRepository.save(student);
  }

  async getSessions(user: ActiveUserData) {
    this.assertFaculty(user);
    await this.markPastSessionsCompleted(new Date());

    return this.classSessionRepository.find({
      where: this.isAdmin(user) ? {} : { faculty: { id: user.sub } },
      relations: ['batch', 'course', 'faculty'],
      order: { startsAt: 'ASC' },
    });
  }

  async getExamAttempts(user: ActiveUserData) {
    this.assertFaculty(user);
    const courses = await this.getAssignedCourses(user.sub);
    const courseIds = courses.map((course) => course.id);

    if (!courseIds.length) {
      return [];
    }

    const attempts = await this.examAttemptRepository
      .createQueryBuilder('attempt')
      .leftJoinAndSelect('attempt.exam', 'exam')
      .leftJoinAndSelect('attempt.course', 'course')
      .leftJoinAndSelect('attempt.user', 'user')
      .where('course.id IN (:...courseIds)', { courseIds })
      .andWhere('attempt.status != :inProgress', {
        inProgress: ExamAttemptStatus.InProgress,
      })
      .orderBy('attempt.submittedAt', 'DESC', 'NULLS LAST')
      .addOrderBy('attempt.createdAt', 'DESC')
      .getMany();

    return attempts.map((attempt) => this.mapFacultyAttempt(attempt));
  }

  async getExamAttempt(id: number, user: ActiveUserData) {
    const attempt = await this.getExamAttemptForFaculty(id, user);
    return {
      ...this.mapFacultyAttempt(attempt),
      answers: attempt.answers,
      questionResults: attempt.questionResults,
    };
  }

  async gradeExamAttempt(
    id: number,
    user: ActiveUserData,
    dto: GradeExamAttemptDto,
  ) {
    const attempt = await this.getExamAttemptForFaculty(id, user);

    if (attempt.status === ExamAttemptStatus.InProgress) {
      throw new BadRequestException('Attempt is still in progress');
    }

    const resultMap = new Map(
      dto.questionResults.map((result) => [result.questionId, result]),
    );
    const questionResults = attempt.questionResults.map((result) => {
      const manual = resultMap.get(result.questionId);
      if (!manual) {
        return result;
      }

      const score = Math.min(Math.max(manual.score, 0), Number(result.maxScore || 0));

      return {
        ...result,
        score,
        isCorrect: manual.isCorrect ?? score >= Number(result.maxScore || 0),
        needsManualGrading: false,
        feedback: manual.feedback ?? result.feedback,
      };
    });
    const score = questionResults.reduce(
      (total, result) => total + Number(result.score || 0),
      0,
    );
    const maxScore = questionResults.reduce(
      (total, result) => total + Number(result.maxScore || 0),
      0,
    );
    const percentage =
      dto.percentageOverride ?? (maxScore ? (score / maxScore) * 100 : 0);

    attempt.questionResults = questionResults;
    attempt.score = this.toDecimal(score);
    attempt.maxScore = this.toDecimal(maxScore);
    attempt.percentage = this.toDecimal(percentage);
    attempt.passed = percentage >= Number(attempt.exam.passingPercentage || 0);
    attempt.needsManualGrading = false;
    attempt.status = ExamAttemptStatus.Graded;
    attempt.manualGradedAt = new Date();
    attempt.manualGradedBy = { id: user.sub } as User;

    const saved = await this.examAttemptRepository.save(attempt);
    return this.getExamAttempt(saved.id, user);
  }

  async createSession(user: ActiveUserData, dto: CreateClassSessionDto) {
    const batch = await this.getBatchForFaculty(dto.batchId, user);
    const startsAt = new Date(dto.startsAt);
    const endsAt = new Date(dto.endsAt);

    this.assertBatchCanScheduleClass(batch);
    this.assertValidSessionWindow(startsAt, endsAt);

    const session = await this.classSessionRepository.save(
      this.classSessionRepository.create({
        batch,
        course: batch.course,
        faculty: batch.faculty,
        title: dto.title,
        description: dto.description || null,
        startsAt,
        endsAt,
        timezone: dto.timezone || 'Asia/Kolkata',
        meetingUrl: dto.meetingUrl || null,
        location: dto.location || null,
        status: dto.status ?? ClassSessionStatus.Scheduled,
        reminderBeforeMinutes: dto.reminderBeforeMinutes ?? 60,
        reminderOffsetsMinutes: this.normalizeReminderOffsets(dto),
      }),
    );

    return session;
  }

  async updateSession(
    id: number,
    user: ActiveUserData,
    dto: UpdateClassSessionDto,
  ) {
    const session = await this.getSessionForFaculty(id, user);

    if (dto.batchId && dto.batchId !== session.batch.id) {
      const batch = await this.getBatchForFaculty(dto.batchId, user);
      this.assertBatchCanScheduleClass(batch);
      session.batch = batch;
      session.course = batch.course;
      session.faculty = batch.faculty;
    }

    if (
      dto.batchId === undefined &&
      (dto.startsAt !== undefined ||
        dto.endsAt !== undefined ||
        dto.status === ClassSessionStatus.Scheduled)
    ) {
      this.assertBatchCanScheduleClass(session.batch);
    }

    const startsAt = dto.startsAt ? new Date(dto.startsAt) : session.startsAt;
    const endsAt = dto.endsAt ? new Date(dto.endsAt) : session.endsAt;
    this.assertValidSessionWindow(startsAt, endsAt);

    if (dto.title !== undefined) session.title = dto.title;
    if (dto.description !== undefined) session.description = dto.description || null;
    session.startsAt = startsAt;
    session.endsAt = endsAt;
    if (dto.timezone !== undefined) session.timezone = dto.timezone || 'Asia/Kolkata';
    if (dto.meetingUrl !== undefined) session.meetingUrl = dto.meetingUrl || null;
    if (dto.location !== undefined) session.location = dto.location || null;
    if (dto.status !== undefined) session.status = dto.status;
    if (dto.reminderBeforeMinutes !== undefined) {
      session.reminderBeforeMinutes = dto.reminderBeforeMinutes;
    }
    if (
      dto.reminderOffsetsMinutes !== undefined ||
      dto.reminderBeforeMinutes !== undefined
    ) {
      session.reminderOffsetsMinutes = this.normalizeReminderOffsets(dto);
      session.reminderBeforeMinutes = session.reminderOffsetsMinutes[0] ?? 60;
    }
    if (
      dto.startsAt !== undefined ||
      dto.reminderOffsetsMinutes !== undefined ||
      dto.reminderBeforeMinutes !== undefined ||
      dto.status === ClassSessionStatus.Scheduled
    ) {
      session.sentReminderOffsetsMinutes = null;
      session.reminderSentAt = null;
    }

    const savedSession = await this.classSessionRepository.save(session);

    return savedSession;
  }

  async deleteSession(id: number, user: ActiveUserData) {
    await this.getSessionForFaculty(id, user);
    await this.classSessionRepository.softDelete(id);

    return { message: 'Session deleted successfully' };
  }

  private assertFaculty(user: ActiveUserData) {
    if (
      !this.isAdmin(user) &&
      !user?.roles?.includes('faculty') &&
      !user?.permissions?.includes('view_faculty_workspace')
    ) {
      throw new ForbiddenException('Faculty access required');
    }
  }

  private isAdmin(user: ActiveUserData) {
    return user.roles?.includes('admin');
  }

  private getAssignedCourses(facultyId: number) {
    return this.courseRepository
      .createQueryBuilder('course')
      .leftJoin('course.faculties', 'faculty')
      .leftJoinAndSelect('course.enrollments', 'enrollments')
      .where('faculty.id = :facultyId', { facultyId })
      .orderBy('course.updatedAt', 'DESC')
      .getMany();
  }

  private async getStudentsCount(courseIds: number[]) {
    if (!courseIds.length) return 0;

    const result = await this.enrollmentRepository
      .createQueryBuilder('enrollment')
      .leftJoin('enrollment.course', 'course')
      .leftJoin('enrollment.user', 'student')
      .select('COUNT(DISTINCT student.id)', 'count')
      .where('course.id IN (:...courseIds)', { courseIds })
      .andWhere('enrollment.isActive = true')
      .getRawOne<{ count: string }>();

    return Number(result?.count || 0);
  }

  private getAssignedExams(facultyId: number, courseIds: number[]) {
    const query = this.examRepository
      .createQueryBuilder('exam')
      .leftJoinAndSelect('exam.courses', 'courses')
      .leftJoinAndSelect('exam.faculties', 'faculties')
      .leftJoinAndSelect('exam.attempts', 'attempts')
      .where(
        new Brackets((qb) => {
          qb.where('faculties.id = :facultyId', { facultyId });

          if (courseIds.length) {
            qb.orWhere('courses.id IN (:...courseIds)', { courseIds });
          }
        }),
      );

    return query
      .andWhere('exam.status != :archived', { archived: ExamStatus.Archived })
      .orderBy('exam.updatedAt', 'DESC')
      .getMany();
  }

  private getRecentAttempts(courseIds: number[]) {
    if (!courseIds.length) return Promise.resolve([]);

    return this.examAttemptRepository
      .createQueryBuilder('attempt')
      .leftJoinAndSelect('attempt.exam', 'exam')
      .leftJoinAndSelect('attempt.course', 'course')
      .leftJoinAndSelect('attempt.user', 'user')
      .where('course.id IN (:...courseIds)', { courseIds })
      .andWhere('attempt.status != :status', {
        status: ExamAttemptStatus.InProgress,
      })
      .orderBy('attempt.submittedAt', 'DESC', 'NULLS LAST')
      .addOrderBy('attempt.createdAt', 'DESC')
      .take(12)
      .getMany();
  }

  private getUpcomingSessions(facultyId: number) {
    return this.classSessionRepository
      .createQueryBuilder('session')
      .leftJoinAndSelect('session.batch', 'batch')
      .leftJoinAndSelect('session.course', 'course')
      .leftJoinAndSelect('session.faculty', 'faculty')
      .where('faculty.id = :facultyId', { facultyId })
      .andWhere('session.status = :status', {
        status: ClassSessionStatus.Scheduled,
      })
      .andWhere('session.startsAt >= :now', { now: new Date() })
      .orderBy('session.startsAt', 'ASC')
      .take(8)
      .getMany();
  }

  private async markPastSessionsCompleted(now: Date) {
    await this.classSessionRepository
      .createQueryBuilder()
      .update(ClassSession)
      .set({ status: ClassSessionStatus.Completed })
      .where('status = :status', { status: ClassSessionStatus.Scheduled })
      .andWhere('"endsAt" <= :now', { now })
      .execute();
  }

  private getDashboardBatches(facultyId: number) {
    return this.courseBatchRepository.find({
      where: { faculty: { id: facultyId } },
      relations: ['course', 'students', 'sessions'],
      order: { updatedAt: 'DESC' },
      take: 8,
    });
  }

  private async getCourseForFaculty(courseId: number, user: ActiveUserData) {
    const course = await this.courseRepository.findOne({
      where: { id: courseId },
      relations: ['faculties'],
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (
      !this.isAdmin(user) &&
      !course.faculties?.some((faculty) => faculty.id === user.sub)
    ) {
      throw new ForbiddenException('You can only manage assigned courses');
    }

    return course;
  }

  private async getBatchForFaculty(id: number, user: ActiveUserData) {
    this.assertFaculty(user);

    const batch = await this.courseBatchRepository.findOne({
      where: { id },
      relations: ['course', 'faculty', 'students', 'students.student', 'sessions'],
    });

    if (!batch) {
      throw new NotFoundException('Batch not found');
    }

    if (!this.isAdmin(user) && batch.faculty.id !== user.sub) {
      throw new ForbiddenException('You can only manage your own batches');
    }

    return batch;
  }

  private async getSessionForFaculty(id: number, user: ActiveUserData) {
    this.assertFaculty(user);

    const session = await this.classSessionRepository.findOne({
      where: { id },
      relations: ['batch', 'course', 'faculty'],
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (!this.isAdmin(user) && session.faculty.id !== user.sub) {
      throw new ForbiddenException('You can only manage your own sessions');
    }

    return session;
  }

  private async getExamAttemptForFaculty(id: number, user: ActiveUserData) {
    this.assertFaculty(user);

    const attempt = await this.examAttemptRepository.findOne({
      where: { id },
      relations: ['exam', 'course', 'user', 'manualGradedBy'],
    });

    if (!attempt) {
      throw new NotFoundException('Exam attempt not found');
    }

    if (!this.isAdmin(user)) {
      if (!attempt.course) {
        throw new ForbiddenException('Attempt is not linked to a course');
      }

      await this.getCourseForFaculty(attempt.course.id, user);
    }

    return attempt;
  }

  private mapFacultyAttempt(attempt: ExamAttempt) {
    return {
      id: attempt.id,
      status: attempt.status,
      learnerName:
        [attempt.user?.firstName, attempt.user?.lastName]
          .filter(Boolean)
          .join(' ') ||
        attempt.user?.email ||
        'Learner',
      learnerEmail: attempt.user?.email,
      examTitle: attempt.exam?.title || 'Exam',
      courseTitle: attempt.course?.title || 'Course',
      courseSlug: attempt.course?.slug,
      score: Number(attempt.score || 0),
      maxScore: Number(attempt.maxScore || 0),
      percentage: Number(attempt.percentage || 0),
      passed: attempt.passed,
      needsManualGrading: attempt.needsManualGrading,
      submittedAt: attempt.submittedAt,
      manualGradedAt: attempt.manualGradedAt,
    };
  }

  private assertValidSessionWindow(startsAt: Date, endsAt: Date) {
    if (Number.isNaN(startsAt.getTime()) || Number.isNaN(endsAt.getTime())) {
      throw new BadRequestException('Invalid session date');
    }

    if (endsAt <= startsAt) {
      throw new BadRequestException('Session end time must be after start time');
    }
  }

  private assertBatchCanScheduleClass(batch: CourseBatch) {
    const lifecycle = this.getBatchLifecycle(batch);

    if (lifecycle !== 'active' && lifecycle !== 'upcoming') {
      throw new BadRequestException(
        'Classes can only be scheduled for active or upcoming batches',
      );
    }
  }

  private assertBatchCanManageStudents(batch: CourseBatch) {
    const lifecycle = this.getBatchLifecycle(batch);

    if (lifecycle !== 'active' && lifecycle !== 'upcoming') {
      throw new BadRequestException(
        'Students can only be changed for active or upcoming batches',
      );
    }
  }

  private getBatchLifecycle(batch: CourseBatch) {
    if (batch.status === CourseBatchStatus.Cancelled) return 'cancelled';
    if (batch.status === CourseBatchStatus.Completed) return 'recent';
    if (batch.status === CourseBatchStatus.Draft) return 'draft';

    const startDate = this.getDateOnlyKey(batch.startDate);
    const endDate = this.getDateOnlyKey(batch.endDate);
    const todayKey = this.getTodayDateKey();

    if (endDate && endDate < todayKey) return 'recent';
    if (startDate && startDate > todayKey) return 'upcoming';

    return 'active';
  }

  private getTodayDateKey() {
    const parts = new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'Asia/Kolkata',
    }).formatToParts(new Date());
    const year = parts.find((part) => part.type === 'year')?.value ?? '';
    const month = parts.find((part) => part.type === 'month')?.value ?? '';
    const day = parts.find((part) => part.type === 'day')?.value ?? '';

    return `${year}-${month}-${day}`;
  }

  private getDateOnlyKey(value?: string | Date | null) {
    if (!value) return null;

    if (value instanceof Date) {
      return value.toISOString().slice(0, 10);
    }

    return value.slice(0, 10);
  }

  private toDecimal(value: number) {
    return Number.isFinite(value) ? value.toFixed(2) : '0.00';
  }

  private normalizeReminderOffsets(dto: {
    reminderBeforeMinutes?: number;
    reminderOffsetsMinutes?: number[];
  }) {
    const offsets = dto.reminderOffsetsMinutes?.length
      ? dto.reminderOffsetsMinutes
      : [dto.reminderBeforeMinutes ?? 60];

    return [...new Set(offsets.map(Number))]
      .filter((value) => Number.isFinite(value) && value > 0)
      .sort((a, b) => b - a);
  }

  private getReminderOffsets(session: ClassSession) {
    return session.reminderOffsetsMinutes?.length
      ? session.reminderOffsetsMinutes
      : [session.reminderBeforeMinutes ?? 60];
  }

  private getPendingReminderOffsets(session: ClassSession) {
    const sent = new Set(session.sentReminderOffsetsMinutes ?? []);

    return this.getReminderOffsets(session).filter((offset) => !sent.has(offset));
  }
}
