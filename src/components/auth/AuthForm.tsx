
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Spinner } from "@/components/ui/spinner";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import ConfirmationSent from "./ConfirmationSent";

const AuthForm = () => {
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  
  const {
    formData,
    loading,
    authError,
    checkingSession,
    confirmationSent,
    setConfirmationSent,
    handleChange,
    handleSignUp,
    handleSignIn,
    setAuthError
  } = useAuth();

  // Clear any error when changing auth mode
  const handleModeChange = (mode: "signin" | "signup") => {
    setAuthMode(mode);
    setAuthError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === "signup") {
      await handleSignUp();
    } else {
      await handleSignIn();
    }
  };

  if (checkingSession) {
    return (
      <div className="flex justify-center items-center h-40">
        <Spinner size="lg" />
      </div>
    );
  }

  if (confirmationSent) {
    return (
      <ConfirmationSent 
        email={formData.email}
        onReturn={() => setConfirmationSent(false)}
      />
    );
  }

  return (
    <div className="flex justify-center items-center w-full animate-fade-in">
      <Card className="w-full max-w-md glassmorphism animate-scale-in">
        <Tabs value={authMode} onValueChange={(value) => handleModeChange(value as "signin" | "signup")}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-semibold text-center">
                {authMode === "signin" ? "Welcome Back" : "Create Account"}
              </CardTitle>
              <TabsList className="grid w-full max-w-[200px] grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
            </div>
            <CardDescription className="text-center pt-2">
              {authMode === "signin" 
                ? "Enter your credentials to access your account" 
                : "Create a new account to get started"}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <TabsContent value="signin">
              <SignInForm 
                formData={formData}
                loading={loading}
                authError={authError}
                onChange={handleChange}
                onSubmit={handleSubmit}
                onSwitchMode={() => handleModeChange("signup")}
              />
            </TabsContent>
            
            <TabsContent value="signup">
              <SignUpForm 
                formData={formData}
                loading={loading}
                authError={authError}
                onChange={handleChange}
                onSubmit={handleSubmit}
                onSwitchMode={() => handleModeChange("signin")}
              />
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default AuthForm;
