function scrubSensitiveInfo(content) {
  content = content.replace(/[A-Za-z0-9_-]{20,}/g, 'API_KEY'); // API keys
  content = content.replace(/\b\d{3}[-.]?\d{2}[-.]?\d{4}\b/g, '+123456789'); // Phone numbers
  content = content.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, 'example@gmail.com'); // Emails
  content = content.replace(/\b\d{5}-\d{4}|\d{3}-\d{2}-\d{4}\b/g, '11111'); // Numeric codes
  content = content.replace(/\b[A-Z][a-z]+(?: [A-Z][a-z]+)*\b/g, 'FIRST_NAME'); // Names
  return content;
}

export { scrubSensitiveInfo };
