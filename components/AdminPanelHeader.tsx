
import React from "react";
import { Shield, Info } from "lucide-react";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";

export const AdminPanelHeader: React.FC = () => {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Shield size={24} className="text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Beheerdersmodus</h2>
          <p className="text-muted-foreground">
            Hier kunt u gebruikers, activiteiten en systeeminstellingen beheren
          </p>
        </div>
      </div>
      
      <Separator className="my-6" />
      
      <div className="flex items-start gap-3 bg-muted p-4 rounded-md">
        <Info size={20} className="text-primary flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium">Demo-omgeving</p>
          <p className="text-muted-foreground text-sm mt-1">
            Dit is een demo-omgeving voor presentatiedoeleinden. Wijzigingen worden lokaal opgeslagen in de browser.
            Voor een volledige productieversie zou dit verbonden zijn met een backend-database.
          </p>
        </div>
      </div>
    </Card>
  );
};
