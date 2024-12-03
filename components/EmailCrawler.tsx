"use client";
import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EmailCrawlerProgressProps {
  startupId: string;
}

interface CrawlerStats {
  processedDomains: number;
  totalDomains: number;
  emailsFound: number;
}

export default function EmailCrawlerProgress({ startupId }: EmailCrawlerProgressProps) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [stats, setStats] = useState<CrawlerStats>({
    processedDomains: 0,
    totalDomains: 0,
    emailsFound: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    const crawlEmails = async () => {
      try {
        const response = await fetch('/api/crawlemails', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ startupId })
        });

        if (!response.body) {
          throw new Error('Response body is null');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            // Show success toast when crawling is complete
            toast({
              title: "Email Collection Complete",
              description: `Successfully collected ${stats.emailsFound} email addresses from ${stats.processedDomains} domains.`,
              duration: 5000,
            });
            break;
          }

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                setProgress(data.progress);
                setStats({
                  processedDomains: data.processedDomains,
                  totalDomains: data.totalDomains,
                  emailsFound: data.emailsFound
                });

                // Optional: Show progress toast at certain intervals
                if (data.progress % 25 === 0 && data.progress !== 0) {
                  toast({
                    title: "Progress Update",
                    description: `Processed ${data.processedDomains} of ${data.totalDomains} domains. Found ${data.emailsFound} emails so far.`,
                    duration: 3000,
                  });
                }
              } catch (parseError) {
                console.error('Error parsing SSE data:', parseError);
              }
            }
          }
        }

        setStatus('completed');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(errorMessage);
        setStatus('error');
        
        // Show error toast
        toast({
          variant: "destructive",
          title: "Email Collection Failed",
          description: errorMessage,
          duration: 5000,
        });
      }
    };

    crawlEmails();

    // Cleanup function for when component unmounts
    return () => {
      if (status !== 'completed' && status !== 'error') {
        toast({
          variant: "destructive",
          title: "Email Collection Interrupted",
          description: "The email collection process was interrupted. Please try again.",
          duration: 5000,
        });
      }
    };
  }, [startupId, toast, stats.emailsFound, stats.processedDomains, status]);

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow">
      <div className="space-y-2">
        <Progress value={progress} className="w-full" />
        <div className="text-sm text-gray-500">
          {progress}% Complete
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          {status !== 'completed' && (
            <Loader2 className="h-4 w-4 animate-spin" />
          )}
          <span className="text-sm font-medium">
            Processing {stats.processedDomains} of {stats.totalDomains} domains
          </span>
        </div>
        <div className="text-sm text-gray-500">
          {stats.emailsFound} emails found so far
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}