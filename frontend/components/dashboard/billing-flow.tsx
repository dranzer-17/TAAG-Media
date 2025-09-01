"use client"

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';

// Import all our components and their data types
import { BrandBillingForm, BrandBillingData } from './BrandBillingForm'; 
import { CreatorPayoutForm, CreatorPayoutData } from './CreatorPayoutForm';
import { BillingSummary } from './BillingSummary'; // <-- Import the final piece

export function BillingFlow() {
  const [activeTab, setActiveTab] = useState("brand");
  
  const [brandData, setBrandData] = useState<BrandBillingData | null>(null);
  const [creatorData, setCreatorData] = useState<CreatorPayoutData | null>(null);

  const handleBrandFormSubmit = (data: BrandBillingData) => {
    console.log("Brand Billing Data Captured:", data);
    setBrandData(data);
    setActiveTab("creator"); 
  };

  const handleCreatorFormSubmit = (data: CreatorPayoutData) => {
    console.log("Creator Payout Data Captured:", data);
    setCreatorData(data);
    setActiveTab("summary");
  };
  
  // This function allows the "Edit" buttons in the summary to work
  const handleEdit = (step: 'brand' | 'creator') => {
    setActiveTab(step);
  };

  const tabTriggerClass = "data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-md rounded-md transition-all duration-200";

  return (
    <div className="bg-black/80 dark:bg-black/50 p-1.5 rounded-lg">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-transparent">
          <TabsTrigger value="brand" className={cn(tabTriggerClass)}>
            Step 1: Brand
          </TabsTrigger>
          <TabsTrigger value="creator" className={cn(tabTriggerClass)} disabled={!brandData}>
            Step 2: Creator
          </TabsTrigger>
          <TabsTrigger value="summary" className={cn(tabTriggerClass)} disabled={!creatorData}>
            Step 3: Summary
          </TabsTrigger>
        </TabsList>

        <TabsContent value="brand" className="mt-2">
          <Card>
            <CardHeader>
              <CardTitle>Brand Billing Details</CardTitle>
              <CardDescription>Enter the company&rsquo;s information for invoicing.</CardDescription>
            </CardHeader>
            <CardContent>
              <BrandBillingForm onBrandSubmit={handleBrandFormSubmit} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="creator" className="mt-2">
          <Card>
            <CardHeader>
              <CardTitle>Creator Payout Details</CardTitle>
              <CardDescription>Enter the creator&rsquo;s information for payment processing.</CardDescription>
            </CardHeader>
            <CardContent>
              <CreatorPayoutForm 
                onCreatorSubmit={handleCreatorFormSubmit}
                onBack={() => setActiveTab("brand")}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="summary" className="mt-2">
          <Card>
            <CardHeader>
              <CardTitle>Billing Summary</CardTitle>
              <CardDescription>Review all details before saving.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* --- RENDER THE FINAL SUMMARY --- */}
              {/* We only render the summary if both brandData and creatorData exist */}
              {brandData && creatorData ? (
                <BillingSummary 
                  brandData={brandData}
                  creatorData={creatorData}
                  onEdit={handleEdit}
                />
              ) : (
                <p>Please complete the previous steps to see the summary.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}