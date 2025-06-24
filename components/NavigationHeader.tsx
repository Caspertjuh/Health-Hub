
import React from "react";
import { Button } from "./ui/button";
import { ChevronLeft, Home } from "lucide-react";

interface NavigationHeaderProps {
  title: string;
  showBackButton?: boolean;
  onBack?: () => void;
  onHome?: () => void;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  title,
  showBackButton = false,
  onBack,
  onHome
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        {showBackButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack || (() => {})}
            className="h-10 w-10 rounded-full"
            disabled={!onBack}
          >
            <ChevronLeft size={24} />
          </Button>
        )}
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      
      {onHome && (
        <Button
          variant="outline"
          onClick={onHome}
          className="flex items-center gap-2 h-10"
        >
          <Home size={18} />
          <span>Hoofdmenu</span>
        </Button>
      )}
    </div>
  );
};
