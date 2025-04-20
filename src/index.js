import { program } from 'commander';
import { processFiles } from './fileProcessor.js';
import chalk from 'chalk';
import { showCommandHelp, showCombineHelp } from './helpFunctions.js';

/**
 * Display a professional banner for VibEx CLI
 */
function displayBanner() {
  const boxWidth = 80;
  
  // Create border line
  const border = '┌' + '─'.repeat(boxWidth - 2) + '┐';
  const emptyLine = '│' + ' '.repeat(boxWidth - 2) + '│';
  const closingBorder = '└' + '─'.repeat(boxWidth - 2) + '┘';
  
  console.log('\n' + chalk.cyan(border));
  console.log(chalk.cyan(emptyLine));
  
  // Title
  const title = ' VibEx CLI ';
  const titleLine = '│' + ' '.repeat(Math.floor((boxWidth - 2 - title.length) / 2)) + 
                    chalk.bold.green(title) + 
                    ' '.repeat(Math.ceil((boxWidth - 2 - title.length) / 2)) + '│';
  console.log(chalk.cyan(titleLine));
  
  console.log(chalk.cyan(emptyLine));
  
  // Description
  const description = 'A powerful tool for preparing code for AI analysis';
  const descLine = '│' + ' '.repeat(Math.floor((boxWidth - 2 - description.length) / 2)) + 
                   chalk.white(description) + 
                   ' '.repeat(Math.ceil((boxWidth - 2 - description.length) / 2)) + '│';
  console.log(chalk.cyan(descLine));
  
  console.log(chalk.cyan(emptyLine));
  
  // Features
  const features = [
    '• Combine multiple code files into a single document',
    '• Remove comments and sensitive information',
    '• Include or exclude specific character ranges',
    '• Monitor files for changes in real-time'
  ];
  
  features.forEach(feature => {
    const featureLine = '│  ' + chalk.yellow(feature) + 
                       ' '.repeat(boxWidth - 4 - feature.length) + '│';
    console.log(chalk.cyan(featureLine));
  });
  
  console.log(chalk.cyan(emptyLine));
  
  // Developer info
  const developer = 'Developed by: Linus Wabwire (@gymnott)';
  const devLine = '│  ' + chalk.white(developer) + 
                  ' '.repeat(boxWidth - 4 - developer.length) + '│';
  console.log(chalk.cyan(devLine));
  
  const github = 'GitHub: https://github.com/Gymnott1';
  const githubLine = '│  ' + chalk.white(github) + 
                    ' '.repeat(boxWidth - 4 - github.length) + '│';
  console.log(chalk.cyan(githubLine));
  
  console.log(chalk.cyan(emptyLine));
  console.log(chalk.cyan(closingBorder));
  console.log('\n' + chalk.green('Type `vx --help` for usage information') + '\n');
}

// Helper function to display custom help
function displayHelp() {
  console.log(chalk.bold.green('\nVibEx CLI') + ' - Prepare code for AI analysis\n');
  console.log(chalk.bold('VERSION'));
  console.log('  0.1.0\n');
  
  console.log(chalk.bold('USAGE'));
  console.log('  vx [command] [options]\n');
  
  console.log(chalk.bold('COMMANDS'));
  console.log('  ' + chalk.yellow('combine, c') + '    Combine files for AI analysis\n');
  
  console.log(chalk.bold('OPTIONS FOR COMBINE COMMAND'));
  console.log('  ' + chalk.yellow('-f, --files <files...>') + '      Specify files to include');
  console.log('  ' + chalk.yellow('-s, --separate') + '              Keep files visually separated');
  console.log('  ' + chalk.yellow('-x, --exclude <files...>') + '    Files to exclude');
  console.log('  ' + chalk.yellow('--rc') + '                        Remove comments');
  console.log('  ' + chalk.yellow('--rp') + '                        Remove private information');
  console.log('  ' + chalk.yellow('-mx, --monitor') + '              Monitor files for changes');
  console.log('  ' + chalk.yellow('--force') + '                     Force inclusion of sensitive folders');
  console.log('  ' + chalk.yellow('--trim <ranges...>') + '          Only include characters in specified ranges');
  console.log('  ' + chalk.yellow('--cut <ranges...>') + '           Exclude characters in specified ranges\n');
  
  console.log(chalk.bold('DETAILED HELP'));
  console.log('  For detailed help on specific features:');
  console.log('  vx --help-command combine    # Detailed help for combine command');
  console.log('  vx --help-command trim       # Detailed help for character trimming');
  console.log('  vx --help-command cut        # Detailed help for character cutting\n');
  
  console.log(chalk.bold('EXAMPLES'));
  console.log('  vx c -f index.js utils.js          # Combine specific files');
  console.log('  vx c -f *.js -x node_modules/**    # Combine all JS files except in node_modules');
  console.log('  vx c -f app.py --rc                # Combine app.py with comments removed');
  console.log('  vx c -f index.js --trim="s-200"    # Only include first 201 characters');
  console.log('  vx c -f main.py --cut="300-500"    # Exclude characters 300-500');
  console.log('  vx c -f app.js --trim="s-200" --trim="500-e"  # Include start-200 and 500-end\n');
}

// Configure the CLI
program
  .name('vx')
  .description('VibEx CLI for preparing code for AI analysis')
  .version('0.1.0')
  .helpOption('-h, --help', 'Display help information')
  .option('--help-command <command>', 'Show detailed help for a specific command')
  .on('--help', () => {
    displayBanner();
    displayHelp();
  })
  .on('command:*', () => {
    console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '));
    process.exit(1);
  });

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
  .option('--trim <ranges...>', 'Only include characters in specified ranges (format: "start-end", use "s" for start, "e" for end)')
  .option('--cut <ranges...>', 'Exclude characters in specified ranges (format: "start-end", use "s" for start, "e" for end)')
  .action((options) => {
    processFiles(options);
  })
  .on('--help', () => {
    displayBanner();
    showCombineHelp();
  });

// Parse arguments
const parsedProgram = program.parse();

// Handle the help-command option
const options = parsedProgram.opts();
if (options.helpCommand) {
  displayBanner();
  showCommandHelp(options.helpCommand);
  process.exit(0);
}

// If no arguments, show banner and help
if (process.argv.length <= 2) {
  displayBanner();
  displayHelp();
  process.exit(0);
}