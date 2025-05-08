import { program } from 'commander';
import { processFiles } from './fileProcessor.js';
import chalk from 'chalk';
import { removeCommentsInFiles } from './removeCommentsProcessor.js';
import { showCommandHelp, showCombineHelp, showRemoveCommentsHelp } from './helpFunctions.js';

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
  console.log(' ' + chalk.yellow('remove-comments, rcm') + ' Remove comments from files in place\n');
  
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

  console.log(chalk.bold('OPTIONS FOR REMOVE-COMMENTS COMMAND')); // Add options for new command
  console.log(' ' + chalk.yellow('-f, --files <files...>') + ' Specify files/patterns to process (default: all supported files)');
  console.log(' ' + chalk.yellow('-x, --exclude <files...>') + ' Files/patterns to exclude');
  console.log(' ' + chalk.yellow('--force') + '            Force processing in normally excluded directories\n');

  console.log(chalk.bold('DETAILED HELP'));
  console.log('  For detailed help on specific features:');
  console.log('  vx --help-command combine    # Detailed help for combine command');
  console.log(' vx --help-command remove-comments # Detailed help for comment removal');
  console.log('  vx --help-command trim       # Detailed help for character trimming');
  console.log('  vx --help-command cut        # Detailed help for character cutting\n');
  
  console.log(chalk.bold('EXAMPLES'));
  console.log('  vx c -f index.js utils.js          # Combine specific files');
  console.log('  vx c -f *.js -x node_modules/**    # Combine all JS files except in node_modules');
  console.log('  vx c -f app.py --rc                # Combine app.py with comments removed');
  console.log('  vx c -f index.js --trim="s-200"    # Only include first 201 characters');
  console.log('  vx c -f main.py --cut="300-500"    # Exclude characters 300-500');
  console.log('  vx c -f app.js --trim="s-200" --trim="500-e"  # Include start-200 and 500-end\n');
  console.log(' # Remove comments from a specific file IN PLACE'); // Add example for new command
  console.log(' vx rcm -f my_script.py\n');
  console.log(' # Remove comments from all supported files in current dir IN PLACE'); // Add example for new command
  console.log(' vx rcm\n');
  console.log(' # Remove comments from JS files, excluding tests, IN PLACE'); // Add example for new command
  console.log(' vx rcm -f *.js -x tests/**\n');

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
  .action(async (options) => {
    processFiles(options);
  })
  .on('--help', () => {
    displayBanner();
    showCombineHelp();
  });


  // Remove Comments Command (New)
program
.command('remove-comments')
.alias('rcm')
.description('Remove comments from specified files in place')
.option('-f, --files <files...>', 'Specify files or patterns to process (default: all supported files)')
.option('-x, --exclude <patterns...>', 'Patterns of files/directories to exclude')
.option('--force', 'Force processing in normally excluded directories (like node_modules)')
.addHelpText('after', `
${chalk.yellow('WARNING:')} This command modifies files directly in place. Make sure you have backups or use version control.
`) // Add a warning
.action(async (options) => { // Make action async
    await removeCommentsInFiles(options);
})
.on('--help', () => {
    displayBanner();
    // We'll create showRemoveCommentsHelp in the next step
    // For now, commander's default help for the command is decent
    // Or reuse/adapt showCombineHelp structure if needed
    console.log(chalk.bold.green('\nVibEx CLI: Remove Comments Command Help') + '\n');
    console.log(chalk.bold('DESCRIPTION'));
    console.log(' Removes comments from source code files directly, modifying them in place.\n');
    console.log(chalk.bold('USAGE'));
    console.log(' vx remove-comments [options]');
    console.log(' vx rcm [options]\n');
    console.log(chalk.bold('OPTIONS'));
    console.log(' ' + chalk.yellow('-f, --files <files...> ') + 'Specify files/patterns (e.g., *.js, src/app.py)');
    console.log('                         (Default: Processes all supported file types found)\n');
    console.log(' ' + chalk.yellow('-x, --exclude <ptns...> ') + 'Patterns to exclude (e.g., node_modules/**, tests/**)\n');
    console.log(' ' + chalk.yellow('--force             ') + 'Include normally excluded dirs (node_modules, etc.)\n');
    console.log(chalk.bold('EXAMPLES'));
    console.log(' # Remove comments from a specific file');
    console.log(' vx rcm -f ./src/my_script.py\n');
    console.log(' # Remove comments from all supported files in the current directory and subdirectories');
    console.log(' vx rcm\n');
    console.log(' # Remove comments from all Python files, excluding the venv directory');
    console.log(' vx rcm -f **/*.py -x venv/**\n');
    console.log(chalk.bold.red('WARNING: This command modifies files IN PLACE. Ensure you have backups or use version control.\n'));
});



// Parse arguments
const parsedProgram = program.parse(process.argv); // Use process.argv

// Handle the help-command option
const options = parsedProgram.opts();
if (options.helpCommand) {
    displayBanner();
    showCommandHelp(options.helpCommand); // Ensure showCommandHelp handles 'remove-comments'
    process.exit(0);
}

// If no command was specified (and not asking for general help)
if (!parsedProgram.args.length && process.argv.length > 2 && !options.helpCommand) {
    // Check if a command alias was intended but mistyped or if only options were given
    // If only options like -f were given without a command, commander might parse them globally.
    // We want to guide the user to use a command.
    console.error(chalk.red('Error: Please specify a command (e.g., "combine", "remove-comments").'));
    console.log('\nRun ' + chalk.green('vx --help') + ' to see available commands.');
    process.exit(1);
} else if (process.argv.length <= 2) {
    // If just 'vx' is typed (no args)
    displayBanner();
    displayHelp();
    process.exit(0);
}
