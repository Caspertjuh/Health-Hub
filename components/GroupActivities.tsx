import React, { useState } from "react";
import { Activity, useSchedule } from "../contexts/EnhancedScheduleContext";
import { User, useUser } from "../contexts/EnhancedUserContext";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  Users, 
  Calendar, 
  CheckCircle, 
  ThumbsUp, 
  X, 
  AlertCircle
} from "lucide-react";
import { EnhancedActivityCard } from "./EnhancedActivityCard";
import { toast } from "sonner@2.0.3";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";

interface GroupActivitiesProps {
  activities: Activity[];
  currentUser: User;
}

// Demo group activity for when real ones aren't available
const DEMO_GROUP_ACTIVITY: Activity = {
  id: "demo-group-1",
  title: "Knutsel Workshop",
  description: "Samen creatieve projecten maken",
  startTime: "14:00",
  endTime: "16:00",
  date: new Date().toISOString().split('T')[0],
  location: "Activiteitenruimte",
  category: "group",
  type: "creative",
  icon: "smile",
  color: "#DDA0DD",
  completed: false,
  participants: [],
  maxParticipants: 10,
  requiredSupport: {
    language: false,
    planning: false,
    sensory: false,
    motor: false,
    social: false,
    cognitive: false
  }
};

export const GroupActivities: React.FC<GroupActivitiesProps> = ({ 
  activities, 
  currentUser 
}) => {
  const { 
    joinGroupActivity, 
    leaveGroupActivity, 
    persistScheduleData 
  } = useSchedule();
  
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [confirmationType, setConfirmationType] = useState<'join' | 'leave'>('join');
  const [successDialogOpen, setSuccessDialogOpen] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");

  // Get available group activities - use a demo activity if none available
  const getGroupActivities = () => {
    try {
      // Filter for group activities that aren't joined by the current user
      const groupActivities = activities.filter(
        activity => 
          activity.category === 'group' && 
          !activity.participants?.some(p => p.id === currentUser.id)
      );
      
      // Return either actual group activities or a demo one
      return groupActivities.length > 0 ? groupActivities : [DEMO_GROUP_ACTIVITY];
    } catch (error) {
      console.error("Error getting group activities:", error);
      return [DEMO_GROUP_ACTIVITY];
    }
  };

  // Get user's enrolled activities
  const getUserActivities = () => {
    try {
      return activities.filter(
        activity => 
          activity.category === 'group' && 
          activity.participants?.some(p => p.id === currentUser.id)
      );
    } catch (error) {
      console.error("Error getting user activities:", error);
      return [];
    }
  };
  
  const availableActivities = getGroupActivities();
  const userActivities = getUserActivities();

  // Open confirmation dialog for joining an activity
  const confirmJoinActivity = (activity: Activity) => {
    setSelectedActivity(activity);
    setConfirmationType('join');
    setConfirmDialogOpen(true);
  };

  // Open confirmation dialog for leaving an activity
  const confirmLeaveActivity = (activity: Activity) => {
    setSelectedActivity(activity);
    setConfirmationType('leave');
    setConfirmDialogOpen(true);
  };
  
  // Handle joining an activity
  const handleJoinActivity = () => {
    if (!selectedActivity) return;
    
    try {
      const success = joinGroupActivity(selectedActivity.id, currentUser.id);
      
      if (success) {
        setSuccessMessage(`Je doet nu mee aan: ${selectedActivity.title}`);
        setSuccessDialogOpen(true);
        toast.success(`Je doet nu mee aan: ${selectedActivity.title}`);
        persistScheduleData();
      } else {
        toast.error("Je kunt niet deelnemen aan deze activiteit");
      }
    } catch (error) {
      console.error("Error joining activity:", error);
      toast.error("Er is een probleem opgetreden");
    }
    
    setConfirmDialogOpen(false);
  };

  // Handle leaving an activity
  const handleLeaveActivity = () => {
    if (!selectedActivity) return;
    
    try {
      leaveGroupActivity(selectedActivity.id, currentUser.id);
      setSuccessMessage(`Je doet niet meer mee aan: ${selectedActivity.title}`);
      setSuccessDialogOpen(true);
      toast.success(`Je doet niet meer mee aan: ${selectedActivity.title}`);
      persistScheduleData();
    } catch (error) {
      console.error("Error leaving activity:", error);
      toast.error("Er is een probleem opgetreden");
    }
    
    setConfirmDialogOpen(false);
  };

  // Format current date
  const formatDate = (date: Date) => {
    try {
      const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        day: "numeric",
        month: "long",
      };
      return date.toLocaleDateString("nl-NL", options);
    } catch (error) {
      console.error("Error formatting date:", error);
      return date.toDateString();
    }
  };

  return (
    <div className="mt-2 space-y-6">
      <div className="flex items-center gap-3 bg-muted p-5 rounded-lg">
        <Calendar size={28} className="text-primary" />
        <span className="text-xl">Activiteiten voor {formatDate(new Date())}</span>
      </div>
      
      {/* User's enrolled activities */}
      {userActivities.length > 0 && (
        <div className="space-y-5">
          <div className="flex items-center gap-3 border-b pb-2">
            <CheckCircle size={32} className="text-green-500" />
            <h3 className="text-xl">Jouw activiteiten</h3>
          </div>
          
          {userActivities.map(activity => (
            <Card key={activity.id} className="p-5 border-2 border-primary shadow-md">
              <div className="relative">
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2 text-lg bg-green-100">
                    <CheckCircle size={24} className="text-green-500" />
                    <span>Ingeschreven</span>
                  </Badge>
                </div>
                
                <div className="mt-10">
                  <EnhancedActivityCard 
                    activity={activity} 
                    onComplete={() => {}} 
                    userDisabilities={currentUser.disabilities}
                    userPreferences={currentUser.preferences}
                  />
                </div>
                
                <div className="mt-4 flex justify-end">
                  <Button 
                    variant="outline" 
                    onClick={() => confirmLeaveActivity(activity)}
                    className="text-destructive h-16 px-6 text-xl flex gap-3 items-center shadow-sm"
                    size="lg"
                  >
                    <X size={24} />
                    <span>Uitschrijven</span>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      
      {/* Available activities */}
      {availableActivities.length > 0 && (
        <div className="space-y-5">
          <div className="flex items-center gap-3 border-b pb-2">
            <Users size={32} className="text-primary" />
            <h3 className="text-xl">Beschikbare activiteiten</h3>
          </div>
          
          {availableActivities.map(activity => (
            <Card key={activity.id} className="p-5 shadow-md hover:shadow-lg transition-shadow">
              <EnhancedActivityCard 
                activity={activity} 
                onComplete={() => {}} 
                userDisabilities={currentUser.disabilities}
                userPreferences={currentUser.preferences}
              />
              
              <div className="mt-4 flex items-center justify-between">
                <Badge variant="outline" className="flex items-center gap-2 px-4 py-2 text-lg">
                  <Users size={20} />
                  <span>
                    {activity.participants?.length || 0}/{activity.maxParticipants || "∞"} deelnemers
                  </span>
                </Badge>
                
                <Button 
                  onClick={() => confirmJoinActivity(activity)}
                  className="h-16 px-6 text-xl flex gap-3 items-center shadow-sm"
                  size="lg"
                >
                  <ThumbsUp size={24} />
                  <span>Inschrijven</span>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
      
      {availableActivities.length === 0 && userActivities.length === 0 && (
        <Card className="p-8 text-center shadow-md">
          <AlertCircle size={40} className="mx-auto mb-4 text-muted-foreground" />
          <p className="text-2xl mb-3">Er zijn geen groepsactiviteiten beschikbaar voor deze dag.</p>
          <p className="text-muted-foreground text-xl">
            Kijk op een andere dag voor meer activiteiten.
          </p>
        </Card>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {confirmationType === 'join' ? 'Inschrijven voor activiteit' : 'Uitschrijven van activiteit'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-6">
            {selectedActivity && (
              <EnhancedActivityCard 
                activity={selectedActivity} 
                onComplete={() => {}} 
                userDisabilities={currentUser.disabilities}
                userPreferences={currentUser.preferences}
              />
            )}
          </div>
          
          <DialogFooter className="gap-4 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setConfirmDialogOpen(false)}
              className="h-16 text-xl w-full sm:w-auto"
              size="lg"
            >
              Annuleren
            </Button>
            <Button
              onClick={confirmationType === 'join' ? handleJoinActivity : handleLeaveActivity}
              variant={confirmationType === 'join' ? "default" : "destructive"}
              className="h-16 text-xl w-full sm:w-auto"
              size="lg"
            >
              {confirmationType === 'join' ? 'Ja, inschrijven' : 'Ja, uitschrijven'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center">
              {confirmationType === 'join' ? 'Ingeschreven!' : 'Uitgeschreven!'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-8 flex flex-col items-center">
            {confirmationType === 'join' ? (
              <CheckCircle size={80} className="text-green-500 mb-6" />
            ) : (
              <ThumbsUp size={80} className="text-primary mb-6" />
            )}
            <p className="text-2xl text-center">{successMessage}</p>
          </div>
          
          <DialogFooter>
            <Button
              onClick={() => setSuccessDialogOpen(false)}
              className="h-16 px-8 text-xl mx-auto w-full max-w-sm"
              size="lg"
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};