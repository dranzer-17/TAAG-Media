"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import type { MatchedCreator } from "@/lib/types"; // Import our new type

// Props for the component: it will receive the matches, loading state, and error state
interface MatchConsoleProps {
  matches: MatchedCreator[];
  isLoading: boolean;
  error: string | null;
}

export function MatchConsole({ matches, isLoading, error }: MatchConsoleProps) {

  // --- Loading State ---
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <Skeleton className="h-8 w-1/4" />
          </div>
        ))}
      </div>
    );
  }

  // --- Error State ---
  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-destructive font-semibold">An error occurred:</p>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  // --- Empty/Initial State ---
  if (matches.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-semibold">No Matches Found</h3>
        <p className="text-muted-foreground">Submit a brand brief to find matching creators.</p>
      </div>
    );
  }

  // --- Success State (Displaying the Matches) ---
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Creator</TableHead>
            <TableHead>Match Score</TableHead>
            <TableHead>Reasons</TableHead>
            <TableHead className="text-right">Base Price (INR)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {matches.map(({ creator, score, reasons }) => (
            <TableRow key={creator.id}>
              <TableCell className="font-medium">
                <div className="font-bold">{creator.handle}</div>
                <div className="text-sm text-muted-foreground">{creator.verticals.join(', ')}</div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-semibold w-12 text-right">{score.toFixed(1)}%</span>
                  <Progress value={score} className="w-[100px]" />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {reasons.slice(0, 3).map((reason) => (
                    <Badge key={reason} variant="secondary">{reason}</Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell className="text-right font-mono">
                {creator.basePriceINR.toLocaleString('en-IN')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}