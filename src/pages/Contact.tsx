import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Send, Calendar, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const services = [
  "Website Development",
  "E-commerce",
  "UI/UX Design",
  "SEO Optimization",
  "Brand Strategy",
  "Content Marketing",
];

const budgetRanges = [
  "Under KSh 40,000",
  "KSh 40,000 - KSh 80,000",
  "KSh 80,000 - KSh 100,000",
  "KSh 100,000+",
];

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    company: "",
    services: [] as string[],
    budget: "",
    message: "",
    consent: false,
  });

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Format services and budget for submission
    const servicesText = formData.services.join(", ");
    
    // Create FormData for FormSubmit
    const formElement = e.target as HTMLFormElement;
    const formDataToSubmit = new FormData(formElement);
    
    // Add FormSubmit specific fields
    formDataToSubmit.append("_subject", "New Contact Form Submission - Kreative Creations");
    formDataToSubmit.append("_replyto", formData.email);
    formDataToSubmit.append("_next", window.location.origin + "/contact?success=true");
    formDataToSubmit.append("_template", "table");
    formDataToSubmit.append("services", servicesText);
    formDataToSubmit.append("budget", formData.budget);
    formDataToSubmit.append("consent", formData.consent ? "Yes" : "No");
    
    // Submit to FormSubmit
    try {
      const response = await fetch("https://formsubmit.co/d5f27201196224a39e1c37a29561b232", {
        method: "POST",
        body: formDataToSubmit,
      });
      
      if (response.ok) {
        toast({
          title: "Message Sent!",
          description: "We'll get back to you within 24 hours.",
        });
        
        setFormData({
          name: "",
          email: "",
          phoneNumber: "",
          company: "",
          services: [],
          budget: "",
          message: "",
          consent: false,
        });
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsSubmitting(false);
  };

  return (
    <main className="pt-20">
      {/* Hero */}
      <section className="section-padding bg-slate-dark text-primary-foreground">
        <div className="container-tight">
          <div className="max-w-3xl">
            <span className="text-coral font-semibold text-sm uppercase tracking-wider">Get in Touch</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6">
              Let's Build Something <span className="text-gradient">Amazing</span>
            </h1>
            <p className="text-xl text-primary-foreground/80 leading-relaxed">
              Ready to start your project? Tell us about your vision and we'll help make it a reality.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="section-padding bg-background">
        <div className="container-tight">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Your Name *</label>
                    <Input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                      className="h-12"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address *</label>
                    <Input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@company.com"
                      className="h-12"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number *</label>
                    <Input
                      required
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      placeholder="+254 7XX XXX XXX"
                      className="h-12"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Company Name</label>
                  <Input
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Your Company"
                    className="h-12"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-4">Services You're Interested In</label>
                  <div className="flex flex-wrap gap-2">
                    {services.map((service) => (
                      <button
                        key={service}
                        type="button"
                        onClick={() => handleServiceToggle(service)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          formData.services.includes(service)
                            ? "bg-coral text-accent-foreground"
                            : "bg-secondary text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {formData.services.includes(service) && (
                          <CheckCircle2 className="w-4 h-4 inline mr-1" />
                        )}
                        {service}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-4">Project Budget</label>
                  <div className="flex flex-wrap gap-2">
                    {budgetRanges.map((budget) => (
                      <button
                        key={budget}
                        type="button"
                        onClick={() => setFormData({ ...formData, budget })}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          formData.budget === budget
                            ? "bg-coral text-accent-foreground"
                            : "bg-secondary text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {budget}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Tell Us About Your Project *</label>
                  <Textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your project, goals, and timeline..."
                    rows={6}
                  />
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="consent"
                    required
                    checked={formData.consent}
                    onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                    className="mt-1 w-5 h-5 rounded border-gray-300 text-coral focus:ring-coral"
                  />
                  <label htmlFor="consent" className="text-sm text-muted-foreground">
                    I consent to my information being used to contact me regarding my inquiry. 
                    My data will be processed and stored securely in accordance with the Data Protection Act 
                    and will only be used for the purpose of responding to my request.
                  </label>
                </div>

                <Button
                  type="submit" 
                  variant="coral" 
                  size="xl" 
                  disabled={isSubmitting}
                  className="w-full md:w-auto"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                  <Send className="w-5 h-5 ml-2" />
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div className="bg-secondary rounded-2xl p-8">
                <h3 className="text-xl font-bold mb-6">Contact Information</h3>
                <ul className="space-y-6">
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-coral/20 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-coral" />
                    </div>
                    <div>
                      <p className="font-medium">Email</p>
                      <a href="mailto:hello@kreativecreations.co.ke" className="text-muted-foreground hover:text-coral transition-colors">
                        hello@kreativecreations.co.ke
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-coral/20 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-coral" />
                    </div>
                    <div>
                      <p className="font-medium">Phone</p>
                      <a href="tel:+254743653115" className="text-muted-foreground hover:text-coral transition-colors">
                        +2547 43 653 115
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-coral/20 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-coral" />
                    </div>
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-muted-foreground">
                        Kahawa Sukari, Thika Road<br />
                        Nairobi, Kenya
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-hero text-primary-foreground rounded-2xl p-8">
                <div className="w-12 h-12 rounded-xl bg-primary-foreground/10 flex items-center justify-center mb-6">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-4">Schedule a Call</h3>
                <p className="text-primary-foreground/80 mb-6">
                  Prefer to talk? Book a free 30-minute strategy call with our team.
                </p>
                <Button variant="hero" className="w-full">
                  Book a Call
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-secondary">
        <div className="container-tight">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                q: "What's your typical project timeline?",
                a: "Most website projects take 4-8 weeks from kickoff to launch, depending on complexity. We'll provide a detailed timeline during our initial consultation.",
              },
              {
                q: "Do you offer ongoing support?",
                a: "Yes! We offer various maintenance and support packages to keep your site running smoothly, secure, and up-to-date.",
              },
              {
                q: "What technologies do you use?",
                a: "We work with modern technologies including React, Next.js, WordPress, Shopify, and custom solutions tailored to your needs.",
              },
              {
                q: "How do you handle project communication?",
                a: "We use Slack for real-time communication, weekly video calls for updates, and project management tools to keep everything organized.",
              },
            ].map((faq) => (
              <div key={faq.q} className="bg-card rounded-2xl p-6 shadow-soft">
                <h4 className="font-bold mb-2">{faq.q}</h4>
                <p className="text-muted-foreground text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
