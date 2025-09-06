export interface User {
  id: string;
  academicId: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profileImage?: string;
  createdAt: Date;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  credits: number;
  professor: string;
}

export interface ApprovedCourse {
  id: string;
  userId: string;
  courseId: string;
  course: Course;
  approvalDate: Date;
}

export interface Publication {
  id: string;
  userId: string;
  user: User;
  courseOrProfessor: string;
  message: string;
  createdAt: Date;
  comments: Comment[];
}

export interface Comment {
  id: string;
  publicationId: string;
  userId: string;
  user: User;
  message: string;
  createdAt: Date;
}

export type FilterType = 'course' | 'professor' | 'courseName' | 'professorName' | 'none';