import React from "react";
import { Button } from "./ui/button";
import { CalendarClock, UserRound, Settings, ArrowRight } from "lucide-react";
import { useUser } from "../contexts/EnhancedUserContext";

export const Welcome = () => {
  const { setShowUserSelector } = useUser();

  return (
    <div className="welcome-screen fade-in">
      <h1 className="welcome-title">
        Welkom bij je Dagplanning
      </h1>
      <p className="welcome-subtitle">
        Laten we samen je dag plannen met leuke activiteiten!
      </p>
      
      <div className="welcome-image-container">
        <div className="relative mx-auto w-64 h-64 mb-8">
          <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse"></div>
          <div className="absolute inset-4 bg-primary/20 rounded-full"></div>
          <div className="absolute inset-8 flex items-center justify-center">
            <CalendarClock size={100} className="text-primary" />
          </div>
        </div>
      </div>
      
      <div className="grid gap-6 max-w-md mx-auto">
        <Button 
          size="lg" 
          className="button-with-icon py-6 text-lg"
          onClick={() => setShowUserSelector(true)}
        >
          <UserRound className="mr-2" size={24} />
          Kies je profiel
          <ArrowRight className="ml-auto" size={20} />
        </Button>
        
        <Button 
          variant="outline" 
          size="lg" 
          className="button-with-icon py-6 text-lg"
          onClick={() => window.location.href = '/admin'}
        >
          <Settings className="mr-2" size={24} />
          Begeleider instellingen
        </Button>
        
        <div className="mt-8 text-center text-muted-foreground">
          <p className="text-sm">
            Dagplanning Applicatie voor Dagbesteding
            <br />
            <span className="font-medium">Juni 2025</span>
          </p>
        </div>
      </div>
    </div>
  );
};