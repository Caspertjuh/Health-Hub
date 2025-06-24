import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/EnhancedUserContext';
import { useSchedule, Activity } from '../contexts/EnhancedScheduleContext';
import { EnhancedActivityCard } from './EnhancedActivityCard';
import { EnhancedNavigationHeader } from './EnhancedNavigationHeader';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from "sonner@2.0.3";
import { GroupActivities } from './GroupActivities';
import { AccessibilitySettingsPanel } from './AccessibilitySettingsPanel';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';

export const DailySchedule = () => {
  const { currentUser, setCurrentUser, updateUserPreferences } = useUser();
  const { 
    activities, 
    markActivityCompleted, 
    selectedDate, 
    setSelectedDate,
    isLoading
  } = useSchedule();
  
  const [showSettings, setShowSettings] = useState(false);
  const [timeFrame, setTimeFrame] = useState<'morning' | 'afternoon' | 'evening' | 'all'>('all');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Set initial time frame based on current time
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) setTimeFrame('morning');
    else if (currentHour >= 12 && currentHour < 17) setTimeFrame('afternoon');
    else setTimeFrame('evening');
  }, []);

  // Filter activities by time frame
  const filterActivitiesByTime = (activities: Activity[]) => {
    if (timeFrame === 'all') return activities;
    
    return activities.filter(activity => {
      const startHour = activity.startTime ? parseInt(activity.startTime.split(':')[0], 10) : 0;
      
      switch (timeFrame) {
        case 'morning':
          return startHour >= 5 && startHour < 12;
        case 'afternoon':
          return startHour >= 12 && startHour < 17;
        case 'evening':
          return startHour >= 17 && startHour < 24;
        default:
          return true;
      }
    });
  };

  // Sort activities by start time
  const sortedActivities = [...activities].sort((a, b) => {
    const aTime = a.startTime || '00:00';
    const bTime = b.startTime || '00:00';
    return aTime.localeCompare(bTime);
  });

  const filteredActivities = filterActivitiesByTime(sortedActivities);
  
  // Group activities by type for visualization
  const personalActivities = filteredActivities.filter(a => a.category !== 'group');
  const groupActivities = filteredActivities.filter(a => a.category === 'group');
  
  // Handle logging out
  const handleLogout = () => {
    setCurrentUser(null);
    toast.success('Je bent uitgelogd');
  };

  // Handle marking activity as completed
  const handleActivityComplete = (activityId: string, completed: boolean) => {
    markActivityCompleted(activityId, completed);
    
    if (completed) {
      toast.success('Activiteit afgerond!');
    }
  };

  // Date formatting
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('nl-NL', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    }).format(date);
  };

  // Count completed activities
  const completedCount = personalActivities.filter(a => a.completed).length;
  const totalCount = personalActivities.length;
  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  if (!mounted) return null;

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <EnhancedNavigationHeader 
        title="Mijn Dagplanning"
        subtitle={formatDate(selectedDate)}
        onSettingsClick={() => setShowSettings(true)}
        onLogout={handleLogout}
        user={currentUser}
      />
      
      {/* Main content */}
      <main className="flex-1 px-4 pb-16 pt-6 bg-gradient-to-b from-white dark:from-gray-900 to-[#f0f4ff] dark:to-[#172554]/10">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Progress indicator */}
          <div className="slide-in-up">
            <Card className="p-5 bg-white dark:bg-gray-800 border-0 shadow-md overflow-hidden relative">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-primary/10 relative">
                  <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M15.71 15.18L12.61 13.33C12.07 13.01 11.63 12.24 11.63 11.61V7.51001" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <svg className="absolute inset-0 w-16 h-16 -rotate-90">
                    <circle cx="32" cy="32" r="28" 
                      className="stroke-primary/20 fill-none" 
                      strokeWidth="6" 
                      strokeDasharray="175.9" 
                      strokeLinecap="round"
                      transform="translate(-20, -20)" 
                    />
                    <circle cx="32" cy="32" r="28" 
                      className="stroke-primary fill-none" 
                      strokeWidth="6" 
                      strokeDasharray="175.9" 
                      strokeDashoffset={175.9 - (175.9 * progressPercentage / 100)}
                      strokeLinecap="round"
                      transform="translate(-20, -20)" 
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="font-medium">Je voortgang vandaag</h2>
                  <p className="text-muted-foreground">
                    {completedCount} van {totalCount} activiteiten afgerond
                  </p>
                </div>
                <div className="ml-auto">
                  <div className="text-2xl font-bold text-primary">
                    {progressPercentage}%
                  </div>
                </div>
              </div>
              
              {/* Decorative element */}
              <div className="absolute right-2 top-2 opacity-10">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"/>
                </svg>
              </div>
            </Card>
          </div>

          {/* Time filter tabs */}
          <div className="slide-in-up" style={{animationDelay: '0.1s'}}>
            <Tabs defaultValue={timeFrame} onValueChange={(v) => setTimeFrame(v as any)}>
              <TabsList className="grid grid-cols-4 mb-4 bg-white dark:bg-gray-800 border-0 shadow-md p-1">
                <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    Alles
                  </span>
                </TabsTrigger>
                <TabsTrigger value="morning" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    Ochtend
                  </span>
                </TabsTrigger>
                <TabsTrigger value="afternoon" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    Middag
                  </span>
                </TabsTrigger>
                <TabsTrigger value="evening" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                    Avond
                  </span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Loading state */}
          {isLoading ? (
            <div className="py-8 flex justify-center">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 relative">
                  <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
                </div>
                <p className="mt-4 text-muted-foreground">Activiteiten laden...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Activities list */}
              {filteredActivities.length === 0 ? (
                <div className="py-8 text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium">Geen activiteiten gevonden</h3>
                  <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                    Er zijn geen activiteiten gepland voor deze periode.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Personal activities */}
                  {personalActivities.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="font-medium ml-2">Persoonlijke activiteiten</h3>
                      <div className="space-y-4">
                        {personalActivities.map((activity, index) => (
                          <div 
                            className="slide-in-up" 
                            style={{animationDelay: `${0.2 + index * 0.1}s`}} 
                            key={activity.id}
                          >
                            <EnhancedActivityCard
                              activity={activity}
                              onComplete={(completed) => handleActivityComplete(activity.id, completed)}
                              userDisabilities={currentUser.disabilities}
                              userPreferences={currentUser.preferences}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Group activities */}
                  {groupActivities.length > 0 && (
                    <div className="space-y-4 mt-8">
                      <h3 className="font-medium ml-2">Groepsactiviteiten</h3>
                      <div className="slide-in-up" style={{animationDelay: '0.4s'}}>
                        {groupActivities.map((activity, index) => (
                          <div 
                            className="mt-3 first:mt-0" 
                            key={activity.id}
                          >
                            <EnhancedActivityCard
                              activity={activity}
                              onComplete={(completed) => handleActivityComplete(activity.id, completed)}
                              userDisabilities={currentUser.disabilities}
                              userPreferences={currentUser.preferences}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      
      {/* Settings dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Toegankelijkheidsinstellingen</DialogTitle>
          </DialogHeader>
          
          <AccessibilitySettingsPanel 
            preferences={currentUser.preferences}
            onPreferencesChange={updateUserPreferences}
          />
          
          <DialogFooter className="mt-6">
            <Button onClick={() => setShowSettings(false)}>
              Sluiten
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};