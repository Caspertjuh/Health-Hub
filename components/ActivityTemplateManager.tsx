
import React, { useState, useEffect } from "react";
import { Activity, useSchedule } from "../contexts/EnhancedScheduleContext";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Search, Info, Save, FilterX, Edit, Check, X } from "lucide-react";
import { toast } from "sonner@2.0.3";

// Template interface to uniquely identify activity types
interface ActivityTemplate {
  id: string;
  title: string;
  description?: string;
  category: "fixed" | "flexible" | "group";
  type: "hygiene" | "meal" | "medication" | "therapy" | "exercise" | "social" | "entertainment" | "creative" | "education" | "other";
  icon: string;
  color: string;
  location?: string;
  requiredSupport?: {
    language?: boolean;
    planning?: boolean;
    sensory?: boolean;
    motor?: boolean;
    social?: boolean;
    cognitive?: boolean;
  };
  difficulty?: "easy" | "medium" | "hard";
  baseActivityId?: string; // Reference to the original activity ID
}

export const ActivityTemplateManager: React.FC = () => {
  const { activities, updateActivity, persistScheduleData } = useSchedule();
  
  // State for activity templates
  const [templates, setTemplates] = useState<ActivityTemplate[]>([]);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<ActivityTemplate | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [activityFilter, setActivityFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  
  // Generate unique templates from all activities
  useEffect(() => {
    const uniqueTemplates = new Map<string, ActivityTemplate>();
    
    activities.forEach(activity => {
      // Create a unique key based on title and type
      const templateKey = `${activity.title}-${activity.type}`;
      
      if (!uniqueTemplates.has(templateKey)) {
        uniqueTemplates.set(templateKey, {
          id: templateKey,
          title: activity.title,
          description: activity.description,
          category: activity.category,
          type: activity.type,
          icon: activity.icon,
          color: activity.color,
          location: activity.location,
          requiredSupport: activity.requiredSupport ? { ...activity.requiredSupport } : undefined,
          difficulty: activity.difficulty,
          baseActivityId: activity.id
        });
      }
    });
    
    setTemplates(Array.from(uniqueTemplates.values()));
  }, [activities]);
  
  // Filtered templates
  const filteredTemplates = templates.filter(template => {
    // Text search
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (template.description || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    // Activity type filter
    const matchesType = activityFilter === "all" || template.type === activityFilter;
    
    // Category filter
    const matchesCategory = categoryFilter === "all" || template.category === categoryFilter;
    
    return matchesSearch && matchesType && matchesCategory;
  });
  
  // Start editing a template
  const handleStartEdit = (template: ActivityTemplate) => {
    setEditingTemplateId(template.id);
    setEditForm({ ...template });
  };
  
  // Cancel editing
  const handleCancelEdit = () => {
    setEditingTemplateId(null);
    setEditForm(null);
  };
  
  // Handle input change in edit form
  const handleEditFormChange = (field: string, value: any) => {
    if (!editForm) return;
    
    if (field.includes('.')) {
      // Handle nested fields like requiredSupport.language
      const [parent, child] = field.split('.');
      setEditForm({
        ...editForm,
        [parent]: {
          ...(editForm[parent as keyof ActivityTemplate] as object),
          [child]: value
        }
      });
    } else {
      // Handle direct fields
      setEditForm({
        ...editForm,
        [field]: value
      });
    }
  };
  
  // Save template changes to all related activities
  const handleSaveTemplate = (template: ActivityTemplate) => {
    if (!editForm) return;
    
    // Update all activities that match this template
    const updatedActivities = activities.map(activity => {
      // Check if this activity matches the template
      if (activity.title === template.title && activity.type === template.type) {
        return {
          ...activity,
          title: editForm.title,
          description: editForm.description,
          icon: editForm.icon,
          color: editForm.color,
          location: editForm.location,
          requiredSupport: editForm.requiredSupport ? { ...editForm.requiredSupport } : undefined,
          difficulty: editForm.difficulty
        };
      }
      return activity;
    });
    
    // Update all activities in context
    updatedActivities.forEach(activity => updateActivity(activity));
    
    // Exit edit mode
    setEditingTemplateId(null);
    setEditForm(null);
    
    // Save changes
    persistScheduleData();
    
    toast.success(`Template "${editForm.title}" bijgewerkt en toegepast op alle gerelateerde activiteiten`);
  };
  
  const getActivityTypeLabel = (type: string): string => {
    const typeLabels: Record<string, string> = {
      "hygiene": "Hygiëne",
      "meal": "Maaltijd",
      "medication": "Medicatie",
      "therapy": "Therapie",
      "exercise": "Beweging",
      "social": "Sociaal",
      "entertainment": "Ontspanning",
      "creative": "Creatief",
      "education": "Educatief",
      "other": "Overig"
    };
    
    return typeLabels[type] || type;
  };
  
  const getCategoryLabel = (category: string): string => {
    const categoryLabels: Record<string, string> = {
      "fixed": "Vast",
      "flexible": "Flexibel",
      "group": "Groep"
    };
    
    return categoryLabels[category] || category;
  };
  
  // Count activities that match this template
  const getActivityCount = (template: ActivityTemplate): number => {
    return activities.filter(
      activity => activity.title === template.title && activity.type === template.type
    ).length;
  };
  
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">Activiteiten-Sjablonen Beheer</h3>
        <div className="flex items-start gap-3 bg-muted p-4 rounded-md mb-6">
          <Info size={20} className="text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Over Sjablonen</p>
            <p className="text-muted-foreground text-sm mt-1">
              Hier kunt u de basisinstellingen voor alle activiteiten beheren. Wijzigingen worden toegepast op alle gerelateerde activiteiten in het systeem.
              Dit vereenvoudigt het beheer van meerdere activiteiten van hetzelfde type.
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
        
        {/* Templates List */}
        <div className="space-y-4">
          {filteredTemplates.length > 0 ? (
            filteredTemplates.map((template) => (
              <Card key={template.id} className="p-4">
                {editingTemplateId === template.id ? (
                  // Edit Form
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title" className="mb-2 block">Titel</Label>
                        <Input
                          id="title"
                          value={editForm?.title || ""}
                          onChange={(e) => handleEditFormChange("title", e.target.value)}
                          placeholder="Activiteit titel"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="location" className="mb-2 block">Locatie</Label>
                        <Input
                          id="location"
                          value={editForm?.location || ""}
                          onChange={(e) => handleEditFormChange("location", e.target.value)}
                          placeholder="Locatie (optioneel)"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="description" className="mb-2 block">Beschrijving</Label>
                      <Input
                        id="description"
                        value={editForm?.description || ""}
                        onChange={(e) => handleEditFormChange("description", e.target.value)}
                        placeholder="Beschrijving van de activiteit"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="difficulty" className="mb-2 block">Moeilijkheidsgraad</Label>
                        <Select 
                          value={editForm?.difficulty || "easy"} 
                          onValueChange={(val) => handleEditFormChange("difficulty", val)}
                        >
                          <SelectTrigger id="difficulty">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="easy">Eenvoudig</SelectItem>
                            <SelectItem value="medium">Gemiddeld</SelectItem>
                            <SelectItem value="hard">Moeilijk</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="icon" className="mb-2 block">Icoon</Label>
                        <Input
                          id="icon"
                          value={editForm?.icon || ""}
                          onChange={(e) => handleEditFormChange("icon", e.target.value)}
                          placeholder="Icoon naam"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t">
                      <h5 className="font-medium mb-3">Vereiste ondersteuning:</h5>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="language" className="cursor-pointer">Taal</Label>
                          <Switch
                            id="language"
                            checked={editForm?.requiredSupport?.language || false}
                            onCheckedChange={(checked) => handleEditFormChange("requiredSupport.language", checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="planning" className="cursor-pointer">Planning</Label>
                          <Switch
                            id="planning"
                            checked={editForm?.requiredSupport?.planning || false}
                            onCheckedChange={(checked) => handleEditFormChange("requiredSupport.planning", checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="sensory" className="cursor-pointer">Zintuiglijk</Label>
                          <Switch
                            id="sensory"
                            checked={editForm?.requiredSupport?.sensory || false}
                            onCheckedChange={(checked) => handleEditFormChange("requiredSupport.sensory", checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="motor" className="cursor-pointer">Motorisch</Label>
                          <Switch
                            id="motor"
                            checked={editForm?.requiredSupport?.motor || false}
                            onCheckedChange={(checked) => handleEditFormChange("requiredSupport.motor", checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="social" className="cursor-pointer">Sociaal</Label>
                          <Switch
                            id="social"
                            checked={editForm?.requiredSupport?.social || false}
                            onCheckedChange={(checked) => handleEditFormChange("requiredSupport.social", checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="cognitive" className="cursor-pointer">Cognitief</Label>
                          <Switch
                            id="cognitive"
                            checked={editForm?.requiredSupport?.cognitive || false}
                            onCheckedChange={(checked) => handleEditFormChange("requiredSupport.cognitive", checked)}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2 mt-4">
                      <Button variant="outline" onClick={handleCancelEdit}>
                        <X size={16} className="mr-2" />
                        Annuleren
                      </Button>
                      <Button onClick={() => handleSaveTemplate(template)}>
                        <Save size={16} className="mr-2" />
                        Opslaan
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Display Mode
                  <>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">{template.title}</h4>
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="outline" className="capitalize">
                            {getActivityTypeLabel(template.type)}
                          </Badge>
                          <Badge variant="outline" className="capitalize">
                            {getCategoryLabel(template.category)}
                          </Badge>
                          <Badge variant="secondary">
                            {getActivityCount(template)} instanties
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0">
                        <Button 
                          variant="outline" 
                          onClick={() => handleStartEdit(template)}
                          className="flex items-center gap-2"
                        >
                          <Edit size={16} />
                          <span>Bewerken</span>
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t">
                      <h5 className="font-medium mb-3">Vereiste ondersteuning:</h5>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="flex items-center justify-between">
                          <span>Taal</span>
                          {template.requiredSupport?.language ? (
                            <Check size={20} className="text-green-500" />
                          ) : (
                            <X size={20} className="text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Planning</span>
                          {template.requiredSupport?.planning ? (
                            <Check size={20} className="text-green-500" />
                          ) : (
                            <X size={20} className="text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Zintuiglijk</span>
                          {template.requiredSupport?.sensory ? (
                            <Check size={20} className="text-green-500" />
                          ) : (
                            <X size={20} className="text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Motorisch</span>
                          {template.requiredSupport?.motor ? (
                            <Check size={20} className="text-green-500" />
                          ) : (
                            <X size={20} className="text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Sociaal</span>
                          {template.requiredSupport?.social ? (
                            <Check size={20} className="text-green-500" />
                          ) : (
                            <X size={20} className="text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Cognitief</span>
                          {template.requiredSupport?.cognitive ? (
                            <Check size={20} className="text-green-500" />
                          ) : (
                            <X size={20} className="text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}
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
    </div>
  );
};
