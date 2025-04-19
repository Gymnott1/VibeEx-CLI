import { program } from 'commander';
import { processFiles } from './fileProcessor.js';

program
  .name('vx')
  .description('VibEx CLI for preparing code for AI analysis')
  .version('0.1.0');

program
  .command('combine')
  .alias('c')
  .description('Combine files for AI analysis')
  .option('-f, --files <files...>', 'Specify files to include')
  .option('-s, --separate', 'Keep files visually separated')
  .option('-x, --exclude <files...>', 'Files to exclude')
  .option('--rc', 'Remove comments')
  .option('--rp', 'Remove private information')
  .option('-mx, --monitor', 'Monitor files for changes')
  .option('--force', 'Force inclusion of sensitive folders')
  .action((options) => {
    processFiles(options);
  });

program.parse();
