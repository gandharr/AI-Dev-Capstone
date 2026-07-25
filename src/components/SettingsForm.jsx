import { useState } from 'react';
import {
  INITIAL_SETTINGS,
  hasErrors,
  validateField,
  validateSettings,
} from '../utils/validation';
import './SettingsForm.css';

export default function SettingsForm() {
  const [formData, setFormData] = useState(INITIAL_SETTINGS);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    const nextValue = type === 'checkbox' ? checked : value;

    setFormData((current) => ({ ...current, [name]: nextValue }));
    setStatus({ type: '', message: '' });

    if (touched[name]) {
      setErrors((current) => ({
        ...current,
        [name]: validateField(name, nextValue),
      }));
    }
  };

  const handleBlur = (event) => {
    const { name, value, type, checked } = event.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setTouched((current) => ({ ...current, [name]: true }));
    setErrors((current) => ({
      ...current,
      [name]: validateField(name, fieldValue),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    const validationErrors = validateSettings(formData);
    setErrors(validationErrors);
    setTouched({
      displayName: true,
      email: true,
      username: true,
      bio: true,
      theme: true,
      language: true,
    });

    if (hasErrors(validationErrors)) {
      setStatus({ type: 'error', message: 'Fix the highlighted fields before saving.' });
      setIsSubmitting(false);
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 600));

    setStatus({ type: 'success', message: 'Settings saved successfully.' });
    setIsSubmitting(false);
  };

  const handleReset = () => {
    setFormData(INITIAL_SETTINGS);
    setErrors({});
    setTouched({});
    setStatus({ type: '', message: '' });
  };

  return (
    <form className="settings-form" onSubmit={handleSubmit} noValidate>
      <header className="settings-form__header">
        <h1>Account Settings</h1>
        <p>Update your profile and preferences. Fields marked with * are required.</p>
      </header>

      {status.message && (
        <div className={`settings-form__alert settings-form__alert--${status.type}`} role="alert">
          {status.message}
        </div>
      )}

      <section className="settings-form__section">
        <h2>Profile</h2>

        <div className="form-field">
          <label htmlFor="displayName">Display name *</label>
          <input
            id="displayName"
            name="displayName"
            type="text"
            value={formData.displayName}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(errors.displayName)}
            aria-describedby={errors.displayName ? 'displayName-error' : undefined}
            autoComplete="name"
          />
          {errors.displayName && (
            <p id="displayName-error" className="form-field__error">
              {errors.displayName}
            </p>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="email">Email *</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
            autoComplete="email"
          />
          {errors.email && (
            <p id="email-error" className="form-field__error">
              {errors.email}
            </p>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="username">Username *</label>
          <input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(errors.username)}
            aria-describedby={errors.username ? 'username-error' : undefined}
            autoComplete="username"
          />
          {errors.username && (
            <p id="username-error" className="form-field__error">
              {errors.username}
            </p>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            rows={4}
            value={formData.bio}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(errors.bio)}
            aria-describedby="bio-help bio-error"
            maxLength={200}
          />
          <p id="bio-help" className="form-field__hint">
            {formData.bio.length}/200 characters
          </p>
          {errors.bio && (
            <p id="bio-error" className="form-field__error">
              {errors.bio}
            </p>
          )}
        </div>
      </section>

      <section className="settings-form__section">
        <h2>Preferences</h2>

        <div className="form-field">
          <label htmlFor="theme">Theme</label>
          <select
            id="theme"
            name="theme"
            value={formData.theme}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(errors.theme)}
          >
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
          {errors.theme && <p className="form-field__error">{errors.theme}</p>}
        </div>

        <div className="form-field">
          <label htmlFor="language">Language</label>
          <select
            id="language"
            name="language"
            value={formData.language}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(errors.language)}
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
          {errors.language && <p className="form-field__error">{errors.language}</p>}
        </div>

        <div className="form-field form-field--checkbox">
          <label htmlFor="emailNotifications">
            <input
              id="emailNotifications"
              name="emailNotifications"
              type="checkbox"
              checked={formData.emailNotifications}
              onChange={handleChange}
            />
            Email me about product updates
          </label>
        </div>
      </section>

      <div className="settings-form__actions">
        <button type="button" className="button button--secondary" onClick={handleReset}>
          Reset
        </button>
        <button type="submit" className="button button--primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save settings'}
        </button>
      </div>
    </form>
  );
}
