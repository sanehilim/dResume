'use client';

import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import { exportResumeToPDF, type ResumePDFData } from '@/lib/pdf-export';
import { toast } from 'sonner';
import { useState } from 'react';

interface PDFExportButtonProps {
  resumeData: ResumePDFData;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export function PDFExportButton({ 
  resumeData, 
  variant = 'outline', 
  size = 'default',
  className = '' 
}: PDFExportButtonProps) {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportResumeToPDF(resumeData);
      toast.success('Resume exported successfully!');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Failed to export resume');
    } finally {
      setExporting(false);
    }
  };

  return (
    <Button
      onClick={handleExport}
      disabled={exporting}
      variant={variant}
      size={size}
      className={className}
    >
      {exporting ? (
        <>
          <FileText className="w-4 h-4 mr-2 animate-pulse" />
          Exporting...
        </>
      ) : (
        <>
          <Download className="w-4 h-4 mr-2" />
          Export PDF
        </>
      )}
    </Button>
  );
}
