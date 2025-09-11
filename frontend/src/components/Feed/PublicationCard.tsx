import React, { useState } from 'react';
import { MessageCircle, Send, User, Calendar,Trash2 } from 'lucide-react';
import { Publication } from '../../types';
import { useData } from '../../context/DataContext';
import { formatDistanceToNow } from '../../utils/dateUtils';



interface PublicationCardProps {
  publication: Publication;
}

export function PublicationCard({ publication }: PublicationCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const { addComment, deleteComment, currentUser} = useData();

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      addComment(publication.id, newComment.trim());
      setNewComment('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-4">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-white" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <p className="text-sm font-medium text-gray-900">
              {publication.user.firstName} {publication.user.lastName}
            
            </p>
            <span className="text-gray-400">•</span>
            <p className="text-sm text-gray-500">{publication.user.academicId}</p>
          
          </div>
          
          <p className="text-sm text-blue-600 font-medium mb-2">
            {publication.courseOrProfessor}
          </p>
          
          <p className="text-gray-800 mb-3">{publication.message}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-gray-500 text-sm">
              <Calendar className="h-4 w-4" />
              <span>{formatDistanceToNow(publication.createdAt)}</span>
            </div>
           
            <button
              onClick={() => setShowComments(!showComments)}
              
              className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm">
                {publication.comments.length} comentarios
              </span>
            </button>
          </div>
        </div>
        
      </div>

      {showComments && (
        <div className="mt-6 border-t border-gray-100 pt-4">
          <div className="space-y-4">
            {publication.comments.map((comment) => (
              <div key={comment.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="text-sm font-medium text-gray-900">
                      {comment.user.firstName} {comment.user.lastName}
                    </p>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(comment.createdAt)}
                    </span>
                    {/*
                    Botón de trash
                    */ }
                    {currentUser?.id === comment.userId && (
          <button
            onClick={() => deleteComment(publication.id, comment.id)}
            className="ml-2 text-red-500 hover:text-red-700"
            title="Eliminar comentario"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
        {/*
                    FIN Botón de trash
                    */ }
                  </div>
                  <p className="text-sm text-gray-800">{comment.message}</p>
                </div>
              </div>
            ))}
          </div>
          
          <form onSubmit={handleAddComment} className="mt-4 flex space-x-3">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escribe un comentario..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}