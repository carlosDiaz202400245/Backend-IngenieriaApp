import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Publication, Comment, ApprovedCourse, Course } from '../types';
import { mockPublications, mockApprovedCourses, mockCourses } from '../data/mockData';
import { useAuth } from './AuthContext';
import axios from "axios";

interface DataContextType {
  publications: Publication[];
  courses: Course[];
  approvedCourses: ApprovedCourse[];
  currentUser: any; //
  createPublication: (courseOrProfessor: string, message: string) => void;
  addComment: (publicationId: string, message: string) => void;
  deleteComment: (publicationId: string, commentId: string) => void; // 
  addApprovedCourse: (courseId: string) => void;
  removeApprovedCourse: (courseId: string) => void;
  getTotalCredits: (userId: string) => number;
  getUserApprovedCourses: (userId: string) => ApprovedCourse[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [publications, setPublications] = useState<Publication[]>(mockPublications);
  const [approvedCourses, setApprovedCourses] = useState<ApprovedCourse[]>(mockApprovedCourses);
  const [courses] = useState<Course[]>(mockCourses);
  const { currentUser } = useAuth();
  //función para eliminar comentario:
  const deleteComment = (publicationId: string, commentId: string) => {
  if (!currentUser) return;

  setPublications(publications.map(pub =>
    pub.id === publicationId
      ? { 
          ...pub, 
          comments: pub.comments.filter(c => 
            !(c.id === commentId && c.userId === currentUser.id) // solo borra si el comentario es del usuario actual
          )
        }
      : pub
  ));
};
  //fin

  const createPublication = (courseOrProfessor: string, message: string) => {
    if (!currentUser) return;

    const newPublication: Publication = {
      id: (publications.length + 1).toString(),
      userId: currentUser.id,
      user: currentUser,
      courseOrProfessor,
      message,
      createdAt: new Date(),
      comments: []
    };

    setPublications([newPublication, ...publications]);
  };

  const addComment = (publicationId: string, message: string) => {
    if (!currentUser) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      publicationId,
      userId: currentUser.id,
      user: currentUser,
      message,
      createdAt: new Date()
    };

    setPublications(publications.map(pub => 
      pub.id === publicationId 
        ? { ...pub, comments: [...pub.comments, newComment] }
        : pub
    ));
  };

  const addApprovedCourse = (courseId: string) => {
    if (!currentUser) return;

    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    // Check if already approved
    const alreadyApproved = approvedCourses.some(ac => 
      ac.userId === currentUser.id && ac.courseId === courseId
    );
    if (alreadyApproved) return;

    const newApprovedCourse: ApprovedCourse = {
      id: (approvedCourses.length + 1).toString(),
      userId: currentUser.id,
      courseId,
      course,
      approvalDate: new Date()
    };

    setApprovedCourses([...approvedCourses, newApprovedCourse]);
  };

  const removeApprovedCourse = (courseId: string) => {
    if (!currentUser) return;

    setApprovedCourses(approvedCourses.filter(ac => 
      !(ac.userId === currentUser.id && ac.courseId === courseId)
    ));
  };

  const getTotalCredits = (userId: string): number => {
    return approvedCourses
      .filter(ac => ac.userId === userId)
      .reduce((total, ac) => total + ac.course.credits, 0);
  };

  const getUserApprovedCourses = (userId: string): ApprovedCourse[] => {
    return approvedCourses.filter(ac => ac.userId === userId);
  };

  return (
    <DataContext.Provider value={{
      publications,
      courses,
      approvedCourses,
      currentUser,
      createPublication,
      addComment,
      deleteComment,
      addApprovedCourse,
      removeApprovedCourse,
      getTotalCredits,
      getUserApprovedCourses
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}