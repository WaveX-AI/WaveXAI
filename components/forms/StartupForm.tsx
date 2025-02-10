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

type StartupFormValues = z.infer<typeof startupFormSchema>;

export function StartupForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

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
        throw new Error(data.error || data.details || 'Failed to submit startup information');
      }

      if (!data.startup?.id) {
        throw new Error('Invalid response format: missing startup ID');
      }

      toast({
        title: "Startup Created! 🎉",
        description: "Your startup has been registered. The AI analysis is processing and results will be available shortly.",
      });

      // Redirect to the startup details page
      router.push(`/dashboard/startup/${data.startup.id}`);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
    <Header/>
    <Card className="max-w-4xl mx-auto my-8 backdrop-blur-xl bg-slate-900/50 border-none shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
          Startup Information
        </CardTitle>
        <CardDescription className="text-slate-400">
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
                    <FormLabel className="text-slate-300">Your Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your full name" 
                        className="bg-slate-800/50 border-slate-700 text-slate-200 placeholder:text-slate-500
                                 focus:border-primary focus:ring-primary"
                        {...field} 
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
  
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Email Address</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="Enter your email"
                        className="bg-slate-800/50 border-slate-700 text-slate-200 placeholder:text-slate-500
                                 focus:border-primary focus:ring-primary" 
                        {...field} 
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
  
              <FormField
                control={form.control}
                name="startupName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Startup Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your startup name"
                        className="bg-slate-800/50 border-slate-700 text-slate-200 placeholder:text-slate-500
                                 focus:border-primary focus:ring-primary" 
                        {...field} 
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription className="text-slate-500">The official name of your startup</FormDescription>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
  
              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Industry</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-slate-800/50 border-slate-700 text-slate-200">
                          <SelectValue placeholder="Select an industry" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {Object.values(Industry).map((industry) => (
                          <SelectItem 
                            key={industry} 
                            value={industry}
                            className="text-slate-200 focus:bg-slate-700 focus:text-white"
                          >
                            {industry.split('_').map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                            ).join(' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-slate-500">The primary industry your startup operates in</FormDescription>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
                <FormField
                  control={form.control}
                  name="sector"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Sector</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={isLoading}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-slate-800/50 border-slate-700 text-slate-200">
                            <SelectValue placeholder="Select a sector" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          {Object.values(Sector).map((sector) => (
                            <SelectItem key={sector} value={sector} className="text-slate-200 focus:bg-slate-700 focus:text-white">
                              {sector.split('_').map(word => 
                                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                              ).join(' ')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-slate-500">The specific sector within your industry</FormDescription>
                      <FormMessage className="text-red-400"/>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Startup Stage</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={isLoading}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-slate-800/50 border-slate-700 text-slate-200">
                            <SelectValue placeholder="Select your startup stage" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          {Object.values(StartupStage).map((stage) => (
                            <SelectItem key={stage} value={stage} className="text-slate-200 focus:bg-slate-700 focus:text-white">
                              {stage.split('_').map(word => 
                                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                              ).join(' ')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-slate-500">Current stage of your startup</FormDescription>
                      <FormMessage className="text-red-400"/>
                    </FormItem>
                  )}
                />

              {/* Description field - Now properly responsive */}
              <div className="col-span-1 md:col-span-2">
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-300">Startup Description</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Textarea
                                placeholder="Describe your startup..."
                                className="min-h-[150px] w-full bg-slate-800/50 border-slate-700 text-slate-200 
                                        placeholder:text-slate-500 focus:border-primary focus:ring-primary
                                        resize-y"
                                {...field}
                                disabled={isLoading}
                                onChange={(e) => {
                                  field.onChange(e);
                                  form.trigger("description");
                                }}
                              />
                              <div className="absolute bottom-2 right-2 text-sm text-slate-400">
                                {field.value?.length || 0}/500
                              </div>
                            </div>
                          </FormControl>
                          <FormDescription className="text-slate-500">
                            Provide a compelling description (50-500 characters)
                          </FormDescription>
                          <FormMessage className="text-red-400" />
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
                    <FormLabel className="text-slate-300">Capital Required</FormLabel>
                    <FormControl>
                      <Input 
                        type="text" 
                        placeholder="e.g., $500,000"
                        className="bg-slate-800/50 border-slate-700 text-slate-200 placeholder:text-slate-500
                                 focus:border-primary focus:ring-primary" 
                        {...field} 
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription className="text-slate-500">Amount of funding you&apos;re looking to raise</FormDescription>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-6">
            <Button
              type="submit"
              className="w-full md:w-auto min-w-[200px] relative group overflow-hidden"
              disabled={isLoading}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-400 
                            transition-transform group-hover:translate-x-full" />
              <span className="relative flex items-center justify-center">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  'Submit and Analyze'
                )}
              </span>
            </Button>
          </div>
        </form>
      </Form>
    </CardContent>
  </Card>
</div>
  );
}

