'use client';

import { Skeleton } from '@/components/ui/skeleton';
import DXTCard from './DXTCard';

interface DXTGridProps {
  dxtList: Array<{
    _id: string;
    name: string;
    description: string;
    downloadUrl: string;
    providerUrl: string;
    downloads: number;
  }>;
  loading: boolean;
  onDownload: (dxtId: string, downloadUrl: string) => void;
}

export default function DXTGrid({ dxtList, loading, onDownload }: DXTGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-[200px] w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (dxtList.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No DXT extensions found.</p>
        <p className="text-muted-foreground">Try adjusting your search or check back later for new submissions.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {dxtList.map((dxt) => (
        <DXTCard key={dxt._id} dxt={dxt} onDownload={onDownload} />
      ))}
    </div>
  );
}