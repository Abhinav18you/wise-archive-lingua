import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/lib/toast";
import { signUpWithEmail, signInWithEmail, getSession } from "@/lib/auth";
import { AuthFormData } from "@/types";
import { Spinner } from "@/components/ui/spinner";

const AuthForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [confirmationSent, setConfirmationSent] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  
  const [formData, setFormData] = useState<AuthFormData>({
    email: "",
    password: "",
    username: "",
  });

  useEffect(() => {
    // Clear any error when changing auth mode
    setAuthError(null);
    setConfirmationSent(false);
  }, [authMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError(null);

    try {
      if (authMode === "signup") {
        const { error } = await signUpWithEmail(
          formData.email,
          formData.password,
          formData.username
        );
        
        if (error) throw error;
        
        // For Supabase, the user typically needs to confirm their email
        setConfirmationSent(true);
        toast.success("Verification email sent! Please check your inbox.");
      } else {
        const { error } = await signInWithEmail(
          formData.email,
          formData.password
        );
        
        if (error) throw error;
        
        toast.success("Signed in successfully!");
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      setAuthError(error.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Check if user is already logged in
  useEffect(() => {
    const checkAuthSession = async () => {
      setCheckingSession(true);
      const { session } = await getSession();
      if (session) {
        navigate("/dashboard");
      }
      setCheckingSession(false);
    };
    
    checkAuthSession();
  }, [navigate]);

  if (checkingSession) {
    return (
      <div className="flex justify-center items-center h-40">
        <Spinner size="lg" />
      </div>
    );
  }

  if (confirmationSent) {
    return (
      <Card className="w-full max-w-md glassmorphism animate-scale-in">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">Email Verification Sent</CardTitle>
          <CardDescription className="text-center pt-2">
            Please check your email to confirm your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              We've sent a verification link to <strong>{formData.email}</strong>. 
              Please check your inbox and click the link to complete your registration.
            </AlertDescription>
          </Alert>
          <div className="text-center mt-4">
            <p className="text-sm text-muted-foreground mb-4">
              After clicking the verification link, you'll be redirected to complete your registration.
            </p>
            <Button variant="outline" onClick={() => setConfirmationSent(false)}>
              Return to Login
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Didn't receive the email? Check your spam folder or try again.
          </p>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="flex justify-center items-center w-full animate-fade-in">
      <Card className="w-full max-w-md glassmorphism animate-scale-in">
        <Tabs value={authMode} onValueChange={(value) => setAuthMode(value as "signin" | "signup")}>
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
            {authError && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{authError}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <TabsContent value="signup" className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input 
                    id="username"
                    name="username"
                    placeholder="johndoe"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="transition-all duration-200"
                  />
                </div>
              </TabsContent>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email"
                  type="email"
                  name="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="transition-all duration-200"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="transition-all duration-200"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full mt-6"
                disabled={loading}
              >
                {loading ? 
                  "Processing..." : 
                  authMode === "signin" ? "Sign In" : "Create Account"
                }
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-muted-foreground text-center w-full mt-2">
              {authMode === "signin" ? (
                <p>
                  Don't have an account?{" "}
                  <button 
                    type="button"
                    className="text-primary underline-offset-4 hover:underline transition-all"
                    onClick={() => setAuthMode("signup")}
                  >
                    Sign up
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{" "}
                  <button 
                    type="button"
                    className="text-primary underline-offset-4 hover:underline transition-all"
                    onClick={() => setAuthMode("signin")}
                  >
                    Sign in
                  </button>
                </p>
              )}
            </div>
          </CardFooter>
        </Tabs>
      </Card>
    </div>
  );
};

export default AuthForm;
