// src/removeCommentsProcessor.js
import fs from 'fs-extra';
import path from 'path';
// import glob from 'glob'; // No longer needed directly
import { removeComments } from './commentRemover.js';
// import { isBinaryFile } from './fileSupport.js'; // No longer needed directly
import { findFilesToProcess } from './utils.js'; // Import the utility
import chalk from 'chalk';

/**
 * Removes comments from specified files in place.
 * @param {object} options - Command line options (files, exclude, force)
 */
async function removeCommentsInFiles(options) {
    console.log(chalk.blue('Starting comment removal process...'));

    // Use the shared utility function
    const files = await findFilesToProcess(options, ['node_modules/**', '**/vx_*.txt'], true); // Pass defaults and enable default glob

    if (files.length === 0) {
        console.log(chalk.yellow('No suitable text files found to process.'));
        return;
    }

     console.log(chalk.blue(`Processing ${files.length} file(s):`));
     // files.forEach(file => console.log(` - ${file}`)); // Optional: List all files

    let filesModified = 0;
    let filesUnchanged = 0;
    let filesErrored = 0;

    for (const file of files) {
        try {
            const originalContent = await fs.readFile(file, 'utf-8');
            const fileExtension = path.extname(file);
            const contentWithoutComments = removeComments(originalContent, fileExtension);

            if (originalContent !== contentWithoutComments) {
                await fs.writeFile(file, contentWithoutComments, 'utf-8');
                console.log(chalk.green(`Removed comments from: ${file}`));
                filesModified++;
            } else {
                // Only log unchanged if verbose needed, otherwise it's noisy
                // console.log(chalk.gray(`No comments found or removed in: ${file}`));
                filesUnchanged++;
            }
        } catch (error) {
            console.error(chalk.red(`Error processing file ${file}:`), error.message);
            filesErrored++;
        }
    }

    console.log(chalk.blue('\nComment removal process finished.'));
    if (filesModified > 0) console.log(chalk.green(`  Files modified: ${filesModified}`));
    if (filesUnchanged > 0) console.log(chalk.gray(`  Files unchanged/no comments: ${filesUnchanged}`));
    if (filesErrored > 0) {
        console.log(chalk.red(`  Files with errors: ${filesErrored}`));
    }
}

export { removeCommentsInFiles };