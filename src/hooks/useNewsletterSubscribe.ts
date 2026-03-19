"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

// API URL - change this to your server URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const emailSchema = z.string().email("Please enter a valid email address");

export const useNewsletterSubscribe = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const subscribe = async (email: string): Promise<boolean> => {
    const validation = emailSchema.safeParse(email);
    
    if (!validation.success) {
      toast({
        title: "Invalid Email",
        description: validation.error.errors[0].message,
        variant: "destructive",
      });
      return false;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.message?.includes('already subscribed')) {
          toast({
            title: "Already Subscribed",
            description: data.message || "This email is already subscribed to our newsletter.",
          });
        } else {
          toast({
            title: "Subscription Failed",
            description: data.message || "Something went wrong. Please try again later.",
            variant: "destructive",
          });
        }
        return false;
      }

      toast({
        title: "Successfully Subscribed!",
        description: data.message || "Thank you for subscribing to our newsletter.",
      });
      return true;
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      toast({
        title: "Subscription Failed",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { subscribe, isLoading };
};

