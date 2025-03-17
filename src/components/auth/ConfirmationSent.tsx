
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoIcon, RefreshCwIcon, AlertTriangleIcon, LinkIcon, ClipboardCopyIcon } from "lucide-react";
import { toast } from "@/lib/toast";
import { useState } from "react";

interface ConfirmationSentProps {
  email: string;
  onReturn: () => void;
}

const ConfirmationSent = ({ email, onReturn }: ConfirmationSentProps) => {
  // Get the current origin dynamically
  const currentOrigin = window.location.origin;
  const callbackUrl = `${currentOrigin}/auth/callback`;
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(callbackUrl);
    setCopied(true);
    toast.success("Callback URL copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

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
            <div>
              <p className="font-semibold">IMPORTANT: Before proceeding</p>
              <p className="mt-1">
                Make sure your Supabase project has the following URL added to the redirect URLs list in Authentication settings:
              </p>
              <div className="flex items-center gap-2 mt-2 bg-background p-2 rounded border">
                <LinkIcon className="h-4 w-4 text-muted-foreground" />
                <code className="text-xs flex-1 break-all">{callbackUrl}</code>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={copyToClipboard}
                  className="h-8 w-8 p-0 ml-2"
                >
                  {copied ? 
                    <span className="text-primary text-xs">✓</span> : 
                    <ClipboardCopyIcon className="h-4 w-4" />
                  }
                </Button>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Go to Supabase Dashboard → Authentication → URL Configuration → Add the URL above to the "Redirect URLs" section.
              </p>
            </div>
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
