import React, { useState } from "react";
import { User, useUser, Disability, Preferences } from "../contexts/EnhancedUserContext";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { AdminPanelHeader } from "./AdminPanelHeader";
import { ActivityDisabilitySettings } from "./ActivityDisabilitySettings";
import { AccessibilitySettingsPanel } from "./AccessibilitySettingsPanel";
import { 
  User as UserIcon, 
  Users, 
  Settings, 
  Save, 
  PlusCircle, 
  AlertTriangle,
  Trash2,
  Check,
  X
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { ImageWithFallback } from "./figma/ImageWithFallback";

// Default user for creating new users
const DEFAULT_NEW_USER: User = {
  id: "",
  name: "",
  avatar: undefined,
  disabilities: {
    language: false,
    planning: false,
    sensory: false,
    motor: false,
    social: false,
    cognitive: false
  },
  preferences: {
    simplifiedLanguage: false,
    enhancedVisualSupport: false,
    highContrast: false,
    largerText: false
  }
};

const AdminPanel: React.FC = () => {
  const { 
    users, 
    updateUser, 
    addUser, 
    deleteUser, 
    persistUserData,
    toggleAdminMode
  } = useUser();
  
  // States for tab and user selection
  const [activeTab, setActiveTab] = useState("users");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  
  // States for editing a user
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);
  
  // States for confirmation dialogs
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [confirmDiscardDialog, setConfirmDiscardDialog] = useState(false);
  
  // Get selected user
  const selectedUser = users.find(user => user.id === selectedUserId);
  
  // Handle selecting a user
  const handleSelectUser = (userId: string) => {
    // If we're editing, show confirmation dialog
    if (editingUser && userId !== selectedUserId) {
      setConfirmDiscardDialog(true);
      return;
    }
    
    setSelectedUserId(userId);
    setEditingUser(null);
    setIsNewUser(false);
  };
  
  // Handle starting to edit a user
  const handleEditUser = () => {
    if (!selectedUser) return;
    setEditingUser({...selectedUser});
  };
  
  // Handle creating a new user
  const handleNewUser = () => {
    // If we're editing, show confirmation dialog
    if (editingUser) {
      setConfirmDiscardDialog(true);
      return;
    }
    
    const newUser = {...DEFAULT_NEW_USER, id: `user-${Date.now()}`};
    setEditingUser(newUser);
    setSelectedUserId(null);
    setIsNewUser(true);
  };
  
  // Handle saving user changes
  const handleSaveUser = () => {
    if (!editingUser) return;
    
    if (isNewUser) {
      if (!editingUser.name.trim()) {
        toast.error("Voer een naam in voor de nieuwe gebruiker");
        return;
      }
      
      addUser(editingUser);
      toast.success(`Nieuwe gebruiker "${editingUser.name}" aangemaakt`);
    } else {
      updateUser(editingUser.id, editingUser);
      toast.success(`Gebruiker "${editingUser.name}" bijgewerkt`);
    }
    
    setEditingUser(null);
    setIsNewUser(false);
    setSelectedUserId(editingUser.id);
    persistUserData();
  };
  
  // Handle canceling edit
  const handleCancelEdit = () => {
    setEditingUser(null);
    setIsNewUser(false);
  };
  
  // Handle deleting a user
  const handleConfirmDelete = () => {
    if (!userToDelete) return;
    
    deleteUser(userToDelete.id);
    toast.success(`Gebruiker "${userToDelete.name}" verwijderd`);
    
    setUserToDelete(null);
    setConfirmDeleteDialog(false);
    setSelectedUserId(null);
    setEditingUser(null);
    persistUserData();
  };
  
  // Handle opening delete confirmation
  const handleOpenDeleteDialog = (user: User) => {
    setUserToDelete(user);
    setConfirmDeleteDialog(true);
  };
  
  // Handle discarding changes confirmation
  const handleConfirmDiscard = (continueAction: () => void) => {
    setEditingUser(null);
    setIsNewUser(false);
    setConfirmDiscardDialog(false);
    continueAction();
  };
  
  // Handle disability toggle
  const handleDisabilityToggle = (key: keyof Disability, value: boolean) => {
    if (!editingUser) return;
    
    setEditingUser({
      ...editingUser,
      disabilities: {
        ...editingUser.disabilities,
        [key]: value
      }
    });
  };
  
  // Handle preference toggle
  const handlePreferenceToggle = (key: keyof Preferences, value: boolean) => {
    if (!editingUser) return;
    
    setEditingUser({
      ...editingUser,
      preferences: {
        ...editingUser.preferences,
        [key]: value
      }
    });
  };
  
  // Handle editing user fields
  const handleUserFieldChange = (field: keyof User, value: string) => {
    if (!editingUser) return;
    
    setEditingUser({
      ...editingUser,
      [field]: value
    } as User);
  };

  // Handle exit from admin panel
  const handleExitAdmin = () => {
    toggleAdminMode();
    toast.info("Beheerdermodus verlaten");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 max-w-6xl pb-8">
        <div className="flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold">Beheerdersdashboard</h1>
          <Button variant="outline" onClick={handleExitAdmin}>
            Verlaat beheerdermodus
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid grid-cols-3 h-14">
            <TabsTrigger value="users" className="text-lg flex items-center gap-2">
              <Users size={20} />
              <span>Gebruikers</span>
            </TabsTrigger>
            <TabsTrigger value="activities" className="text-lg flex items-center gap-2">
              <Settings size={20} />
              <span>Activiteitenbeheer</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-lg flex items-center gap-2">
              <Settings size={20} />
              <span>Systeeminstellingen</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Users Tab */}
          <TabsContent value="users" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* User List */}
              <div className="md:col-span-1">
                <Card className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Bewoners</h3>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 w-8 p-0" 
                      onClick={handleNewUser}
                    >
                      <PlusCircle size={20} />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {users.map(user => (
                      <Button
                        key={user.id}
                        variant={selectedUserId === user.id ? "default" : "outline"}
                        className={`w-full justify-start h-auto py-3 px-4 ${
                          selectedUserId === user.id ? "" : "hover:bg-accent"
                        }`}
                        onClick={() => handleSelectUser(user.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {user.avatar ? (
                              <ImageWithFallback
                                src={user.avatar}
                                alt={user.name}
                                width={32}
                                height={32}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <UserIcon size={18} />
                            )}
                          </div>
                          <div className="text-left">
                            <p className="font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground">Bewoner</p>
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                  
                  {users.length === 0 && (
                    <div className="text-center p-4 border border-dashed rounded-md">
                      <p className="text-muted-foreground">Geen bewoners gevonden</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2"
                        onClick={handleNewUser}
                      >
                        <PlusCircle size={16} className="mr-2" />
                        Bewoner toevoegen
                      </Button>
                    </div>
                  )}
                </Card>
              </div>
              
              {/* User Details or Edit Form */}
              <div className="md:col-span-2">
                {selectedUser && !editingUser && (
                  <Card className="p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-3">
                        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {selectedUser.avatar ? (
                            <ImageWithFallback
                              src={selectedUser.avatar}
                              alt={selectedUser.name}
                              width={64}
                              height={64}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <UserIcon size={32} />
                          )}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold">{selectedUser.name}</h3>
                          <p className="text-muted-foreground">Bewoner</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={handleEditUser}>
                          Bewerken
                        </Button>
                        <Button 
                          variant="destructive" 
                          onClick={() => handleOpenDeleteDialog(selectedUser)}
                        >
                          <Trash2 size={18} className="mr-2" />
                          Verwijderen
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid gap-6">
                      {/* Disabilities */}
                      <div>
                        <h4 className="text-lg font-semibold mb-3">Beperkingen</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                            <span>Taal</span>
                            {selectedUser.disabilities?.language ? (
                              <Check size={20} className="text-green-500" />
                            ) : (
                              <X size={20} className="text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                            <span>Planning</span>
                            {selectedUser.disabilities?.planning ? (
                              <Check size={20} className="text-green-500" />
                            ) : (
                              <X size={20} className="text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                            <span>Zintuiglijk</span>
                            {selectedUser.disabilities?.sensory ? (
                              <Check size={20} className="text-green-500" />
                            ) : (
                              <X size={20} className="text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                            <span>Motorisch</span>
                            {selectedUser.disabilities?.motor ? (
                              <Check size={20} className="text-green-500" />
                            ) : (
                              <X size={20} className="text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                            <span>Sociaal</span>
                            {selectedUser.disabilities?.social ? (
                              <Check size={20} className="text-green-500" />
                            ) : (
                              <X size={20} className="text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                            <span>Cognitief</span>
                            {selectedUser.disabilities?.cognitive ? (
                              <Check size={20} className="text-green-500" />
                            ) : (
                              <X size={20} className="text-muted-foreground" />
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Preferences */}
                      <div>
                        <h4 className="text-lg font-semibold mb-3">Voorkeuren</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                            <span>Vereenvoudigde taal</span>
                            {selectedUser.preferences?.simplifiedLanguage ? (
                              <Check size={20} className="text-green-500" />
                            ) : (
                              <X size={20} className="text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                            <span>Verbeterde visuele ondersteuning</span>
                            {selectedUser.preferences?.enhancedVisualSupport ? (
                              <Check size={20} className="text-green-500" />
                            ) : (
                              <X size={20} className="text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                            <span>Hoog contrast</span>
                            {selectedUser.preferences?.highContrast ? (
                              <Check size={20} className="text-green-500" />
                            ) : (
                              <X size={20} className="text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                            <span>Grotere tekst</span>
                            {selectedUser.preferences?.largerText ? (
                              <Check size={20} className="text-green-500" />
                            ) : (
                              <X size={20} className="text-muted-foreground" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}
                
                {/* Edit User Form */}
                {editingUser && (
                  <Card className="p-6">
                    <div className="flex justify-between items-start mb-6">
                      <h3 className="text-2xl font-bold">
                        {isNewUser ? "Nieuwe bewoner" : `Bewerk ${editingUser.name}`}
                      </h3>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={handleCancelEdit}>
                          Annuleren
                        </Button>
                        <Button onClick={handleSaveUser}>
                          <Save size={18} className="mr-2" />
                          Opslaan
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      {/* Basic Info */}
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold">Basisinformatie</h4>
                        <div className="grid gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Naam</Label>
                            <Input
                              id="name"
                              value={editingUser.name}
                              onChange={(e) => handleUserFieldChange("name", e.target.value)}
                              placeholder="Voer naam in"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="avatar">Avatar URL</Label>
                            <Input
                              id="avatar"
                              value={editingUser.avatar || ""}
                              onChange={(e) => handleUserFieldChange("avatar", e.target.value)}
                              placeholder="URL naar avatar afbeelding"
                            />
                            <p className="text-xs text-muted-foreground">
                              Voorbeeld: /avatars/user1.png
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Disabilities */}
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold">Beperkingen</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="language" className="cursor-pointer">Taal</Label>
                            <Switch
                              id="language"
                              checked={editingUser.disabilities?.language || false}
                              onCheckedChange={(checked) => handleDisabilityToggle("language", checked)}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="planning" className="cursor-pointer">Planning</Label>
                            <Switch
                              id="planning"
                              checked={editingUser.disabilities?.planning || false}
                              onCheckedChange={(checked) => handleDisabilityToggle("planning", checked)}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="sensory" className="cursor-pointer">Zintuiglijk</Label>
                            <Switch
                              id="sensory"
                              checked={editingUser.disabilities?.sensory || false}
                              onCheckedChange={(checked) => handleDisabilityToggle("sensory", checked)}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="motor" className="cursor-pointer">Motorisch</Label>
                            <Switch
                              id="motor"
                              checked={editingUser.disabilities?.motor || false}
                              onCheckedChange={(checked) => handleDisabilityToggle("motor", checked)}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="social" className="cursor-pointer">Sociaal</Label>
                            <Switch
                              id="social"
                              checked={editingUser.disabilities?.social || false}
                              onCheckedChange={(checked) => handleDisabilityToggle("social", checked)}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="cognitive" className="cursor-pointer">Cognitief</Label>
                            <Switch
                              id="cognitive"
                              checked={editingUser.disabilities?.cognitive || false}
                              onCheckedChange={(checked) => handleDisabilityToggle("cognitive", checked)}
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Preferences */}
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold">Voorkeuren</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="simplifiedLanguage" className="cursor-pointer">Vereenvoudigde taal</Label>
                            <Switch
                              id="simplifiedLanguage"
                              checked={editingUser.preferences?.simplifiedLanguage || false}
                              onCheckedChange={(checked) => handlePreferenceToggle("simplifiedLanguage", checked)}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="enhancedVisualSupport" className="cursor-pointer">Verbeterde visuele ondersteuning</Label>
                            <Switch
                              id="enhancedVisualSupport"
                              checked={editingUser.preferences?.enhancedVisualSupport || false}
                              onCheckedChange={(checked) => handlePreferenceToggle("enhancedVisualSupport", checked)}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="highContrast" className="cursor-pointer">Hoog contrast</Label>
                            <Switch
                              id="highContrast"
                              checked={editingUser.preferences?.highContrast || false}
                              onCheckedChange={(checked) => handlePreferenceToggle("highContrast", checked)}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="largerText" className="cursor-pointer">Grotere tekst</Label>
                            <Switch
                              id="largerText"
                              checked={editingUser.preferences?.largerText || false}
                              onCheckedChange={(checked) => handlePreferenceToggle("largerText", checked)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}
                
                {!selectedUser && !editingUser && (
                  <Card className="p-6 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
                    <UserIcon size={48} className="text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Geen bewoner geselecteerd</h3>
                    <p className="text-muted-foreground mb-6">
                      Selecteer een bewoner uit de lijst of maak een nieuwe bewoner aan.
                    </p>
                    <Button onClick={handleNewUser}>
                      <PlusCircle size={18} className="mr-2" />
                      Nieuwe bewoner
                    </Button>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
          
          {/* Activities Tab */}
          <TabsContent value="activities" className="mt-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Activiteitenbeheer</h3>
              <p className="text-muted-foreground mb-6">
                Hier kunt u activiteiten en activiteitensjablonen beheren voor de dagplanning.
              </p>
              <ActivityDisabilitySettings />
            </Card>
          </TabsContent>
          
          {/* Settings Tab */}
          <TabsContent value="settings" className="mt-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Systeeminstellingen</h3>
              <p className="text-muted-foreground mb-6">
                Pas de algemene instellingen van de applicatie aan.
              </p>
              <AccessibilitySettingsPanel 
                preferences={{
                  simplifiedLanguage: false,
                  enhancedVisualSupport: true,
                  highContrast: false,
                  largerText: false
                }}
                onPreferencesChange={() => {}}
              />
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Delete Confirmation Dialog */}
        <AlertDialog open={confirmDeleteDialog} onOpenChange={setConfirmDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Gebruiker verwijderen</AlertDialogTitle>
              <AlertDialogDescription>
                Weet je zeker dat je <strong>{userToDelete?.name}</strong> wilt verwijderen? 
                Deze actie kan niet ongedaan worden gemaakt.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuleren</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleConfirmDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Verwijderen
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        {/* Discard Changes Confirmation Dialog */}
        <AlertDialog open={confirmDiscardDialog} onOpenChange={setConfirmDiscardDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Wijzigingen ongedaan maken</AlertDialogTitle>
              <AlertDialogDescription>
                Je hebt niet-opgeslagen wijzigingen. Weet je zeker dat je deze wilt ongedaan maken?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Terug naar bewerken</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => handleConfirmDiscard(() => setConfirmDiscardDialog(false))}
              >
                Wijzigingen ongedaan maken
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export { AdminPanel };