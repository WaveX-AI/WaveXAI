"use client"
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Mail } from "lucide-react";
import type { StatusMessage } from '@/types';

const NewsletterSection = () => {
  const [email, setEmail] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [status, setStatus] = useState<StatusMessage>({ type: '', message: '' });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setStatus({ type: '', message: '' });
    
    try {
      console.log('Submitting email:', email);
      
      const response = await fetch('/api/saveemail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();

      if (response.ok) {
        setStatus({ 
          type: 'success', 
          message: data.message || 'Thank you for joining our community!' 
        });
        setEmail('');
      } else {
        throw new Error(data.error || 'Failed to subscribe');
      }
    } catch (error) {
      console.error('Error details:', error);
      setStatus({ 
        type: 'error', 
        message: error instanceof Error ? error.message : 'Something went wrong. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
      // Clear status message after 5 seconds
      if (status.type === 'success') {
        setTimeout(() => setStatus({ type: '', message: '' }), 5000);
      }
    }
  };

  return (
    <section className="py-20 dark border-t ">
      <div className="max-w-7xl mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-6">
            <Mail className="w-8 h-8 text-purple-600" />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Join Our Startup Community
          </h2>
          
          <p className="text-lg text-gray-300 mb-8">
            Get exclusive insights, funding opportunities, and expert advice delivered straight to your inbox.
          </p>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-grow"
              />
              <Button 
                type="submit" 
                className="bg-purple-600 hover:bg-purple-700 whitespace-nowrap text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Joining...
                  </>
                ) : (
                  'Join Now'
                )}
              </Button>
            </div>
          </form>

          {status.message && (
            <div className={`mt-4 text-sm ${
              status.type === 'success' ? 'text-green-600' : 'text-red-600'
            }`}>
              {status.message}
            </div>
          )}

          <p className="mt-4 text-sm text-gray-300">
            Join over 1,000+ founders who already trust us with their startup journey. 
            We respect your privacy and never share your information.
          </p>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;