import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  githubUrl: z
    .string()
    .url('Invalid URL')
    .refine((val) => val.includes('github.com'), {
      message: 'Must be a valid GitHub URL',
    }),
  portfolioUrl: z.union([z.literal(''), z.string().url('Invalid URL')]).optional(),
  bio: z.string().max(250, 'Bio must be 250 characters or less').optional(),
});

export default function SettingsForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty, isSubmitting, isSubmitSuccessful },
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onTouched',
  });

  const onSubmit = async (data) => {
    // Simulate an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Saved:', data);
        resolve();
      }, 500);
    });
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
      
      {isSubmitSuccessful && (
        <div className="mb-4 p-4 text-green-700 bg-green-100 rounded-md" role="alert">
          Settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="fullName">
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            {...register('fullName')}
          />
          {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            {...register('email')}
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="githubUrl">
            GitHub URL
          </label>
          <input
            id="githubUrl"
            type="url"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            {...register('githubUrl')}
          />
          {errors.githubUrl && <p className="mt-1 text-sm text-red-600">{errors.githubUrl.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="portfolioUrl">
            Portfolio URL (Optional)
          </label>
          <input
            id="portfolioUrl"
            type="url"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            {...register('portfolioUrl')}
          />
          {errors.portfolioUrl && <p className="mt-1 text-sm text-red-600">{errors.portfolioUrl.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="bio">
            Bio
          </label>
          <textarea
            id="bio"
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            {...register('bio')}
          />
          {errors.bio && <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>}
        </div>

        <div>
          <button
            type="submit"
            disabled={!isDirty || !isValid || isSubmitting}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
