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
        <div className="grid md:grid-cols-2 gap-10">
          {/* --- LEFT COLUMN --- */}
          <div className="space-y-6">
            <div className="pb-3">
              <h3 className="text-lg font-semibold text-foreground">Campaign Details</h3>
              <p className="text-sm text-muted-foreground">Basic information about your campaign</p>
            </div>
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">Campaign Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g., Summer Activewear Launch" 
                    className="h-11 border-2 focus:border-primary transition-colors" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="category" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">Category</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-11 border-2 focus:border-primary transition-colors">
                      <SelectValue placeholder="Select a campaign category" />
                    </SelectTrigger>
                  </FormControl>
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
                <FormLabel className="text-base font-medium">Budget (INR)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground font-medium">₹</span>
                    <Input 
                      type="number" 
                      placeholder="500000" 
                      className="h-11 pl-8 border-2 focus:border-primary transition-colors"
                      value={field.value?.toString() || ""} 
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                      onBlur={field.onBlur}
                      name={field.name}
                    />
                  </div>
                </FormControl>
                <FormDescription className="text-sm text-muted-foreground">The total amount you want to spend.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="ageRange" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">Target Age Range: {field.value[0]} - {field.value[1]} years</FormLabel>
                <FormControl>
                  <div className="px-3 py-4">
                    <Slider
                      value={field.value} 
                      onValueChange={field.onChange}
                      max={65} 
                      min={13} 
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>13</span>
                      <span>65</span>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          {/* --- RIGHT COLUMN (Checkboxes) --- */}
          <div className="space-y-6">
            <div className="pb-3">
              <h3 className="text-lg font-semibold text-foreground">Targeting & Preferences</h3>
              <p className="text-sm text-muted-foreground">Define your target audience and content preferences</p>
            </div>
            <FormField control={form.control} name="locations" render={({ field }) => (
                <FormItem>
                    <FormLabel className="text-base font-medium">Target Locations</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-2 gap-3 p-4 border rounded-lg bg-muted/20">
                          {locationsOptions.map((item) => (
                              <div key={item.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted/40 transition-colors">
                                  <Checkbox 
                                    checked={field.value?.includes(item.id)} 
                                    onCheckedChange={(checked) => {
                                        return checked ? field.onChange([...(field.value || []), item.id]) : field.onChange(field.value?.filter((value) => value !== item.id))
                                    }} 
                                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                  />
                                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">{item.label}</label>
                              </div>
                          ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )} />
            
            <FormField control={form.control} name="goals" render={({ field }) => (
                <FormItem>
                    <FormLabel className="text-base font-medium">Campaign Goals</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-2 gap-3 p-4 border rounded-lg bg-muted/20">
                          {goalsOptions.map((item) => (
                              <div key={item.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted/40 transition-colors">
                                  <Checkbox 
                                    checked={field.value?.includes(item.id)} 
                                    onCheckedChange={(checked) => {
                                        return checked ? field.onChange([...(field.value || []), item.id]) : field.onChange(field.value?.filter((value) => value !== item.id))
                                    }} 
                                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                  />
                                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">{item.label}</label>
                              </div>
                          ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )} />

            <FormField control={form.control} name="tone" render={({ field }) => (
                <FormItem>
                    <FormLabel className="text-base font-medium">Content Tone</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-2 gap-3 p-4 border rounded-lg bg-muted/20">
                          {toneOptions.map((item) => (
                              <div key={item.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted/40 transition-colors">
                                  <Checkbox 
                                    checked={field.value?.includes(item.id)} 
                                    onCheckedChange={(checked) => {
                                        return checked ? field.onChange([...(field.value || []), item.id]) : field.onChange(field.value?.filter((value) => value !== item.id))
                                    }} 
                                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                  />
                                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">{item.label}</label>
                              </div>
                          ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )} />

            <FormField control={form.control} name="platforms" render={({ field }) => (
                <FormItem>
                    <FormLabel className="text-base font-medium">Platforms</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-2 gap-3 p-4 border rounded-lg bg-muted/20">
                          {platformsOptions.map((item) => (
                              <div key={item.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted/40 transition-colors">
                                  <Checkbox 
                                    checked={field.value?.includes(item.id)} 
                                    onCheckedChange={(checked) => {
                                        return checked ? field.onChange([...(field.value || []), item.id]) : field.onChange(field.value?.filter((value) => value !== item.id))
                                    }} 
                                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                  />
                                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">{item.label}</label>
                              </div>
                          ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )} />
          </div>
        </div>

        {/* --- FORM ACTIONS --- */}
        <div className="flex justify-end gap-4 pt-8 border-t border-border">
            <Button type="button" variant="outline" onClick={loadTemplate} className="min-w-[140px] h-11">
              Load Template
            </Button>
            <Button type="submit" className="min-w-[140px] h-11 bg-primary hover:bg-primary/90">
              Find Creators
            </Button>
        </div>
      </form>
    </Form>
  )
}