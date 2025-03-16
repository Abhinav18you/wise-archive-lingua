
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface ConfirmationSentProps {
  email: string;
  onReturn: () => void;
}

const ConfirmationSent = ({ email, onReturn }: ConfirmationSentProps) => {
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
            Please check your inbox and click the link to complete your registration.
          </AlertDescription>
        </Alert>
        <div className="text-center mt-4">
          <p className="text-sm text-muted-foreground mb-4">
            After clicking the verification link, you'll be redirected to complete your registration.
          </p>
          <Button variant="outline" onClick={onReturn}>
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
};

export default ConfirmationSent;
