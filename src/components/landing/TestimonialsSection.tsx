
import { useState, useEffect } from 'react';
import { Users, Star } from 'lucide-react';

// Testimonial data
const testimonials = [
  {
    quote: "Memoria has completely transformed how I organize my research. I can find anything in seconds now.",
    author: "Sarah K.",
    role: "Academic Researcher",
    stars: 5
  },
  {
    quote: "The AI assistant feels like having a research partner. It understands context and helps me connect ideas.",
    author: "Michael T.",
    role: "Content Creator",
    stars: 5
  },
  {
    quote: "I've tried many note-taking apps but Memoria's natural language search is on another level.",
    author: "Priya L.",
    role: "Project Manager",
    stars: 4
  }
];

export const TestimonialsSection = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  
  useEffect(() => {
    // Auto rotate testimonials
    const testimonialInterval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(testimonialInterval);
  }, []);

  return (
    <section className="w-full py-24 bg-primary/5 relative overflow-hidden" data-animate>
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-primary/5"></div>
      <div className="absolute inset-0 bg-stripes opacity-10"></div>
      
      <div className="container max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block bg-accent/10 text-accent rounded-full px-4 py-2 text-sm font-medium mb-6 shadow-soft border border-accent/10">
            <Users className="h-4 w-4 inline mr-2" /> User Stories
          </div>
          <h2 className="text-4xl font-bold tracking-tight">
            What our users <span className="text-gradient bg-gradient-to-r from-primary to-accent">are saying</span>
          </h2>
        </div>
        
        <div className="relative h-72 md:h-56 max-w-3xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className={`absolute inset-0 transition-all duration-500 flex flex-col items-center text-center p-8 rounded-2xl glassmorphism ${
                index === activeTestimonial 
                  ? 'opacity-100 translate-y-0 z-10 shadow-soft' 
                  : 'opacity-0 translate-y-8 -z-10'
              }`}
            >
              <div className="mb-2 flex">
                {[...Array(testimonial.stars)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-lg mb-6 italic leading-relaxed">&ldquo;{testimonial.quote}&rdquo;</p>
              <div className="mt-auto">
                <div className="font-semibold text-lg">{testimonial.author}</div>
                <div className="text-sm text-muted-foreground">{testimonial.role}</div>
              </div>
            </div>
          ))}
          
          <div className="absolute -bottom-12 left-0 right-0 flex justify-center gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === activeTestimonial 
                    ? 'bg-primary scale-125' 
                    : 'bg-primary/30'
                }`}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
