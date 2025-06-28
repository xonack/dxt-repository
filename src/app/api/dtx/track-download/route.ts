import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import DTX from '@/models/DTX';

export async function POST(request: NextRequest) {
  try {
    const { dtxId } = await request.json();
    
    if (!dtxId) {
      return NextResponse.json(
        { error: 'DTX ID is required' },
        { status: 400 }
      );
    }
    
    await dbConnect();
    
    const dtx = await DTX.findByIdAndUpdate(
      dtxId,
      { $inc: { downloads: 1 } },
      { new: true }
    );
    
    if (!dtx) {
      return NextResponse.json(
        { error: 'DTX not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      message: 'Download tracked successfully',
      downloads: dtx.downloads 
    });
  } catch (error) {
    console.error('Error tracking download:', error);
    return NextResponse.json(
      { error: 'Failed to track download' },
      { status: 500 }
    );
  }
}