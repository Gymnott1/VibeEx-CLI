/**
 * Functions for trimming files based on character ranges
 */

/**
 * Processes content by applying character range trimming/cutting
 * 
 * @param {string} content - The file content to process
 * @param {object} options - Trim/cut options
 * @returns {string} - The processed content
 */
function processCharacterRanges(content, options) {
  let result = content;
  
  // Process trim ranges - only keep characters within these ranges
  if (options.trim && options.trim.length > 0) {
    // Convert content to array for easier manipulation
    const contentArray = [...content];
    let newContent = [];
    
    // Process each trim range
    for (const range of options.trim) {
      const [start, end] = parseRange(range, content.length);
      if (start !== null && end !== null) {
        // Add characters from this range to the result
        newContent.push(...contentArray.slice(start, end + 1));
      }
    }
    
    result = newContent.join('');
  }
  
  // Process cut ranges - remove characters within these ranges
  if (options.cut && options.cut.length > 0) {
    // Convert content to array for easier manipulation
    const contentArray = [...result];
    let newContent = [...contentArray];
    
    // Process each cut range (in reverse to maintain indices)
    for (const range of options.cut.sort((a, b) => {
      const [aStart] = parseRange(a, result.length);
      const [bStart] = parseRange(b, result.length);
      return bStart - aStart; // Sort in descending order
    })) {
      const [start, end] = parseRange(range, result.length);
      if (start !== null && end !== null) {
        // Remove characters from this range
        newContent.splice(start, end - start + 1);
      }
    }
    
    result = newContent.join('');
  }
  
  return result;
}

/**
 * Parse a range string into start and end indices
 * 
 * @param {string} rangeStr - Range string in format "start-end"
 * @param {number} contentLength - Length of the content for handling wildcards
 * @returns {Array} - [startIndex, endIndex] or [null, null] if invalid
 */
function parseRange(rangeStr, contentLength) {
  // Clean up any quotes or parentheses that might be in the range string
  const cleanRange = rangeStr.replace(/['"()]/g, '');
  const match = cleanRange.match(/^(s|\*|\d+)-(e|\*|\d+)$/);
  if (!match) return [null, null];
  
  let [_, startStr, endStr] = match;
  
  // Convert wildcard or special values to actual value
  const start = startStr === '*' || startStr === 's' ? 0 : parseInt(startStr, 10);
  const end = endStr === '*' || endStr === 'e' ? contentLength - 1 : parseInt(endStr, 10);
  
  // Validate range
  if (isNaN(start) || isNaN(end) || start < 0 || end >= contentLength || start > end) {
    console.warn(`Invalid range: ${cleanRange} (converted to ${start}-${end}, content length: ${contentLength})`);
    return [null, null];
  }
  
  return [start, end];
}

/**
 * Extract and parse character range options from command line arguments
 * 
 * @param {object} options - Command line options
 * @returns {object} - Parsed trim and cut options
 */
function extractCharacterRangeOptions(options) {
  const result = {
    trim: [],
    cut: []
  };
  
  if (options.trim) {
    // Handle trim ranges
    const trimRanges = Array.isArray(options.trim) ? options.trim : [options.trim];
    result.trim = trimRanges;
  }
  
  if (options.cut) {
    // Handle cut ranges
    const cutRanges = Array.isArray(options.cut) ? options.cut : [options.cut];
    result.cut = cutRanges;
  }
  
  return result;
}

export { processCharacterRanges, extractCharacterRangeOptions };