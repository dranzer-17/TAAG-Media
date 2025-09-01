"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, type SubmitHandler } from "react-hook-form"
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
import { sampleBrandBilling } from "@/lib/sample-data";

// --- 1. Define the validation schema for the form ---
const brandBillingSchema = z.object({
  companyName: z.string().min(2, { message: "Company name must be at least 2 characters." }),
  // Regex for standard Indian GSTIN format
  gstin: z.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, {
    message: "Invalid GSTIN format.",
  }),
  address: z.string().min(10, { message: "Please enter a valid address." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().regex(/^\d{10}$/, { message: "Phone number must be 10 digits." }),
  budget: z.coerce.number().positive({ message: "Budget must be a positive number." }),
});

// We export this type so the parent component knows the shape of the data
export type BrandBillingData = z.infer<typeof brandBillingSchema>;

// Define the props, expecting a function to call on successful submission
interface BrandBillingFormProps {
  onBrandSubmit: (data: BrandBillingData) => void;
}

export function BrandBillingForm({ onBrandSubmit }: BrandBillingFormProps) {
  // --- 2. Initialize react-hook-form ---
  const form = useForm({
    resolver: zodResolver(brandBillingSchema),
    mode: "onBlur" as const, // Validate fields when the user moves away from them
    defaultValues: {
      companyName: "",
      gstin: "",
      address: "",
      email: "",
      phone: "",
      budget: 0,
    },
  });

  // The onSubmit function just calls the prop passed from the parent
  const onSubmit: SubmitHandler<BrandBillingData> = (values: BrandBillingData) => {
    onBrandSubmit(values);
  };


  const loadSample = () => {
    form.reset(sampleBrandBilling);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input placeholder="Acme Corporation" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gstin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GSTIN</FormLabel>
                <FormControl>
                  <Input placeholder="29ABCDE1234F1Z5" {...field} />
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
              <FormLabel>Company Address</FormLabel>
              <FormControl>
                <Input placeholder="123 Main Street, Anytown, ST 12345" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Billing Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="billing@acme.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="9876543210" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
            control={form.control}
            name="budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Campaign Budget (INR)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="500000" 
                    value={field.value?.toString() || ""} 
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                    onBlur={field.onBlur}
                    name={field.name}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        {/* Form Actions */}
        <div className="flex justify-between items-center pt-8 border-t border-border">
          <Button type="button" variant="secondary" onClick={loadSample} className="min-w-[140px]">
            Load Sample Data
          </Button>
          <Button type="submit" className="min-w-[140px]">
            Next: Creator Payout
          </Button>
        </div>
      </form>
    </Form>
  );
}