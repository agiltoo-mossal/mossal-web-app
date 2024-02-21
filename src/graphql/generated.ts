import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any; }
};

export type ArticleLesson = {
  __typename?: 'ArticleLesson';
  ressources: Array<Link>;
};

export type ArticleLessonInput = {
  ressources?: InputMaybe<Array<LinkInput>>;
};

export type ArticleLessonUpdateInput = {
  ressources?: InputMaybe<Array<LinkInput>>;
};

export type Category = {
  __typename?: 'Category';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type CategoryInput = {
  name: Scalars['String']['input'];
};

export type CategoryUpdateInput = {
  name: Scalars['String']['input'];
};

export type ContactInput = {
  company?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  fullName: Scalars['String']['input'];
  message: Scalars['String']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
};

export type Course = {
  __typename?: 'Course';
  areaStudy: Scalars['String']['output'];
  certificationType?: Maybe<Scalars['String']['output']>;
  cover: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  duration?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  language: Scalars['String']['output'];
  level: Scalars['String']['output'];
  modules: Array<Module>;
  numberOfHoursByWeek?: Maybe<Scalars['Int']['output']>;
  numberOfWeeks?: Maybe<Scalars['Int']['output']>;
  objectives?: Maybe<Scalars['String']['output']>;
  prerequisites?: Maybe<Scalars['String']['output']>;
  pricing: CoursePricing;
  progress: Scalars['Float']['output'];
  startDate: Scalars['String']['output'];
  status: CourseStatus;
  targetStudents?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  totalEarnedPoints: Scalars['Float']['output'];
  totalFinished: Scalars['Float']['output'];
  totalLearners: Scalars['Float']['output'];
  totalLessons: Scalars['Float']['output'];
  totalPoints: Scalars['Float']['output'];
  type?: Maybe<CourseType>;
  updatedAt: Scalars['DateTime']['output'];
  videoIntro?: Maybe<Scalars['String']['output']>;
};

export type CourseEnrollment = {
  __typename?: 'CourseEnrollment';
  course: Scalars['ID']['output'];
  user: Scalars['ID']['output'];
};

export type CourseEnrollmentInput = {
  course: Scalars['ID']['input'];
};

export type CourseInput = {
  areaStudy: Scalars['String']['input'];
  certificationType: Scalars['String']['input'];
  description: Scalars['String']['input'];
  duration: Scalars['Int']['input'];
  language: Scalars['String']['input'];
  level: Scalars['String']['input'];
  numberOfHoursByWeek: Scalars['Int']['input'];
  numberOfWeeks: Scalars['Int']['input'];
  objectives: Scalars['String']['input'];
  prerequisites: Scalars['String']['input'];
  pricing?: InputMaybe<CoursePricingInput>;
  startDate: Scalars['String']['input'];
  status: CourseStatus;
  targetStudents: Scalars['String']['input'];
  title: Scalars['String']['input'];
  type: Scalars['String']['input'];
};

export type CourseInvitationInput = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
  role: UserRole;
};

export type CoursePricing = {
  __typename?: 'CoursePricing';
  currency?: Maybe<Currency>;
  enabled?: Maybe<Scalars['Boolean']['output']>;
  price?: Maybe<Scalars['Float']['output']>;
};

export type CoursePricingInput = {
  currency: Currency;
  enabled: Scalars['Boolean']['input'];
  price: Scalars['Float']['input'];
};

export enum CourseStatus {
  AvailableForPreview = 'AvailableForPreview',
  Draft = 'Draft',
  End = 'End',
  RegistrationOpen = 'RegistrationOpen'
}

export enum CourseType {
  Course = 'Course',
  Test = 'Test'
}

export type CourseUpdateInput = {
  id: Scalars['String']['input'];
  targetStudents: Scalars['String']['input'];
};

export enum Currency {
  Eur = 'EUR',
  Usd = 'USD',
  Xof = 'XOF'
}

export type ExerciceReview = {
  __typename?: 'ExerciceReview';
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  updatedAt: Scalars['DateTime']['output'];
  user: User;
};

export type ExerciceReviewInput = {
  content: Scalars['String']['input'];
  submission: Scalars['ID']['input'];
};

export type ExerciceReviewUpdateInput = {
  id: Scalars['String']['input'];
};

export type ExerciceSubmission = {
  __typename?: 'ExerciceSubmission';
  attachment?: Maybe<Scalars['String']['output']>;
  content?: Maybe<Scalars['String']['output']>;
  course: Course;
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lesson: Lesson;
  module: Module;
  reviews: Array<ExerciceReview>;
  title: Scalars['String']['output'];
  type: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  user: User;
};

export type Lesson = {
  __typename?: 'Lesson';
  allowDiscussion?: Maybe<Scalars['Boolean']['output']>;
  allowServices: Scalars['Boolean']['output'];
  course: Scalars['ID']['output'];
  description?: Maybe<Scalars['String']['output']>;
  duration: Scalars['Float']['output'];
  exerciceSubmission?: Maybe<ExerciceSubmission>;
  id: Scalars['ID']['output'];
  isCompletedByCurrentUser: Scalars['Boolean']['output'];
  minScoreRequired?: Maybe<Scalars['Float']['output']>;
  module: Scalars['ID']['output'];
  moduleData: Module;
  next?: Maybe<Lesson>;
  order?: Maybe<Scalars['Float']['output']>;
  points?: Maybe<Scalars['Float']['output']>;
  prev?: Maybe<Lesson>;
  questions?: Maybe<Array<QuizQuestion>>;
  quizSubmission?: Maybe<QuizSubmission>;
  ressources: Array<Link>;
  slide?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  type: Scalars['String']['output'];
  video?: Maybe<Scalars['String']['output']>;
};

export type LessonCompletion = {
  __typename?: 'LessonCompletion';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  lesson: Lesson;
  updatedAt: Scalars['DateTime']['output'];
  user: User;
};

export type LessonInput = {
  allowDiscussion?: InputMaybe<Scalars['Boolean']['input']>;
  allowServices?: InputMaybe<Scalars['Boolean']['input']>;
  course: Scalars['ID']['input'];
  description: Scalars['String']['input'];
  duration: Scalars['Float']['input'];
  minScoreRequired?: InputMaybe<Scalars['Int']['input']>;
  module: Scalars['ID']['input'];
  order?: InputMaybe<Scalars['Float']['input']>;
  points?: InputMaybe<Scalars['Float']['input']>;
  questions?: InputMaybe<Array<QuizQuestionInput>>;
  ressources?: InputMaybe<Array<LinkInput>>;
  title: Scalars['String']['input'];
  type: Scalars['String']['input'];
};

export type LessonUpdateInput = {
  allowDiscussion?: InputMaybe<Scalars['Boolean']['input']>;
  allowServices?: InputMaybe<Scalars['Boolean']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  duration?: InputMaybe<Scalars['Float']['input']>;
  minScoreRequired?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Scalars['Float']['input']>;
  points?: InputMaybe<Scalars['Float']['input']>;
  questions?: InputMaybe<Array<QuizQuestionInput>>;
  ressources?: InputMaybe<Array<LinkInput>>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type Link = {
  __typename?: 'Link';
  name: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type LinkInput = {
  name: Scalars['String']['input'];
  url: Scalars['String']['input'];
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type ManagedQuizzSubmission = {
  __typename?: 'ManagedQuizzSubmission';
  lastSubmission: QuizSubmission;
  nbAttempts: Scalars['Float']['output'];
};

export type Module = {
  __typename?: 'Module';
  course: Scalars['ID']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lessons: Array<Lesson>;
  order?: Maybe<Scalars['Float']['output']>;
  requireFeedback?: Maybe<Scalars['Boolean']['output']>;
  title: Scalars['String']['output'];
};

export type ModuleInput = {
  course: Scalars['ID']['input'];
  description: Scalars['String']['input'];
  order?: InputMaybe<Scalars['Float']['input']>;
  requireFeedback?: InputMaybe<Scalars['Boolean']['input']>;
  title: Scalars['String']['input'];
};

export type ModuleUpdateInput = {
  course?: InputMaybe<Scalars['ID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Scalars['Float']['input']>;
  requireFeedback?: InputMaybe<Scalars['Boolean']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addUserEducation: UserEducation;
  addUserEmployment: UserEmployment;
  addUserSkill: UserSkill;
  blockUser: Scalars['Boolean']['output'];
  createArticleLesson: ArticleLesson;
  createCategory: Category;
  createCourse: Course;
  createCourseEnrollment: CourseEnrollment;
  createLesson: Lesson;
  createModule: Module;
  createPath: Path;
  createPathEnrollment: PathEnrollment;
  createQuiz: Quiz;
  createVideoLesson: VideoLesson;
  decrementModuleOrder: Scalars['Boolean']['output'];
  deleteLesson: Scalars['Boolean']['output'];
  deleteModule: Scalars['Boolean']['output'];
  deleteUser: Scalars['Boolean']['output'];
  incrementModuleOrder: Scalars['Boolean']['output'];
  inviteUsersToEnrollCourse: Scalars['Boolean']['output'];
  markLessonAsCompleted?: Maybe<LessonCompletion>;
  register: Session;
  removeUserEducation: Scalars['Boolean']['output'];
  removeUserEmployment: Scalars['Boolean']['output'];
  removeUserSkill: Scalars['Boolean']['output'];
  requestPasswordReset: Scalars['Boolean']['output'];
  resetPassword: Scalars['Boolean']['output'];
  sendExerciceReview: ExerciceReview;
  submitQuiz?: Maybe<QuizSubmission>;
  unLockUser: Scalars['Boolean']['output'];
  updateArticleLesson: Scalars['Boolean']['output'];
  updateCategory: Scalars['Boolean']['output'];
  updateCourse: Scalars['Boolean']['output'];
  updateExerciceReview: Scalars['Boolean']['output'];
  updateLesson: Scalars['Boolean']['output'];
  updateModule: Scalars['Boolean']['output'];
  updatePath: Scalars['Boolean']['output'];
  updatePersonalDetails: Scalars['Boolean']['output'];
  updateQuiz: Scalars['Boolean']['output'];
  updateUserEducation: Scalars['Boolean']['output'];
  updateUserEmployment: Scalars['Boolean']['output'];
  updateUserRole: Scalars['Boolean']['output'];
  updateUserSkill: Scalars['Boolean']['output'];
  updateVideoLesson: Scalars['Boolean']['output'];
};


export type MutationAddUserEducationArgs = {
  education: UserEducationInput;
};


export type MutationAddUserEmploymentArgs = {
  employment: UserEmploymentInput;
};


export type MutationAddUserSkillArgs = {
  skill: UserSkillInput;
};


export type MutationBlockUserArgs = {
  userId: Scalars['ID']['input'];
};


export type MutationCreateArticleLessonArgs = {
  articleLessonInput: ArticleLessonInput;
};


export type MutationCreateCategoryArgs = {
  categoryInput: CategoryInput;
};


export type MutationCreateCourseArgs = {
  courseInput: CourseInput;
};


export type MutationCreateCourseEnrollmentArgs = {
  courseEnrollmentInput: CourseEnrollmentInput;
};


export type MutationCreateLessonArgs = {
  lessonInput: LessonInput;
};


export type MutationCreateModuleArgs = {
  moduleInput: ModuleInput;
};


export type MutationCreatePathArgs = {
  pathInput: PathInput;
};


export type MutationCreatePathEnrollmentArgs = {
  pathEnrollmentInput: PathEnrollmentInput;
};


export type MutationCreateQuizArgs = {
  quizInput: QuizInput;
};


export type MutationCreateVideoLessonArgs = {
  videoLessonInput: VideoLessonInput;
};


export type MutationDecrementModuleOrderArgs = {
  moduleId: Scalars['ID']['input'];
};


export type MutationDeleteLessonArgs = {
  lessonId: Scalars['ID']['input'];
};


export type MutationDeleteModuleArgs = {
  moduleId: Scalars['ID']['input'];
};


export type MutationDeleteUserArgs = {
  userId: Scalars['ID']['input'];
};


export type MutationIncrementModuleOrderArgs = {
  moduleId: Scalars['ID']['input'];
};


export type MutationInviteUsersToEnrollCourseArgs = {
  course: Scalars['ID']['input'];
  invitations: Array<CourseInvitationInput>;
};


export type MutationMarkLessonAsCompletedArgs = {
  lesson: Scalars['ID']['input'];
};


export type MutationRegisterArgs = {
  registerInput: RegisterInput;
};


export type MutationRemoveUserEducationArgs = {
  educationId: Scalars['ID']['input'];
};


export type MutationRemoveUserEmploymentArgs = {
  employmentId: Scalars['ID']['input'];
};


export type MutationRemoveUserSkillArgs = {
  skillId: Scalars['ID']['input'];
};


export type MutationRequestPasswordResetArgs = {
  email: Scalars['String']['input'];
};


export type MutationResetPasswordArgs = {
  resetPasswordInput: ResetPasswordInput;
};


export type MutationSendExerciceReviewArgs = {
  review: ExerciceReviewInput;
};


export type MutationSubmitQuizArgs = {
  quizSubmissionInput: QuizSubmissionInput;
};


export type MutationUnLockUserArgs = {
  userId: Scalars['ID']['input'];
};


export type MutationUpdateArticleLessonArgs = {
  articleLessonId: Scalars['ID']['input'];
  articleLessonInput: ArticleLessonUpdateInput;
};


export type MutationUpdateCategoryArgs = {
  categoryId: Scalars['ID']['input'];
  categoryInput: CategoryUpdateInput;
};


export type MutationUpdateCourseArgs = {
  courseId: Scalars['ID']['input'];
  courseInput: CourseUpdateInput;
};


export type MutationUpdateExerciceReviewArgs = {
  exerciceReviewId: Scalars['ID']['input'];
  exerciceReviewInput: ExerciceReviewUpdateInput;
};


export type MutationUpdateLessonArgs = {
  lessonId: Scalars['ID']['input'];
  lessonInput: LessonUpdateInput;
};


export type MutationUpdateModuleArgs = {
  moduleId: Scalars['ID']['input'];
  moduleInput: ModuleUpdateInput;
};


export type MutationUpdatePathArgs = {
  pathId: Scalars['ID']['input'];
  pathInput: PathUpdateInput;
};


export type MutationUpdatePersonalDetailsArgs = {
  personalDetailsInput: PersonalDetailsInput;
};


export type MutationUpdateQuizArgs = {
  quizId: Scalars['ID']['input'];
  quizInput: QuizUpdateInput;
};


export type MutationUpdateUserEducationArgs = {
  education: UserEducationUpdateInput;
  educationId: Scalars['ID']['input'];
};


export type MutationUpdateUserEmploymentArgs = {
  employment: UserEmploymentUpdateInput;
  employmentId: Scalars['ID']['input'];
};


export type MutationUpdateUserRoleArgs = {
  role: UserRole;
  userId: Scalars['ID']['input'];
};


export type MutationUpdateUserSkillArgs = {
  skill: UserSkillUpdateInput;
  skillId: Scalars['ID']['input'];
};


export type MutationUpdateVideoLessonArgs = {
  videoLessonId: Scalars['ID']['input'];
  videoLessonInput: VideoLessonUpdateInput;
};

export type Path = {
  __typename?: 'Path';
  areaStudy: Scalars['String']['output'];
  certificationType?: Maybe<Scalars['String']['output']>;
  courses: Array<Course>;
  cover: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  duration?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  language: Scalars['String']['output'];
  level: Scalars['String']['output'];
  modules: Array<Module>;
  numberOfHoursByWeek?: Maybe<Scalars['Int']['output']>;
  numberOfWeeks?: Maybe<Scalars['Int']['output']>;
  objectives?: Maybe<Scalars['String']['output']>;
  prerequisites?: Maybe<Scalars['String']['output']>;
  pricing: CoursePricing;
  progress: Scalars['Float']['output'];
  startDate: Scalars['String']['output'];
  status: CourseStatus;
  targetStudents?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  totalEarnedPoints: Scalars['Float']['output'];
  totalFinished: Scalars['Float']['output'];
  totalLearners: Scalars['Float']['output'];
  totalLessons: Scalars['Float']['output'];
  totalPoints: Scalars['Float']['output'];
  type?: Maybe<CourseType>;
  updatedAt: Scalars['DateTime']['output'];
  videoIntro?: Maybe<Scalars['String']['output']>;
};

export type PathEnrollment = {
  __typename?: 'PathEnrollment';
  path: Scalars['ID']['output'];
  user: Scalars['ID']['output'];
};

export type PathEnrollmentInput = {
  path: Scalars['ID']['input'];
};

export type PathInput = {
  areaStudy: Scalars['String']['input'];
  certificationType: Scalars['String']['input'];
  courses: Array<Scalars['ID']['input']>;
  description: Scalars['String']['input'];
  duration: Scalars['Int']['input'];
  language: Scalars['String']['input'];
  level: Scalars['String']['input'];
  numberOfHoursByWeek: Scalars['Int']['input'];
  numberOfWeeks: Scalars['Int']['input'];
  objectives: Scalars['String']['input'];
  prerequisites: Scalars['String']['input'];
  pricing?: InputMaybe<CoursePricingInput>;
  startDate: Scalars['String']['input'];
  status: CourseStatus;
  targetStudents: Scalars['String']['input'];
  title: Scalars['String']['input'];
  type: Scalars['String']['input'];
};

export type PathUpdateInput = {
  courses: Array<Scalars['ID']['input']>;
  id: Scalars['String']['input'];
  targetStudents: Scalars['String']['input'];
};

export type PersonalDetailsInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  firstName: Scalars['String']['input'];
  gender?: InputMaybe<Scalars['String']['input']>;
  lastName: Scalars['String']['input'];
  nationality?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
};

export type Query = {
  __typename?: 'Query';
  fetchArticleLesson: ArticleLesson;
  fetchArticleLessons: Array<ArticleLesson>;
  fetchCategories: Array<Category>;
  fetchCategory: Category;
  fetchCourse: Course;
  fetchCourseEnrollment: CourseEnrollment;
  fetchCourseEnrollments: Array<CourseEnrollment>;
  fetchCourseUsers: Array<User>;
  fetchCourses: Array<Course>;
  fetchCurrentUser: User;
  fetchExerciceReview: ExerciceReview;
  fetchExerciceSubmission: ExerciceSubmission;
  fetchExerciceSubmissionReviews: Array<ExerciceReview>;
  fetchExerciceSubmissions: Array<ExerciceSubmission>;
  fetchLesson: Lesson;
  fetchLessons: Array<Lesson>;
  fetchModule: Module;
  fetchMyCourse: Course;
  fetchMyCourses: Array<Course>;
  fetchMyManagedCourse: Course;
  fetchMyManagedCourses: Array<Course>;
  fetchMyManagedExercicesSubmission: Array<ExerciceSubmission>;
  fetchMyManagedQuizzesSubmission: Array<ManagedQuizzSubmission>;
  fetchMyPath: Path;
  fetchMyPaths: Array<Path>;
  fetchMyTests: Array<Course>;
  fetchOpenCourses: Array<Course>;
  fetchOpenPaths: Array<Path>;
  fetchOpenTests: Array<Course>;
  fetchPath: Path;
  fetchPathEnrollment: PathEnrollment;
  fetchPathEnrollments: Array<PathEnrollment>;
  fetchPaths: Array<Path>;
  fetchProgramModules: Array<Module>;
  fetchQuiz: Quiz;
  fetchQuizSubmission: QuizSubmission;
  fetchQuizSubmissions: Array<QuizSubmission>;
  fetchQuizs: Array<Quiz>;
  fetchUserEducation: UserEducation;
  fetchUserEducations: Array<UserEducation>;
  fetchUserEmployment: UserEmployment;
  fetchUserEmployments: Array<UserEmployment>;
  fetchUserSkill: UserSkill;
  fetchUserSkills: Array<UserSkill>;
  fetchUsers: Array<User>;
  fetchVideoLesson: VideoLesson;
  fetchVideoLessons: Array<VideoLesson>;
  login: Session;
  sendContactMessage: Scalars['Boolean']['output'];
};


export type QueryFetchArticleLessonArgs = {
  articleLessonId: Scalars['ID']['input'];
};


export type QueryFetchCategoryArgs = {
  categoryId: Scalars['ID']['input'];
};


export type QueryFetchCourseArgs = {
  courseId: Scalars['ID']['input'];
};


export type QueryFetchCourseEnrollmentArgs = {
  courseEnrollmentId: Scalars['ID']['input'];
};


export type QueryFetchCourseUsersArgs = {
  course: Scalars['ID']['input'];
};


export type QueryFetchExerciceReviewArgs = {
  exerciceReviewId: Scalars['ID']['input'];
};


export type QueryFetchExerciceSubmissionArgs = {
  exerciceSubmissionId: Scalars['ID']['input'];
};


export type QueryFetchExerciceSubmissionReviewsArgs = {
  submission: Scalars['ID']['input'];
};


export type QueryFetchLessonArgs = {
  lessonId: Scalars['ID']['input'];
};


export type QueryFetchModuleArgs = {
  moduleId: Scalars['ID']['input'];
};


export type QueryFetchMyCourseArgs = {
  courseId: Scalars['ID']['input'];
};


export type QueryFetchMyManagedCourseArgs = {
  courseId: Scalars['ID']['input'];
};


export type QueryFetchMyManagedExercicesSubmissionArgs = {
  courseId: Scalars['ID']['input'];
};


export type QueryFetchMyManagedQuizzesSubmissionArgs = {
  courseId: Scalars['ID']['input'];
};


export type QueryFetchMyPathArgs = {
  pathId: Scalars['ID']['input'];
};


export type QueryFetchPathArgs = {
  pathId: Scalars['ID']['input'];
};


export type QueryFetchPathEnrollmentArgs = {
  pathEnrollmentId: Scalars['ID']['input'];
};


export type QueryFetchProgramModulesArgs = {
  courseId: Scalars['ID']['input'];
};


export type QueryFetchQuizArgs = {
  quizId: Scalars['ID']['input'];
};


export type QueryFetchQuizSubmissionArgs = {
  quizSubmissionId: Scalars['ID']['input'];
};


export type QueryFetchUserEducationArgs = {
  userEducationId: Scalars['ID']['input'];
};


export type QueryFetchUserEmploymentArgs = {
  userEmploymentId: Scalars['ID']['input'];
};


export type QueryFetchUserSkillArgs = {
  userSkillId: Scalars['ID']['input'];
};


export type QueryFetchVideoLessonArgs = {
  videoLessonId: Scalars['ID']['input'];
};


export type QueryLoginArgs = {
  loginInput: LoginInput;
};


export type QuerySendContactMessageArgs = {
  contactInput: ContactInput;
};

export type Quiz = {
  __typename?: 'Quiz';
  minScoreRequired?: Maybe<Scalars['Float']['output']>;
  questions?: Maybe<Array<QuizQuestion>>;
};

export type QuizInput = {
  minScoreRequired: Scalars['Int']['input'];
  questions: Array<QuizQuestionInput>;
};

export type QuizQuestion = {
  __typename?: 'QuizQuestion';
  options: Array<QuizQuestionOption>;
  points: Scalars['Float']['output'];
  text: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type QuizQuestionInput = {
  options: Array<QuizQuestionOptionInput>;
  points: Scalars['Int']['input'];
  text: Scalars['String']['input'];
  type: Scalars['String']['input'];
};

export type QuizQuestionOption = {
  __typename?: 'QuizQuestionOption';
  isChoosed?: Maybe<Scalars['Boolean']['output']>;
  isCorrect: Scalars['Boolean']['output'];
  text: Scalars['String']['output'];
};

export type QuizQuestionOptionInput = {
  isChoosed?: InputMaybe<Scalars['Boolean']['input']>;
  isCorrect: Scalars['Boolean']['input'];
  text: Scalars['String']['input'];
};

export type QuizQuestionOptionUpdateInput = {
  isCorrect: Scalars['Boolean']['input'];
  text: Scalars['String']['input'];
};

export type QuizQuestionUpdateInput = {
  options: Array<QuizQuestionOptionUpdateInput>;
  points: Scalars['Int']['input'];
  text: Scalars['String']['input'];
  type: Scalars['String']['input'];
};

export type QuizSubmission = {
  __typename?: 'QuizSubmission';
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  duration: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  minScoreRequired?: Maybe<Scalars['Float']['output']>;
  module: Module;
  points?: Maybe<Scalars['Float']['output']>;
  questions?: Maybe<Array<QuizQuestion>>;
  score: Scalars['Float']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  user: User;
};

export type QuizSubmissionInput = {
  course: Scalars['ID']['input'];
  description: Scalars['String']['input'];
  duration: Scalars['Float']['input'];
  minScoreRequired: Scalars['Int']['input'];
  module: Scalars['ID']['input'];
  points?: InputMaybe<Scalars['Float']['input']>;
  questions: Array<QuizQuestionInput>;
  quiz: Scalars['ID']['input'];
  title: Scalars['String']['input'];
};

export type QuizUpdateInput = {
  description: Scalars['String']['input'];
  duration: Scalars['Int']['input'];
  minScoreRequired: Scalars['Int']['input'];
  points: Scalars['Int']['input'];
  questions: Array<QuizQuestionUpdateInput>;
  title: Scalars['String']['input'];
};

export type RegisterInput = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
};

export type ResetPasswordInput = {
  newPassword: Scalars['String']['input'];
  token: Scalars['String']['input'];
};

export type Session = {
  __typename?: 'Session';
  token: Scalars['String']['output'];
  user: User;
};

export type User = {
  __typename?: 'User';
  address?: Maybe<Scalars['String']['output']>;
  avatar?: Maybe<Scalars['String']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  educations?: Maybe<Array<UserEducation>>;
  email: Scalars['String']['output'];
  employments?: Maybe<Array<UserEmployment>>;
  firstName: Scalars['String']['output'];
  fullName: Scalars['String']['output'];
  gender?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  nationality?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  role: UserRole;
  skills?: Maybe<Array<UserSkill>>;
  status: UserStatus;
  updatedAt: Scalars['DateTime']['output'];
};

export type UserEducation = {
  __typename?: 'UserEducation';
  endDate: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  level: Scalars['String']['output'];
  school: Scalars['String']['output'];
  specialization: Scalars['String']['output'];
  startDate: Scalars['String']['output'];
};

export type UserEducationInput = {
  endDate: Scalars['DateTime']['input'];
  level: Scalars['String']['input'];
  school: Scalars['String']['input'];
  specialization: Scalars['String']['input'];
  startDate: Scalars['DateTime']['input'];
};

export type UserEducationUpdateInput = {
  endDate: Scalars['DateTime']['input'];
  level: Scalars['String']['input'];
  school: Scalars['String']['input'];
  specialization: Scalars['String']['input'];
  startDate: Scalars['DateTime']['input'];
};

export type UserEmployment = {
  __typename?: 'UserEmployment';
  city: Scalars['String']['output'];
  company: Scalars['String']['output'];
  country: Scalars['String']['output'];
  description: Scalars['String']['output'];
  endDate?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isCurrentPosition: Scalars['Boolean']['output'];
  jobTitle: Scalars['String']['output'];
  startDate: Scalars['String']['output'];
};

export type UserEmploymentInput = {
  city: Scalars['String']['input'];
  company: Scalars['String']['input'];
  country: Scalars['String']['input'];
  description: Scalars['String']['input'];
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  isCurrentPosition?: InputMaybe<Scalars['Boolean']['input']>;
  jobTitle: Scalars['String']['input'];
  startDate: Scalars['DateTime']['input'];
};

export type UserEmploymentUpdateInput = {
  city: Scalars['String']['input'];
  company: Scalars['String']['input'];
  country: Scalars['String']['input'];
  description: Scalars['String']['input'];
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  isCurrentPosition: Scalars['Boolean']['input'];
  jobTitle: Scalars['String']['input'];
  startDate: Scalars['DateTime']['input'];
};

/** Possible user role */
export enum UserRole {
  Admin = 'ADMIN',
  Instructor = 'INSTRUCTOR',
  Talent = 'TALENT'
}

export type UserSkill = {
  __typename?: 'UserSkill';
  id: Scalars['ID']['output'];
  proficiency: Scalars['String']['output'];
  skill: Scalars['String']['output'];
};

export type UserSkillInput = {
  proficiency: Scalars['String']['input'];
  skill: Scalars['String']['input'];
};

export type UserSkillUpdateInput = {
  proficiency: Scalars['String']['input'];
  skill: Scalars['String']['input'];
};

/** Possible user status */
export enum UserStatus {
  Blocked = 'Blocked',
  Joined = 'Joined',
  Pending = 'Pending'
}

export type VideoLesson = {
  __typename?: 'VideoLesson';
  id: Scalars['ID']['output'];
};

export type VideoLessonInput = {
  id: Scalars['String']['input'];
};

export type VideoLessonUpdateInput = {
  id: Scalars['String']['input'];
};

export type CreateCategoryMutationVariables = Exact<{
  categoryInput: CategoryInput;
}>;


export type CreateCategoryMutation = { __typename?: 'Mutation', createCategory: { __typename?: 'Category', name: string, id: string } };

export type FetchCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchCategoriesQuery = { __typename?: 'Query', fetchCategories: Array<{ __typename?: 'Category', id: string, name: string }> };

export type QuestionsFragment = { __typename?: 'Lesson', questions?: Array<{ __typename?: 'QuizQuestion', text: string, type: string, points: number, options: Array<{ __typename?: 'QuizQuestionOption', text: string, isCorrect: boolean, isChoosed?: boolean | null }> }> | null };

export type CreateLessonMutationVariables = Exact<{
  lessonInput: LessonInput;
}>;


export type CreateLessonMutation = { __typename?: 'Mutation', createLesson: { __typename?: 'Lesson', id: string, title: string, type: string, description?: string | null, points?: number | null, duration: number, allowDiscussion?: boolean | null, video?: string | null, slide?: string | null, minScoreRequired?: number | null, allowServices: boolean, order?: number | null, questions?: Array<{ __typename?: 'QuizQuestion', text: string, type: string, points: number, options: Array<{ __typename?: 'QuizQuestionOption', text: string, isCorrect: boolean }> }> | null, ressources: Array<{ __typename?: 'Link', name: string, url: string }> } };

export type UpdateLessonMutationVariables = Exact<{
  lessonInput: LessonUpdateInput;
  lessonId: Scalars['ID']['input'];
}>;


export type UpdateLessonMutation = { __typename?: 'Mutation', updateLesson: boolean };

export type FetchLessonQueryVariables = Exact<{
  lessonId: Scalars['ID']['input'];
}>;


export type FetchLessonQuery = { __typename?: 'Query', fetchLesson: { __typename?: 'Lesson', id: string, title: string, type: string, description?: string | null, points?: number | null, duration: number, allowDiscussion?: boolean | null, video?: string | null, slide?: string | null, minScoreRequired?: number | null, order?: number | null, course: string, module: string, allowServices: boolean, questions?: Array<{ __typename?: 'QuizQuestion', text: string, type: string, points: number, options: Array<{ __typename?: 'QuizQuestionOption', text: string, isCorrect: boolean }> }> | null, ressources: Array<{ __typename?: 'Link', name: string, url: string }>, next?: { __typename?: 'Lesson', id: string, type: string } | null, prev?: { __typename?: 'Lesson', id: string, type: string } | null } };

export type FetchQuizLessonQueryVariables = Exact<{
  lessonId: Scalars['ID']['input'];
}>;


export type FetchQuizLessonQuery = { __typename?: 'Query', fetchLesson: { __typename?: 'Lesson', id: string, title: string, type: string, description?: string | null, points?: number | null, duration: number, allowDiscussion?: boolean | null, video?: string | null, slide?: string | null, minScoreRequired?: number | null, order?: number | null, course: string, module: string, quizSubmission?: { __typename?: 'QuizSubmission', minScoreRequired?: number | null, score: number, duration: number, createdAt: any, updatedAt: any, questions?: Array<{ __typename?: 'QuizQuestion', text: string, type: string, points: number, options: Array<{ __typename?: 'QuizQuestionOption', text: string, isCorrect: boolean, isChoosed?: boolean | null }> }> | null } | null, questions?: Array<{ __typename?: 'QuizQuestion', text: string, type: string, points: number, options: Array<{ __typename?: 'QuizQuestionOption', text: string, isCorrect: boolean, isChoosed?: boolean | null }> }> | null, ressources: Array<{ __typename?: 'Link', name: string, url: string }>, next?: { __typename?: 'Lesson', id: string, type: string } | null, prev?: { __typename?: 'Lesson', id: string, type: string } | null } };

export type FetchExerciceLessonQueryVariables = Exact<{
  lessonId: Scalars['ID']['input'];
}>;


export type FetchExerciceLessonQuery = { __typename?: 'Query', fetchLesson: { __typename?: 'Lesson', id: string, title: string, type: string, description?: string | null, points?: number | null, duration: number, allowDiscussion?: boolean | null, video?: string | null, slide?: string | null, minScoreRequired?: number | null, order?: number | null, course: string, module: string, allowServices: boolean, exerciceSubmission?: { __typename?: 'ExerciceSubmission', id: string, title: string, description: string, type: string, content?: string | null, attachment?: string | null, createdAt: any } | null, next?: { __typename?: 'Lesson', id: string, type: string } | null, prev?: { __typename?: 'Lesson', id: string, type: string } | null } };

export type DeleteLessonMutationVariables = Exact<{
  lessonId: Scalars['ID']['input'];
}>;


export type DeleteLessonMutation = { __typename?: 'Mutation', deleteLesson: boolean };

export type CreateModuleMutationVariables = Exact<{
  moduleInput: ModuleInput;
}>;


export type CreateModuleMutation = { __typename?: 'Mutation', createModule: { __typename?: 'Module', id: string, title: string, description: string, order?: number | null } };

export type UpdateModuleMutationVariables = Exact<{
  moduleId: Scalars['ID']['input'];
  moduleInput: ModuleUpdateInput;
}>;


export type UpdateModuleMutation = { __typename?: 'Mutation', updateModule: boolean };

export type DeleteModuleMutationVariables = Exact<{
  moduleId: Scalars['ID']['input'];
}>;


export type DeleteModuleMutation = { __typename?: 'Mutation', deleteModule: boolean };

export type BlockUserMutationVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;


export type BlockUserMutation = { __typename?: 'Mutation', blockUser: boolean };

export type UnLockUserMutationVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;


export type UnLockUserMutation = { __typename?: 'Mutation', unLockUser: boolean };

export type DeleteUserMutationVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;


export type DeleteUserMutation = { __typename?: 'Mutation', deleteUser: boolean };

export type InviteUsersToEnrollCourseMutationVariables = Exact<{
  invitations: Array<CourseInvitationInput> | CourseInvitationInput;
  course: Scalars['ID']['input'];
}>;


export type InviteUsersToEnrollCourseMutation = { __typename?: 'Mutation', inviteUsersToEnrollCourse: boolean };

export type FetchCourseUsersQueryVariables = Exact<{
  course: Scalars['ID']['input'];
}>;


export type FetchCourseUsersQuery = { __typename?: 'Query', fetchCourseUsers: Array<{ __typename?: 'User', id: string, firstName: string, lastName: string, fullName: string, status: UserStatus, email: string, updatedAt: any, role: UserRole }> };

export type UpdateUserRoleMutationVariables = Exact<{
  role: UserRole;
  userId: Scalars['ID']['input'];
}>;


export type UpdateUserRoleMutation = { __typename?: 'Mutation', updateUserRole: boolean };

export type CreatePathEnrollmentMutationVariables = Exact<{
  pathEnrollmentInput: PathEnrollmentInput;
}>;


export type CreatePathEnrollmentMutation = { __typename?: 'Mutation', createPathEnrollment: { __typename?: 'PathEnrollment', path: string } };

export type FetchPathQueryVariables = Exact<{
  pathId: Scalars['ID']['input'];
}>;


export type FetchPathQuery = { __typename?: 'Query', fetchPath: { __typename?: 'Path', id: string, areaStudy: string, certificationType?: string | null, type?: CourseType | null, language: string, description: string, title: string, numberOfHoursByWeek?: number | null, numberOfWeeks?: number | null, level: string, prerequisites?: string | null, objectives?: string | null, startDate: string, cover: string, videoIntro?: string | null, targetStudents?: string | null, status: CourseStatus, duration?: number | null, pricing: { __typename?: 'CoursePricing', price?: number | null, currency?: Currency | null }, courses: Array<{ __typename?: 'Course', id: string, areaStudy: string, certificationType?: string | null, type?: CourseType | null, language: string, description: string, title: string, numberOfHoursByWeek?: number | null, numberOfWeeks?: number | null, level: string, prerequisites?: string | null, objectives?: string | null, startDate: string, cover: string, videoIntro?: string | null, targetStudents?: string | null, status: CourseStatus, duration?: number | null, totalLearners: number, pricing: { __typename?: 'CoursePricing', price?: number | null, currency?: Currency | null }, modules: Array<{ __typename?: 'Module', title: string, lessons: Array<{ __typename?: 'Lesson', id: string, type: string }> }> }> } };

export type FetchMyPathQueryVariables = Exact<{
  pathId: Scalars['ID']['input'];
}>;


export type FetchMyPathQuery = { __typename?: 'Query', fetchMyPath: { __typename?: 'Path', id: string, areaStudy: string, certificationType?: string | null, type?: CourseType | null, language: string, description: string, title: string, numberOfHoursByWeek?: number | null, numberOfWeeks?: number | null, level: string, prerequisites?: string | null, objectives?: string | null, startDate: string, cover: string, videoIntro?: string | null, targetStudents?: string | null, status: CourseStatus, duration?: number | null, progress: number, totalFinished: number, totalLessons: number, pricing: { __typename?: 'CoursePricing', price?: number | null, currency?: Currency | null }, courses: Array<{ __typename?: 'Course', id: string, areaStudy: string, certificationType?: string | null, type?: CourseType | null, language: string, description: string, title: string, numberOfHoursByWeek?: number | null, numberOfWeeks?: number | null, level: string, prerequisites?: string | null, objectives?: string | null, startDate: string, cover: string, videoIntro?: string | null, targetStudents?: string | null, status: CourseStatus, duration?: number | null, progress: number, totalFinished: number, totalLessons: number, totalEarnedPoints: number, totalPoints: number, pricing: { __typename?: 'CoursePricing', price?: number | null, currency?: Currency | null }, modules: Array<{ __typename?: 'Module', title: string, lessons: Array<{ __typename?: 'Lesson', id: string, type: string }> }> }> } };

export type FetchPathsQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchPathsQuery = { __typename?: 'Query', fetchPaths: Array<{ __typename?: 'Path', id: string, areaStudy: string, certificationType?: string | null, type?: CourseType | null, language: string, description: string, title: string, numberOfHoursByWeek?: number | null, numberOfWeeks?: number | null, level: string, prerequisites?: string | null, objectives?: string | null, startDate: string, cover: string, videoIntro?: string | null, targetStudents?: string | null, status: CourseStatus, duration?: number | null, pricing: { __typename?: 'CoursePricing', price?: number | null, currency?: Currency | null }, courses: Array<{ __typename?: 'Course', id: string, areaStudy: string, certificationType?: string | null, type?: CourseType | null, language: string, description: string, title: string, numberOfHoursByWeek?: number | null, numberOfWeeks?: number | null, level: string, prerequisites?: string | null, objectives?: string | null, startDate: string, targetStudents?: string | null, status: CourseStatus, duration?: number | null, pricing: { __typename?: 'CoursePricing', price?: number | null, currency?: Currency | null } }> }> };

export type FetchOpenPathsQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchOpenPathsQuery = { __typename?: 'Query', fetchOpenPaths: Array<{ __typename?: 'Path', id: string, areaStudy: string, certificationType?: string | null, type?: CourseType | null, language: string, description: string, title: string, numberOfHoursByWeek?: number | null, numberOfWeeks?: number | null, level: string, prerequisites?: string | null, objectives?: string | null, startDate: string, cover: string, videoIntro?: string | null, targetStudents?: string | null, status: CourseStatus, duration?: number | null, pricing: { __typename?: 'CoursePricing', price?: number | null, currency?: Currency | null }, courses: Array<{ __typename?: 'Course', id: string, areaStudy: string, certificationType?: string | null, type?: CourseType | null, language: string, description: string, title: string, numberOfHoursByWeek?: number | null, numberOfWeeks?: number | null, level: string, prerequisites?: string | null, objectives?: string | null, startDate: string, targetStudents?: string | null, status: CourseStatus, duration?: number | null, pricing: { __typename?: 'CoursePricing', price?: number | null, currency?: Currency | null } }> }> };

export type FetchMyPathsQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchMyPathsQuery = { __typename?: 'Query', fetchMyPaths: Array<{ __typename?: 'Path', id: string, areaStudy: string, certificationType?: string | null, type?: CourseType | null, language: string, description: string, title: string, numberOfHoursByWeek?: number | null, numberOfWeeks?: number | null, level: string, prerequisites?: string | null, objectives?: string | null, startDate: string, cover: string, videoIntro?: string | null, targetStudents?: string | null, status: CourseStatus, duration?: number | null, progress: number, totalFinished: number, totalLessons: number, totalEarnedPoints: number, totalPoints: number, courses: Array<{ __typename?: 'Course', id: string, areaStudy: string, certificationType?: string | null, type?: CourseType | null, language: string, description: string, title: string, numberOfHoursByWeek?: number | null, numberOfWeeks?: number | null, level: string, prerequisites?: string | null, objectives?: string | null, startDate: string, targetStudents?: string | null, status: CourseStatus, duration?: number | null }> }> };

export type FetchExerciceSubmissionReviewsQueryVariables = Exact<{
  submission: Scalars['ID']['input'];
}>;


export type FetchExerciceSubmissionReviewsQuery = { __typename?: 'Query', fetchExerciceSubmissionReviews: Array<{ __typename?: 'ExerciceReview', content: string, createdAt: any, user: { __typename?: 'User', role: UserRole, fullName: string, firstName: string, avatar?: string | null } }> };

export type FetchMyManagedCoursesQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchMyManagedCoursesQuery = { __typename?: 'Query', fetchMyManagedCourses: Array<{ __typename?: 'Course', id: string, areaStudy: string, certificationType?: string | null, type?: CourseType | null, language: string, description: string, title: string, numberOfHoursByWeek?: number | null, numberOfWeeks?: number | null, level: string, duration?: number | null, prerequisites?: string | null, objectives?: string | null, startDate: string, cover: string, status: CourseStatus, modules: Array<{ __typename?: 'Module', id: string, title: string, order?: number | null }> }> };

export type FetchMyManagedCourseQueryVariables = Exact<{
  courseId: Scalars['ID']['input'];
}>;


export type FetchMyManagedCourseQuery = { __typename?: 'Query', fetchMyManagedCourse: { __typename?: 'Course', id: string, areaStudy: string, certificationType?: string | null, type?: CourseType | null, language: string, description: string, title: string, numberOfHoursByWeek?: number | null, numberOfWeeks?: number | null, duration?: number | null, prerequisites?: string | null, objectives?: string | null, startDate: string, cover: string, status: CourseStatus, modules: Array<{ __typename?: 'Module', id: string, title: string, order?: number | null }> } };

export type FetchMyManagedExercicesSubmissionQueryVariables = Exact<{
  courseId: Scalars['ID']['input'];
}>;


export type FetchMyManagedExercicesSubmissionQuery = { __typename?: 'Query', fetchMyManagedExercicesSubmission: Array<{ __typename?: 'ExerciceSubmission', id: string, createdAt: any, updatedAt: any, attachment?: string | null, content?: string | null, user: { __typename?: 'User', id: string, fullName: string, email: string }, reviews: Array<{ __typename?: 'ExerciceReview', id: string, content: string }>, lesson: { __typename?: 'Lesson', id: string, title: string, moduleData: { __typename?: 'Module', id: string, title: string } } }> };

export type FetchMyManagedQuizzesSubmissionQueryVariables = Exact<{
  courseId: Scalars['ID']['input'];
}>;


export type FetchMyManagedQuizzesSubmissionQuery = { __typename?: 'Query', fetchMyManagedQuizzesSubmission: Array<{ __typename?: 'ManagedQuizzSubmission', nbAttempts: number, lastSubmission: { __typename?: 'QuizSubmission', id: string, title: string, minScoreRequired?: number | null, score: number, duration: number, createdAt: any, updatedAt: any, module: { __typename?: 'Module', id: string, title: string }, user: { __typename?: 'User', id: string, fullName: string, email: string } } }> };

export type SendExerciceReviewMutationVariables = Exact<{
  review: ExerciceReviewInput;
}>;


export type SendExerciceReviewMutation = { __typename?: 'Mutation', sendExerciceReview: { __typename?: 'ExerciceReview', id: string, content: string, createdAt: any, user: { __typename?: 'User', avatar?: string | null, fullName: string, firstName: string } } };

export type RegisterMutationVariables = Exact<{
  registerInput: RegisterInput;
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'Session', token: string, user: { __typename?: 'User', id: string, email: string, firstName: string, lastName: string, phone?: string | null, role: UserRole } } };

export type LoginQueryVariables = Exact<{
  loginInput: LoginInput;
}>;


export type LoginQuery = { __typename?: 'Query', login: { __typename?: 'Session', token: string, user: { __typename?: 'User', id: string, email: string, firstName: string, lastName: string, phone?: string | null, role: UserRole } } };

export type RequestPasswordResetMutationVariables = Exact<{
  email: Scalars['String']['input'];
}>;


export type RequestPasswordResetMutation = { __typename?: 'Mutation', requestPasswordReset: boolean };

export type ResetPasswordMutationVariables = Exact<{
  resetPasswordInput: ResetPasswordInput;
}>;


export type ResetPasswordMutation = { __typename?: 'Mutation', resetPassword: boolean };

export type SubmitQuizMutationVariables = Exact<{
  quizSubmissionInput: QuizSubmissionInput;
}>;


export type SubmitQuizMutation = { __typename?: 'Mutation', submitQuiz?: { __typename?: 'QuizSubmission', minScoreRequired?: number | null, score: number, duration: number, createdAt: any, updatedAt: any, questions?: Array<{ __typename?: 'QuizQuestion', text: string, type: string, points: number, options: Array<{ __typename?: 'QuizQuestionOption', text: string, isCorrect: boolean, isChoosed?: boolean | null }> }> | null } | null };

export type MarkLessonAsCompletedMutationVariables = Exact<{
  lesson: Scalars['ID']['input'];
}>;


export type MarkLessonAsCompletedMutation = { __typename?: 'Mutation', markLessonAsCompleted?: { __typename?: 'LessonCompletion', lesson: { __typename?: 'Lesson', id: string }, user: { __typename?: 'User', id: string } } | null };

export type SendContactMessageQueryVariables = Exact<{
  contactInput: ContactInput;
}>;


export type SendContactMessageQuery = { __typename?: 'Query', sendContactMessage: boolean };

export type FetchCurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchCurrentUserQuery = { __typename?: 'Query', fetchCurrentUser: { __typename?: 'User', email: string, firstName: string, lastName: string, fullName: string, phone?: string | null, address?: string | null, country?: string | null, nationality?: string | null, gender?: string | null, city?: string | null, employments?: Array<{ __typename?: 'UserEmployment', id: string, jobTitle: string, company: string, description: string, country: string, city: string, startDate: string, endDate?: string | null, isCurrentPosition: boolean }> | null, educations?: Array<{ __typename?: 'UserEducation', id: string, school: string, level: string, specialization: string, startDate: string, endDate: string }> | null, skills?: Array<{ __typename?: 'UserSkill', id: string, skill: string, proficiency: string }> | null } };

export type UpdatePersonalDetailsMutationVariables = Exact<{
  personalDetailsInput: PersonalDetailsInput;
}>;


export type UpdatePersonalDetailsMutation = { __typename?: 'Mutation', updatePersonalDetails: boolean };

export type AddUserEducationMutationVariables = Exact<{
  education: UserEducationInput;
}>;


export type AddUserEducationMutation = { __typename?: 'Mutation', addUserEducation: { __typename?: 'UserEducation', id: string, school: string, level: string, specialization: string, startDate: string, endDate: string } };

export type UpdateUserEducationMutationVariables = Exact<{
  education: UserEducationUpdateInput;
  educationId: Scalars['ID']['input'];
}>;


export type UpdateUserEducationMutation = { __typename?: 'Mutation', updateUserEducation: boolean };

export type RemoveUserEducationMutationVariables = Exact<{
  educationId: Scalars['ID']['input'];
}>;


export type RemoveUserEducationMutation = { __typename?: 'Mutation', removeUserEducation: boolean };

export type AddUserEmploymentMutationVariables = Exact<{
  employment: UserEmploymentInput;
}>;


export type AddUserEmploymentMutation = { __typename?: 'Mutation', addUserEmployment: { __typename?: 'UserEmployment', id: string, jobTitle: string, company: string, description: string, country: string, city: string, startDate: string, endDate?: string | null, isCurrentPosition: boolean } };

export type UpdateUserEmploymentMutationVariables = Exact<{
  employment: UserEmploymentUpdateInput;
  employmentId: Scalars['ID']['input'];
}>;


export type UpdateUserEmploymentMutation = { __typename?: 'Mutation', updateUserEmployment: boolean };

export type RemoveUserEmploymentMutationVariables = Exact<{
  employmentId: Scalars['ID']['input'];
}>;


export type RemoveUserEmploymentMutation = { __typename?: 'Mutation', removeUserEmployment: boolean };

export type AddUserSkillMutationVariables = Exact<{
  skill: UserSkillInput;
}>;


export type AddUserSkillMutation = { __typename?: 'Mutation', addUserSkill: { __typename?: 'UserSkill', id: string, skill: string, proficiency: string } };

export type UpdateUserSkillMutationVariables = Exact<{
  skill: UserSkillUpdateInput;
  skillId: Scalars['ID']['input'];
}>;


export type UpdateUserSkillMutation = { __typename?: 'Mutation', updateUserSkill: boolean };

export type RemoveUserSkillMutationVariables = Exact<{
  skillId: Scalars['ID']['input'];
}>;


export type RemoveUserSkillMutation = { __typename?: 'Mutation', removeUserSkill: boolean };

export type CreateCourseEnrollmentMutationVariables = Exact<{
  courseEnrollmentInput: CourseEnrollmentInput;
}>;


export type CreateCourseEnrollmentMutation = { __typename?: 'Mutation', createCourseEnrollment: { __typename?: 'CourseEnrollment', course: string } };

export type FetchCourseQueryVariables = Exact<{
  courseId: Scalars['ID']['input'];
}>;


export type FetchCourseQuery = { __typename?: 'Query', fetchCourse: { __typename?: 'Course', id: string, areaStudy: string, certificationType?: string | null, type?: CourseType | null, language: string, description: string, title: string, numberOfHoursByWeek?: number | null, numberOfWeeks?: number | null, level: string, prerequisites?: string | null, objectives?: string | null, startDate: string, cover: string, videoIntro?: string | null, targetStudents?: string | null, status: CourseStatus, duration?: number | null, updatedAt: any, pricing: { __typename?: 'CoursePricing', price?: number | null, currency?: Currency | null }, modules: Array<{ __typename?: 'Module', id: string, title: string, description: string, order?: number | null, lessons: Array<{ __typename?: 'Lesson', id: string, type: string, title: string, description?: string | null, points?: number | null, duration: number, order?: number | null, allowDiscussion?: boolean | null, ressources: Array<{ __typename?: 'Link', name: string, url: string }> }> }> } };

export type FetchMyCourseQueryVariables = Exact<{
  courseId: Scalars['ID']['input'];
}>;


export type FetchMyCourseQuery = { __typename?: 'Query', fetchMyCourse: { __typename?: 'Course', id: string, areaStudy: string, certificationType?: string | null, type?: CourseType | null, language: string, description: string, title: string, numberOfHoursByWeek?: number | null, numberOfWeeks?: number | null, level: string, prerequisites?: string | null, objectives?: string | null, startDate: string, cover: string, videoIntro?: string | null, targetStudents?: string | null, status: CourseStatus, duration?: number | null, progress: number, totalFinished: number, totalLessons: number, totalEarnedPoints: number, totalPoints: number, updatedAt: any, pricing: { __typename?: 'CoursePricing', price?: number | null, currency?: Currency | null }, modules: Array<{ __typename?: 'Module', id: string, title: string, description: string, order?: number | null, lessons: Array<{ __typename?: 'Lesson', id: string, type: string, title: string, description?: string | null, points?: number | null, duration: number, order?: number | null, allowDiscussion?: boolean | null, isCompletedByCurrentUser: boolean, ressources: Array<{ __typename?: 'Link', name: string, url: string }> }> }> } };

export type FetchCoursesQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchCoursesQuery = { __typename?: 'Query', fetchCourses: Array<{ __typename?: 'Course', id: string, areaStudy: string, certificationType?: string | null, type?: CourseType | null, language: string, description: string, title: string, numberOfHoursByWeek?: number | null, numberOfWeeks?: number | null, level: string, prerequisites?: string | null, objectives?: string | null, startDate: string, cover: string, status: CourseStatus, duration?: number | null, updatedAt: any, pricing: { __typename?: 'CoursePricing', price?: number | null, currency?: Currency | null }, modules: Array<{ __typename?: 'Module', id: string, title: string, order?: number | null }> }> };

export type FetchOpenCoursesQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchOpenCoursesQuery = { __typename?: 'Query', fetchOpenCourses: Array<{ __typename?: 'Course', id: string, areaStudy: string, certificationType?: string | null, type?: CourseType | null, language: string, description: string, title: string, numberOfHoursByWeek?: number | null, numberOfWeeks?: number | null, level: string, prerequisites?: string | null, objectives?: string | null, startDate: string, cover: string, status: CourseStatus, duration?: number | null, totalLearners: number, updatedAt: any, pricing: { __typename?: 'CoursePricing', price?: number | null, currency?: Currency | null }, modules: Array<{ __typename?: 'Module', id: string, title: string, order?: number | null }> }> };

export type FetchOpenTestsQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchOpenTestsQuery = { __typename?: 'Query', fetchOpenTests: Array<{ __typename?: 'Course', id: string, areaStudy: string, certificationType?: string | null, type?: CourseType | null, language: string, description: string, title: string, numberOfHoursByWeek?: number | null, numberOfWeeks?: number | null, level: string, prerequisites?: string | null, objectives?: string | null, startDate: string, cover: string, status: CourseStatus, duration?: number | null, totalLearners: number, updatedAt: any, pricing: { __typename?: 'CoursePricing', price?: number | null, currency?: Currency | null }, modules: Array<{ __typename?: 'Module', id: string, title: string, order?: number | null, lessons: Array<{ __typename?: 'Lesson', id: string, title: string, description?: string | null, type: string }> }> }> };

export type FetchMyCoursesQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchMyCoursesQuery = { __typename?: 'Query', fetchMyCourses: Array<{ __typename?: 'Course', id: string, areaStudy: string, certificationType?: string | null, type?: CourseType | null, language: string, description: string, title: string, numberOfHoursByWeek?: number | null, numberOfWeeks?: number | null, level: string, duration?: number | null, prerequisites?: string | null, objectives?: string | null, startDate: string, cover: string, status: CourseStatus, progress: number, totalFinished: number, totalLessons: number, totalEarnedPoints: number, totalPoints: number, updatedAt: any, pricing: { __typename?: 'CoursePricing', price?: number | null, currency?: Currency | null }, modules: Array<{ __typename?: 'Module', id: string, title: string, order?: number | null, lessons: Array<{ __typename?: 'Lesson', id: string, title: string, description?: string | null, type: string }> }> }> };

export type FetchMyTestsQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchMyTestsQuery = { __typename?: 'Query', fetchMyTests: Array<{ __typename?: 'Course', id: string, areaStudy: string, certificationType?: string | null, type?: CourseType | null, language: string, description: string, title: string, numberOfHoursByWeek?: number | null, numberOfWeeks?: number | null, level: string, updatedAt: any, duration?: number | null, prerequisites?: string | null, objectives?: string | null, startDate: string, cover: string, status: CourseStatus, progress: number, totalFinished: number, totalLessons: number, totalEarnedPoints: number, totalPoints: number, pricing: { __typename?: 'CoursePricing', price?: number | null, currency?: Currency | null }, modules: Array<{ __typename?: 'Module', id: string, title: string, order?: number | null, lessons: Array<{ __typename?: 'Lesson', id: string, title: string, description?: string | null, type: string }> }> }> };

export const QuestionsFragmentDoc = gql`
    fragment Questions on Lesson {
  questions {
    text
    type
    points
    options {
      text
      isCorrect
      isChoosed
    }
  }
}
    `;
export const CreateCategoryDocument = gql`
    mutation CreateCategory($categoryInput: CategoryInput!) {
  createCategory(categoryInput: $categoryInput) {
    name
    id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateCategoryGQL extends Apollo.Mutation<CreateCategoryMutation, CreateCategoryMutationVariables> {
    document = CreateCategoryDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FetchCategoriesDocument = gql`
    query FetchCategories {
  fetchCategories {
    id
    name
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FetchCategoriesGQL extends Apollo.Query<FetchCategoriesQuery, FetchCategoriesQueryVariables> {
    document = FetchCategoriesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateLessonDocument = gql`
    mutation CreateLesson($lessonInput: LessonInput!) {
  createLesson(lessonInput: $lessonInput) {
    id
    title
    type
    description
    points
    duration
    allowDiscussion
    video
    slide
    minScoreRequired
    allowServices
    order
    questions {
      text
      type
      points
      options {
        text
        isCorrect
      }
    }
    ressources {
      name
      url
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateLessonGQL extends Apollo.Mutation<CreateLessonMutation, CreateLessonMutationVariables> {
    document = CreateLessonDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateLessonDocument = gql`
    mutation UpdateLesson($lessonInput: LessonUpdateInput!, $lessonId: ID!) {
  updateLesson(lessonInput: $lessonInput, lessonId: $lessonId)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateLessonGQL extends Apollo.Mutation<UpdateLessonMutation, UpdateLessonMutationVariables> {
    document = UpdateLessonDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FetchLessonDocument = gql`
    query FetchLesson($lessonId: ID!) {
  fetchLesson(lessonId: $lessonId) {
    id
    title
    type
    description
    points
    duration
    allowDiscussion
    video
    slide
    minScoreRequired
    order
    course
    module
    allowServices
    questions {
      text
      type
      points
      options {
        text
        isCorrect
      }
    }
    ressources {
      name
      url
    }
    next {
      id
      type
    }
    prev {
      id
      type
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FetchLessonGQL extends Apollo.Query<FetchLessonQuery, FetchLessonQueryVariables> {
    document = FetchLessonDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FetchQuizLessonDocument = gql`
    query FetchQuizLesson($lessonId: ID!) {
  fetchLesson(lessonId: $lessonId) {
    id
    title
    type
    description
    points
    duration
    allowDiscussion
    video
    slide
    minScoreRequired
    order
    course
    module
    quizSubmission {
      minScoreRequired
      score
      duration
      createdAt
      updatedAt
      questions {
        text
        type
        points
        options {
          text
          isCorrect
          isChoosed
        }
      }
    }
    questions {
      text
      type
      points
      options {
        text
        isCorrect
        isChoosed
      }
    }
    ressources {
      name
      url
    }
    next {
      id
      type
    }
    prev {
      id
      type
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FetchQuizLessonGQL extends Apollo.Query<FetchQuizLessonQuery, FetchQuizLessonQueryVariables> {
    document = FetchQuizLessonDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FetchExerciceLessonDocument = gql`
    query FetchExerciceLesson($lessonId: ID!) {
  fetchLesson(lessonId: $lessonId) {
    id
    title
    type
    description
    points
    duration
    allowDiscussion
    video
    slide
    minScoreRequired
    order
    course
    module
    allowServices
    exerciceSubmission {
      id
      title
      description
      type
      content
      attachment
      createdAt
    }
    next {
      id
      type
    }
    prev {
      id
      type
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FetchExerciceLessonGQL extends Apollo.Query<FetchExerciceLessonQuery, FetchExerciceLessonQueryVariables> {
    document = FetchExerciceLessonDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteLessonDocument = gql`
    mutation DeleteLesson($lessonId: ID!) {
  deleteLesson(lessonId: $lessonId)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DeleteLessonGQL extends Apollo.Mutation<DeleteLessonMutation, DeleteLessonMutationVariables> {
    document = DeleteLessonDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateModuleDocument = gql`
    mutation CreateModule($moduleInput: ModuleInput!) {
  createModule(moduleInput: $moduleInput) {
    id
    title
    description
    order
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateModuleGQL extends Apollo.Mutation<CreateModuleMutation, CreateModuleMutationVariables> {
    document = CreateModuleDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateModuleDocument = gql`
    mutation UpdateModule($moduleId: ID!, $moduleInput: ModuleUpdateInput!) {
  updateModule(moduleId: $moduleId, moduleInput: $moduleInput)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateModuleGQL extends Apollo.Mutation<UpdateModuleMutation, UpdateModuleMutationVariables> {
    document = UpdateModuleDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteModuleDocument = gql`
    mutation DeleteModule($moduleId: ID!) {
  deleteModule(moduleId: $moduleId)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DeleteModuleGQL extends Apollo.Mutation<DeleteModuleMutation, DeleteModuleMutationVariables> {
    document = DeleteModuleDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const BlockUserDocument = gql`
    mutation BlockUser($userId: ID!) {
  blockUser(userId: $userId)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class BlockUserGQL extends Apollo.Mutation<BlockUserMutation, BlockUserMutationVariables> {
    document = BlockUserDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UnLockUserDocument = gql`
    mutation unLockUser($userId: ID!) {
  unLockUser(userId: $userId)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UnLockUserGQL extends Apollo.Mutation<UnLockUserMutation, UnLockUserMutationVariables> {
    document = UnLockUserDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteUserDocument = gql`
    mutation DeleteUser($userId: ID!) {
  deleteUser(userId: $userId)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DeleteUserGQL extends Apollo.Mutation<DeleteUserMutation, DeleteUserMutationVariables> {
    document = DeleteUserDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const InviteUsersToEnrollCourseDocument = gql`
    mutation InviteUsersToEnrollCourse($invitations: [CourseInvitationInput!]!, $course: ID!) {
  inviteUsersToEnrollCourse(invitations: $invitations, course: $course)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class InviteUsersToEnrollCourseGQL extends Apollo.Mutation<InviteUsersToEnrollCourseMutation, InviteUsersToEnrollCourseMutationVariables> {
    document = InviteUsersToEnrollCourseDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FetchCourseUsersDocument = gql`
    query FetchCourseUsers($course: ID!) {
  fetchCourseUsers(course: $course) {
    id
    firstName
    lastName
    fullName
    status
    email
    updatedAt
    role
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FetchCourseUsersGQL extends Apollo.Query<FetchCourseUsersQuery, FetchCourseUsersQueryVariables> {
    document = FetchCourseUsersDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateUserRoleDocument = gql`
    mutation UpdateUserRole($role: UserRole!, $userId: ID!) {
  updateUserRole(role: $role, userId: $userId)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateUserRoleGQL extends Apollo.Mutation<UpdateUserRoleMutation, UpdateUserRoleMutationVariables> {
    document = UpdateUserRoleDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreatePathEnrollmentDocument = gql`
    mutation CreatePathEnrollment($pathEnrollmentInput: PathEnrollmentInput!) {
  createPathEnrollment(pathEnrollmentInput: $pathEnrollmentInput) {
    path
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CreatePathEnrollmentGQL extends Apollo.Mutation<CreatePathEnrollmentMutation, CreatePathEnrollmentMutationVariables> {
    document = CreatePathEnrollmentDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FetchPathDocument = gql`
    query FetchPath($pathId: ID!) {
  fetchPath(pathId: $pathId) {
    id
    areaStudy
    certificationType
    type
    language
    description
    title
    numberOfHoursByWeek
    numberOfWeeks
    level
    prerequisites
    objectives
    startDate
    cover
    videoIntro
    targetStudents
    status
    duration
    pricing {
      price
      currency
    }
    courses {
      id
      areaStudy
      certificationType
      type
      language
      description
      title
      numberOfHoursByWeek
      numberOfWeeks
      level
      prerequisites
      objectives
      startDate
      cover
      videoIntro
      targetStudents
      status
      duration
      totalLearners
      pricing {
        price
        currency
      }
      modules {
        title
        lessons {
          id
          type
        }
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FetchPathGQL extends Apollo.Query<FetchPathQuery, FetchPathQueryVariables> {
    document = FetchPathDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FetchMyPathDocument = gql`
    query FetchMyPath($pathId: ID!) {
  fetchMyPath(pathId: $pathId) {
    id
    areaStudy
    certificationType
    type
    language
    description
    title
    numberOfHoursByWeek
    numberOfWeeks
    level
    prerequisites
    objectives
    startDate
    cover
    videoIntro
    targetStudents
    status
    duration
    progress
    totalFinished
    totalLessons
    pricing {
      price
      currency
    }
    courses {
      id
      areaStudy
      certificationType
      type
      language
      description
      title
      numberOfHoursByWeek
      numberOfWeeks
      level
      prerequisites
      objectives
      startDate
      cover
      videoIntro
      targetStudents
      status
      duration
      progress
      totalFinished
      totalLessons
      totalEarnedPoints
      totalPoints
      pricing {
        price
        currency
      }
      modules {
        title
        lessons {
          id
          type
        }
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FetchMyPathGQL extends Apollo.Query<FetchMyPathQuery, FetchMyPathQueryVariables> {
    document = FetchMyPathDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FetchPathsDocument = gql`
    query FetchPaths {
  fetchPaths {
    id
    areaStudy
    certificationType
    type
    language
    description
    title
    numberOfHoursByWeek
    numberOfWeeks
    level
    prerequisites
    objectives
    startDate
    cover
    videoIntro
    targetStudents
    status
    duration
    pricing {
      price
      currency
    }
    courses {
      id
      areaStudy
      certificationType
      type
      language
      description
      title
      numberOfHoursByWeek
      numberOfWeeks
      level
      prerequisites
      objectives
      startDate
      targetStudents
      status
      duration
      pricing {
        price
        currency
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FetchPathsGQL extends Apollo.Query<FetchPathsQuery, FetchPathsQueryVariables> {
    document = FetchPathsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FetchOpenPathsDocument = gql`
    query FetchOpenPaths {
  fetchOpenPaths {
    id
    areaStudy
    certificationType
    type
    language
    description
    title
    numberOfHoursByWeek
    numberOfWeeks
    level
    prerequisites
    objectives
    startDate
    cover
    videoIntro
    targetStudents
    status
    duration
    pricing {
      price
      currency
    }
    courses {
      id
      areaStudy
      certificationType
      type
      language
      description
      title
      numberOfHoursByWeek
      numberOfWeeks
      level
      prerequisites
      objectives
      startDate
      targetStudents
      status
      duration
      pricing {
        price
        currency
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FetchOpenPathsGQL extends Apollo.Query<FetchOpenPathsQuery, FetchOpenPathsQueryVariables> {
    document = FetchOpenPathsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FetchMyPathsDocument = gql`
    query FetchMyPaths {
  fetchMyPaths {
    id
    areaStudy
    certificationType
    type
    language
    description
    title
    numberOfHoursByWeek
    numberOfWeeks
    level
    prerequisites
    objectives
    startDate
    cover
    videoIntro
    targetStudents
    status
    duration
    progress
    totalFinished
    totalLessons
    totalEarnedPoints
    totalPoints
    courses {
      id
      areaStudy
      certificationType
      type
      language
      description
      title
      numberOfHoursByWeek
      numberOfWeeks
      level
      prerequisites
      objectives
      startDate
      targetStudents
      status
      duration
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FetchMyPathsGQL extends Apollo.Query<FetchMyPathsQuery, FetchMyPathsQueryVariables> {
    document = FetchMyPathsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FetchExerciceSubmissionReviewsDocument = gql`
    query FetchExerciceSubmissionReviews($submission: ID!) {
  fetchExerciceSubmissionReviews(submission: $submission) {
    content
    createdAt
    user {
      role
      fullName
      firstName
      avatar
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FetchExerciceSubmissionReviewsGQL extends Apollo.Query<FetchExerciceSubmissionReviewsQuery, FetchExerciceSubmissionReviewsQueryVariables> {
    document = FetchExerciceSubmissionReviewsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FetchMyManagedCoursesDocument = gql`
    query FetchMyManagedCourses {
  fetchMyManagedCourses {
    id
    areaStudy
    certificationType
    type
    language
    description
    title
    numberOfHoursByWeek
    numberOfWeeks
    level
    duration
    prerequisites
    objectives
    startDate
    cover
    status
    modules {
      id
      title
      order
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FetchMyManagedCoursesGQL extends Apollo.Query<FetchMyManagedCoursesQuery, FetchMyManagedCoursesQueryVariables> {
    document = FetchMyManagedCoursesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FetchMyManagedCourseDocument = gql`
    query FetchMyManagedCourse($courseId: ID!) {
  fetchMyManagedCourse(courseId: $courseId) {
    id
    areaStudy
    certificationType
    type
    language
    description
    title
    numberOfHoursByWeek
    numberOfWeeks
    duration
    prerequisites
    objectives
    startDate
    cover
    status
    modules {
      id
      title
      order
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FetchMyManagedCourseGQL extends Apollo.Query<FetchMyManagedCourseQuery, FetchMyManagedCourseQueryVariables> {
    document = FetchMyManagedCourseDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FetchMyManagedExercicesSubmissionDocument = gql`
    query FetchMyManagedExercicesSubmission($courseId: ID!) {
  fetchMyManagedExercicesSubmission(courseId: $courseId) {
    id
    createdAt
    updatedAt
    attachment
    content
    user {
      id
      fullName
      email
    }
    reviews {
      id
      content
    }
    lesson {
      id
      title
      moduleData {
        id
        title
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FetchMyManagedExercicesSubmissionGQL extends Apollo.Query<FetchMyManagedExercicesSubmissionQuery, FetchMyManagedExercicesSubmissionQueryVariables> {
    document = FetchMyManagedExercicesSubmissionDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FetchMyManagedQuizzesSubmissionDocument = gql`
    query fetchMyManagedQuizzesSubmission($courseId: ID!) {
  fetchMyManagedQuizzesSubmission(courseId: $courseId) {
    nbAttempts
    lastSubmission {
      id
      title
      minScoreRequired
      score
      duration
      createdAt
      updatedAt
      module {
        id
        title
      }
      user {
        id
        fullName
        email
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FetchMyManagedQuizzesSubmissionGQL extends Apollo.Query<FetchMyManagedQuizzesSubmissionQuery, FetchMyManagedQuizzesSubmissionQueryVariables> {
    document = FetchMyManagedQuizzesSubmissionDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const SendExerciceReviewDocument = gql`
    mutation SendExerciceReview($review: ExerciceReviewInput!) {
  sendExerciceReview(review: $review) {
    id
    content
    createdAt
    user {
      avatar
      fullName
      firstName
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class SendExerciceReviewGQL extends Apollo.Mutation<SendExerciceReviewMutation, SendExerciceReviewMutationVariables> {
    document = SendExerciceReviewDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const RegisterDocument = gql`
    mutation Register($registerInput: RegisterInput!) {
  register(registerInput: $registerInput) {
    token
    user {
      id
      email
      firstName
      lastName
      phone
      role
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class RegisterGQL extends Apollo.Mutation<RegisterMutation, RegisterMutationVariables> {
    document = RegisterDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const LoginDocument = gql`
    query Login($loginInput: LoginInput!) {
  login(loginInput: $loginInput) {
    token
    user {
      id
      email
      firstName
      lastName
      phone
      role
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class LoginGQL extends Apollo.Query<LoginQuery, LoginQueryVariables> {
    document = LoginDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const RequestPasswordResetDocument = gql`
    mutation RequestPasswordReset($email: String!) {
  requestPasswordReset(email: $email)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class RequestPasswordResetGQL extends Apollo.Mutation<RequestPasswordResetMutation, RequestPasswordResetMutationVariables> {
    document = RequestPasswordResetDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const ResetPasswordDocument = gql`
    mutation ResetPassword($resetPasswordInput: ResetPasswordInput!) {
  resetPassword(resetPasswordInput: $resetPasswordInput)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ResetPasswordGQL extends Apollo.Mutation<ResetPasswordMutation, ResetPasswordMutationVariables> {
    document = ResetPasswordDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const SubmitQuizDocument = gql`
    mutation SubmitQuiz($quizSubmissionInput: QuizSubmissionInput!) {
  submitQuiz(quizSubmissionInput: $quizSubmissionInput) {
    minScoreRequired
    score
    duration
    createdAt
    updatedAt
    questions {
      text
      type
      points
      options {
        text
        isCorrect
        isChoosed
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class SubmitQuizGQL extends Apollo.Mutation<SubmitQuizMutation, SubmitQuizMutationVariables> {
    document = SubmitQuizDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const MarkLessonAsCompletedDocument = gql`
    mutation MarkLessonAsCompleted($lesson: ID!) {
  markLessonAsCompleted(lesson: $lesson) {
    lesson {
      id
    }
    user {
      id
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class MarkLessonAsCompletedGQL extends Apollo.Mutation<MarkLessonAsCompletedMutation, MarkLessonAsCompletedMutationVariables> {
    document = MarkLessonAsCompletedDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const SendContactMessageDocument = gql`
    query sendContactMessage($contactInput: ContactInput!) {
  sendContactMessage(contactInput: $contactInput)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class SendContactMessageGQL extends Apollo.Query<SendContactMessageQuery, SendContactMessageQueryVariables> {
    document = SendContactMessageDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FetchCurrentUserDocument = gql`
    query FetchCurrentUser {
  fetchCurrentUser {
    email
    firstName
    lastName
    fullName
    phone
    address
    country
    nationality
    gender
    city
    employments {
      id
      jobTitle
      company
      description
      country
      city
      startDate
      endDate
      isCurrentPosition
    }
    educations {
      id
      school
      level
      specialization
      startDate
      endDate
    }
    skills {
      id
      skill
      proficiency
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FetchCurrentUserGQL extends Apollo.Query<FetchCurrentUserQuery, FetchCurrentUserQueryVariables> {
    document = FetchCurrentUserDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdatePersonalDetailsDocument = gql`
    mutation UpdatePersonalDetails($personalDetailsInput: PersonalDetailsInput!) {
  updatePersonalDetails(personalDetailsInput: $personalDetailsInput)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdatePersonalDetailsGQL extends Apollo.Mutation<UpdatePersonalDetailsMutation, UpdatePersonalDetailsMutationVariables> {
    document = UpdatePersonalDetailsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const AddUserEducationDocument = gql`
    mutation AddUserEducation($education: UserEducationInput!) {
  addUserEducation(education: $education) {
    id
    school
    level
    specialization
    startDate
    endDate
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class AddUserEducationGQL extends Apollo.Mutation<AddUserEducationMutation, AddUserEducationMutationVariables> {
    document = AddUserEducationDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateUserEducationDocument = gql`
    mutation UpdateUserEducation($education: UserEducationUpdateInput!, $educationId: ID!) {
  updateUserEducation(education: $education, educationId: $educationId)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateUserEducationGQL extends Apollo.Mutation<UpdateUserEducationMutation, UpdateUserEducationMutationVariables> {
    document = UpdateUserEducationDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const RemoveUserEducationDocument = gql`
    mutation RemoveUserEducation($educationId: ID!) {
  removeUserEducation(educationId: $educationId)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class RemoveUserEducationGQL extends Apollo.Mutation<RemoveUserEducationMutation, RemoveUserEducationMutationVariables> {
    document = RemoveUserEducationDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const AddUserEmploymentDocument = gql`
    mutation AddUserEmployment($employment: UserEmploymentInput!) {
  addUserEmployment(employment: $employment) {
    id
    jobTitle
    company
    description
    country
    city
    startDate
    endDate
    isCurrentPosition
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class AddUserEmploymentGQL extends Apollo.Mutation<AddUserEmploymentMutation, AddUserEmploymentMutationVariables> {
    document = AddUserEmploymentDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateUserEmploymentDocument = gql`
    mutation UpdateUserEmployment($employment: UserEmploymentUpdateInput!, $employmentId: ID!) {
  updateUserEmployment(employment: $employment, employmentId: $employmentId)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateUserEmploymentGQL extends Apollo.Mutation<UpdateUserEmploymentMutation, UpdateUserEmploymentMutationVariables> {
    document = UpdateUserEmploymentDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const RemoveUserEmploymentDocument = gql`
    mutation RemoveUserEmployment($employmentId: ID!) {
  removeUserEmployment(employmentId: $employmentId)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class RemoveUserEmploymentGQL extends Apollo.Mutation<RemoveUserEmploymentMutation, RemoveUserEmploymentMutationVariables> {
    document = RemoveUserEmploymentDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const AddUserSkillDocument = gql`
    mutation AddUserSkill($skill: UserSkillInput!) {
  addUserSkill(skill: $skill) {
    id
    skill
    proficiency
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class AddUserSkillGQL extends Apollo.Mutation<AddUserSkillMutation, AddUserSkillMutationVariables> {
    document = AddUserSkillDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateUserSkillDocument = gql`
    mutation UpdateUserSkill($skill: UserSkillUpdateInput!, $skillId: ID!) {
  updateUserSkill(skill: $skill, skillId: $skillId)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateUserSkillGQL extends Apollo.Mutation<UpdateUserSkillMutation, UpdateUserSkillMutationVariables> {
    document = UpdateUserSkillDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const RemoveUserSkillDocument = gql`
    mutation RemoveUserSkill($skillId: ID!) {
  removeUserSkill(skillId: $skillId)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class RemoveUserSkillGQL extends Apollo.Mutation<RemoveUserSkillMutation, RemoveUserSkillMutationVariables> {
    document = RemoveUserSkillDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateCourseEnrollmentDocument = gql`
    mutation CreateCourseEnrollment($courseEnrollmentInput: CourseEnrollmentInput!) {
  createCourseEnrollment(courseEnrollmentInput: $courseEnrollmentInput) {
    course
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateCourseEnrollmentGQL extends Apollo.Mutation<CreateCourseEnrollmentMutation, CreateCourseEnrollmentMutationVariables> {
    document = CreateCourseEnrollmentDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FetchCourseDocument = gql`
    query FetchCourse($courseId: ID!) {
  fetchCourse(courseId: $courseId) {
    id
    areaStudy
    certificationType
    type
    language
    description
    title
    numberOfHoursByWeek
    numberOfWeeks
    level
    prerequisites
    objectives
    startDate
    cover
    videoIntro
    targetStudents
    status
    duration
    updatedAt
    pricing {
      price
      currency
    }
    modules {
      id
      title
      description
      order
      lessons {
        id
        type
        title
        description
        points
        duration
        order
        allowDiscussion
        ressources {
          name
          url
        }
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FetchCourseGQL extends Apollo.Query<FetchCourseQuery, FetchCourseQueryVariables> {
    document = FetchCourseDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FetchMyCourseDocument = gql`
    query FetchMyCourse($courseId: ID!) {
  fetchMyCourse(courseId: $courseId) {
    id
    areaStudy
    certificationType
    type
    language
    description
    title
    numberOfHoursByWeek
    numberOfWeeks
    level
    prerequisites
    objectives
    startDate
    cover
    videoIntro
    targetStudents
    status
    duration
    progress
    totalFinished
    totalLessons
    totalEarnedPoints
    totalPoints
    updatedAt
    pricing {
      price
      currency
    }
    modules {
      id
      title
      description
      order
      lessons {
        id
        type
        title
        description
        points
        duration
        order
        allowDiscussion
        isCompletedByCurrentUser
        ressources {
          name
          url
        }
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FetchMyCourseGQL extends Apollo.Query<FetchMyCourseQuery, FetchMyCourseQueryVariables> {
    document = FetchMyCourseDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FetchCoursesDocument = gql`
    query FetchCourses {
  fetchCourses {
    id
    areaStudy
    certificationType
    type
    language
    description
    title
    numberOfHoursByWeek
    numberOfWeeks
    level
    prerequisites
    objectives
    startDate
    cover
    status
    duration
    updatedAt
    pricing {
      price
      currency
    }
    modules {
      id
      title
      order
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FetchCoursesGQL extends Apollo.Query<FetchCoursesQuery, FetchCoursesQueryVariables> {
    document = FetchCoursesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FetchOpenCoursesDocument = gql`
    query FetchOpenCourses {
  fetchOpenCourses {
    id
    areaStudy
    certificationType
    type
    language
    description
    title
    numberOfHoursByWeek
    numberOfWeeks
    level
    prerequisites
    objectives
    startDate
    cover
    status
    duration
    totalLearners
    updatedAt
    pricing {
      price
      currency
    }
    modules {
      id
      title
      order
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FetchOpenCoursesGQL extends Apollo.Query<FetchOpenCoursesQuery, FetchOpenCoursesQueryVariables> {
    document = FetchOpenCoursesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FetchOpenTestsDocument = gql`
    query FetchOpenTests {
  fetchOpenTests {
    id
    areaStudy
    certificationType
    type
    language
    description
    title
    numberOfHoursByWeek
    numberOfWeeks
    level
    prerequisites
    objectives
    startDate
    cover
    status
    duration
    totalLearners
    updatedAt
    pricing {
      price
      currency
    }
    modules {
      id
      title
      order
      lessons {
        id
        title
        description
        type
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FetchOpenTestsGQL extends Apollo.Query<FetchOpenTestsQuery, FetchOpenTestsQueryVariables> {
    document = FetchOpenTestsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FetchMyCoursesDocument = gql`
    query FetchMyCourses {
  fetchMyCourses {
    id
    areaStudy
    certificationType
    type
    language
    description
    title
    numberOfHoursByWeek
    numberOfWeeks
    level
    duration
    prerequisites
    objectives
    startDate
    cover
    status
    progress
    totalFinished
    totalLessons
    totalEarnedPoints
    totalPoints
    updatedAt
    pricing {
      price
      currency
    }
    modules {
      id
      title
      order
      lessons {
        id
        title
        description
        type
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FetchMyCoursesGQL extends Apollo.Query<FetchMyCoursesQuery, FetchMyCoursesQueryVariables> {
    document = FetchMyCoursesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FetchMyTestsDocument = gql`
    query FetchMyTests {
  fetchMyTests {
    id
    areaStudy
    certificationType
    type
    language
    description
    title
    numberOfHoursByWeek
    numberOfWeeks
    level
    updatedAt
    duration
    prerequisites
    objectives
    startDate
    cover
    status
    progress
    totalFinished
    totalLessons
    totalEarnedPoints
    totalPoints
    pricing {
      price
      currency
    }
    modules {
      id
      title
      order
      lessons {
        id
        title
        description
        type
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FetchMyTestsGQL extends Apollo.Query<FetchMyTestsQuery, FetchMyTestsQueryVariables> {
    document = FetchMyTestsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }