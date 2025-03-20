
import ContentForm from "@/components/content/ContentForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

const Add = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Alert className="mb-6 bg-blue-50 border-blue-200">
        <InfoIcon className="h-5 w-5 text-blue-500" />
        <AlertDescription className="text-blue-700">
          Save your content to access it from any device when signed in.
        </AlertDescription>
      </Alert>
      <ContentForm />
    </div>
  );
};

export default Add;
