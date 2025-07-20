import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Scan, Upload, FileText, Camera, DollarSign, Receipt } from "lucide-react";
import { createWorker } from 'tesseract.js';

interface OCRDocumentScannerProps {
  onExtractedData: (data: ExtractedFinancialData) => void;
}

interface ExtractedFinancialData {
  amount?: number;
  vendor?: string;
  date?: string;
  description?: string;
  rawText: string;
}

const OCRDocumentScanner = ({ onExtractedData }: OCRDocumentScannerProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState("");
  const [extractedData, setExtractedData] = useState<ExtractedFinancialData | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const processOCR = async () => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select an image file first",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setExtractedText("");
    setExtractedData(null);

    try {
      const worker = await createWorker('eng');
      
      toast({
        title: "Processing",
        description: "Scanning document with OCR...",
      });

      const { data: { text } } = await worker.recognize(selectedFile);
      await worker.terminate();

      setExtractedText(text);
      
      // Extract financial data from the text
      const financialData = extractFinancialData(text);
      setExtractedData(financialData);

      toast({
        title: "Success",
        description: "Document scanned successfully",
      });
    } catch (error) {
      console.error("OCR Error:", error);
      toast({
        title: "Error",
        description: "Failed to process document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const extractFinancialData = (text: string): ExtractedFinancialData => {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    // Patterns for common financial data
    const amountPatterns = [
      /\$[\d,]+\.?\d*/g,
      /[\d,]+\.?\d*\s*(?:USD|dollars?)/gi,
      /(?:total|amount|sum|pay|payment|cost|price)[:=\s]*\$?[\d,]+\.?\d*/gi
    ];
    
    const datePatterns = [
      /\d{1,2}\/\d{1,2}\/\d{2,4}/g,
      /\d{1,2}-\d{1,2}-\d{2,4}/g,
      /\w+\s+\d{1,2},?\s+\d{4}/g
    ];

    const vendorPatterns = [
      /(?:vendor|company|business|merchant|store)[:=\s]*([^\n\r]+)/gi,
      /(?:from|to|pay to|payee)[:=\s]*([^\n\r]+)/gi
    ];

    let amount: number | undefined;
    let vendor: string | undefined;
    let date: string | undefined;
    let description = "";

    // Extract amounts
    for (const pattern of amountPatterns) {
      const matches = text.match(pattern);
      if (matches && matches.length > 0) {
        const amountStr = matches[0].replace(/[^\d.,]/g, '');
        const parsedAmount = parseFloat(amountStr.replace(/,/g, ''));
        if (!isNaN(parsedAmount) && parsedAmount > 0) {
          amount = parsedAmount;
          break;
        }
      }
    }

    // Extract dates
    for (const pattern of datePatterns) {
      const matches = text.match(pattern);
      if (matches && matches.length > 0) {
        const dateStr = matches[0];
        const parsedDate = new Date(dateStr);
        if (!isNaN(parsedDate.getTime())) {
          date = parsedDate.toISOString().split('T')[0];
          break;
        }
      }
    }

    // Extract vendor/company name
    for (const pattern of vendorPatterns) {
      const match = pattern.exec(text);
      if (match && match[1]) {
        vendor = match[1].trim();
        break;
      }
    }

    // Generate description from the document type and content
    const lowerText = text.toLowerCase();
    if (lowerText.includes('receipt') || lowerText.includes('purchase')) {
      description = `Receipt from ${vendor || 'vendor'}`;
    } else if (lowerText.includes('invoice')) {
      description = `Invoice from ${vendor || 'vendor'}`;
    } else if (lowerText.includes('pay stub') || lowerText.includes('payroll')) {
      description = `Payroll document`;
    } else {
      description = `Financial document from ${vendor || 'unknown source'}`;
    }

    return {
      amount,
      vendor,
      date,
      description,
      rawText: text
    };
  };

  const useExtractedData = () => {
    if (extractedData) {
      onExtractedData(extractedData);
      setIsDialogOpen(false);
      toast({
        title: "Data Applied",
        description: "Extracted data has been applied to the form",
      });
    }
  };

  const resetScanner = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setExtractedText("");
    setExtractedData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="ml-2">
          <Scan className="mr-2 h-4 w-4" />
          Scan Document
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Camera className="mr-2 h-5 w-5" />
            OCR Document Scanner
          </DialogTitle>
          <DialogDescription>
            Upload and scan receipts, invoices, pay stubs, and other financial documents to automatically extract data.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Upload Section */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Document
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="document-upload">Select Image File</Label>
                  <Input
                    id="document-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    ref={fileInputRef}
                  />
                  <p className="text-sm text-muted-foreground">
                    Supports JPG, PNG, WebP, and other image formats
                  </p>
                </div>

                {previewUrl && (
                  <div className="space-y-2">
                    <Label>Preview</Label>
                    <img
                      src={previewUrl}
                      alt="Document preview"
                      className="w-full max-h-48 object-contain border rounded-md"
                    />
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button
                    onClick={processOCR}
                    disabled={!selectedFile || isProcessing}
                    className="flex-1"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Scan className="mr-2 h-4 w-4" />
                        Scan Document
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={resetScanner}>
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-4">
            {extractedData && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <DollarSign className="mr-2 h-4 w-4" />
                    Extracted Financial Data
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {extractedData.amount && (
                    <div className="flex justify-between">
                      <span className="font-medium">Amount:</span>
                      <span className="text-green-600 font-semibold">
                        ${extractedData.amount.toFixed(2)}
                      </span>
                    </div>
                  )}
                  {extractedData.vendor && (
                    <div className="flex justify-between">
                      <span className="font-medium">Vendor:</span>
                      <span>{extractedData.vendor}</span>
                    </div>
                  )}
                  {extractedData.date && (
                    <div className="flex justify-between">
                      <span className="font-medium">Date:</span>
                      <span>{extractedData.date}</span>
                    </div>
                  )}
                  {extractedData.description && (
                    <div className="flex justify-between">
                      <span className="font-medium">Description:</span>
                      <span>{extractedData.description}</span>
                    </div>
                  )}
                  <Button onClick={useExtractedData} className="w-full mt-4">
                    <Receipt className="mr-2 h-4 w-4" />
                    Use This Data
                  </Button>
                </CardContent>
              </Card>
            )}

            {extractedText && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    Raw Extracted Text
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={extractedText}
                    readOnly
                    placeholder="Extracted text will appear here..."
                    className="min-h-[200px] text-sm"
                  />
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OCRDocumentScanner;