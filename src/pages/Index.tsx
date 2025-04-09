import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Database, Search, FileText, Link, Image, Sparkles } from "lucide-react";
const Index = () => {
  const navigate = useNavigate();
  const handleGetStarted = () => {
    console.log("Get Started button clicked, attempting navigation to /auth");
    try {
      navigate("/auth");
      console.log("Navigation to /auth completed");
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };
  return <div className="flex flex-col items-center">
      <section className="py-10 md:py-16 w-full max-w-5xl mx-auto text-center animate-fade-in">
        <div className="space-y-4">
          <div className="inline-block bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium mb-4 animate-slide-up">
            Your Personal Content Repository
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight animate-slide-up" style={{
          animationDelay: "100ms"
        }}>
            Store anything,<br />find it naturally
          </h1>
          <p className="mt-6 text-xl text-muted-foreground max-w-3xl mx-auto animate-slide-up" style={{
          animationDelay: "200ms"
        }}>
            Save links, notes, images, and files. Then find them using natural language instead of rigid keywords.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-10 animate-slide-up" style={{
          animationDelay: "300ms"
        }}>
            <Button size="lg" onClick={handleGetStarted} className="gap-2 text-3xl">
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" onClick={() => {
            // Changed to navigate to the Chat page when Learn More is clicked
            navigate("/chat");
          }} className="gap-2 text-3xl bg-slate-50 rounded-3xl">
              <Sparkles className="h-4 w-4" />
              Try AI Chat
            </Button>
          </div>
        </div>
      </section>
      
      <section className="w-full py-20 bg-gradient-to-b from-background to-muted/50">
        <div className="container max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="order-2 md:order-1 animate-slide-up">
              <div className="inline-block bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium mb-4">
                How It Works
              </div>
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                Save now, find later with AI-powered search
              </h2>
              <p className="text-muted-foreground mb-6">
                Memoria uses advanced AI to understand the content you save and match it with your natural language searches, so you can find exactly what you're looking for without remembering exact keywords.
              </p>
              <Button onClick={() => navigate("/auth")} className="gap-2">
                Try It Now
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="order-1 md:order-2 glassmorphism p-8 rounded-xl animate-scale-in">
              <div className="relative">
                <div className="absolute -top-4 -left-4 bg-primary text-primary-foreground p-3 rounded-lg">
                  <Search className="h-6 w-6" />
                </div>
                <div className="bg-background rounded-lg p-6 shadow-sm">
                  <div className="text-lg font-semibold mb-2">Natural Language Search</div>
                  <p className="text-muted-foreground mb-4">Type searches the way you think:</p>
                  <div className="space-y-2 text-sm">
                    <div className="bg-accent p-2 rounded-md">"That article about AI ethics I saved"</div>
                    <div className="bg-accent p-2 rounded-md">"Photos from my trip to Japan"</div>
                    <div className="bg-accent p-2 rounded-md">"Research papers I saved last month"</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section id="features" className="w-full py-20">
        <div className="container max-w-5xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-block bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium mb-4">
              Key Features
            </div>
            <h2 className="text-3xl font-bold tracking-tight">
              Everything you need to organize your digital life
            </h2>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="glassmorphism rounded-xl p-6 flex flex-col h-full animate-scale-in" style={{
            animationDelay: "100ms"
          }}>
              <div className="bg-primary/10 p-3 rounded-lg w-fit mb-4">
                <Database className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Store Anything</h3>
              <p className="text-muted-foreground flex-grow">
                Save links, text notes, images, videos, and files all in one secure place.
              </p>
            </div>
            
            <div className="glassmorphism rounded-xl p-6 flex flex-col h-full animate-scale-in" style={{
            animationDelay: "200ms"
          }}>
              <div className="bg-primary/10 p-3 rounded-lg w-fit mb-4">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Natural Search</h3>
              <p className="text-muted-foreground flex-grow">
                Find what you need using everyday language instead of exact keywords.
              </p>
            </div>
            
            <div className="glassmorphism rounded-xl p-6 flex flex-col h-full animate-scale-in" style={{
            animationDelay: "300ms"
          }}>
              <div className="bg-primary/10 p-3 rounded-lg w-fit mb-4">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Organized Tags</h3>
              <p className="text-muted-foreground flex-grow">
                Enhance searchability with custom tags and categories for your content.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="w-full py-20 bg-muted/30">
        <div className="container max-w-5xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-block bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium mb-4">
              Save Anything
            </div>
            <h2 className="text-3xl font-bold tracking-tight">
              Multiple content types for all your needs
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-background rounded-xl p-6 text-center shadow-sm animate-scale-in" style={{
            animationDelay: "100ms"
          }}>
              <div className="bg-primary/10 p-4 rounded-full w-fit mx-auto mb-4">
                <Link className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium">Links</h3>
            </div>
            
            <div className="bg-background rounded-xl p-6 text-center shadow-sm animate-scale-in" style={{
            animationDelay: "200ms"
          }}>
              <div className="bg-primary/10 p-4 rounded-full w-fit mx-auto mb-4">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium">Notes</h3>
            </div>
            
            <div className="bg-background rounded-xl p-6 text-center shadow-sm animate-scale-in" style={{
            animationDelay: "300ms"
          }}>
              <div className="bg-primary/10 p-4 rounded-full w-fit mx-auto mb-4">
                <Image className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium">Images</h3>
            </div>
            
            <div className="bg-background rounded-xl p-6 text-center shadow-sm animate-scale-in" style={{
            animationDelay: "400ms"
          }}>
              <div className="bg-primary/10 p-4 rounded-full w-fit mx-auto mb-4">
                <Database className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium">Files</h3>
            </div>
          </div>
        </div>
      </section>
      
      <section className="w-full py-20">
        <div className="container max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-6 animate-fade-in">
            Ready to organize your digital life?
          </h2>
          <p className="text-xl text-muted-foreground mb-10 animate-fade-in" style={{
          animationDelay: "100ms"
        }}>
            Join Memoria today and start saving your content with powerful natural language search.
          </p>
          <Button size="lg" onClick={() => navigate("/auth")} className="animate-scale-in" style={{
          animationDelay: "200ms"
        }}>
            Get Started for Free
          </Button>
        </div>
      </section>
    </div>;
};
export default Index;