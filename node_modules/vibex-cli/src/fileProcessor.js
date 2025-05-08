// src/fileProcessor.js
import fs from 'fs-extra';
import path from 'path';
// import glob from 'glob'; // No longer needed directly
import { removeComments } from './commentRemover.js';
import { scrubSensitiveInfo } from './privacyFilter.js';
import { processCharacterRanges, extractCharacterRangeOptions } from './characterTrim.js';
import { findFilesToProcess } from './utils.js'; // Import the utility
import chokidar from 'chokidar';
import chalk from 'chalk';

async function processFiles(options) {

    // Use the shared utility function
    const filesToProcess = await findFilesToProcess(options, ['node_modules/**', '**/vx_*.txt'], true);

    if (filesToProcess.length === 0) {
        console.log(chalk.yellow('No suitable text files found to combine.'));
        return;
    }

    const { default: chalk } = await import('chalk'); // Keep dynamic import for chalk here if needed

    console.log(chalk.blue(`Combining ${filesToProcess.length} file(s)...`));

    // Extract character range options
    const rangeOptions = extractCharacterRangeOptions(options);

    let combinedContent = '';
    let updateNeeded = false; // Flag for monitor mode

    const buildCombinedContent = async () => {
        let tempCombinedContent = '';
        for (const file of filesToProcess) {
            try {
                const content = await fs.readFile(file, 'utf-8');
                let processedContent = content;

                // Apply character range trimming/cutting first
                if (rangeOptions.trim.length > 0 || rangeOptions.cut.length > 0) {
                    processedContent = processCharacterRanges(processedContent, rangeOptions);
                }

                if (options.rc) {
                    processedContent = removeComments(processedContent, path.extname(file));
                }
                if (options.rp) {
                    processedContent = scrubSensitiveInfo(processedContent);
                }

                // Compress the content by removing unnecessary spaces and newlines
                // Keep newlines between markers for readability if not separated
                processedContent = processedContent.replace(/\s+/g, ' ').trim(); // Replace multiple spaces/tabs but keep \n
                 // Optionally remove empty lines if desired:
                 // processedContent = processedContent.split('\n').filter(line => line.trim() !== '').join('\n');


                const startMarker = `<start of ${file}>`;
                const endMarker = `<end of ${file}>`;

                // Add newlines around markers for better separation
                tempCombinedContent += `\n${startMarker}\n${processedContent}\n${endMarker}\n`;

            } catch (error) {
                 console.error(chalk.red(`Error reading file ${file}, skipping: ${error.message}`));
            }
        }
        // Compress the final combined content - maybe just trim whitespace
         return tempCombinedContent.trim();
         // Avoid collapsing all whitespace globally on the final combined content
         // return tempCombinedContent.replace(/\s+/g, ' ').trim(); // This might be too aggressive
    };


    combinedContent = await buildCombinedContent();


    // Determine the output file name
    // Use specified files for naming only if they were *actually* provided
    const outputFileNameBase = (options.files && options.files.length > 0 && filesToProcess.length > 0)
       ? path.basename(filesToProcess[0]).split('.')[0] // Use first *processed* file base name
       : path.basename(process.cwd());
    const outputFileName = `vx_${outputFileNameBase}.txt`;
    const outputFile = path.join(process.cwd(), outputFileName);

    await fs.writeFile(outputFile, combinedContent);
    console.log(chalk.green(`Combined content written to ${outputFile}`));


    if (options.monitor) {
        console.log(chalk.blue(`Monitoring files for changes... Press Ctrl+C to stop.`));
        const watcher = chokidar.watch(filesToProcess);

        // Simple debounce mechanism
        let updateTimeout;
        const debounceTime = 500; // ms

        watcher.on('change', (filePath) => {
            console.log(chalk.yellow(`Change detected in ${filePath}. Rebuilding output...`));
            clearTimeout(updateTimeout);
            updateTimeout = setTimeout(async () => {
                 try {
                    // Re-run the combination process
                    combinedContent = await buildCombinedContent();
                    await fs.writeFile(outputFile, combinedContent);
                    console.log(chalk.green(`Updated ${outputFile}`));
                 } catch (error) {
                     console.error(chalk.red(`Error updating ${outputFile}: ${error.message}`));
                 }
            }, debounceTime);
        });

         watcher.on('error', error => console.error(chalk.red(`Watcher error: ${error}`)));
    }
}

export { processFiles };