import React, { useEffect, ReactNode } from "react";
import {
  UserProvider,
  useUser,
} from "./contexts/EnhancedUserContext";
import { ScheduleProvider } from "./contexts/EnhancedScheduleContext";
import { EnhancedUserSelector } from "./components/EnhancedUserSelector";
import { DailySchedule } from "./components/DailySchedule";
import { ThemeSwitcher } from "./components/ThemeSwitcher";
import { AdminPanelAccess } from "./components/AdminPanelAccess";
import { Toaster } from "sonner@2.0.3";

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

// Error Boundary component to catch and display errors
function ErrorFallback({
  error,
  resetErrorBoundary,
}: ErrorFallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="bg-card border rounded-lg p-6 max-w-md w-full shadow-md">
        <h2 className="text-2xl font-bold text-destructive mb-4">
          Er is een fout opgetreden
        </h2>
        <p className="mb-4 text-muted-foreground">
          Er is een probleem opgetreden bij het laden van de
          applicatie.
        </p>
        <div className="bg-muted p-3 rounded-md mb-4 overflow-auto">
          <p className="whitespace-pre-wrap text-sm">
            {error.message}
          </p>
        </div>
        <button
          onClick={resetErrorBoundary}
          className="bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90"
        >
          Probeer opnieuw
        </button>
      </div>
    </div>
  );
}

interface ErrorBoundaryWrapperProps {
  children: ReactNode;
}

interface ErrorBoundaryWrapperState {
  hasError: boolean;
  error: Error | null;
}

// Simple wrapper to catch errors
class ErrorBoundaryWrapper extends React.Component<
  ErrorBoundaryWrapperProps,
  ErrorBoundaryWrapperState
> {
  constructor(props: ErrorBoundaryWrapperProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(
    error: Error,
  ): ErrorBoundaryWrapperState {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <ErrorFallback
          error={this.state.error}
          resetErrorBoundary={() =>
            this.setState({ hasError: false, error: null })
          }
        />
      );
    }

    return this.props.children;
  }
}

// MainApp component that uses the context
const MainApp = () => {
  const { currentUser, isAdmin } = useUser();

  // Set up viewport meta tag for better touch support
  useEffect(() => {
    // This helps ensure the app works well on touch devices
    const viewportMeta = document.createElement("meta");
    viewportMeta.name = "viewport";
    viewportMeta.content =
      "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
    document.head.appendChild(viewportMeta);

    // Add touch-action CSS for better touch response
    const style = document.createElement("style");
    style.textContent = `
      * {
        touch-action: manipulation;
      }
      button, a, [role="button"] {
        cursor: pointer;
        min-height: 44px; /* Minimum touch target size */
      }
      .touch-target {
        min-width: 44px;
        min-height: 44px;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(viewportMeta);
      document.head.removeChild(style);
    };
  }, []);

  // Project info message
  useEffect(() => {
    console.log(
      "%cDagplanning Applicatie voor Dagbesteding",
      "color: #3b82f6; font-size: 20px; font-weight: bold;",
    );
    console.log(
      "%cAangepast voor gebruikers met verstandelijke beperkingen",
      "color: #6b7280; font-size: 14px;",
    );
    console.log(
      "%cOntwikkeld door: Jesse Hummel, Remco Pruim, Tjitte Timmerman, Casper Oudman",
      "color: #6b7280; font-size: 14px;",
    );
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {isAdmin ? (
        // Show admin panel if in admin mode
        <AdminPanelAccess />
      ) : // Otherwise show normal app view
      currentUser ? (
        <DailySchedule />
      ) : (
        <EnhancedUserSelector />
      )}
      <ThemeSwitcher />
      {!isAdmin && <AdminPanelAccess />}{" "}
      {/* Always show admin access button unless already in admin mode */}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            fontSize: "16px",
            padding: "16px",
            borderRadius: "8px",
          },
          duration: 4000,
        }}
      />
    </div>
  );
};

// Root App component that provides the context
export default function App() {
  return (
    <ErrorBoundaryWrapper>
      <UserProvider>
        <ScheduleProvider>
          <MainApp />
        </ScheduleProvider>
      </UserProvider>
    </ErrorBoundaryWrapper>
  );
}