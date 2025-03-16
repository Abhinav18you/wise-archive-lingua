
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthFormData } from "@/types";

interface SignUpFormProps {
  formData: AuthFormData;
  loading: boolean;
  authError: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onSwitchMode: () => void;
}

const SignUpForm = ({ 
  formData, 
  loading, 
  authError, 
  onChange, 
  onSubmit,
  onSwitchMode 
}: SignUpFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {authError && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{authError}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input 
          id="username"
          name="username"
          placeholder="johndoe"
          value={formData.username}
          onChange={onChange}
          required
          className="transition-all duration-200"
        />
      </div>
      
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
        <Label htmlFor="password">Password</Label>
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
        {loading ? "Processing..." : "Create Account"}
      </Button>

      <div className="text-sm text-muted-foreground text-center w-full mt-2">
        <p>
          Already have an account?{" "}
          <button 
            type="button"
            className="text-primary underline-offset-4 hover:underline transition-all"
            onClick={onSwitchMode}
          >
            Sign in
          </button>
        </p>
      </div>
    </form>
  );
};

export default SignUpForm;
