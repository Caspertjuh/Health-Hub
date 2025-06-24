import React, { useState } from 'react';
import { useUser } from '../contexts/EnhancedUserContext';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { AdminLogin } from './AdminLogin';
import { AdminPanel } from './AdminPanel';

export const AdminPanelAccess: React.FC = () => {
  const { isAdmin } = useUser();
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  // If the user is already authenticated as admin, show the admin panel
  if (isAdmin) {
    return <AdminPanel />;
  }

  // Otherwise, show a button to open the admin login dialog
  return (
    <>
      <Button 
        variant="outline" 
        className="fixed bottom-4 right-4 z-50 flex items-center gap-2 opacity-70 hover:opacity-100"
        onClick={() => setShowAdminLogin(true)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        Beheerder
      </Button>
      
      <Dialog open={showAdminLogin} onOpenChange={setShowAdminLogin}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Beheerder inloggen</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <AdminLogin insideDialog onBack={() => setShowAdminLogin(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};