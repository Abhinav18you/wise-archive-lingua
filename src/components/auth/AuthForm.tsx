
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { api, handleApiError } from "@/lib/api";
import { AuthFormData } from "@/types";

const AuthForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  
  const [formData, setFormData] = useState<AuthFormData>({
    email: "",
    password: "",
    username: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (authMode === "signup") {
        const { user, error } = await api.auth.signUp(formData);
        if (error) throw error;
        toast.success("Account created successfully!");
        navigate("/dashboard");
      } else {
        const { user, error } = await api.auth.signIn({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
        toast.success("Signed in successfully!");
        navigate("/dashboard");
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

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
