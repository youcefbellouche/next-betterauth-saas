"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";

interface ExportWaitlistButtonProps {
  data: {
    email: string;
    createdAt: Date;
  }[];
}

export function ExportWaitlistButton({ data }: ExportWaitlistButtonProps) {
  const handleExport = () => {
    if (data.length === 0) {
      toast.error("No entries to export");
      return;
    }

    try {
      // Create CSV content
      const headers = ["Email", "Joined At"];
      const rows = data.map(entry => [
        entry.email,
        new Date(entry.createdAt).toISOString()
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map(row => row.join(","))
      ].join("\n");

      // Create download link
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `waitlist-export-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Waitlist exported successfully");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export waitlist");
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="gap-2" 
      onClick={handleExport}
      disabled={data.length === 0}
    >
      <Download className="h-4 w-4" />
      Export CSV
    </Button>
  );
}
