"use client"
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Industry, Sector, StartupStage } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Header } from "./Header";
import { useState } from "react";
import { Loader2 } from 'lucide-react';
import { startupFormSchema } from "@/lib/validation";
import { z } from "zod";

// Define the form values type based on the zod schema
type StartupFormValues = z.infer<typeof startupFormSchema>;

export function StartupForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form with validation schema
  const form = useForm<StartupFormValues>({
    resolver: zodResolver(startupFormSchema),
    defaultValues: {
      name: "",
      email: "",
      startupName: "",
      industry: undefined,
      sector: undefined,
      stage: undefined,
      description: "",
      capitalRequired: "",
    },
  });

  const onSubmit = async (values: StartupFormValues) => {
    try {
      setIsLoading(true);
      console.log("1. Starting form submission with values:", values);

      const response = await fetch('/api/startup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      console.log("2. API Response Status:", response.status);
      const data = await response.json();
      console.log("3. API Response Data:", data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit startup information');
      }

      const startupId = data.startup.id;

      toast({
        title: "Success! 🎉",
        description: "Your startup has been analyzed. Redirecting to results...",
      });

      // Redirect to the startup details page
      router.push(`/startup/${startupId}`);
    } catch (error) {
      console.error("Error in form submission:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header/>
      <Card className="max-w-4xl mx-auto my-8">
        <CardHeader>
          <CardTitle className="text-2xl">Startup Information</CardTitle>
          <CardDescription>
            Tell us about your startup to get matched with the right investors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your full name" 
                          {...field} 
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="Enter your email" 
                          {...field} 
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="startupName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Startup Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your startup name" 
                          {...field} 
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormDescription>The official name of your startup</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={isLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an industry" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(Industry).map((industry) => (
                            <SelectItem key={industry} value={industry}>
                              {industry.split('_').map(word => 
                                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                              ).join(' ')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>The primary industry your startup operates in</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sector"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sector</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={isLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a sector" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(Sector).map((sector) => (
                            <SelectItem key={sector} value={sector}>
                              {sector.split('_').map(word => 
                                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                              ).join(' ')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>The specific sector within your industry</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Startup Stage</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={isLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your startup stage" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(StartupStage).map((stage) => (
                            <SelectItem key={stage} value={stage}>
                              {stage.split('_').map(word => 
                                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                              ).join(' ')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>Current stage of your startup</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Startup Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your startup..."
                            className="min-h-[150px]"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormDescription>Provide a compelling description (50-500 characters)</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="capitalRequired"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Capital Required</FormLabel>
                        <FormControl>
                          <Input 
                            type="text" 
                            placeholder="e.g., $500,000" 
                            {...field} 
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormDescription>Amount of funding you&apos;re looking to raise</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6">
                  <Button
                    type="submit"
                    className="w-full md:w-auto min-w-[200px]"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <span>Processing...</span>
                      </div>
                    ) : (
                      'Submit and Analyze'
                    )}
                  </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}

