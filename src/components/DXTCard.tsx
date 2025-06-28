'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, ExternalLink } from 'lucide-react';
interface DXTCardProps {
  dxt: {
    _id: string;
    name: string;
    description: string;
    downloadUrl: string;
    providerUrl: string;
    downloads: number;
  };
  onDownload: (dxtId: string, downloadUrl: string) => void;
}

export default function DXTCard({ dxt, onDownload }: DXTCardProps) {
  const handleDownload = () => {
    onDownload(dxt._id, dxt.downloadUrl);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-grow">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold">{dxt.name}</CardTitle>
          <Badge variant="secondary" className="ml-2">
            {dxt.downloads} downloads
          </Badge>
        </div>
        <CardDescription className="line-clamp-3">
          {dxt.description}
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
            onClick={() => window.open(dxt.providerUrl, '_blank')}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}