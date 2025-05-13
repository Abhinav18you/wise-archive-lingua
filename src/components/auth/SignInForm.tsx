
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthFormData } from "@/types";
import { useState } from "react";

interface SignInFormProps {
  formData: AuthFormData;
  loading: boolean;
  authError: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onSwitchMode: () => void;
  onForgotPassword: (email: string) => void;
}

const SignInForm = ({ 
  formData, 
  loading, 
  authError, 
  onChange, 
  onSubmit,
  onSwitchMode,
  onForgotPassword
}: SignInFormProps) => {
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  
  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.email) {
      onForgotPassword(formData.email);
    }
  };
  
  return (
    <>
      {!forgotPasswordMode ? (
        <form onSubmit={onSubmit} className="space-y-5">
          {authError && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{authError}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email"
              type="email"
              name="email"
              placeholder="example@email.com"
              value={formData.email}
              onChange={onChange}
              required
              className="transition-all duration-200"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <button 
                type="button" 
                onClick={() => setForgotPasswordMode(true)}
                className="text-xs text-primary hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <Input 
              id="password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={onChange}
              required
              className="transition-all duration-200"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full mt-6"
            disabled={loading}
          >
            {loading ? "Processing..." : "Sign In"}
          </Button>

          <div className="text-sm text-muted-foreground text-center w-full mt-2">
            <p>
              Don't have an account?{" "}
              <button 
                type="button"
                className="text-primary underline-offset-4 hover:underline transition-all"
                onClick={onSwitchMode}
              >
                Sign up
              </button>
            </p>
          </div>
        </form>
      ) : (
        <div className="space-y-5">
          {authError && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{authError}</AlertDescription>
            </Alert>
          )}
          
          <div className="text-center mb-4">
            <h3 className="text-lg font-medium">Reset your password</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>
          
          <form onSubmit={handleForgotPassword}>
            <div className="space-y-2">
              <Label htmlFor="reset-email">Email</Label>
              <Input 
                id="reset-email"
                type="email"
                name="email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={onChange}
                required
                className="transition-all duration-200"
              />
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1"
                onClick={() => setForgotPasswordMode(false)}
              >
                Back
              </Button>
              <Button 
                type="submit" 
                className="flex-1"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default SignInForm;
