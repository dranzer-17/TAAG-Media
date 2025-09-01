"use client"

import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import type { BrandBillingData } from './BrandBillingForm';
import type { CreatorPayoutData } from './CreatorPayoutForm';

// --- Define styles for the PDF ---
// This is like CSS-in-JS, but for the PDF document
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 11,
    color: '#333',
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#1a1a1a',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 20,
    padding: 15,
    border: '1px solid #e5e5e5',
    borderRadius: 5,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
    borderBottom: '1px solid #e5e5e5',
    paddingBottom: 5,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  label: {
    color: '#666',
  },
  value: {
    fontWeight: 'bold',
  },
  hr: {
    borderBottom: '1px solid #e5e5e5',
    marginVertical: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: '#999',
    fontSize: 9,
  },
});

// Define the props the document will receive
interface BillingPdfProps {
  brandData: BrandBillingData;
  creatorData: CreatorPayoutData;
}

export const BillingPdfDocument = ({ brandData, creatorData }: BillingPdfProps) => {
  const gstRate = 0.18;
  const gstAmount = brandData.budget * gstRate;
  const totalAmount = brandData.budget + gstAmount;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Billing Summary & Invoice</Text>

        {/* Brand Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Brand Billing Details</Text>
          <View style={styles.detailRow}><Text style={styles.label}>Company Name:</Text><Text style={styles.value}>{brandData.companyName}</Text></View>
          <View style={styles.detailRow}><Text style={styles.label}>GSTIN:</Text><Text style={styles.value}>{brandData.gstin}</Text></View>
          <View style={styles.detailRow}><Text style={styles.label}>Email:</Text><Text style={styles.value}>{brandData.email}</Text></View>
          <View style={styles.detailRow}><Text style={styles.label}>Phone:</Text><Text style={styles.value}>{brandData.phone}</Text></View>
        </View>

        {/* Creator Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Creator Payout Details</Text>
          <View style={styles.detailRow}><Text style={styles.label}>Name:</Text><Text style={styles.value}>{creatorData.name}</Text></View>
          <View style={styles.detailRow}><Text style={styles.label}>PAN:</Text><Text style={styles.value}>{creatorData.pan}</Text></View>
          <View style={styles.detailRow}><Text style={styles.label}>UPI ID:</Text><Text style={styles.value}>{creatorData.upi}</Text></View>
          <View style={styles.detailRow}><Text style={styles.label}>Bank Account:</Text><Text style={styles.value}>{creatorData.bankAccount}</Text></View>
          <View style={styles.detailRow}><Text style={styles.label}>IFSC Code:</Text><Text style={styles.value}>{creatorData.ifsc}</Text></View>
        </View>
        
        {/* Financial Summary Section */}
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Financial Summary</Text>
            <View style={styles.detailRow}><Text style={styles.label}>Campaign Budget:</Text><Text>₹ {brandData.budget.toLocaleString('en-IN')}</Text></View>
            <View style={styles.detailRow}><Text style={styles.label}>GST (18%):</Text><Text>₹ {gstAmount.toLocaleString('en-IN')}</Text></View>
            <View style={styles.hr}></View>
            <View style={styles.totalRow}><Text style={styles.totalLabel}>Total Amount Payable:</Text><Text style={styles.totalValue}>₹ {totalAmount.toLocaleString('en-IN')}</Text></View>
        </View>

        <Text style={styles.footer}>Generated on {new Date().toLocaleDateString('en-IN')} by Taag Media</Text>
      </Page>
    </Document>
  );
};