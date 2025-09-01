"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, type SubmitHandler } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { acmeActivewearTemplate } from "@/lib/sample-data"

// --- 1. CORRECTED Form Schema ---
const formSchema = z.object({
  name: z.string().min(5, { message: "Campaign name must be at least 5 characters." }),
  // This is the main fix. Use .min(1) for required strings from a select.
  category: z.string().min(1, { message: "Please select a category." }),
  budget: z.coerce.number().min(10000, { message: "Budget must be at least ₹10,000." }),
  locations: z.array(z.string()).refine((value) => value.length > 0, {
    message: "You have to select at least one location.",
  }),
  ageRange: z.array(z.number()).min(2).max(2),
  goals: z.array(z.string()).refine((value) => value.length > 0, {
    message: "You have to select at least one goal.",
  }),
  tone: z.array(z.string()).refine((value) => value.length > 0, {
    message: "You have to select at least one tone.",
  }),
  platforms: z.array(z.string()).refine((value) => value.length > 0, {
    message: "You have to select at least one platform.",
  }),
});

// Type alias for inferred schema type
export type BrandBriefFormValues = z.infer<typeof formSchema>;

// --- Constants for form options ---
const locationsOptions = [{ id: 'Mumbai', label: 'Mumbai' }, { id: 'Delhi', label: 'Delhi' }, { id: 'Bengaluru', label: 'Bengaluru' }, { id: 'Hyderabad', label: 'Hyderabad' }];
const goalsOptions = [{ id: 'installs', label: 'App Installs' }, { id: 'awareness', label: 'Brand Awareness' }, { id: 'signups', label: 'Signups' }, { id: 'sales', label: 'Sales' }];
const toneOptions = [{ id: 'energetic', label: 'Energetic' }, { id: 'fun', label: 'Fun' }, { id: 'informative', label: 'Informative' }, { id: 'clean', label: 'Clean' }, { id: 'trustworthy', label: 'Trustworthy' }];
const platformsOptions = [{ id: 'Instagram', label: 'Instagram' }, { id: 'YouTube', label: 'YouTube' }, { id: 'LinkedIn', label: 'LinkedIn' }, { id: 'Reels', label: 'Reels' }];

interface BrandBriefFormProps {
  onFormSubmit?: (values: BrandBriefFormValues) => void | Promise<void>;
}

export function BrandBriefForm({ onFormSubmit }: BrandBriefFormProps) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "", // Ensure category has a default empty string
      budget: 250000,
      ageRange: [18, 35] as [number, number],
      locations: [] as string[],
      goals: [] as string[],
      tone: [] as string[],
      platforms: [] as string[],
    },
    mode: "onChange" as const,
  });

  const onSubmit: SubmitHandler<BrandBriefFormValues> = (values: BrandBriefFormValues) => {
    if (onFormSubmit) {
      onFormSubmit(values);
    } else {
      console.log("Form Submitted:", values);
      alert("Form submitted! Check the console for the data.");
    }
  }

  function loadTemplate() {
    form.reset(acmeActivewearTemplate);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* --- LEFT COLUMN --- */}
          <div className="space-y-8">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Campaign Name</FormLabel>
                <FormControl><Input placeholder="e.g., Summer Activewear Launch" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="category" render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select a campaign category" /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="Fashion">Fashion</SelectItem>
                    <SelectItem value="Fintech">Fintech</SelectItem>
                    <SelectItem value="EdTech">EdTech</SelectItem>
                    <SelectItem value="Food">Food</SelectItem>
                    <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="budget" render={({ field }) => (
              <FormItem>
                <FormLabel>Budget (INR)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="e.g., 500000" 
                    value={field.value?.toString() || ""} 
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                    onBlur={field.onBlur}
                    name={field.name}
                  />
                </FormControl>
                <FormDescription>The total amount you want to spend.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="ageRange" render={({ field }) => (
              <FormItem>
                <FormLabel>Target Age Range: {field.value[0]} - {field.value[1]}</FormLabel>
                <FormControl>
                  <Slider
                    defaultValue={[18, 35]} min={13} max={65} step={1}
                    value={field.value} onValueChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          {/* --- RIGHT COLUMN (Checkboxes) --- */}
          <div className="space-y-8">
            <FormField control={form.control} name="locations" render={({ field }) => (
                <FormItem>
                    <FormLabel>Target Locations</FormLabel>
                    <div className="grid grid-cols-2 gap-4">
                        {locationsOptions.map((item) => (
                            <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                    <Checkbox checked={field.value?.includes(item.id)} onCheckedChange={(checked) => {
                                        return checked ? field.onChange([...(field.value || []), item.id]) : field.onChange(field.value?.filter((value) => value !== item.id))
                                    }} />
                                </FormControl>
                                <FormLabel className="font-normal">{item.label}</FormLabel>
                            </FormItem>
                        ))}
                    </div>
                    <FormMessage />
                </FormItem>
            )} />
            
            <FormField control={form.control} name="goals" render={({ field }) => (
                <FormItem>
                    <FormLabel>Campaign Goals</FormLabel>
                    <div className="grid grid-cols-2 gap-4">
                        {goalsOptions.map((item) => (
                            <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                    <Checkbox checked={field.value?.includes(item.id)} onCheckedChange={(checked) => {
                                        return checked ? field.onChange([...(field.value || []), item.id]) : field.onChange(field.value?.filter((value) => value !== item.id))
                                    }} />
                                </FormControl>
                                <FormLabel className="font-normal">{item.label}</FormLabel>
                            </FormItem>
                        ))}
                    </div>
                    <FormMessage />
                </FormItem>
            )} />

            <FormField control={form.control} name="tone" render={({ field }) => (
                <FormItem>
                    <FormLabel>Content Tone</FormLabel>
                    <div className="grid grid-cols-2 gap-4">
                        {toneOptions.map((item) => (
                            <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                    <Checkbox checked={field.value?.includes(item.id)} onCheckedChange={(checked) => {
                                        return checked ? field.onChange([...(field.value || []), item.id]) : field.onChange(field.value?.filter((value) => value !== item.id))
                                    }} />
                                </FormControl>
                                <FormLabel className="font-normal">{item.label}</FormLabel>
                            </FormItem>
                        ))}
                    </div>
                    <FormMessage />
                </FormItem>
            )} />

            <FormField control={form.control} name="platforms" render={({ field }) => (
                <FormItem>
                    <FormLabel>Platforms</FormLabel>
                    <div className="grid grid-cols-2 gap-4">
                        {platformsOptions.map((item) => (
                            <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                    <Checkbox checked={field.value?.includes(item.id)} onCheckedChange={(checked) => {
                                        return checked ? field.onChange([...(field.value || []), item.id]) : field.onChange(field.value?.filter((value) => value !== item.id))
                                    }} />
                                </FormControl>
                                <FormLabel className="font-normal">{item.label}</FormLabel>
                            </FormItem>
                        ))}
                    </div>
                    <FormMessage />
                </FormItem>
            )} />
          </div>
        </div>

        {/* --- FORM ACTIONS --- */}
        <div className="flex justify-end gap-4 pt-8">
            <Button type="button" variant="secondary" onClick={loadTemplate}>Load Template</Button>
            <Button type="submit">Find Creators</Button>
        </div>
      </form>
    </Form>
  )
}