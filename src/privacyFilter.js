/**
 * Scrubs sensitive information from text content
 * - Improved regex patterns for better accuracy
 * - Added more data types for comprehensive protection
 * - Added configuration options for customization
 * - Better handling of edge cases
 * @param {string} content - The text content to scrub
 * @param {Object} options - Optional configuration settings
 * @returns {string} - The scrubbed content
 */
function scrubSensitiveInfo(content, options = {}) {
  // Default replacement values
  const defaults = {
    apiKeyReplacement: 'API_KEY',
    phoneReplacement: 'PHONE_NUMBER',
    emailReplacement: 'EMAIL@EXAMPLE.COM',
    ssnReplacement: 'SSN',
    zipReplacement: 'ZIP_CODE',
    nameReplacement: 'NAME',
    creditCardReplacement: 'CREDIT_CARD',
    addressReplacement: 'ADDRESS',
    ipReplacement: 'IP_ADDRESS',
    uuidReplacement: 'UUID',
    urlReplacement: 'URL',
    preserveFormat: true, // When true, tries to preserve the format of replaced items
  };

  // Merge defaults with provided options
  const config = { ...defaults, ...options };

  // Guard against non-string input
  if (typeof content !== 'string') {
    return '';
  }

  // Regular expressions for different types of sensitive data
  const patterns = {
    // API keys, auth tokens, and similar credentials (improved pattern)
    apiKeys: /(?![0-9]+$)[A-Za-z0-9_\-\.]{20,}/g,
    
    // Phone numbers with various formats
    phoneNumbers: /\b(?:\+\d{1,3}[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)\d{3}[-.\s]?\d{4}\b/g,
    
    // Email addresses (more comprehensive)
    emails: /\b[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}\b/g,
    
    // Social Security Numbers with various formats
    ssn: /\b\d{3}[-.\s]?\d{2}[-.\s]?\d{4}\b/g,
    
    // ZIP codes (both 5 and 9 digit formats)
    zipCodes: /\b\d{5}(?:[-\s]\d{4})?\b/g,
    
    // Names (basic pattern - will catch many but not all names)
    names: /\b[A-Z][a-z]+(?:[\s'-][A-Z][a-z]+)*\b/g,
    
    // Credit card numbers
    creditCards: /\b(?:\d{4}[-\s]?){3}\d{4}\b|\b\d{16}\b/g,
    
    // IP addresses
    ipAddresses: /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g,
    
    // UUIDs
    uuids: /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi,
    
    // URLs
    urls: /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi,
    
    // Street addresses (basic pattern)
    addresses: /\b\d+\s+[A-Za-z0-9\s,]+(?:Avenue|Ave|Street|St|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr|Court|Ct|Plaza|Plz|Way)\b/gi
  };

  // Function to replace while preserving format length if needed
  const formatPreservingReplace = (match, replacement) => {
    if (!config.preserveFormat) return replacement;
    // Keep the same length by padding or truncating
    if (match.length <= replacement.length) {
      return replacement.substring(0, match.length);
    } else {
      return replacement + '_'.repeat(match.length - replacement.length);
    }
  };

  // Scrub each type of sensitive data
  let result = content;

  // Replace API keys and tokens
  result = result.replace(patterns.apiKeys, match => 
    formatPreservingReplace(match, config.apiKeyReplacement));

  // Replace phone numbers
  result = result.replace(patterns.phoneNumbers, match => 
    formatPreservingReplace(match, config.phoneReplacement));

  // Replace email addresses
  result = result.replace(patterns.emails, match => 
    formatPreservingReplace(match, config.emailReplacement));

  // Replace SSNs
  result = result.replace(patterns.ssn, match => 
    formatPreservingReplace(match, config.ssnReplacement));

  // Replace ZIP codes
  result = result.replace(patterns.zipCodes, match => 
    formatPreservingReplace(match, config.zipReplacement));

  // Replace names (apply cautiously as may cause false positives)
  result = result.replace(patterns.names, match => 
    formatPreservingReplace(match, config.nameReplacement));

  // Replace credit card numbers
  result = result.replace(patterns.creditCards, match => 
    formatPreservingReplace(match, config.creditCardReplacement));

  // Replace IP addresses
  result = result.replace(patterns.ipAddresses, match => 
    formatPreservingReplace(match, config.ipReplacement));

  // Replace UUIDs
  result = result.replace(patterns.uuids, match => 
    formatPreservingReplace(match, config.uuidReplacement));

  // Replace URLs
  result = result.replace(patterns.urls, match => 
    formatPreservingReplace(match, config.urlReplacement));

  // Replace addresses
  result = result.replace(patterns.addresses, match => 
    formatPreservingReplace(match, config.addressReplacement));

  return result;
}

/**
 * Additional function to check if content contains sensitive information
 * @param {string} content - The text content to check
 * @returns {Object} - Object containing results of detection
 */
function detectSensitiveInfo(content) {
  if (typeof content !== 'string') return {};
  
  const results = {
    containsSensitiveInfo: false,
    detections: {}
  };

  const patterns = {
    apiKeys: /(?![0-9]+$)[A-Za-z0-9_\-\.]{20,}/g,
    phoneNumbers: /\b(?:\+\d{1,3}[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)\d{3}[-.\s]?\d{4}\b/g,
    emails: /\b[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}\b/g,
    ssn: /\b\d{3}[-.\s]?\d{2}[-.\s]?\d{4}\b/g,
    zipCodes: /\b\d{5}(?:[-\s]\d{4})?\b/g,
    creditCards: /\b(?:\d{4}[-\s]?){3}\d{4}\b|\b\d{16}\b/g,
    ipAddresses: /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g,
    uuids: /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi
  };

  for (const [type, pattern] of Object.entries(patterns)) {
    const matches = content.match(pattern) || [];
    if (matches.length > 0) {
      results.containsSensitiveInfo = true;
      results.detections[type] = matches.length;
    }
  }

  return results;
}

// Export both functions
export { scrubSensitiveInfo, detectSensitiveInfo };