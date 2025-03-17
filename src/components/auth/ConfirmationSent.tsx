
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoIcon, RefreshCwIcon, AlertTriangleIcon } from "lucide-react";

interface ConfirmationSentProps {
  email: string;
  onReturn: () => void;
}

const ConfirmationSent = ({ email, onReturn }: ConfirmationSentProps) => {
  // Get the current origin dynamically
  const currentOrigin = window.location.origin;
  const callbackUrl = `${currentOrigin}/auth/callback`;

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
            We've sent a verification link to <strong>{email}</strong>. 
            Please check your inbox (and spam folder) and click the link to complete your registration.
          </AlertDescription>
        </Alert>
        
        <div className="bg-muted p-4 rounded-md text-sm space-y-3">
          <div className="flex items-start gap-2">
            <InfoIcon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <p>
              After clicking the verification link, you'll be redirected to the authentication callback page.
            </p>
          </div>
          
          <div className="flex items-start gap-2">
            <InfoIcon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <p>
              Once verified, you'll be automatically redirected to the dashboard.
            </p>
          </div>
          
          <div className="flex items-start gap-2">
            <AlertTriangleIcon className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p>
              <strong>Important:</strong> Make sure your Supabase project has the correct redirect URL set to <strong>{callbackUrl}</strong> in the authentication settings.
            </p>
          </div>
        </div>
        
        <div className="text-center mt-4">
          <Button variant="outline" onClick={onReturn}>
            Return to Login
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground">
          Didn't receive the email? Check your spam folder.
        </p>
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-2" 
          onClick={() => window.location.reload()}
        >
          <RefreshCwIcon className="h-4 w-4" />
          <span>Refresh the page</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ConfirmationSent;
