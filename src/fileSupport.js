// src/fileSupport.js

/**
 * File type support information and utilities
 */
const fileTypeSupport = {
    // Full support - detailed parsing and advanced features
    fullSupport: [
      '.js', '.jsx', '.ts', '.tsx',  // JavaScript/TypeScript
      '.py',                        // Python
      '.html', '.htm',              // HTML
      '.css', '.scss',              // CSS
      '.md',                        // Markdown
      '.json',                      // JSON
    ],
    
    // Partial support - basic parsing and features
    partialSupport: [
      '.rb',                        // Ruby
      '.go',                        // Go
      '.swift',                     // Swift
      '.kt', '.kts',                // Kotlin
      '.java',                      // Java
      '.c', '.cpp', '.h', '.hpp',   // C/C++
      '.php',                       // PHP
      '.rs',                        // Rust
      '.sh', '.bash',               // Shell scripts
      '.xml', '.svg',               // XML formats
      '.yaml', '.yml',              // YAML
      '.sql',                       // SQL
      '.less',                      // Less CSS
    ],
    
    // Basic support - minimal processing
    basicSupport: [
      '.txt',                       // Plain text
      '.csv',                       // CSV
      '.ini',                       // INI config
      '.conf',                      // Config files
      '.toml',                      // TOML
      '.env',                       // Environment variables
      '.gitignore',                 // Git ignore
      '.dockerignore',              // Docker ignore
      '.ps1',                       // PowerShell
      '.pl', '.pm',                 // Perl
      '.r',                         // R
      '.elm',                       // Elm
      '.lua',                       // Lua
      '.dart',                      // Dart
      '.ex', '.exs',                // Elixir
      '.hs',                        // Haskell
      '.fs', '.fsx',                // F#
    ],
    
    // File categories for organization
    categories: {
      'frontend': ['.js', '.jsx', '.ts', '.tsx', '.html', '.css', '.scss', '.less', '.svg'],
      'backend': ['.js', '.ts', '.py', '.rb', '.go', '.java', '.php', '.cs', '.rs'],
      'config': ['.json', '.yaml', '.yml', '.toml', '.ini', '.conf', '.env'],
      'documentation': ['.md', '.txt', '.rst', '.adoc'],
      'data': ['.json', '.csv', '.xml', '.yaml', '.yml'],
      'script': ['.sh', '.bash', '.ps1', '.bat', '.cmd']
    },
    
    /**
     * Checks if a file extension has full support
     * @param {string} extension - File extension
     * @returns {boolean} - Whether the extension has full support
     */
    hasFullSupport(extension) {
      return this.fullSupport.includes(extension.toLowerCase());
    },
    
    /**
     * Checks if a file extension has at least partial support
     * @param {string} extension - File extension
     * @returns {boolean} - Whether the extension has at least partial support
     */
    hasPartialSupport(extension) {
      return this.partialSupport.includes(extension.toLowerCase());
    },
    
    /**
     * Checks if a file extension has any level of support
     * @param {string} extension - File extension
     * @returns {boolean} - Whether the extension has any support
     */
    isSupported(extension) {
      extension = extension.toLowerCase();
      return this.fullSupport.includes(extension) || 
             this.partialSupport.includes(extension) || 
             this.basicSupport.includes(extension);
    },
    
    /**
     * Gets the support level for a file extension
     * @param {string} extension - File extension
     * @returns {string} - Support level (full, partial, basic, or unsupported)
     */
    getSupportLevel(extension) {
      extension = extension.toLowerCase();
      if (this.fullSupport.includes(extension)) return 'full';
      if (this.partialSupport.includes(extension)) return 'partial';
      if (this.basicSupport.includes(extension)) return 'basic';
      return 'unsupported';
    }
  };
  
  /**
   * Gets the category of a file based on its extension
   * @param {string} extension - File extension
   * @returns {string} - Category of the file
   */
  function getFileCategory(extension) {
    extension = extension.toLowerCase();
    
    for (const [category, extensions] of Object.entries(fileTypeSupport.categories)) {
      if (extensions.includes(extension)) {
        return category;
      }
    }
    
    return 'other';
  }
  
  /**
   * Checks if a file is binary (not text)
   * @param {string} filePath - Path to the file
   * @returns {Promise<boolean>} - Whether the file is binary
   */
  async function isBinaryFile(filePath) {
    try {
      const { default: isBinary } = await import('is-binary-file');
      return await isBinary(filePath);
    } catch (error) {
      // Fallback to extension-based check if module not available
      const binaryExtensions = [
        '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.ico', '.tif', '.tiff',
        '.pdf', '.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx',
        '.zip', '.tar', '.gz', '.7z', '.rar', '.exe', '.dll', '.so',
        '.mp3', '.mp4', '.avi', '.mov', '.wav', '.ogg', '.flac',
        '.ttf', '.otf', '.woff', '.woff2'
      ];
      
      const extension = require('path').extname(filePath).toLowerCase();
      return binaryExtensions.includes(extension);
    }
  }
  
  /**
   * Gets language-specific parser options for a file
   * @param {string} extension - File extension
   * @returns {Object} - Parser options
   */
  function getParserOptions(extension) {
    extension = extension.toLowerCase();
    
    // Default options for all parsers
    const defaultOptions = {
      removeComments: true,
      preserveDocstrings: false
    };
    
    // Language-specific options
    const languageOptions = {
      '.js': { parser: 'babel', plugins: ['jsx'] },
      '.jsx': { parser: 'babel', plugins: ['jsx'] },
      '.ts': { parser: 'typescript' },
      '.tsx': { parser: 'typescript', plugins: ['jsx'] },
      '.py': { parser: 'python', keepDocstrings: true },
      '.html': { parser: 'html' },
      '.css': { parser: 'css' },
      '.scss': { parser: 'scss' },
      '.md': { parser: 'markdown' },
      '.json': { parser: 'json' },
      '.rb': { parser: 'ruby' },
      '.go': { parser: 'go' },
      '.swift': { parser: 'swift' },
      '.kt': { parser: 'kotlin' },
      '.java': { parser: 'java' },
      '.php': { parser: 'php' }
    };
    
    return {
      ...defaultOptions,
      ...(languageOptions[extension] || {})
    };
  }
  
  export { fileTypeSupport, getFileCategory, isBinaryFile, getParserOptions };