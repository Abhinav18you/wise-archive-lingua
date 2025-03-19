
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangleIcon, ArrowLeftIcon, RefreshCwIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ErrorStateProps {
  error: string;
}

const ErrorState = ({ error }: ErrorStateProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangleIcon className="h-16 w-16 text-amber-500" />
          </div>
          <CardTitle className="text-2xl font-semibold text-red-600">Authentication Failed</CardTitle>
        </CardHeader>
        <CardContent className="py-4">
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          
          <div className="mt-6 space-y-2">
            <h3 className="font-medium">Possible causes:</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>The verification link has expired or is invalid</li>
              <li>Your callback URL is not configured in Supabase</li>
              <li>You've already verified your email</li>
              <li>There's a temporary issue with the authentication service</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button 
            onClick={() => navigate("/auth")}
            variant="default"
            className="w-full gap-2"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Return to Sign In
          </Button>
          
          <Button 
            onClick={() => window.location.reload()}
            variant="outline"
            className="w-full gap-2"
          >
            <RefreshCwIcon className="h-4 w-4" />
            Try Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ErrorState;
