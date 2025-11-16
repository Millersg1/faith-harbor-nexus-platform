import React, { Suspense, lazy, ComponentType } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Loading states for different component types
export const ComponentSkeleton = () => (
  <div className="space-y-4 p-4">
    <Skeleton className="h-8 w-3/4" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-2/3" />
    <Skeleton className="h-32 w-full" />
  </div>
);

export const CardSkeleton = () => (
  <div className="space-y-3 p-6 border rounded-lg">
    <Skeleton className="h-6 w-1/2" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-3/4" />
  </div>
);

export const TableSkeleton = () => (
  <div className="space-y-2">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex space-x-4">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 flex-1" />
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-20" />
      </div>
    ))}
  </div>
);

// Lazy loading with error boundaries and loading states
export const createLazyComponent = <P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  fallback?: React.ReactNode
) => {
  const LazyComponent = lazy(importFn);
  
  return React.forwardRef<any, P>((props, ref) => (
    <Suspense fallback={fallback || <ComponentSkeleton />}>
      <LazyComponent {...props} ref={ref} />
    </Suspense>
  ));
};

// Image optimization component
interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  priority = false,
  placeholder = 'empty',
  className,
  ...props
}) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);

  const handleLoad = () => setIsLoading(false);
  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && placeholder === 'blur' && (
        <Skeleton 
          className="absolute inset-0" 
          style={{ width: width || '100%', height: height || '100%' }} 
        />
      )}
      
      {hasError ? (
        <div 
          className="flex items-center justify-center bg-muted text-muted-foreground"
          style={{ width: width || '100%', height: height || '100%' }}
        >
          <span className="text-sm">Failed to load</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          onLoad={handleLoad}
          onError={handleError}
          className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          {...props}
        />
      )}
    </div>
  );
};

// Resource preloader
export const preloadResources = (resources: string[]) => {
  resources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource;
    
    if (resource.endsWith('.js')) {
      link.as = 'script';
    } else if (resource.endsWith('.css')) {
      link.as = 'style';
    } else if (resource.match(/\.(jpg|jpeg|png|webp|gif)$/)) {
      link.as = 'image';
    } else if (resource.match(/\.(woff|woff2|ttf|otf)$/)) {
      link.as = 'font';
      link.crossOrigin = 'anonymous';
    }
    
    document.head.appendChild(link);
  });
};

// Critical resource preloader hook
export const useCriticalResources = (resources: string[]) => {
  React.useEffect(() => {
    preloadResources(resources);
  }, [resources]);
};

// Bundle size analyzer (development only)
export const BundleAnalyzer: React.FC = () => {
  React.useEffect(() => {
    if (import.meta.env.DEV) {
      const analyzeBundle = () => {
        const scripts = Array.from(document.scripts);
        const stylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
        
        console.group('Bundle Analysis');
        console.log('Scripts:', scripts.map(s => ({ src: s.src, size: s.textContent?.length })));
        console.log('Stylesheets:', stylesheets.map(s => ({ href: (s as HTMLLinkElement).href })));
        console.log('Performance entries:', performance.getEntriesByType('resource'));
        console.groupEnd();
      };

      setTimeout(analyzeBundle, 2000);
    }
  }, []);

  return null;
};