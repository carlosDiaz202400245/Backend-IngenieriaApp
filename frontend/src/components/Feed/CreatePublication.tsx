import React, { useState } from 'react';
import { PlusCircle, Send } from 'lucide-react';
import { useData } from '../../context/DataContext';

export function CreatePublication() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [courseOrProfessor, setCourseOrProfessor] = useState('');
  const [message, setMessage] = useState('');
  const { createPublication } = useData();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (courseOrProfessor.trim() && message.trim()) {
      createPublication(courseOrProfessor.trim(), message.trim());
      setCourseOrProfessor('');
      setMessage('');
      setIsExpanded(false);
    }
  };

  const handleCancel = () => {
    setCourseOrProfessor('');
    setMessage('');
    setIsExpanded(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full flex items-center space-x-3 text-left text-gray-500 hover:text-gray-700 transition-colors"
        >
          <PlusCircle className="h-5 w-5" />
          <span>¿Qué quieres compartir hoy?</span>
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Curso o Catedrático
            </label>
            <input
              type="text"
              value={courseOrProfessor}
              onChange={(e) => setCourseOrProfessor(e.target.value)}
              placeholder="Ej: Dr. Juan Pérez - Programación Web"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mensaje
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Comparte tu pregunta, comentario o información..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Send className="h-4 w-4" />
              <span>Publicar</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}