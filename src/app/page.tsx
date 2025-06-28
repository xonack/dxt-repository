'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import SearchAndSort from '@/components/SearchAndSort';
import DTXGrid from '@/components/DTXGrid';
export default function Home() {
  const [dtxList, setDtxList] = useState<Array<{
    _id: string;
    name: string;
    description: string;
    downloadUrl: string;
    downloads: number;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('popularity');

  const fetchDTX = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search,
        sort,
      });
      
      const response = await fetch(`/api/dtx?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        setDtxList(data.dtxList);
      } else {
        console.error('Failed to fetch DTX:', data.error);
      }
    } catch (error) {
      console.error('Error fetching DTX:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDTX();
  }, [search, sort]);

  const handleDownload = async (dtxId: string, downloadUrl: string) => {
    try {
      await fetch('/api/dtx/track-download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dtxId }),
      });
      
      window.open(downloadUrl, '_blank');
      
      fetchDTX();
    } catch (error) {
      console.error('Error tracking download:', error);
      window.open(downloadUrl, '_blank');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">DTX Repository</h1>
          <p className="text-xl text-muted-foreground">
            Discover and share Desktop Extensions for enhanced productivity
          </p>
        </div>
        <div className="mt-4 lg:mt-0">
          <Link href="/submit">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Submit DTX
            </Button>
          </Link>
        </div>
      </div>

      <SearchAndSort 
        search={search}
        sort={sort}
        onSearchChange={setSearch}
        onSortChange={setSort}
      />

      <DTXGrid 
        dtxList={dtxList}
        loading={loading}
        onDownload={handleDownload}
      />
    </div>
  );
}
