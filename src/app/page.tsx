'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import SearchAndSort from '@/components/SearchAndSort';
import DXTGrid from '@/components/DXTGrid';
export default function Home() {
  const [dxtList, setDxtList] = useState<Array<{
    _id: string;
    name: string;
    description: string;
    downloadUrl: string;
    providerUrl: string;
    downloads: number;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('popularity');

  const fetchDXT = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search,
        sort,
      });
      
      const response = await fetch(`/api/dxt?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        setDxtList(data.dxtList);
      } else {
        console.error('Failed to fetch DXT:', data.error);
      }
    } catch (error) {
      console.error('Error fetching DXT:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDXT();
  }, [search, sort]);

  const handleDownload = async (dxtId: string, downloadUrl: string) => {
    try {
      await fetch('/api/dxt/track-download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dxtId }),
      });
      
      window.open(downloadUrl, '_blank');
      
      fetchDXT();
    } catch (error) {
      console.error('Error tracking download:', error);
      window.open(downloadUrl, '_blank');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">.dxt repository</h1>
          <p className="text-xl text-muted-foreground mb-3">
            Browse and share Desktop Extensions that enhance your AI workflow
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>New to .dxt?</span>
            <a 
              href="https://www.anthropic.com/engineering/desktop-extensions" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-foreground hover:text-blue-600 transition-colors"
            >
              Learn more
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
        <div className="mt-4 lg:mt-0">
          <Link href="/submit">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Submit .dxt
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

      <DXTGrid 
        dxtList={dxtList}
        loading={loading}
        onDownload={handleDownload}
      />
    </div>
  );
}
