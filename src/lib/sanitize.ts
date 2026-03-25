/**
 * Input sanitization utilities to prevent XSS and injection attacks.
 */

/** Strip all HTML tags from a string */
export function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, '');
}

/** Sanitize user input: trim, strip HTML, enforce max length */
export function sanitizeInput(input: string, maxLength: number = 500): string {
  return stripHtml(input).trim().slice(0, maxLength);
}

/** Validate email format */
export function isValidEmail(email: string): boolean {
  return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email.trim());
}

/** Check for script injection patterns */
export function containsScriptInjection(input: string): boolean {
  return /<script/i.test(input) || /javascript:/i.test(input) || /on\w+\s*=/i.test(input);
}

/** Sanitize and validate a form field, returning error message or null */
export function validateField(
  value: string,
  fieldName: string,
  options: { required?: boolean; maxLength?: number; isEmail?: boolean } = {}
): string | null {
  const { required = true, maxLength = 500, isEmail = false } = options;
  const trimmed = value.trim();

  if (required && !trimmed) return `${fieldName} is required`;
  if (trimmed.length > maxLength) return `${fieldName} must be under ${maxLength} characters`;
  if (containsScriptInjection(trimmed)) return `${fieldName} contains invalid content`;
  if (isEmail && !isValidEmail(trimmed)) return `Please enter a valid email`;

  return null;
}
