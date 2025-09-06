import { User, Course, Publication, ApprovedCourse, Comment } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    academicId: '2024001',
    firstName: 'María',
    lastName: 'García',
    email: 'maria.garcia@Ing.nieria.usac.edu.gt',
    password: '123456',
    createdAt: new Date('2025-01-15')
  },
  {
    id: '2',
    academicId: '2024002',
    firstName: 'Carlos',
    lastName: 'López',
    email: 'carlos.lopez@Ing.nieria.usac.edu.gt',
    password: '123456',
    createdAt: new Date('2025-01-16')
  },
  {
    id: '3',
    academicId: '2024003',
    firstName: 'Ana',
    lastName: 'Rodríguez',
    email: 'ana.rodriguez@Ing.nieria.usac.edu.gt',
    password: '123456',
    createdAt: new Date('2025-01-17')
  }
];

export const mockCourses: Course[] = [
  {
    id: '1',
    name: 'Programación Web',
    code: 'CS101',
    credits: 4,
    professor: 'Ing. Juan Pérez'
  },
  {
    id: '2',
    name: 'Base de Datos',
    code: 'CS201',
    credits: 5,
    professor: 'Dra. Elena Martínez'
  },
  {
    id: '3',
    name: 'Estructuras de Datos',
    code: 'CS102',
    credits: 4,
    professor: 'Ing. Roberto Silva'
  },
  {
    id: '4',
    name: 'Cálculo I',
    code: 'MAT101',
    credits: 3,
    professor: 'Ing. Luis Torres'
  }
];

export const mockPublications: Publication[] = [
  {
    id: '1',
    userId: '1',
    user: mockUsers[0],
    courseOrProfessor: 'Ing. Juan Pérez - Programación Web',
    message: '¿Alguien sabe cuándo será el examen final de Programación Web? No encuentro la información en uedi.',
    createdAt: new Date('2025-09-15T14:30:00'),
    comments: [
      {
        id: '1',
        publicationId: '1',
        userId: '2',
        user: mockUsers[1],
        message: 'Según escuché, será la próxima semana. Te recomiendo preguntar directamente al profesor.',
        createdAt: new Date('2025-09-15T15:00:00')
      }
    ]
  },
  {
    id: '2',
    userId: '2',
    user: mockUsers[1],
    courseOrProfessor: 'Dra. Elena Martínez - Base de Datos',
    message: 'Compartiendo algunos recursos útiles para el proyecto de Base de Datos',
    createdAt: new Date('2025-09-15T10:15:00'),
    comments: []
  },
  {
    id: '3',
    userId: '3',
    user: mockUsers[2],
    courseOrProfessor: 'Ing. Roberto Silva - Estructuras de Datos',
    message: 'Mucha este Ing. no explica nada, solo lee presentaciones xd.',
    createdAt: new Date('2025-09-14T16:45:00'),
    comments: [
      {
        id: '2',
        publicationId: '3',
        userId: '1',
        user: mockUsers[0],
        message: 'Jajaja, sí, es verdad. Pero al menos sus exámenes son justos.',
        createdAt: new Date('2025-09-14T17:30:00')
      },
      {
        id: '3',
        publicationId: '3',
        userId: '2',
        user: mockUsers[1],
        message: 'y si pero los exámenes son justo lo que pone en las presentaciones',
        createdAt: new Date('2025-09-14T18:00:00')
      }
    ]
  }
];

export const mockApprovedCourses: ApprovedCourse[] = [
  {
    id: '1',
    userId: '1',
    courseId: '1',
    course: mockCourses[0],
    approvalDate: new Date('2025-06-15')
  },
  {
    id: '2',
    userId: '1',
    courseId: '4',
    course: mockCourses[3],
    approvalDate: new Date('2025-06-20')
  },
  {
    id: '3',
    userId: '2',
    courseId: '2',
    course: mockCourses[1],
    approvalDate: new Date('2025-06-18')
  }
];