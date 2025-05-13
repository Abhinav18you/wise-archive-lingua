
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeftIcon } from "lucide-react";

interface ForgotPasswordFormProps {
  loading: boolean;
  authError: string | null;
  onSubmit: (email: string) => void;
  onCancel: () => void;
}

const ForgotPasswordForm = ({ loading, authError, onSubmit, onCancel }: ForgotPasswordFormProps) => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email);
  };

  return (
    <Card className="w-full max-w-md glassmorphism animate-scale-in">
      <CardHeader>
        <div className="flex items-center gap-2 mb-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onCancel} 
            className="h-8 w-8 p-0"
          >
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
          <CardTitle className="text-2xl font-semibold">Reset Password</CardTitle>
        </div>
        <CardDescription>
          Enter your email address and we'll send you a link to reset your password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {authError && (
            <Alert variant="destructive">
              <AlertDescription>{authError}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="transition-all duration-200"
              disabled={loading}
            />
          </div>
          
          <div className="pt-2">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-4 text-sm text-muted-foreground">
        Remember your password? <Button variant="link" onClick={onCancel} className="p-0 ml-1 h-auto">Back to sign in</Button>
      </CardFooter>
    </Card>
  );
};

export default ForgotPasswordForm;
