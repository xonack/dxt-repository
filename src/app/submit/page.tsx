'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { dxtSubmissionSchema, type DXTSubmissionData } from '@/lib/validations';
import { ArrowLeft, Send, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function SubmitPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DXTSubmissionData>({
    resolver: zodResolver(dxtSubmissionSchema),
  });

  const onSubmit = async (data: DXTSubmissionData) => {
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/dxt/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setShowSuccessDialog(true);
        reset();
      } else {
        setError(result.error || 'Failed to submit DXT');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Repository
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Submit Your DXT Extension</CardTitle>
          <CardDescription>
            Share your Desktop Extension with the community. Submissions will be reviewed before appearing in the repository.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Extension Name</Label>
              <Input
                id="name"
                placeholder="Enter the name of your DXT extension"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what your extension does and its key features..."
                rows={4}
                {...register('description')}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="downloadUrl">Download URL</Label>
              <Input
                id="downloadUrl"
                type="url"
                placeholder="https://github.com/user/repo/releases/download/..."
                {...register('downloadUrl')}
              />
              {errors.downloadUrl && (
                <p className="text-sm text-destructive">{errors.downloadUrl.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="providerUrl">Provider Website URL</Label>
              <Input
                id="providerUrl"
                type="url"
                placeholder="https://your-website.com or https://github.com/user/repo"
                {...register('providerUrl')}
              />
              {errors.providerUrl && (
                <p className="text-sm text-destructive">{errors.providerUrl.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="submittedBy">Your Email</Label>
              <Input
                id="submittedBy"
                type="email"
                placeholder="your.email@example.com"
                {...register('submittedBy')}
              />
              {errors.submittedBy && (
                <p className="text-sm text-destructive">{errors.submittedBy.message}</p>
              )}
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                'Submitting...'
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit DXT Extension
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
              Submission Successful!
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              Thank you for submitting your DXT extension! Your submission has been received and will be reviewed by our team.
            </p>
            <p className="text-sm text-muted-foreground">
              You'll be notified via email once your extension has been approved and is live in the repository.
            </p>
            <div className="flex gap-2">
              <Button onClick={() => setShowSuccessDialog(false)} variant="outline">
                Submit Another
              </Button>
              <Link href="/" className="flex-1">
                <Button className="w-full">
                  Browse Repository
                </Button>
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}