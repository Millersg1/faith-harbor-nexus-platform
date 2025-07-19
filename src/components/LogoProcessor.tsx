import { useEffect, useState } from 'react';
import { removeBackground, loadImageFromSrc } from '@/utils/backgroundRemoval';
import faithHarborLogo from '@/assets/faith-harbor-logo.png';

interface LogoProcessorProps {
  onProcessed: (processedImageUrl: string) => void;
}

const LogoProcessor = ({ onProcessed }: LogoProcessorProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processLogo = async () => {
      try {
        setIsProcessing(true);
        setError(null);
        
        console.log('Loading lighthouse logo...');
        const img = await loadImageFromSrc(faithHarborLogo);
        
        console.log('Removing background...');
        const processedBlob = await removeBackground(img);
        
        console.log('Creating object URL...');
        const processedImageUrl = URL.createObjectURL(processedBlob);
        
        console.log('Background removal completed successfully');
        onProcessed(processedImageUrl);
        
      } catch (err) {
        console.error('Failed to process logo:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        // Fallback to original logo if processing fails
        onProcessed(faithHarborLogo);
      } finally {
        setIsProcessing(false);
      }
    };

    processLogo();
  }, [onProcessed]);

  if (isProcessing) {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gray-200 animate-pulse rounded"></div>
        <span className="text-sm text-gray-500">Processing logo...</span>
      </div>
    );
  }

  if (error) {
    console.warn('Logo processing failed, using original:', error);
  }

  return null;
};

export default LogoProcessor;