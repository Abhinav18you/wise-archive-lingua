
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

const LoadingState = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold">Verifying your account...</CardTitle>
          <CardDescription>This may take a few moments</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <Spinner size="lg" />
        </CardContent>
      </Card>
    </div>
  );
};

export default LoadingState;
