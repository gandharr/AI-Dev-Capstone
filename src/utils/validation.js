const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_PATTERN = /^[a-zA-Z0-9_]+$/;

export const INITIAL_SETTINGS = {
  displayName: '',
  email: '',
  username: '',
  bio: '',
  theme: 'system',
  emailNotifications: true,
  language: 'en',
};

export function validateField(name, value) {
  switch (name) {
    case 'displayName':
      if (!value.trim()) return 'Display name is required.';
      if (value.trim().length < 2) return 'Display name must be at least 2 characters.';
      if (value.trim().length > 50) return 'Display name must be 50 characters or fewer.';
      return '';

    case 'email':
      if (!value.trim()) return 'Email is required.';
      if (!EMAIL_PATTERN.test(value.trim())) return 'Enter a valid email address.';
      return '';

    case 'username':
      if (!value.trim()) return 'Username is required.';
      if (value.length < 3) return 'Username must be at least 3 characters.';
      if (value.length > 20) return 'Username must be 20 characters or fewer.';
      if (!USERNAME_PATTERN.test(value)) {
        return 'Username may only contain letters, numbers, and underscores.';
      }
      return '';

    case 'bio':
      if (value.length > 200) return 'Bio must be 200 characters or fewer.';
      return '';

    case 'theme':
      if (!['light', 'dark', 'system'].includes(value)) return 'Select a valid theme.';
      return '';

    case 'language':
      if (!['en', 'es', 'fr', 'de'].includes(value)) return 'Select a valid language.';
      return '';

    default:
      return '';
  }
}

export function validateSettings(formData) {
  const fieldsToValidate = ['displayName', 'email', 'username', 'bio', 'theme', 'language'];
  const errors = {};

  for (const field of fieldsToValidate) {
    const message = validateField(field, formData[field]);
    if (message) errors[field] = message;
  }

  return errors;
}

export function hasErrors(errors) {
  return Object.keys(errors).length > 0;
}
