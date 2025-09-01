"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import type { BrandBillingData } from './BrandBillingForm';
import type { CreatorPayoutData } from './CreatorPayoutForm';

// --- NEW IMPORTS ---
import { usePDF } from '@react-pdf/renderer';
import { BillingPdfDocument } from './BillingPdfDocument'; // The PDF document structure we already created

// Props for the summary component
interface BillingSummaryProps {
  brandData: BrandBillingData;
  creatorData: CreatorPayoutData;
  onEdit: (step: 'brand' | 'creator') => void;
}

const DetailRow = ({ label, value }: { label: string; value: string | number | undefined }) => (
  <div className="flex justify-between items-center py-2">
    <dt className="text-sm text-muted-foreground">{label}</dt>
    <dd className="text-sm font-medium text-foreground">{value}</dd>
  </div>
);

export function BillingSummary({ brandData, creatorData, onEdit }: BillingSummaryProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // --- Use the usePDF hook ---
  // This hook generates the PDF in the background and gives us a URL and loading state.
  const [instance] = usePDF({
    document: <BillingPdfDocument brandData={brandData} creatorData={creatorData} />,
  });

  const gstRate = 0.18;
  const gstAmount = brandData.budget * gstRate;
  const totalAmount = brandData.budget + gstAmount;
  const pdfFileName = `Billing-Summary-${brandData.companyName.replace(/\s/g, '_')}.pdf`;

  return (
    <div className="space-y-6">
      {/* ... (The two Card components for Brand and Creator details remain exactly the same) ... */}
      <Card className="bg-muted/30">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Brand Billing Details</CardTitle>
            <CardDescription>{brandData.companyName}</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => onEdit('brand')}>Edit</Button>
        </CardHeader>
        <CardContent>
          <dl>
            <DetailRow label="GSTIN" value={brandData.gstin} />
            <DetailRow label="Billing Email" value={brandData.email} />
            <DetailRow label="Phone" value={brandData.phone} />
            <DetailRow label="Address" value={brandData.address} />
          </dl>
        </CardContent>
      </Card>

      <Card className="bg-muted/30">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Creator Payout Details</CardTitle>
            <CardDescription>{creatorData.name}</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => onEdit('creator')}>Edit</Button>
        </CardHeader>
        <CardContent>
          <dl>
            <DetailRow label="PAN" value={creatorData.pan} />
            <DetailRow label="UPI ID" value={creatorData.upi} />
            <DetailRow label="Bank Account" value={creatorData.bankAccount} />
            <DetailRow label="IFSC Code" value={creatorData.ifsc} />
          </dl>
        </CardContent>
      </Card>

      {/* Financial Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <DetailRow label="Campaign Budget" value={`₹ ${brandData.budget.toLocaleString('en-IN')}`} />
            <DetailRow label="GST (18%)" value={`₹ ${gstAmount.toLocaleString('en-IN')}`} />
            <Separator />
            <div className="flex justify-between items-center py-2">
              <dt className="text-base font-semibold">Total Amount Payable</dt>
              <dd className="text-base font-bold">₹ {totalAmount.toLocaleString('en-IN')}</dd>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* --- NEW MODAL-BASED ACTIONS SECTION --- */}
      <div className="flex justify-end pt-4">
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button disabled={instance.loading}>
              {instance.loading ? "Preparing Preview..." : "Preview & Save PDF"}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-4xl h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>PDF Preview</DialogTitle>
              <DialogDescription>Review the generated summary below. You can download it from here.</DialogDescription>
            </DialogHeader>
            <div className="flex-grow rounded-md overflow-hidden">
              {instance.url ? (
                <iframe src={instance.url} className="w-full h-full" title="PDF Preview" />
              ) : (
                <div className="flex items-center justify-center h-full">Loading preview...</div>
              )}
            </div>
            <DialogFooter>
              <a href={instance.url!} download={pdfFileName}>
                <Button disabled={!instance.url}>
                  Download PDF
                </Button>
              </a>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}