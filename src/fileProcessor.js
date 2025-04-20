import fs from 'fs-extra';
import path from 'path';
import glob from 'glob';
import { removeComments } from './commentRemover.js';
import { scrubSensitiveInfo } from './privacyFilter.js';
import { processCharacterRanges, extractCharacterRangeOptions } from './characterTrim.js';
import chokidar from 'chokidar';

async function processFiles(options) {
  let filesToProcess = [];
  const defaultExcludes = ['node_modules/**'];
  
  if (options.files) {
    filesToProcess = options.files.filter(file => !file.startsWith('vx_'));
  } else {
    const excludePatterns = options.force ? options.exclude || [] : [...defaultExcludes, ...(options.exclude || [])];
    filesToProcess = glob.sync('**/*.{js,py,html,css,txt}', { ignore: excludePatterns }).filter(file => !file.startsWith('vx_'));
  }

  // Extract character range options
  const rangeOptions = extractCharacterRangeOptions(options);
  
  let combinedContent = '';
  for (const file of filesToProcess) {
    const content = await fs.readFile(file, 'utf-8');
    let processedContent = content;
    
    // Apply character range trimming/cutting
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
    processedContent = processedContent.replace(/\s+/g, ' ').trim();
    
    // Add markers for the start and end of each file's content
    const startMarker = `<start of ${file}>`;
    const endMarker = `<end of ${file}>`;
    combinedContent += options.separate ? `\n${startMarker}\n${processedContent}\n${endMarker}\n` : `${startMarker}\n${processedContent}\n${endMarker}\n`;
  }
  
  // Compress the final combined content
  combinedContent = combinedContent.replace(/\s+/g, ' ').trim();
  
  // Determine the output file name
  const outputFileName = options.files && options.files.length > 0 ? `vx_${path.basename(options.files[0])}.txt` : `vx_${path.basename(process.cwd())}.txt`;
  const outputFile = path.join(process.cwd(), outputFileName);
  
  await fs.writeFile(outputFile, combinedContent);
  
  const { default: chalk } = await import('chalk');
  console.log(chalk.green(`Combined content written to ${outputFile}`));
  
  if (options.monitor) {
    const watcher = chokidar.watch(filesToProcess);
    watcher.on('change', async (filePath) => {
      const content = await fs.readFile(filePath, 'utf-8');
      let processedContent = content;
      
      // Apply character range trimming/cutting
      if (rangeOptions.trim.length > 0 || rangeOptions.cut.length > 0) {
        processedContent = processCharacterRanges(processedContent, rangeOptions);
      }
      
      if (options.rc) {
        processedContent = removeComments(processedContent, path.extname(filePath));
      }
      
      if (options.rp) {
        processedContent = scrubSensitiveInfo(processedContent);
      }
      
      // Compress the content by removing unnecessary spaces and newlines
      processedContent = processedContent.replace(/\s+/g, ' ').trim();
      
      // Add markers for the start and end of each file's content
      const startMarker = `<start of ${filePath}>`;
      const endMarker = `<end of ${filePath}>`;
      combinedContent = combinedContent.replace(new RegExp(`${startMarker}.*${endMarker}`, 's'), `${startMarker}\n${processedContent}\n${endMarker}`);
      
      // Compress the final combined content
      combinedContent = combinedContent.replace(/\s+/g, ' ').trim();
      
      await fs.writeFile(outputFile, combinedContent);
      console.log(chalk.green(`Updated ${outputFile} due to changes in ${filePath}`));
    });
  }
}

export { processFiles };