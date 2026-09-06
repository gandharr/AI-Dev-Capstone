import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SettingsForm } from './SettingsForm';

describe('SettingsForm Component', () => {
  it('renders the form with accessible labels and submit button', () => {
    render(<SettingsForm />);

    // Query strictly by accessible role and label, never by test ID or CSS class
    expect(
      screen.getByRole('form', { name: /api configuration form/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/api key/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /save configuration/i })
    ).toBeInTheDocument();
  });

  it('displays validation alert when submitted with an empty API key', async () => {
    const user = userEvent.setup();
    render(<SettingsForm />);

    const submitButton = screen.getByRole('button', {
      name: /save configuration/i,
    });
    await user.click(submitButton);

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/api key is required/i);
    expect(screen.getByLabelText(/api key/i)).toHaveAttribute(
      'aria-invalid',
      'true'
    );
  });

  it('displays error alert when key prefix is invalid', async () => {
    const user = userEvent.setup();
    render(<SettingsForm />);

    const input = screen.getByLabelText(/api key/i);
    await user.type(input, 'invalid_key_123456');

    const submitButton = screen.getByRole('button', {
      name: /save configuration/i,
    });
    await user.click(submitButton);

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/must start with valid prefix/i);
  });

  it('successfully validates and invokes onSave callback with valid key', async () => {
    const user = userEvent.setup();
    const handleSave = vi.fn().mockResolvedValue(undefined);

    render(<SettingsForm onSave={handleSave} />);

    const input = screen.getByLabelText(/api key/i);
    await user.type(input, 'AIzaSyDemoValidAPIKey12345678');

    const submitButton = screen.getByRole('button', {
      name: /save configuration/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(handleSave).toHaveBeenCalledWith('AIzaSyDemoValidAPIKey12345678');
    });

    const statusMessage = await screen.findByRole('status');
    expect(statusMessage).toHaveTextContent(
      /configuration saved successfully/i
    );
  });
});
