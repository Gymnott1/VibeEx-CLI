// src/fileSupport.js
import path from 'path'; // <-- Import path module at the top
import fs from 'fs-extra'; 
import chalk from 'chalk';
// Inside the isBinaryFile function's try block
// Inside the isBinaryFile function's try block// <-- WRONG
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
  
 

async function isBinaryFile(filePath) {
  try {
      // Ensure the file exists and is a file before checking
      if (!(await fs.pathExists(filePath)) || !(await fs.stat(filePath)).isFile()) {
          return true; // Treat non-existent or non-files as non-processable
      }

      // Import the named export 'isBinaryFile' from 'isbinaryfile'
      const { isBinaryFile: checkIsBinary } = await import('isbinaryfile');

      // Check if the imported function is actually a function
      if (typeof checkIsBinary !== 'function') {
           throw new Error('"isbinaryfile" did not export a function named "isBinaryFile"');
      }

      // Call the function - it usually takes the file path and returns a Promise<boolean>
      return await checkIsBinary(filePath);

  } catch (error) {
      // Use the correct package name in warnings
      if (error.code === 'ERR_MODULE_NOT_FOUND' && error.message.includes('isbinaryfile')) {
           console.warn(chalk.yellow(`Warning: Optional package 'isbinaryfile' not found. Falling back to extension check for ${filePath}. Run 'npm install isbinaryfile' for better accuracy.`));
      } else {
           console.warn(chalk.yellow(`Warning: 'isbinaryfile' check failed for ${filePath}. Falling back to extension check. Error: ${error.message}`));
      }

      // Fallback to extension-based check
      const binaryExtensions = [
          '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.ico', '.tif', '.tiff',
          '.pdf',
          '.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx',
          '.zip', '.tar', '.gz', '.7z', '.rar',
          '.exe', '.dll', '.so', '.dylib', '.app',
          '.mp3', '.mp4', '.avi', '.mov', '.wav', '.ogg', '.flac', '.webm',
          '.ttf', '.otf', '.woff', '.woff2',
          '.iso', '.img', '.dmg',
          '.pyc', '.pyo',
          '.class', '.jar',
          '.swf'
      ];
      const extension = path.extname(filePath).toLowerCase();
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