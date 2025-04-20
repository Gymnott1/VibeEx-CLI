// src/utils.js
import fs from 'fs-extra';
import path from 'path';
import glob from 'glob';
import { isBinaryFile } from './fileSupport.js';
import chalk from 'chalk';
import { fileTypeSupport } from './fileSupport.js'; // Import support info

/**
 * Finds files to process based on options, filtering binaries and respecting exclusions.
 * @param {object} options - Command line options (files, exclude, force)
 * @param {string[]} defaultExcludes - Default patterns to always exclude (e.g., ['node_modules/**'])
 * @param {boolean} useDefaultGlob - If true and options.files is empty, glob for supported files.
 * @returns {Promise<string[]>} - Array of valid text file paths.
 */
async function findFilesToProcess(options, defaultExcludes = ['node_modules/**', '**/vx_*.txt'], useDefaultGlob = true) {
    let filesToProcess = [];

    if (options.files && options.files.length > 0) {
        // Use glob for user-provided patterns/files
        const patterns = Array.isArray(options.files) ? options.files : [options.files];
        const foundFiles = patterns.flatMap(pattern => glob.sync(pattern, { nodir: true, dot: true })); // Include dotfiles if matched
        filesToProcess = [...new Set(foundFiles)]; // Ensure unique files
    } else if (useDefaultGlob) {
        // Default: Find all supported files in the current directory, respecting excludes
        const supportedExtensions = [
            ...fileTypeSupport.fullSupport,
            ...fileTypeSupport.partialSupport,
            ...fileTypeSupport.basicSupport
        ].map(ext => ext.substring(1)); // Remove leading dot for glob pattern

        const globPattern = `**/*.{${supportedExtensions.join(',')}}`;

        const excludePatterns = options.force
            ? options.exclude || []
            : [...defaultExcludes, ...(options.exclude || [])];

        filesToProcess = glob.sync(globPattern, {
            ignore: excludePatterns,
            nodir: true, // Ensure we only get files
            dot: true // Include dotfiles if they match pattern
        })
        .filter(file => !path.basename(file).startsWith('vx_')); // Extra check for generated files
    }

    // Filter out explicitly excluded files/patterns if provided via -x
    // This applies whether -f was used or the default glob ran.
    if (options.exclude && options.exclude.length > 0) {
        const excludePatterns = Array.isArray(options.exclude) ? options.exclude : [options.exclude];
        const micromatch = (await import('micromatch')).default; // Use dynamic import
        filesToProcess = filesToProcess.filter(file => !micromatch.isMatch(file, excludePatterns));
    }


    // Filter out binary files
    const textFiles = [];
    for (const file of filesToProcess) {
        try {
            if (await fs.pathExists(file) && (await fs.stat(file)).isFile()) {
                 if (!(await isBinaryFile(file))) {
                     textFiles.push(file);
                 } else {
                     console.log(chalk.yellow(`Skipping binary file: ${file}`));
                 }
            }
            // else: Skip directories or non-existent files found by glob
        } catch (err) {
             console.warn(chalk.yellow(`Could not stat file ${file}, skipping. Error: ${err.message}`));
        }
    }

    return textFiles;
}


export { findFilesToProcess }; // Export the utility