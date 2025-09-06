import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { LoginForm } from './components/Auth/LoginForm';
import { RegisterForm } from './components/Auth/RegisterForm';
import { ForgotPasswordForm } from './components/Auth/ForgotPasswordForm';
import { Header } from './components/Layout/Header';
import { FilterPanel } from './components/Feed/FilterPanel';
import { CreatePublication } from './components/Feed/CreatePublication';
import { PublicationCard } from './components/Feed/PublicationCard';
import { ProfileModal } from './components/Profile/ProfileModal';
import { CoursesModal } from './components/Profile/CoursesModal';
import { useData } from './context/DataContext';
import { User, FilterType } from './types';

type AuthView = 'login' | 'register' | 'forgotPassword';

function AuthScreen() {
  const [currentView, setCurrentView] = useState<AuthView>('login');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {currentView === 'login' && (
          <LoginForm
            onSwitchToRegister={() => setCurrentView('register')}
            onForgotPassword={() => setCurrentView('forgotPassword')}
          />
        )}
        {currentView === 'register' && (
          <RegisterForm onSwitchToLogin={() => setCurrentView('login')} />
        )}
        {currentView === 'forgotPassword' && (
          <ForgotPasswordForm onBackToLogin={() => setCurrentView('login')} />
        )}
      </div>
    </div>
  );
}

function MainApp() {
  const { publications } = useData();
  const { findUserByAcademicId, currentUser } = useAuth();
  const [filterType, setFilterType] = useState<FilterType>('none');
  const [filterValue, setFilterValue] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showCourses, setShowCourses] = useState(false);
  const [searchError, setSearchError] = useState('');

  const handleSearch = (academicId: string) => {
    setSearchError('');
    const user = findUserByAcademicId(academicId);
    if (user) {
      setSelectedUser(user);
      setShowProfile(true);
    } else {
      setSearchError(`No se encontró ningún usuario con el registro académico: ${academicId}`);
      setTimeout(() => setSearchError(''), 3000);
    }
  };

  const handleOpenProfile = () => {
    if (currentUser) {
      setSelectedUser(currentUser);
      setShowProfile(true);
    }
  };

  const handleViewCourses = (userId: string) => {
    setShowProfile(false);
    setShowCourses(true);
  };

  const filteredPublications = publications.filter(publication => {
    if (filterType === 'none') return true;

    const searchTerm = filterValue.toLowerCase();
    const courseOrProfLower = publication.courseOrProfessor.toLowerCase();

    switch (filterType) {
      case 'course':
        return courseOrProfLower.includes('programación') ||
          courseOrProfLower.includes('base de datos') ||
          courseOrProfLower.includes('estructuras') ||
          courseOrProfLower.includes('cálculo');
      case 'professor':
        return courseOrProfLower.includes('dr.') || courseOrProfLower.includes('dra.');
      case 'courseName':
        return courseOrProfLower.includes(searchTerm);
      case 'professorName':
        return courseOrProfLower.includes(searchTerm);
      default:
        return true;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onOpenProfile={handleOpenProfile} onSearch={handleSearch} />

      {searchError && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{searchError}</p>
          </div>
        </div>
      )}

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FilterPanel
          filterType={filterType}
          filterValue={filterValue}
          onFilterTypeChange={setFilterType}
          onFilterValueChange={setFilterValue}
          onClearFilters={() => {
            setFilterType('none');
            setFilterValue('');
          }}
        />

        <CreatePublication />

        <div className="space-y-6">
          {filteredPublications.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No se encontraron publicaciones</p>
              <p className="text-gray-400 text-sm mt-2">
                {filterType !== 'none'
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'Sé el primero en crear una publicación'
                }
              </p>
            </div>
          ) : (
            filteredPublications.map(publication => (
              <PublicationCard key={publication.id} publication={publication} />
            ))
          )}
        </div>
      </main>

      {selectedUser && (
        <>
          <ProfileModal
            user={selectedUser}
            isOpen={showProfile}
            onClose={() => {
              setShowProfile(false);
              setSelectedUser(null);
            }}
            onViewCourses={handleViewCourses}
          />

          <CoursesModal
            user={selectedUser}
            isOpen={showCourses}
            onClose={() => {
              setShowCourses(false);
              setSelectedUser(null);
            }}
          />
        </>
      )}
    </div>
  );
}

function AppContent() {
  const { currentUser } = useAuth();

  return currentUser ? <MainApp /> : <AuthScreen />;
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}

export default App;