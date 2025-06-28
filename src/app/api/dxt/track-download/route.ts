import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import DXT from '@/models/DXT';

export async function POST(request: NextRequest) {
  try {
    const { dxtId } = await request.json();
    
    if (!dxtId) {
      return NextResponse.json(
        { error: 'DXT ID is required' },
        { status: 400 }
      );
    }
    
    await dbConnect();
    
    const dxt = await DXT.findByIdAndUpdate(
      dxtId,
      { $inc: { downloads: 1 } },
      { new: true }
    );
    
    if (!dxt) {
      return NextResponse.json(
        { error: 'DXT not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      message: 'Download tracked successfully',
      downloads: dxt.downloads 
    });
  } catch (error) {
    console.error('Error tracking download:', error);
    return NextResponse.json(
      { error: 'Failed to track download' },
      { status: 500 }
    );
  }
}