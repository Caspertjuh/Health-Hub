
import React, { useState, useEffect } from "react";
import { User, useUser } from "../contexts/EnhancedUserContext";
import { Card } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Settings, User as UserIcon, Users, Lock, Key, AlertCircle, RefreshCcw } from "lucide-react";
import { toast } from "sonner@2.0.3";

export const UserSelector: React.FC = () => {
  const { 
    users, 
    setCurrentUser, 
    isAdminMode, 
    toggleAdminMode, 
    isAdminAuthenticated,
    authenticateAdmin,
    logoutAdmin,
    persistUserData
  } = useUser();
  
  const [adminPassword, setAdminPassword] = useState("");
  const [adminDialogOpen, setAdminDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Initial loading simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Filter out admin users from the user selection grid
  const residentUsers = users.filter(user => user.role === "resident");
  
  // Handle user selection
  const handleUserSelect = (user: User) => {
    setCurrentUser(user);
    toast.success(`Welkom, ${user.name}!`);
  };
  
  // Handle admin login attempt
  const handleAdminLogin = () => {
    const success = authenticateAdmin(adminPassword);
    
    if (success) {
      toggleAdminMode();
      setAdminDialogOpen(false);
      toast.success("Ingelogd als beheerder");
    } else {
      toast.error("Onjuist wachtwoord");
    }
    
    setAdminPassword("");
  };
  
  // Handle admin dialog open
  const handleAdminDialogOpen = () => {
    if (isAdminAuthenticated) {
      toggleAdminMode();
    } else {
      setAdminDialogOpen(true);
    }
  };

  // Force refresh of the user data
  const handleRefresh = () => {
    setLoading(true);
    // Force a reload of the page
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-background to-muted">
        <Card className="w-full max-w-md p-8 text-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-16 w-16 bg-muted rounded-full mb-4"></div>
            <div className="h-8 w-48 bg-muted rounded mb-2"></div>
            <div className="h-6 w-36 bg-muted rounded"></div>
          </div>
          <p className="mt-6 text-muted-foreground">Gebruikers laden...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-background to-muted">
      <Card className="w-full max-w-3xl p-8 shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Dagplanning App</h1>
          <p className="text-xl text-muted-foreground">Selecteer je naam om te beginnen</p>
        </div>
        
        {residentUsers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {residentUsers.map((user) => (
              <Button
                key={user.id}
                variant="outline"
                className="p-0 h-auto hover:bg-accent transition-colors"
                onClick={() => handleUserSelect(user)}
              >
                <div className="flex items-center gap-4 p-6 w-full">
                  <div className="h-16 w-16 rounded-full overflow-hidden bg-muted flex-shrink-0">
                    {user.avatar ? (
                      <ImageWithFallback
                        src={user.avatar}
                        alt={`Avatar van ${user.name}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <UserIcon size={32} className="text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="text-left">
                    <h2 className="text-2xl">{user.name}</h2>
                    <p className="text-muted-foreground">Bewoner</p>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        ) : (
          <div className="text-center p-8 mb-8 border border-dashed rounded-lg">
            <AlertCircle size={48} className="mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl mb-2">Geen bewoners gevonden</h2>
            <p className="text-muted-foreground mb-6">
              Er zijn geen bewoners beschikbaar in het systeem. Log in als beheerder om bewoners toe te voegen of klik op vernieuwen om opnieuw te proberen.
            </p>
            <Button 
              onClick={handleRefresh}
              className="mx-auto flex items-center gap-2"
            >
              <RefreshCcw size={18} />
              Vernieuwen
            </Button>
          </div>
        )}
        
        <div className="flex justify-center mt-8">
          <Button
            variant="outline"
            size="lg"
            className="flex items-center gap-2 px-6 py-3 h-auto"
            onClick={handleAdminDialogOpen}
          >
            <Settings size={20} />
            <span>Beheerdersmodus</span>
            <Lock size={16} className="ml-2" />
          </Button>
        </div>
        
        <div className="mt-16 text-center text-sm text-muted-foreground">
          <p>Ontwikkeld door: Jesse Hummel, Remco Pruim, Tjitte Timmerman, Casper Oudman</p>
          <p className="mt-1">Versie 1.0 • Laatste update: 26 mei 2025</p>
        </div>
      </Card>
      
      {/* Admin Login Dialog */}
      <Dialog open={adminDialogOpen} onOpenChange={setAdminDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Inloggen als beheerder</DialogTitle>
            <DialogDescription>
              Voer het beheerderswachtwoord in om toegang te krijgen tot de beheerdersmodus.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Key size={16} />
                <span>Wachtwoord</span>
              </Label>
              <Input
                id="password"
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Voer wachtwoord in"
                className="h-12"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAdminLogin();
                  }
                }}
              />
              <p className="text-xs text-muted-foreground mt-1">
                <strong>Hint voor de demo:</strong> Het wachtwoord is "admin123"
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAdminDialogOpen(false)}
            >
              Annuleren
            </Button>
            <Button onClick={handleAdminLogin}>Inloggen</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
