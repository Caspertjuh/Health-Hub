
import React, { useState } from "react";
import { Activity, useSchedule } from "../contexts/EnhancedScheduleContext";
import { useUser } from "../contexts/EnhancedUserContext";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { PlusCircle, Clock, Save, X } from "lucide-react";
import { ActivityCard } from "./ActivityCard";
import { toast } from "sonner@2.0.3";

// Default activity suggestion to use if none is available
const DEFAULT_SUGGESTION: Activity = {
  id: "default-suggestion",
  title: "Wandelen",
  description: "Een rustige wandeling buiten",
  startTime: "",
  endTime: "",
  category: "flexible",
  type: "exercise",
  icon: "smile",
  color: "#98FB98",
  completed: false
};

export const ActivityPlanner: React.FC = () => {
  const scheduleContext = useSchedule();
  const userContext = useUser();
  
  // Extract values with safeguards
  const addActivity = scheduleContext?.addActivity;
  const suggestions = scheduleContext?.suggestions || [];
  const persistScheduleData = scheduleContext?.persistScheduleData;
  const currentUser = userContext?.currentUser;
  
  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<Activity | null>(null);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");

  if (!currentUser) return null;

  // Handle opening the dialog with a suggestion
  const handleOpenDialog = (suggestion: Activity) => {
    setSelectedSuggestion(suggestion);
    setIsDialogOpen(true);
  };

  // Handle adding the activity to the schedule
  const handleAddToSchedule = () => {
    if (!selectedSuggestion || !addActivity) return;
    
    if (!startTime || !endTime) {
      toast.error("Vul alstublieft de begin- en eindtijd in");
      return;
    }
    
    if (startTime >= endTime) {
      toast.error("De eindtijd moet na de begintijd zijn");
      return;
    }
    
    try {
      // Create a new activity based on the suggestion
      const activityToAdd: Activity = {
        ...selectedSuggestion,
        id: `activity-${Date.now()}`, // Generate a new ID
        startTime,
        endTime,
        category: "flexible",
        completed: false,
        date: new Date().toISOString().split('T')[0] // Today's date
      };
      
      addActivity(activityToAdd);
      
      if (persistScheduleData) {
        persistScheduleData();
      }
      
      toast.success(`${selectedSuggestion.title} is toegevoegd aan je planning`);
      setIsDialogOpen(false);
      
      // Reset form
      setStartTime("09:00");
      setEndTime("10:00");
    } catch (error) {
      console.error("Error adding activity:", error);
      toast.error("Er is een probleem opgetreden bij het toevoegen van de activiteit");
    }
  };

  // Use demo suggestions if none available
  const displaySuggestions = suggestions.length > 0 ? suggestions : [DEFAULT_SUGGESTION];

  return (
    <div className="mt-8">
      <h3 className="font-bold text-xl mb-4">Activiteiten suggesties</h3>
      
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
        {displaySuggestions.map((suggestion) => (
          <Card 
            key={suggestion.id} 
            className="relative p-4 cursor-pointer hover:shadow-md transition-all"
            onClick={() => handleOpenDialog(suggestion)}
          >
            <ActivityCard 
              activity={suggestion} 
              showTime={false} 
              isCompact={true} 
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 h-8 w-8 rounded-full p-0 flex items-center justify-center"
            >
              <PlusCircle size={20} />
            </Button>
          </Card>
        ))}
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Activiteit inplannen</DialogTitle>
            <DialogDescription>
              Plan deze activiteit in op een tijdstip dat voor jou werkt.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {selectedSuggestion && (
              <div className="mb-4">
                <ActivityCard activity={selectedSuggestion} showTime={false} />
              </div>
            )}
            
            <div className="grid gap-4 mt-6">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startTime" className="text-right flex items-center gap-1">
                  <Clock size={16} />
                  <span>Begintijd</span>
                </Label>
                <Input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="col-span-3 h-12 text-lg"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="endTime" className="text-right flex items-center gap-1">
                  <Clock size={16} />
                  <span>Eindtijd</span>
                </Label>
                <Input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="col-span-3 h-12 text-lg"
                />
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
              className="flex items-center gap-2"
            >
              <X size={16} />
              <span>Annuleren</span>
            </Button>
            <Button 
              onClick={handleAddToSchedule}
              className="flex items-center gap-2"
            >
              <Save size={16} />
              <span>Toevoegen</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
