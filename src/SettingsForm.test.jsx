import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import SettingsForm from './SettingsForm';

describe('SettingsForm', () => {
  test('submit button starts disabled', () => {
    render(<SettingsForm />);
    expect(screen.getByRole('button', { name: /save settings/i })).toBeDisabled();
  });

  test('shows validation errors for required fields', async () => {
    const user = userEvent.setup();
    render(<SettingsForm />);

    const nameInput = screen.getByLabelText(/full name/i);
    await user.click(nameInput);
    await user.tab(); // blur to trigger touch

    expect(await screen.findByText(/full name is required/i)).toBeInTheDocument();
  });

  test('validates github url', async () => {
    const user = userEvent.setup();
    render(<SettingsForm />);

    const githubInput = screen.getByLabelText(/github url/i);
    await user.type(githubInput, 'https://example.com');
    await user.tab();

    expect(await screen.findByText(/must be a valid github url/i)).toBeInTheDocument();
  });

  test('enables submit button when valid and touched', async () => {
    const user = userEvent.setup();
    render(<SettingsForm />);

    await user.type(screen.getByLabelText(/full name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/github url/i), 'https://github.com/johndoe');
    
    // button should be enabled now
    const submitBtn = screen.getByRole('button', { name: /save settings/i });
    expect(submitBtn).toBeEnabled();
  });

  test('shows success message on successful submit', async () => {
    const user = userEvent.setup();
    render(<SettingsForm />);

    await user.type(screen.getByLabelText(/full name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/github url/i), 'https://github.com/johndoe');
    
    const submitBtn = screen.getByRole('button', { name: /save settings/i });
    await user.click(submitBtn);

    expect(await screen.findByRole('alert')).toHaveTextContent(/settings saved successfully/i);
  });
});
