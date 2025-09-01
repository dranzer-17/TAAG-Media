"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { sampleCreatorPayout } from "@/lib/sample-data";

// --- 1. Define the validation schema for the form ---
const creatorPayoutSchema = z.object({
  name: z.string().min(2, { message: "Please enter a valid name." }),
  // Regex for standard Indian PAN card format
  pan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, {
    message: "Invalid PAN card format.",
  }),
  // Simple regex for UPI ID format
  upi: z.string().regex(/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/, {
    message: "Invalid UPI ID format.",
  }),
  bankAccount: z.string().regex(/^\d{9,18}$/, {
    message: "Enter a valid bank account number.",
  }),
  // Regex for standard Indian IFSC format
  ifsc: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, {
    message: "Invalid IFSC code format.",
  }),
  address: z.string().min(10, { message: "Please enter a valid address." }),
});

// We export this type so the parent component knows the shape of the data
export type CreatorPayoutData = z.infer<typeof creatorPayoutSchema>;

// Define the props, expecting two functions: one for successful submission and one to go back
interface CreatorPayoutFormProps {
  onCreatorSubmit: (data: CreatorPayoutData) => void;
  onBack: () => void;
}

export function CreatorPayoutForm({ onCreatorSubmit, onBack }: CreatorPayoutFormProps) {
  // --- 2. Initialize react-hook-form ---
  const form = useForm<CreatorPayoutData>({
    resolver: zodResolver(creatorPayoutSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      pan: "",
      upi: "",
      bankAccount: "",
      ifsc: "",
      address: "",
    },
  });

  const onSubmit = (values: CreatorPayoutData) => {
    onCreatorSubmit(values);
  };

  const loadSample = () => {
    form.reset(sampleCreatorPayout);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name (as per Bank Account)</FormLabel>
                <FormControl>
                  <Input placeholder="Ria Sharma" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PAN Card Number</FormLabel>
                <FormControl>
                  <Input placeholder="ABCDE1234F" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="upi"
          render={({ field }) => (
            <FormItem>
              <FormLabel>UPI ID</FormLabel>
              <FormControl>
                <Input placeholder="ria.sharma@okbank" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="bankAccount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bank Account Number</FormLabel>
                <FormControl>
                  <Input placeholder="123456789012" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ifsc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>IFSC Code</FormLabel>
                <FormControl>
                  <Input placeholder="HDFC0000123" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Address</FormLabel>
              <FormControl>
                <Input placeholder="456 Park Avenue, Anytown, ST 54321" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Form Actions */}
        <div className="flex justify-between items-center pt-8 border-t border-border">
          <Button type="button" variant="outline" onClick={onBack} className="min-w-[100px]">
            Back
          </Button>
          <div className="flex gap-3">
            <Button type="button" variant="secondary" onClick={loadSample} className="min-w-[120px]">
              Load Sample
            </Button>
            <Button type="submit" className="min-w-[120px]">
              View Summary
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}