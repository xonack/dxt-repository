import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import DXT from '@/models/DXT';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const sort = searchParams.get('sort') || 'popularity';
    
    let query: any = { approved: true };
    
    if (search) {
      query = {
        ...query,
        $text: { $search: search }
      };
    }
    
    let sortOption: any;
    switch (sort) {
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'alphabetical':
        sortOption = { name: 1 };
        break;
      case 'popularity':
      default:
        sortOption = { downloads: -1 };
        break;
    }
    
    const dxtList = await DXT.find(query)
      .sort(sortOption)
      .select('-submittedBy -approved -updatedAt')
      .limit(50);
    
    return NextResponse.json({ dxtList });
  } catch (error) {
    console.error('Error fetching DXT:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch DXT',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}