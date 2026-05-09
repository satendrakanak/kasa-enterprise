import { DataSource } from 'typeorm';
import { Category } from 'src/categories/category.entity';
import { CategoryType } from 'src/categories/enums/categoryType.enum';
import { Chapter } from 'src/chapters/chapter.entity';
import { Course } from 'src/courses/course.entity';
import { CourseDeliveryMode } from 'src/courses/constants/course-delivery-mode';
import { Lecture } from 'src/lectures/lecture.entity';
import { Tag } from 'src/tags/tag.entity';
import { Upload } from 'src/uploads/upload.entity';
import { FileTypes } from 'src/uploads/enums/file-types.enum';
import { UploadStatus } from 'src/uploads/enums/upload-status.enum';
import { User } from 'src/users/user.entity';

const createId = (value: string) => value;

type DemoLecture = {
  title: string;
  description: string;
  isFree?: boolean;
};

type DemoChapter = {
  title: string;
  description: string;
  isFree?: boolean;
  lectures?: DemoLecture[];
};

type DemoCourse = {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  imagePath: string;
  imageAlt: string;
  priceInr: string;
  priceUsd: string;
  duration: string;
  mode: string;
  certificate: string;
  experienceLevel: string;
  studyMaterial?: string;
  additionalBook: string;
  language: string;
  technologyRequirements: string;
  eligibilityRequirements: string;
  disclaimer: string;
  exams: string;
  monthlyLiveClassLimit?: number | null;
  attendanceType?: string;
  attendanceValue?: number | null;
  categories: string[];
  tags: string[];
  chapters: DemoChapter[];
};

const demoCourses: DemoCourse[] = [
  {
    title: 'Practical Coding Fundamentals',
    slug: 'practical-coding-fundamentals',
    shortDescription:
      'A beginner-friendly self-learning path for HTML, CSS, JavaScript, and practical project thinking.',
    description:
      '<p>Build a confident foundation in frontend development with a structured self-learning course. Learners move from clean HTML and responsive CSS to JavaScript fundamentals, hands-on UI patterns, and a final assessment that validates practical understanding.</p>',
    imagePath: '/assets/courses/course-1.jpg',
    imageAlt: 'Learner practicing frontend coding fundamentals',
    priceInr: '1499.00',
    priceUsd: '29.00',
    duration: '6 weeks',
    mode: CourseDeliveryMode.SelfLearning,
    certificate: 'Certificate of completion after course progress and final exam',
    experienceLevel: 'Beginner',
    studyMaterial:
      'Downloadable notes, coding checklists, practice exercises, and project prompts are included.',
    additionalBook: 'Frontend Basics Workbook',
    language: 'English',
    technologyRequirements:
      'Laptop or desktop, modern browser, VS Code, and stable internet connection.',
    eligibilityRequirements:
      'No prior programming experience required. Basic computer usage is enough.',
    disclaimer:
      'Results depend on learner consistency, practice time, and completion of assigned exercises.',
    exams: 'Final assessment required for certification',
    categories: ['Web Development', 'Self Learning'],
    tags: ['HTML', 'CSS', 'JavaScript', 'Beginner'],
    chapters: [
      {
        title: 'Web Foundations',
        description:
          'Understand how websites are structured, how browsers render pages, and how to set up a clean coding workflow.',
        isFree: true,
        lectures: [
          {
            title: 'How the web works',
            description:
              'A simple, practical introduction to browsers, servers, pages, assets, and developer tools.',
            isFree: true,
          },
          {
            title: 'Project folder setup',
            description:
              'Create a clean starter project with HTML, CSS, assets, and repeatable naming conventions.',
          },
        ],
      },
      {
        title: 'Responsive UI Building',
        description:
          'Build layouts that adapt across mobile, tablet, and desktop without breaking content.',
        lectures: [
          {
            title: 'CSS layout essentials',
            description:
              'Learn spacing, typography, flexbox, grid, and reusable section structure.',
          },
          {
            title: 'Responsive landing page practice',
            description:
              'Convert a simple design into a responsive page and test common viewport widths.',
          },
        ],
      },
      {
        title: 'JavaScript for Interfaces',
        description:
          'Add interaction with DOM events, form validation, state, and simple UI feedback.',
        lectures: [
          {
            title: 'DOM and events',
            description:
              'Use query selectors, event listeners, and safe DOM updates for interactive components.',
          },
          {
            title: 'Form validation project',
            description:
              'Build a small validation flow with clear messages and polished submission states.',
          },
        ],
      },
    ],
  },
  {
    title: 'Live Web Development Mentorship',
    slug: 'live-web-development-mentorship',
    shortDescription:
      'A hybrid course with guided live classes, recorded learning modules, attendance tracking, and certification.',
    description:
      '<p>Learn web development with a blended experience: recorded modules for self-paced foundations and live classes for doubt-solving, project review, and accountability. This course is designed for learners who need structure, faculty support, and measurable progress.</p>',
    imagePath: '/assets/courses/course-2.jpg',
    imageAlt: 'Faculty-led live web development class',
    priceInr: '2499.00',
    priceUsd: '49.00',
    duration: '8 weeks',
    mode: CourseDeliveryMode.Hybrid,
    certificate: 'Certificate after recorded progress, live attendance, and final exam',
    experienceLevel: 'Beginner to Intermediate',
    studyMaterial:
      'Class notes, replay references, project briefs, and structured revision sheets are included.',
    additionalBook: 'Live Project Mentorship Workbook',
    language: 'English',
    technologyRequirements:
      'Laptop or desktop, webcam and microphone for live classes, modern browser, VS Code, and stable internet.',
    eligibilityRequirements:
      'Basic computer comfort. Previous coding experience is helpful but not mandatory.',
    disclaimer:
      'Live class schedules may be adjusted by the academy. Attendance requirements apply for exam eligibility.',
    exams: 'Final assessment unlocks after learning and attendance requirements are met',
    monthlyLiveClassLimit: 8,
    attendanceType: 'percentage',
    attendanceValue: 75,
    categories: ['Web Development', 'Live Classes'],
    tags: ['Live Classes', 'Mentorship', 'Projects', 'Hybrid'],
    chapters: [
      {
        title: 'Recorded Preparation',
        description:
          'Complete essential recorded modules before joining live implementation sessions.',
        isFree: true,
        lectures: [
          {
            title: 'Setup and workflow refresher',
            description:
              'Prepare your editor, browser tools, and local workflow before live classes begin.',
            isFree: true,
          },
          {
            title: 'HTML and CSS revision',
            description:
              'Revise semantic markup, reusable layouts, and responsive design basics.',
          },
        ],
      },
      {
        title: 'Live Project Sprint',
        description:
          'Faculty-led sessions focus on implementation, review, and improving learner project quality.',
        lectures: [
          {
            title: 'Project planning and UI breakdown',
            description:
              'Learn how to break a project brief into sections, components, and implementation steps.',
          },
          {
            title: 'Project review checklist',
            description:
              'Use a practical review checklist for spacing, responsiveness, accessibility, and code clarity.',
          },
        ],
      },
      {
        title: 'Exam and Certification Readiness',
        description:
          'Prepare for the final assessment with revision guidance, attendance checks, and faculty feedback.',
        lectures: [
          {
            title: 'Final revision roadmap',
            description:
              'Review key concepts and common mistakes before attempting the final assessment.',
          },
        ],
      },
    ],
  },
];

const demoFaqs = (courseTitle: string) => [
  {
    question: `Is ${courseTitle} beginner friendly?`,
    answer:
      'Yes. The course starts with foundations and gradually moves into practical application.',
  },
  {
    question: 'Will I get a certificate after completion?',
    answer:
      'Yes. Certification unlocks after the required progress, attendance when applicable, and final exam are completed.',
  },
  {
    question: 'Can I access this on mobile?',
    answer:
      'You can browse course details and dashboard updates on mobile. For coding practice and live classes, a laptop or desktop is recommended.',
  },
];

const createDemoExam = (courseTitle: string) => ({
  title: `${courseTitle} Final Assessment`,
  description:
    'A practical assessment to validate learner readiness before certification is issued.',
  instructions:
    'Answer every question carefully. The assessment includes objective questions, short answers, and ordering tasks.',
  passingPercentage: 70,
  maxAttempts: 3,
  timeLimitMinutes: 20,
  showResultImmediately: true,
  isPublished: true,
  questions: [
    {
      id: createId('q1'),
      prompt: 'Which learning outcome matters most in this course?',
      type: 'single' as const,
      points: 2,
      explanation:
        'The course is designed around practical understanding and confident application.',
      acceptedAnswers: [],
      options: [
        {
          id: createId('q1o1'),
          text: 'Only memorising definitions',
          isCorrect: false,
        },
        {
          id: createId('q1o2'),
          text: 'Building practical understanding through application',
          isCorrect: true,
        },
        {
          id: createId('q1o3'),
          text: 'Skipping practice and attempting the exam directly',
          isCorrect: false,
        },
      ],
    },
    {
      id: createId('q2'),
      prompt: 'Select habits that improve learner performance.',
      type: 'multiple' as const,
      points: 3,
      explanation:
        'Consistency, revision, and practice improve retention and assessment performance.',
      acceptedAnswers: [],
      options: [
        { id: createId('q2o1'), text: 'Regular revision', isCorrect: true },
        { id: createId('q2o2'), text: 'Hands-on practice', isCorrect: true },
        { id: createId('q2o3'), text: 'Skipping modules', isCorrect: false },
        {
          id: createId('q2o4'),
          text: 'Reviewing feedback before retrying',
          isCorrect: true,
        },
      ],
    },
    {
      id: createId('q3'),
      prompt: 'True or False: Certification can be unlocked without meeting course requirements.',
      type: 'true_false' as const,
      points: 2,
      explanation:
        'Certification requires the configured learning, attendance, and exam requirements.',
      acceptedAnswers: [],
      options: [
        { id: createId('q3o1'), text: 'True', isCorrect: false },
        { id: createId('q3o2'), text: 'False', isCorrect: true },
      ],
    },
    {
      id: createId('q4'),
      prompt: 'Write one word learners should build along with knowledge.',
      type: 'short_text' as const,
      points: 2,
      explanation: 'Confidence is a core learning outcome.',
      acceptedAnswers: ['confidence', 'self confidence', 'self-confidence'],
      options: [],
    },
    {
      id: createId('q5'),
      prompt: 'Arrange the certification journey in a sensible order.',
      type: 'drag_drop' as const,
      points: 3,
      explanation:
        'Learners should study, revise, attempt the exam, and then unlock the certificate.',
      acceptedAnswers: [],
      options: [
        { id: createId('q5o1'), text: 'Complete learning modules', isCorrect: false },
        { id: createId('q5o2'), text: 'Revise key concepts', isCorrect: false },
        { id: createId('q5o3'), text: 'Attempt final assessment', isCorrect: false },
        { id: createId('q5o4'), text: 'Unlock certificate', isCorrect: false },
      ],
    },
  ],
});

async function getSystemUser(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);
  const existingUser = await userRepository.findOne({
    where: { email: 'system@codewithkasa.local' },
  });

  if (existingUser) return existingUser;

  return userRepository.save(
    userRepository.create({
      firstName: 'Code With Kasa',
      lastName: 'Team',
      username: 'codewithkasa-system',
      email: 'system@codewithkasa.local',
      emailVerified: new Date(),
    }),
  );
}

async function getUpload(dataSource: DataSource, path: string, name: string) {
  const uploadRepository = dataSource.getRepository(Upload);
  const existingUpload = await uploadRepository.findOne({ where: { path } });

  if (existingUpload) return existingUpload;

  return uploadRepository.save(
    uploadRepository.create({
      name,
      path,
      type: FileTypes.IMAGE,
      mime: 'image/jpeg',
      size: 0,
      status: UploadStatus.COMPLETED,
    }),
  );
}

async function getCategory(
  dataSource: DataSource,
  name: string,
  createdBy: User,
) {
  const categoryRepository = dataSource.getRepository(Category);
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const existingCategory = await categoryRepository.findOne({
    where: { slug, type: CategoryType.COURSE },
  });

  if (existingCategory) return existingCategory;

  return categoryRepository.save(
    categoryRepository.create({
      name,
      slug,
      type: CategoryType.COURSE,
      description: `${name} course category`,
      createdBy,
    }),
  );
}

async function getTag(dataSource: DataSource, name: string, createdBy: User) {
  const tagRepository = dataSource.getRepository(Tag);
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const existingTag = await tagRepository.findOne({ where: { slug } });

  if (existingTag) return existingTag;

  return tagRepository.save(
    tagRepository.create({
      name,
      slug,
      description: `${name} course tag`,
      createdBy,
    }),
  );
}

export async function seedProductionDemoContent(dataSource: DataSource) {
  const courseRepository = dataSource.getRepository(Course);
  const chapterRepository = dataSource.getRepository(Chapter);
  const lectureRepository = dataSource.getRepository(Lecture);
  const systemUser = await getSystemUser(dataSource);

  for (const demoCourse of demoCourses) {
    const image = await getUpload(
      dataSource,
      demoCourse.imagePath,
      `${demoCourse.title} cover`,
    );
    const categories = await Promise.all(
      demoCourse.categories.map((category) =>
        getCategory(dataSource, category, systemUser),
      ),
    );
    const tags = await Promise.all(
      demoCourse.tags.map((tag) => getTag(dataSource, tag, systemUser)),
    );

    let course = await courseRepository.findOne({
      where: { slug: demoCourse.slug },
      relations: {
        chapters: true,
      },
    });

    if (!course) {
      course = courseRepository.create({
        slug: demoCourse.slug,
        createdBy: systemUser,
      });
    } else if (course.chapters?.length) {
      await chapterRepository.remove(course.chapters);
    }

    course.title = demoCourse.title;
    course.shortDescription = demoCourse.shortDescription;
    course.description = demoCourse.description;
    course.metaTitle = demoCourse.title;
    course.metaSlug = demoCourse.slug;
    course.metaDescription = demoCourse.shortDescription.slice(0, 160);
    course.image = image;
    course.imageAlt = demoCourse.imageAlt;
    course.isFree = false;
    course.isFeatured = true;
    course.isPublished = true;
    course.priceInr = demoCourse.priceInr;
    course.priceUsd = demoCourse.priceUsd;
    course.duration = demoCourse.duration;
    course.mode = demoCourse.mode;
    course.monthlyLiveClassLimit = demoCourse.monthlyLiveClassLimit ?? null;
    course.liveClassAttendanceRequirementType =
      demoCourse.attendanceType ?? 'percentage';
    course.liveClassAttendanceRequirementValue =
      demoCourse.attendanceValue ?? 75;
    course.certificate = demoCourse.certificate;
    course.exams = demoCourse.exams;
    course.experienceLevel = demoCourse.experienceLevel;
    course.studyMaterial = demoCourse.studyMaterial;
    course.additionalBook = demoCourse.additionalBook;
    course.language = demoCourse.language;
    course.technologyRequirements = demoCourse.technologyRequirements;
    course.eligibilityRequirements = demoCourse.eligibilityRequirements;
    course.disclaimer = demoCourse.disclaimer;
    course.faqs = demoFaqs(demoCourse.title);
    course.exam = createDemoExam(demoCourse.title);
    course.categories = categories;
    course.tags = tags;
    course.faculties =
      demoCourse.mode === CourseDeliveryMode.SelfLearning ? [] : [systemUser];
    course.updatedBy = systemUser;

    const savedCourse = await courseRepository.save(course);

    for (const [chapterIndex, demoChapter] of demoCourse.chapters.entries()) {
      const chapter = await chapterRepository.save(
        chapterRepository.create({
          title: demoChapter.title,
          description: demoChapter.description,
          position: chapterIndex + 1,
          isPublished: true,
          isFree: Boolean(demoChapter.isFree),
          course: savedCourse,
        }),
      );

      for (const [lectureIndex, demoLecture] of (
        demoChapter.lectures ?? []
      ).entries()) {
        await lectureRepository.save(
          lectureRepository.create({
            title: demoLecture.title,
            description: demoLecture.description,
            position: lectureIndex + 1,
            isPublished: true,
            isFree: Boolean(demoLecture.isFree),
            chapter,
          }),
        );
      }
    }
  }

  console.log(`✅ Production demo content seeded (${demoCourses.length} courses)`);
}
