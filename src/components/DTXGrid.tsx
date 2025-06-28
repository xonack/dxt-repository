'use client';

import { Skeleton } from '@/components/ui/skeleton';
import DTXCard from './DTXCard';

interface DTXGridProps {
  dtxList: Array<{
    _id: string;
    name: string;
    description: string;
    downloadUrl: string;
    downloads: number;
  }>;
  loading: boolean;
  onDownload: (dtxId: string, downloadUrl: string) => void;
}

export default function DTXGrid({ dtxList, loading, onDownload }: DTXGridProps) {
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

  if (dtxList.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No DTX extensions found.</p>
        <p className="text-muted-foreground">Try adjusting your search or check back later for new submissions.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {dtxList.map((dtx) => (
        <DTXCard key={dtx._id} dtx={dtx} onDownload={onDownload} />
      ))}
    </div>
  );
}