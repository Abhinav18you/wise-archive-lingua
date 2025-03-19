
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircleIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SuccessState = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircleIcon className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-semibold">Authentication Successful!</CardTitle>
          <CardDescription>You have successfully verified your account</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-4">
          <p>Redirecting you to your dashboard...</p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button 
            onClick={() => navigate("/dashboard", { replace: true })}
            className="gap-2"
          >
            Go to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SuccessState;
