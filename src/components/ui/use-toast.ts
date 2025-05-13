
import { useToast as useShadcnToast } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";

// Re-export both toast systems for consistent usage throughout the app
export const useToast = useShadcnToast;
export const toast = sonnerToast;
