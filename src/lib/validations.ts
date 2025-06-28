import { z } from 'zod';

export const dxtSubmissionSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name cannot be more than 100 characters')
    .trim(),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(500, 'Description cannot be more than 500 characters')
    .trim(),
  downloadUrl: z
    .string()
    .url('Please enter a valid URL')
    .min(1, 'Download URL is required'),
  providerUrl: z
    .string()
    .url('Please enter a valid URL')
    .min(1, 'Provider URL is required'),
  submittedBy: z
    .string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required'),
});

export type DXTSubmissionData = z.infer<typeof dxtSubmissionSchema>;