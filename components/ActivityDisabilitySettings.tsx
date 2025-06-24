
import React, { useState } from "react";
import { Activity, useSchedule } from "../contexts/EnhancedScheduleContext";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { Check, FilterX, Info, Save, Search } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { ActivityTemplateManager } from "./ActivityTemplateManager";

export const ActivityDisabilitySettings: React.FC = () => {
  const { activities, updateActivity, persistScheduleData } = useSchedule();
  
  // State for active view
  const [activeView, setActiveView] = useState<"templates" | "instances">("templates");
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [activityFilter, setActivityFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  
  // Filtered activities
  const filteredActivities = activities.filter(activity => {
    // Text search
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (activity.description || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    // Activity type filter
    const matchesType = activityFilter === "all" || activity.type === activityFilter;
    
    // Category filter
    const matchesCategory = categoryFilter === "all" || activity.category === categoryFilter;
    
    return matchesSearch && matchesType && matchesCategory;
  });
  
  // Handle activity disability requirement toggle
  const handleRequirementToggle = (activity: Activity, key: string, value: boolean) => {
    const updatedActivity = {
      ...activity,
      requiredSupport: {
        ...(activity.requiredSupport || {}),
        [key]: value
      }
    };
    
    updateActivity(updatedActivity);
    toast.success(`Ondersteuningsvereiste bijgewerkt voor ${activity.title}`);
    persistScheduleData();
  };
  
  // Handle difficulty change
  const handleDifficultyChange = (activity: Activity, difficulty: "easy" | "medium" | "hard") => {
    const updatedActivity = {
      ...activity,
      difficulty
    };
    
    updateActivity(updatedActivity);
    toast.success(`Moeilijkheidsgraad bijgewerkt voor ${activity.title}`);
    persistScheduleData();
  };
  
  return (
    <div className="space-y-6">
      <Tabs value={activeView} onValueChange={(value) => setActiveView(value as "templates" | "instances")} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="templates">Sjablonen</TabsTrigger>
          <TabsTrigger value="instances">Alle Activiteiten</TabsTrigger>
        </TabsList>
        
        <TabsContent value="templates">
          <ActivityTemplateManager />
        </TabsContent>
        
        <TabsContent value="instances">
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">Alle Activiteiten</h3>
            <div className="flex items-start gap-3 bg-muted p-4 rounded-md mb-6">
              <Info size={20} className="text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Over deze weergave</p>
                <p className="text-muted-foreground text-sm mt-1">
                  Hier ziet u alle individuele activiteiten in het systeem. Voor efficiënter beheer, 
                  gebruik de 'Sjablonen' tab om activiteiten per type te beheren.
                </p>
              </div>
            </div>
            
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <Label htmlFor="search" className="mb-2 block">Zoeken</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Zoek activiteiten..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="activityType" className="mb-2 block">Activiteitstype</Label>
                <Select value={activityFilter} onValueChange={setActivityFilter}>
                  <SelectTrigger id="activityType">
                    <SelectValue placeholder="Alle types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle types</SelectItem>
                    <SelectItem value="hygiene">Hygiëne</SelectItem>
                    <SelectItem value="meal">Maaltijd</SelectItem>
                    <SelectItem value="medication">Medicatie</SelectItem>
                    <SelectItem value="therapy">Therapie</SelectItem>
                    <SelectItem value="exercise">Beweging</SelectItem>
                    <SelectItem value="social">Sociaal</SelectItem>
                    <SelectItem value="entertainment">Ontspanning</SelectItem>
                    <SelectItem value="creative">Creatief</SelectItem>
                    <SelectItem value="education">Educatief</SelectItem>
                    <SelectItem value="other">Overig</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="category" className="mb-2 block">Categorie</Label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Alle categorieën" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle categorieën</SelectItem>
                    <SelectItem value="fixed">Vast</SelectItem>
                    <SelectItem value="flexible">Flexibel</SelectItem>
                    <SelectItem value="group">Groep</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Activities List */}
            <div className="space-y-4">
              {filteredActivities.length > 0 ? (
                filteredActivities.map(activity => (
                  <Card key={activity.id} className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">{activity.title}</h4>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="outline" className="capitalize">
                            {activity.type.replace("-", " ")}
                          </Badge>
                          <Badge variant="outline" className="capitalize">
                            {activity.category === "fixed" ? "Vast" : 
                             activity.category === "flexible" ? "Flexibel" : "Groep"}
                          </Badge>
                          {activity.userId && (
                            <Badge variant="secondary">
                              Gebruiker ID: {activity.userId.split('-')[0]}
                            </Badge>
                          )}
                          {activity.date && (
                            <Badge variant="secondary">
                              Datum: {new Date(activity.date).toLocaleDateString('nl-NL')}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`difficulty-${activity.id}`} className="w-24">Moeilijkheid:</Label>
                          <Select 
                            value={activity.difficulty || "easy"} 
                            onValueChange={(val) => handleDifficultyChange(activity, val as "easy" | "medium" | "hard")}
                          >
                            <SelectTrigger id={`difficulty-${activity.id}`} className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="easy">Eenvoudig</SelectItem>
                              <SelectItem value="medium">Gemiddeld</SelectItem>
                              <SelectItem value="hard">Moeilijk</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t">
                      <h5 className="font-medium mb-3">Vereiste ondersteuning:</h5>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="flex items-center justify-between">
                          <Label htmlFor={`language-${activity.id}`} className="cursor-pointer">Taal</Label>
                          <Switch
                            id={`language-${activity.id}`}
                            checked={activity.requiredSupport?.language || false}
                            onCheckedChange={(checked) => handleRequirementToggle(activity, "language", checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor={`planning-${activity.id}`} className="cursor-pointer">Planning</Label>
                          <Switch
                            id={`planning-${activity.id}`}
                            checked={activity.requiredSupport?.planning || false}
                            onCheckedChange={(checked) => handleRequirementToggle(activity, "planning", checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor={`sensory-${activity.id}`} className="cursor-pointer">Zintuiglijk</Label>
                          <Switch
                            id={`sensory-${activity.id}`}
                            checked={activity.requiredSupport?.sensory || false}
                            onCheckedChange={(checked) => handleRequirementToggle(activity, "sensory", checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor={`motor-${activity.id}`} className="cursor-pointer">Motorisch</Label>
                          <Switch
                            id={`motor-${activity.id}`}
                            checked={activity.requiredSupport?.motor || false}
                            onCheckedChange={(checked) => handleRequirementToggle(activity, "motor", checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor={`social-${activity.id}`} className="cursor-pointer">Sociaal</Label>
                          <Switch
                            id={`social-${activity.id}`}
                            checked={activity.requiredSupport?.social || false}
                            onCheckedChange={(checked) => handleRequirementToggle(activity, "social", checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor={`cognitive-${activity.id}`} className="cursor-pointer">Cognitief</Label>
                          <Switch
                            id={`cognitive-${activity.id}`}
                            checked={activity.requiredSupport?.cognitive || false}
                            onCheckedChange={(checked) => handleRequirementToggle(activity, "cognitive", checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center p-8 border border-dashed rounded-md">
                  <FilterX size={48} className="mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium">Geen activiteiten gevonden</p>
                  <p className="text-muted-foreground mt-1">
                    Probeer andere zoek- of filtercriteria.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchTerm("");
                      setActivityFilter("all");
                      setCategoryFilter("all");
                    }} 
                    className="mt-4"
                  >
                    Filters wissen
                  </Button>
                </div>
              )}
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button onClick={persistScheduleData} className="flex items-center gap-2">
                <Save size={18} />
                <span>Wijzigingen opslaan</span>
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
