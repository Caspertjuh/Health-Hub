import React from 'react';
import { Preferences } from '../contexts/EnhancedUserContext';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Button } from './ui/button';
import { Info } from 'lucide-react';

interface AccessibilitySettingsPanelProps {
  preferences: Preferences;
  onPreferencesChange: (preferences: Partial<Preferences>) => void;
}

export const AccessibilitySettingsPanel: React.FC<AccessibilitySettingsPanelProps> = ({ 
  preferences, 
  onPreferencesChange 
}) => {
  const handleTogglePreference = (key: keyof Preferences, value: boolean) => {
    onPreferencesChange({ [key]: value });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 bg-muted p-4 rounded-md">
        <Info size={20} className="text-primary flex-shrink-0 mt-0.5" />
        <p className="text-muted-foreground">
          Deze instellingen zijn speciaal ontworpen om de app toegankelijker te maken 
          voor gebruikers met verschillende behoeften.
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="simplifiedLanguage" className="font-medium">Vereenvoudigde taal</Label>
            <p className="text-sm text-muted-foreground">Teksten worden eenvoudiger en duidelijker weergegeven</p>
          </div>
          <Switch
            id="simplifiedLanguage"
            checked={preferences.simplifiedLanguage}
            onCheckedChange={(checked) => handleTogglePreference('simplifiedLanguage', checked)}
          />
        </div>
        
        <Separator />
        
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="enhancedVisualSupport" className="font-medium">Verbeterde visuele ondersteuning</Label>
            <p className="text-sm text-muted-foreground">Meer visuele elementen en duidelijkere markeringen</p>
          </div>
          <Switch
            id="enhancedVisualSupport"
            checked={preferences.enhancedVisualSupport}
            onCheckedChange={(checked) => handleTogglePreference('enhancedVisualSupport', checked)}
          />
        </div>
        
        <Separator />
        
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="highContrast" className="font-medium">Hoog contrast</Label>
            <p className="text-sm text-muted-foreground">Verhoogt het contrast voor betere leesbaarheid</p>
          </div>
          <Switch
            id="highContrast"
            checked={preferences.highContrast}
            onCheckedChange={(checked) => handleTogglePreference('highContrast', checked)}
          />
        </div>
        
        <Separator />
        
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="largerText" className="font-medium">Grotere tekst</Label>
            <p className="text-sm text-muted-foreground">Vergroot alle tekst voor betere leesbaarheid</p>
          </div>
          <Switch
            id="largerText"
            checked={preferences.largerText}
            onCheckedChange={(checked) => handleTogglePreference('largerText', checked)}
          />
        </div>
      </div>
      
      <div className="pt-4">
        <Button 
          className="w-full" 
          onClick={() => {
            // Reset all preferences to default
            onPreferencesChange({
              simplifiedLanguage: false,
              enhancedVisualSupport: false,
              highContrast: false,
              largerText: false
            });
          }}
          variant="outline"
        >
          Herstel standaardinstellingen
        </Button>
      </div>
    </div>
  );
};