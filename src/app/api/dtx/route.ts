import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import DTX from '@/models/DTX';

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
    
    const dtxList = await DTX.find(query)
      .sort(sortOption)
      .select('-submittedBy -approved -updatedAt')
      .limit(50);
    
    return NextResponse.json({ dtxList });
  } catch (error) {
    console.error('Error fetching DTX:', error);
    return NextResponse.json(
      { error: 'Failed to fetch DTX' },
      { status: 500 }
    );
  }
}