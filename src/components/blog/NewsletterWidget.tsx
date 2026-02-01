import { useState } from "react";
import { Mail, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface NewsletterWidgetProps {
  title?: string;
  description?: string;
  variant?: "default" | "compact";
}

const NewsletterWidget = ({
  title = "Stay Updated",
  description = "Get the latest insights delivered to your inbox.",
  variant = "default",
}: NewsletterWidgetProps) => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubscribed(true);
    setIsLoading(false);
    setEmail("");
  };

  if (variant === "compact") {
    return (
      <div className="bg-gradient-hero rounded-2xl p-6 text-primary-foreground">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-1">{title}</h3>
            <p className="text-primary-foreground/80 text-sm mb-4">
              {description}
            </p>

            {isSubscribed ? (
              <div className="flex items-center gap-2 text-green-300">
                <Check className="w-5 h-5" />
                <span className="text-sm font-medium">Thanks for subscribing!</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/10 border-white/20 text-primary-foreground placeholder:text-primary-foreground/50"
                  required
                />
                <Button
                  type="submit"
                  variant="secondary"
                  size="icon"
                  disabled={isLoading}
                  className="flex-shrink-0"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-hero rounded-2xl p-8 text-primary-foreground">
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4">
          <Mail className="w-7 h-7" />
        </div>
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <p className="text-primary-foreground/80 mb-6 max-w-sm mx-auto">
          {description}
        </p>

        {isSubscribed ? (
          <div className="flex items-center justify-center gap-2 text-green-300 bg-white/10 rounded-lg p-4">
            <Check className="w-5 h-5" />
            <span className="font-medium">
              Thanks for subscribing! Check your inbox.
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-white/20 text-primary-foreground placeholder:text-primary-foreground/50 h-11"
                required
              />
              <Button
                type="submit"
                variant="secondary"
                disabled={isLoading}
                className="h-11 px-6"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  "Subscribe"
                )}
              </Button>
            </div>
            <p className="text-xs text-primary-foreground/60 mt-3">
              No spam, unsubscribe at any time.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default NewsletterWidget;

