/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Mail, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Dynamically import the markdown editor to avoid SSR issues
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
);

// Define the props interface
interface StartupData {
  id: string;
  name: string;
  industry: string;
  description: string;
  capital: number;
  sector: string;
  stage: string;
}

interface EmailComposerProps {
  startupId: string;
  startupData: StartupData;
}

// Form validation schemas
const emailFormSchema = z.object({
  senderEmail: z.string().email('Please enter a valid email address'),
});

const emailContentSchema = z.object({
  content: z.string().min(1, 'Email content is required'),
});

type EmailFormValues = z.infer<typeof emailFormSchema>;
type EmailContentValues = z.infer<typeof emailContentSchema>;

type EmailStatus = 'idle' | 'verificationSent' | 'sending' | 'sent' | 'error';

export default function EmailComposer({ startupId, startupData }: EmailComposerProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [emailStatus, setEmailStatus] = useState<EmailStatus>('idle');
  const { toast } = useToast();

  // Initialize forms for each step
  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      senderEmail: '',
    },
  });

  const contentForm = useForm<EmailContentValues>({
    resolver: zodResolver(emailContentSchema),
    defaultValues: {
      content: '',
    },
  });

  const handleGenerateEmail = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/generateEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startupName: startupData.name,
          industry: startupData.industry,
          description: startupData.description,
          capital: startupData.capital,
        }),
      });
      
      if (!response.ok) throw new Error('Failed to generate email content');
      
      const data = await response.json();
      contentForm.setValue('content', data.content);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate email content',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const onEmailSubmit = (values: EmailFormValues) => {
    setStep(2);
  };

  // Update the onContentSubmit function in EmailComposer.tsx
const onContentSubmit = async (values: EmailContentValues) => {
  setLoading(true);
  setEmailStatus('sending');
  try {
    const response = await fetch('/api/sendcampaign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        startupId,
        senderEmail: emailForm.getValues('senderEmail'),
        content: values.content,
        subject: `Investment Opportunity: ${startupData.name}`,
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to initiate email campaign');
    }

    console.log("Campaign creation response:", data); // Debug log

    if (data.success) {
      setEmailStatus('verificationSent');
      if (data.redirectUrl) {
        // Optional: Open in new tab
        window.open(data.redirectUrl, '_blank');
      }
      toast({
        title: 'Verification Email Sent',
        description: 'Please check your email to verify and send the campaign. You can also use the verification link in your browser.',
      });
    } else {
      throw new Error(data.error || 'Unknown error occurred');
    }
    
  } catch (error) {
    console.error("Campaign error:", error);
    setEmailStatus('error');
    toast({
      title: 'Error',
      description: error instanceof Error ? error.message : 'Failed to send email campaign',
      variant: 'destructive',
    });
  } finally {
    setLoading(false);
  }
};

  const getStatusMessage = () => {
    switch (emailStatus) {
      case 'verificationSent':
        return (
          <Alert className="mt-4">
            <AlertDescription>
              A verification email has been sent to your inbox. Please check your email to complete sending the campaign.
            </AlertDescription>
          </Alert>
        );
      case 'sending':
        return (
          <Alert className="mt-4">
            <AlertDescription>
              Preparing your email campaign...
            </AlertDescription>
          </Alert>
        );
      case 'sent':
        return (
          <Alert className="mt-4">
            <AlertDescription>
              Email campaign has been sent successfully!
            </AlertDescription>
          </Alert>
        );
      case 'error':
        return (
          <Alert className="mt-4" variant="destructive">
            <AlertDescription>
              There was an error sending your campaign. Please try again.
            </AlertDescription>
          </Alert>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <Button 
        onClick={() => setOpen(true)}
        className="flex items-center gap-2"
      >
        <Mail className="w-4 h-4" />
        Connect with Investors
      </Button>

      <Dialog 
        open={open} 
        onOpenChange={(newOpen) => {
          if (!newOpen) {
            setEmailStatus('idle');
            setStep(1);
          }
          setOpen(newOpen);
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {step === 1 ? 'Enter Your Email' : 'Compose Email Campaign'}
            </DialogTitle>
            <DialogDescription>
              {step === 1 
                ? 'This email will be used as the sender address for the campaign.'
                : 'Review and customize the AI-generated email content before sending.'}
            </DialogDescription>
          </DialogHeader>

          {step === 1 ? (
            <Form {...emailForm}>
              <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
                <FormField
                  control={emailForm.control}
                  name="senderEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={loading}>
                  Continue
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...contentForm}>
              <form onSubmit={contentForm.handleSubmit(onContentSubmit)} className="space-y-4">
                <FormField
                  control={contentForm.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Content</FormLabel>
                      <FormControl>
                        <div data-color-mode="light">
                          <Controller
                            name="content"
                            control={contentForm.control}
                            render={({ field }) => (
                              <MDEditor
                                value={field.value}
                                onChange={(value) => field.onChange(value || '')}
                                preview="edit"
                                height={400}
                                className="w-full"
                              />
                            )}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-4">
                  <Button
                    type="button"
                    onClick={handleGenerateEmail}
                    variant="outline"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      'Generate Email'
                    )}
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading || emailStatus === 'verificationSent'}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send Campaign'
                    )}
                  </Button>
                </div>

                {getStatusMessage()}
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}