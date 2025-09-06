import React, { useState } from 'react';
import { X, Plus, Trash2, GraduationCap, Book } from 'lucide-react';
import { User } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

interface CoursesModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

export function CoursesModal({ user, isOpen, onClose }: CoursesModalProps) {
  const { currentUser } = useAuth();
  const { 
    courses, 
    getUserApprovedCourses, 
    getTotalCredits, 
    addApprovedCourse, 
    removeApprovedCourse 
  } = useData();
  
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const isOwnProfile = currentUser?.id === user.id;
  const approvedCourses = getUserApprovedCourses(user.id);
  const totalCredits = getTotalCredits(user.id);
  
  const availableCourses = courses.filter(course => 
    !approvedCourses.some(ac => ac.courseId === course.id)
  );

  const handleAddCourse = () => {
    if (selectedCourseId && isOwnProfile) {
      addApprovedCourse(selectedCourseId);
      setSelectedCourseId('');
    }
  };

  const handleRemoveCourse = (courseId: string) => {
    if (isOwnProfile) {
      removeApprovedCourse(courseId);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <GraduationCap className="h-6 w-6 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-900">
              Cursos Aprobados - {user.firstName} {user.lastName}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-purple-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-purple-900">Resumen Académico</h3>
                <p className="text-purple-700">
                  Cursos aprobados: <span className="font-bold">{approvedCourses.length}</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-purple-900">{totalCredits}</p>
                <p className="text-purple-700 text-sm">Créditos totales</p>
              </div>
            </div>
          </div>

          {isOwnProfile && availableCourses.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Agregar Curso Aprobado</h3>
              <div className="flex space-x-3">
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Selecciona un curso...</option>
                  {availableCourses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.code} - {course.name} ({course.credits} créditos)
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAddCourse}
                  disabled={!selectedCourseId}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Agregar</span>
                </button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
              <Book className="h-5 w-5" />
              <span>Cursos Aprobados</span>
            </h3>

            {approvedCourses.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <GraduationCap className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p>No hay cursos aprobados registrados</p>
                {isOwnProfile && (
                  <p className="text-sm mt-1">¡Agrega tu primer curso aprobado!</p>
                )}
              </div>
            ) : (
              <div className="grid gap-3">
                {approvedCourses.map((approvedCourse) => (
                  <div
                    key={approvedCourse.id}
                    className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                            <Book className="h-5 w-5 text-white" />
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {approvedCourse.course.code} - {approvedCourse.course.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {approvedCourse.course.professor} • {approvedCourse.course.credits} créditos
                          </p>
                        </div>
                      </div>
                    </div>

                    {isOwnProfile && (
                      <button
                        onClick={() => handleRemoveCourse(approvedCourse.courseId)}
                        className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar curso"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}