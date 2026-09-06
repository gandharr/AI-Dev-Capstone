'use client';

import React, { useState } from 'react';
import { MotionButton } from '@/components/ui/MotionButton';
import { KeyRound, Check, AlertCircle } from 'lucide-react';

interface SettingsFormProps {
  onSave?: (apiKey: string) => Promise<void>;
  initialApiKey?: string;
}

export function SettingsForm({ onSave, initialApiKey = '' }: SettingsFormProps) {
  const [apiKey, setApiKey] = useState(initialApiKey);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (value: string): string | null => {
    if (!value.trim()) {
      return 'API key is required';
    }
    if (value.length < 10) {
      return 'API key must be at least 10 characters long';
    }
    if (!value.startsWith('AIza') && !value.startsWith('sk-')) {
      return 'API key must start with valid prefix (AIza... or sk-...)';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate(apiKey);
    if (validationError) {
      setError(validationError);
      setSuccess(false);
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      if (onSave) {
        await onSave(apiKey);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 600));
      }
      setSuccess(true);
    } catch {
      setError('Failed to save API configuration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-card border border-border rounded-xl shadow-sm space-y-5" aria-label="API Configuration Form">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-primary" />
          API Configuration
        </h2>
        <p className="text-sm text-muted-foreground">Configure your Google Gemini or OpenAI API credentials.</p>
      </div>

      <div className="space-y-2">
        <label htmlFor="api-key-input" className="block text-sm font-medium text-foreground">
          API Key
        </label>
        <input
          id="api-key-input"
          name="apiKey"
          type="password"
          value={apiKey}
          onChange={(e) => {
            setApiKey(e.target.value);
            if (error) setError(null);
          }}
          placeholder="AIzaSy... or sk-..."
          aria-invalid={!!error}
          aria-describedby={error ? 'api-key-error' : undefined}
          className="w-full p-2.5 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
        />

        {error && (
          <p id="api-key-error" role="alert" className="text-xs text-destructive font-medium flex items-center gap-1.5 mt-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{error}</span>
          </p>
        )}

        {success && !error && (
          <p role="status" className="text-xs text-emerald-500 font-medium flex items-center gap-1.5 mt-1">
            <Check className="w-3.5 h-3.5" />
            <span>Configuration saved successfully!</span>
          </p>
        )}
      </div>

      <div className="pt-2">
        <MotionButton
          type="submit"
          disabled={isSubmitting}
          loadingText="Saving..."
          successText="Saved!"
          errorText="Error"
          variant="primary"
          size="md"
        >
          Save Configuration
        </MotionButton>
      </div>
    </form>
  );
}
