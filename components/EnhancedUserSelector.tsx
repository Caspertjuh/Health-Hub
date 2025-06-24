import React, { useState } from 'react';
import { useUser, User } from '../contexts/EnhancedUserContext';
import { toast } from "sonner@2.0.3";
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { AdminLogin } from './AdminLogin';
import { UserAvatar } from './UserAvatar';

export const EnhancedUserSelector: React.FC = () => {
  const { users, setCurrentUser, isLoading, error } = useUser();
  const [adminModalOpen, setAdminModalOpen] = useState<boolean>(false);

  const handleUserSelect = (user: User) => {
    setCurrentUser(user);
    toast.success(`Welkom ${user.name}!`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/50 p-4">
        <div className="scale-in w-full max-w-md">
          <Card className="overflow-hidden bg-white/90 dark:bg-gray-900/90 border-0 shadow-xl backdrop-blur-sm">
            <div className="p-8 space-y-6 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <h2 className="text-center">Gebruikers laden...</h2>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-red-50 to-orange-100 dark:from-red-900/30 dark:to-orange-900/50 p-4">
        <div className="scale-in w-full max-w-md">
          <Card className="overflow-hidden bg-white/90 dark:bg-gray-900/90 border-0 shadow-xl backdrop-blur-sm">
            <div className="p-8 space-y-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
                <svg className="h-8 w-8 text-destructive" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-center">Er is een fout opgetreden</h2>
              <p className="text-center text-muted-foreground">{error}</p>
              <Button 
                className="w-full" 
                onClick={() => window.location.reload()}
              >
                Probeer opnieuw
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#f0f4ff] to-[#e0e7ff] dark:from-[#0f172a] dark:to-[#1e293b]">
      {/* Header with logo and wave decoration */}
      <header className="relative py-6 px-4 mb-4 overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex justify-center items-center mb-3">
            <div className="rounded-full bg-white dark:bg-gray-800 p-3 shadow-lg">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 2V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M16 2V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M3.5 9.09H20.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M11.995 13.7H12.005" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8.295 13.7H8.305" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8.295 16.7H8.305" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <h1 className="text-center text-2xl mb-1">Dagplanning</h1>
          <p className="text-center text-muted-foreground max-w-md mx-auto">
            Selecteer je naam om je dagplanning te bekijken
          </p>
        </div>
        
        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 80" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M0 50L60 55C120 60 240 70 360 65C480 60 600 40 720 35C840 30 960 40 1080 45C1200 50 1320 50 1380 50L1440 50V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0V50Z" 
                  className="fill-white dark:fill-gray-900" />
          </svg>
        </div>
      </header>

      {/* User grid */}
      <main className="flex-1 px-4 pb-16 pt-6 bg-white dark:bg-gray-900">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user, index) => (
              <div 
                className="slide-in-up" 
                style={{animationDelay: `${index * 0.1}s`}} 
                key={user.id}
              >
                <Card 
                  className="relative overflow-hidden border-0 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                  onClick={() => handleUserSelect(user)}
                >
                  <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-[#3b82f6]/80 to-[#6366f1]/80"></div>
                  
                  <div className="p-6 pt-20 flex flex-col items-center">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse"></div>
                      <UserAvatar user={user} size="xl" className="relative z-10 border-4 border-white dark:border-gray-700" />
                    </div>

                    <h3 className="mt-4 text-center font-medium text-lg">{user.name}</h3>
                    
                    <div className="mt-3 flex flex-wrap justify-center gap-2">
                      {Object.entries(user.disabilities).map(([key, value]) => 
                        value && (
                          <span key={key} className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs">
                            {key === 'language' && 'Taal'}
                            {key === 'planning' && 'Planning'}
                            {key === 'sensory' && 'Zintuiglijk'}
                            {key === 'motor' && 'Motorisch'}
                            {key === 'social' && 'Sociaal'}
                            {key === 'cognitive' && 'Cognitief'}
                          </span>
                        )
                      )}
                    </div>
                    
                    <Button 
                      className="mt-4 w-full bg-primary hover:bg-primary/90"
                    >
                      Selecteer
                    </Button>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer with admin button */}
      <footer className="bg-white dark:bg-gray-900 py-4 px-4 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Dagplanning Applicatie v1.0
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-sm"
            onClick={() => setAdminModalOpen(true)}
          >
            <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Beheerder
          </Button>
        </div>
      </footer>

      {/* Admin Login Dialog */}
      <Dialog open={adminModalOpen} onOpenChange={setAdminModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Beheerder inloggen</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <AdminLogin />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};