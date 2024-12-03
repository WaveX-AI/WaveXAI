/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  CheckCircle2, 
  XCircle,
  Loader2, 
  ArrowRight, 
  MailCheck,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

interface Investor {
  email: string;
  vcName: string;
}

interface CampaignStatus {
  status: 'loading' | 'success' | 'error' | 'ready';
  message?: string;
  recipientCount?: number;
  emailData?: {
    subject: string;
    content: string;
    senderEmail: string;
    investors: Investor[];
  };
}

export default function VerifySuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifySuccessContent />
    </Suspense>
  );
}

function VerifySuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const campaignId = searchParams.get('id');
  const token = searchParams.get('token');
  const [status, setStatus] = useState<CampaignStatus>({ 
    status: 'loading' 
  });
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const verifyCampaign = async () => {
      if (!campaignId || !token) {
        setStatus({ 
          status: 'error', 
          message: 'Invalid campaign ID or token' 
        });
        return;
      }

      try {
        const response = await fetch(`/api/verifycampaign?token=${token}&campaignId=${campaignId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Verification failed');
        }

        setStatus({ 
          status: 'ready',
          recipientCount: data.recipientCount,
          message: 'Campaign verified successfully. Click below to start sending emails.',
          emailData: {
            subject: data.campaign.subject,
            content: data.campaign.content,
            senderEmail: data.campaign.senderEmail,
            investors: data.investors
          }
        });
      } catch (error) {
        setStatus({ 
          status: 'error', 
          message: error instanceof Error ? error.message : 'Failed to verify campaign'
        });
      }
    };

    verifyCampaign();
  }, [campaignId, token]);

  const sendEmails = async () => {
    if (!status.emailData) return;

    try {
      setStatus(prev => ({
        ...prev,
        status: 'loading',
        message: 'Sending emails...'
      }));

      const response = await fetch('/api/sendEmails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId,
          senderEmail: status.emailData.senderEmail
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send emails');
      }

      setStatus(prev => ({
        ...prev,
        status: 'success',
        message: `Successfully sent ${data.summary.sent} emails! Failed: ${data.summary.failed}`
      }));

    } catch (error) {
      setStatus(prev => ({
        ...prev,
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to send emails'
      }));
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md ">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-4">
            {status.status === 'loading' && (
              <>
                <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
                <h2 className="text-2xl font-semibold">Verifying Campaign</h2>
                <p className="text-gray-500">
                  Please wait while we verify your campaign...
                </p>
              </>
            )}

            {status.status === 'ready' && (
              <>
                <Send className="h-12 w-12 text-blue-500" />
                <h2 className="text-2xl font-semibold text-blue-700">
                  Ready to Send
                </h2>
                <p className="text-gray-600">
                  {status.emailData?.investors.length} emails ready to send.
                </p>
                <p className="text-gray-500">
                  {currentIndex} of {status.emailData?.investors.length} emails initiated
                </p>
                {status.status === 'ready' && (
                    <Button 
                        onClick={sendEmails}
                        className="mt-4"
                        disabled={!status.emailData}
                    >
                        Send All Emails ({status.emailData?.investors.length} recipients)
                    </Button>
                    )}
              </>
            )}

            {status.status === 'success' && (
              <>
                <div className="relative">
                  <CheckCircle2 className="h-12 w-12 text-green-500" />
                  <MailCheck className="h-6 w-6 text-green-400 absolute -right-1 -bottom-1" />
                </div>
                <h2 className="text-2xl font-semibold text-green-700">
                  Campaign Completed!
                </h2>
                <p className="text-gray-600">
                  All {status.emailData?.investors.length} emails have been initiated.
                </p>
              </>
            )}

            {status.status === 'error' && (
              <>
                <XCircle className="h-12 w-12 text-red-500" />
                <h2 className="text-2xl font-semibold text-red-700">
                  Something Went Wrong
                </h2>
                <p className="text-gray-600">
                  {status.message || 'Failed to verify campaign'}
                </p>
              </>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-center pb-6">
          <Link href="/dashboard">
            <Button className="gap-2">
              Return to Dashboard
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}