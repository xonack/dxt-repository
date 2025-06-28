'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, ExternalLink } from 'lucide-react';
interface DTXCardProps {
  dtx: {
    _id: string;
    name: string;
    description: string;
    downloadUrl: string;
    downloads: number;
  };
  onDownload: (dtxId: string, downloadUrl: string) => void;
}

export default function DTXCard({ dtx, onDownload }: DTXCardProps) {
  const handleDownload = () => {
    onDownload(dtx._id, dtx.downloadUrl);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-grow">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold">{dtx.name}</CardTitle>
          <Badge variant="secondary" className="ml-2">
            {dtx.downloads} downloads
          </Badge>
        </div>
        <CardDescription className="line-clamp-3">
          {dtx.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex gap-2">
          <Button onClick={handleDownload} className="flex-1">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => window.open(dtx.downloadUrl, '_blank')}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}