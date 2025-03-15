
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { toast } from "@/components/ui/sonner";
import { ContentType } from "@/types";
import { Link, ArrowLeft } from "lucide-react";

const formSchema = z.object({
  type: z.enum(["link", "text", "image", "video", "file"] as const),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  description: z.string().optional(),
  tags: z.string().optional(),
});

const ContentForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "link",
      title: "",
      content: "",
      description: "",
      tags: "",
    },
  });
  
  const contentType = form.watch("type") as ContentType;
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      // Process tags
      const tags = values.tags ? values.tags.split(",").map(tag => tag.trim()) : [];
      
      const contentData = {
        type: values.type,
        title: values.title,
        content: values.content,
        description: values.description || "",
        tags,
      };
      
      const { content, error } = await api.content.create(contentData);
      
      if (error) throw error;
      
      toast.success("Content saved successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving content:", error);
      toast.error("Failed to save content");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getPlaceholderByType = () => {
    switch (contentType) {
      case "link":
        return "https://example.com";
      case "text":
        return "Enter your text content here...";
      case "image":
        return "https://example.com/image.jpg";
      case "video":
        return "https://youtube.com/watch?v=...";
      case "file":
        return "https://example.com/document.pdf";
      default:
        return "Enter content here...";
    }
  };
  
  const getContentLabel = () => {
    switch (contentType) {
      case "link":
        return "URL";
      case "text":
        return "Text";
      case "image":
        return "Image URL";
      case "video":
        return "Video URL";
      case "file":
        return "File URL";
      default:
        return "Content";
    }
  };
  
  return (
    <div className="animate-fade-in">
      <Button 
        variant="ghost" 
        size="sm" 
        className="mb-6"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
      
      <Card className="max-w-2xl mx-auto glassmorphism animate-scale-in">
        <CardHeader>
          <CardTitle>Add New Content</CardTitle>
          <CardDescription>
            Save links, text, images and more to your personal repository
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select content type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="link">Link</SelectItem>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="image">Image</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="file">File</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Give your content a title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{getContentLabel()}</FormLabel>
                    <FormControl>
                      {contentType === "text" ? (
                        <Textarea 
                          placeholder={getPlaceholderByType()}
                          className="min-h-[150px]" 
                          {...field} 
                        />
                      ) : (
                        <Input placeholder={getPlaceholderByType()} {...field} />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Add a brief description..." 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="work, important, idea (comma separated)" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save Content"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentForm;
