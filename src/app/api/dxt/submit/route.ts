import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import dbConnect from '@/lib/mongodb';
import DXT from '@/models/DXT';
import { dxtSubmissionSchema } from '@/lib/validations';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validatedData = dxtSubmissionSchema.parse(body);
    
    await dbConnect();
    
    const existingDXT = await DXT.findOne({
      $or: [
        { name: validatedData.name },
        { downloadUrl: validatedData.downloadUrl }
      ]
    });
    
    if (existingDXT) {
      return NextResponse.json(
        { error: 'A DXT with this name or download URL already exists' },
        { status: 400 }
      );
    }
    
    const newDXT = new DXT({
      ...validatedData,
      approved: false,
      downloads: 0,
    });
    
    await newDXT.save();
    
    if (process.env.RESEND_API_KEY && process.env.ADMIN_EMAIL) {
      try {
        await resend.emails.send({
          from: 'DXT Repository <noreply@dxt-repo.com>',
          to: [process.env.ADMIN_EMAIL],
          subject: 'New DXT Submission Pending Approval',
          html: `
            <h2>New DXT Submission</h2>
            <p><strong>Name:</strong> ${validatedData.name}</p>
            <p><strong>Description:</strong> ${validatedData.description}</p>
            <p><strong>Download URL:</strong> ${validatedData.downloadUrl}</p>
            <p><strong>Submitted by:</strong> ${validatedData.submittedBy}</p>
            <p><strong>Submitted at:</strong> ${new Date().toISOString()}</p>
            
            <p>Please review and approve/reject this submission in your admin panel.</p>
          `,
        });
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError);
      }
    }
    
    return NextResponse.json(
      { message: 'DXT submitted successfully. It will be reviewed by an admin.' },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid submission data', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Error submitting DXT:', error);
    return NextResponse.json(
      { 
        error: 'Failed to submit DXT',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}