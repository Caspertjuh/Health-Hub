import React, { useState } from "react";
import { useUser } from "../contexts/EnhancedUserContext";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Key, Lock, ShieldAlert } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface AdminLoginProps {
  insideDialog?: boolean;
  onBack?: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ 
  insideDialog = false,
  onBack
}) => {
  const { authenticateAdmin, toggleAdminMode } = useUser();
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [attempts, setAttempts] = useState<number>(0);
  
  // Handle login attempt
  const handleLogin = () => {
    if (password.trim() === "") {
      toast.error("Voer een wachtwoord in");
      return;
    }
    
    setIsLoading(true);
    
    // Simulate network delay for demo purposes
    setTimeout(() => {
      const success = authenticateAdmin(password);
      
      if (success) {
        toast.success("Ingelogd als beheerder");
      } else {
        setAttempts(prev => prev + 1);
        toast.error(`Onjuist wachtwoord (poging ${attempts + 1}/5)`);
        
        // After 5 attempts, lock out for a short time
        if (attempts >= 4) {
          toast.error("Te veel mislukte pogingen. Probeer het later opnieuw.");
          toggleAdminMode();
          if (onBack) onBack();
        }
      }
      
      setIsLoading(false);
      setPassword("");
    }, 1000);
  };
  
  // Handle enter key press
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      toggleAdminMode();
    }
  };

  // If inside a dialog, we don't need the card wrapper
  const content = (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="password" className="flex items-center gap-2">
          <Key size={16} />
          <span>Wachtwoord</span>
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="Voer beheerderswachtwoord in"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          className="h-12"
          disabled={isLoading}
        />
        <p className="text-xs text-muted-foreground mt-1">
          <strong>Hint voor de demo:</strong> Het wachtwoord is "admin123"
        </p>
      </div>
      
      {attempts > 2 && (
        <div className="bg-destructive/10 p-4 rounded-md flex items-start gap-3">
          <ShieldAlert className="text-destructive flex-shrink-0 mt-0.5" size={20} />
          <p className="text-sm text-destructive">
            Let op: Na 5 mislukte pogingen wordt de toegang tijdelijk geblokkeerd.
          </p>
        </div>
      )}
      
      <Button 
        onClick={handleLogin} 
        className="w-full h-12 mt-2"
        disabled={isLoading}
      >
        {isLoading ? "Bezig met inloggen..." : "Inloggen"}
      </Button>
      
      <Button 
        variant="outline" 
        className="w-full h-12 mt-2"
        onClick={handleBack}
        disabled={isLoading}
      >
        Terug naar gebruikersmodus
      </Button>
    </div>
  );

  if (insideDialog) {
    return content;
  }

  return (
    <div className="container mx-auto max-w-md py-8">
      <Card className="p-8 shadow-md">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Lock size={32} className="text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Inloggen als beheerder</h2>
          <p className="text-muted-foreground text-center mt-2">
            Voer het beheerderswachtwoord in om toegang te krijgen tot de beheerdersinstellingen.
          </p>
        </div>
        
        {content}
      </Card>
    </div>
  );
};