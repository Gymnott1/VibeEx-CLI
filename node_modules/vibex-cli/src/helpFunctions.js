import chalk from 'chalk';

/**
 * Display detailed help for a specific command
 * @param {string} command - The command to show help for
 */
function showCommandHelp(command) {
  switch (command) {
    case 'combine':
    case 'c':
      showCombineHelp();
      break;
    case 'remove-comments': // Add case for new command
    case 'rcm':             // Add case for alias
        showRemoveCommentsHelp();
        break;
    case 'trim':
      showTrimHelp();
      break;
    case 'cut':
      showCutHelp();
      break;
    default:
      console.log(`No detailed help available for '${command}'. Use 'vx --help' for general help.`);
  }
}

/**
 * Show detailed help for the combine command
 */
function showCombineHelp() {
  console.log(chalk.bold.green('\nVibEx CLI: Combine Command') + '\n');
  
  console.log(chalk.bold('DESCRIPTION'));
  console.log('  The combine command merges multiple files into a single output file for AI analysis.\n');
  
  console.log(chalk.bold('USAGE'));
  console.log('  vx combine [options]');
  console.log('  vx c [options]\n');
  
  console.log(chalk.bold('OPTIONS'));
  console.log('  ' + chalk.yellow('-f, --files <files...>') + '      Specify files to include');
  console.log('    Example: vx c -f index.js utils.js app.css\n');
  
  console.log('  ' + chalk.yellow('-s, --separate') + '              Keep files visually separated in the output');
  console.log('    Example: vx c -f *.js -s\n');
  
  console.log('  ' + chalk.yellow('-x, --exclude <files...>') + '    Patterns of files to exclude');
  console.log('    Example: vx c -x node_modules/** test/**\n');
  
  console.log('  ' + chalk.yellow('--rc') + '                        Remove comments from code files');
  console.log('    Example: vx c -f app.js --rc\n');
  
  console.log('  ' + chalk.yellow('--rp') + '                        Remove private information (emails, keys, etc.)');
  console.log('    Example: vx c -f config.js --rp\n');
  
  console.log('  ' + chalk.yellow('-mx, --monitor') + '              Monitor files for changes and update output');
  console.log('    Example: vx c -f index.js -mx\n');
  
  console.log('  ' + chalk.yellow('--force') + '                     Force inclusion of sensitive folders');
  console.log('    Example: vx c --force\n');
  
  console.log('  ' + chalk.yellow('--trim <ranges...>') + '          Only include specified character ranges');
  console.log('    Example: vx c -f app.js --trim="s-200" --trim="500-e"\n');
  
  console.log('  ' + chalk.yellow('--cut <ranges...>') + '           Exclude specified character ranges');
  console.log('    Example: vx c -f app.js --cut="200-500"\n');
  
  console.log(chalk.bold('EXAMPLES'));
  console.log('  # Combine all JavaScript files in the current directory');
  console.log('  vx c -f *.js\n');
  
  console.log('  # Combine specific files with comments removed');
  console.log('  vx c -f index.js utils.js --rc\n');
  
  console.log('  # Combine files and exclude sensitive information');
  console.log('  vx c -f config.js db.js --rp\n');
  
  console.log('  # Combine only specific parts of a file');
  console.log('  vx c -f large-file.js --trim="100-500"\n');
  
  console.log('  # Monitor files and update the output when they change');
  console.log('  vx c -f app.js styles.css -mx\n');
}

/**
 * Show detailed help for character trimming
 */
function showTrimHelp() {
  console.log(chalk.bold.green('\nVibEx CLI: Character Trimming Help') + '\n');
  
  console.log(chalk.bold('DESCRIPTION'));
  console.log('  Character trimming allows you to include only specific parts of files.\n');
  
  console.log(chalk.bold('USAGE'));
  console.log('  Use the --trim option with the combine command:\n');
  console.log('  vx c -f [files] --trim="start-end" [--trim="start-end" ...]\n');
  
  console.log(chalk.bold('RANGE FORMAT'));
  console.log('  Ranges are specified as "start-end" where:');
  console.log('  - start and end are character positions (0-based)');
  console.log('  - "s" can be used to represent the start of the file');
  console.log('  - "e" can be used to represent the end of the file\n');
  
  console.log(chalk.bold('EXAMPLES'));
  console.log('  # Include only the first 200 characters');
  console.log('  vx c -f app.js --trim="s-200"\n');
  
  console.log('  # Include only characters from position 500 to the end');
  console.log('  vx c -f app.js --trim="500-e"\n');
  
  console.log('  # Include two separate ranges');
  console.log('  vx c -f app.js --trim="s-200" --trim="500-700"\n');
  
  console.log('  # Include specific function (assuming you know its character range)');
  console.log('  vx c -f app.js --trim="1050-1500"\n');
  
  console.log(chalk.bold('TIPS'));
  console.log('  - Always use quotes around range values to avoid shell interpretation issues');
  console.log('  - You can combine multiple --trim options to include several ranges');
  console.log('  - Character positions are 0-based (first character is at position 0)');
  console.log('  - To find character positions, you can use text editors with position display\n');
}

function showRemoveCommentsHelp() {
  console.log(chalk.bold.green('\nVibEx CLI: Remove Comments Command') + '\n');
  console.log(chalk.bold('DESCRIPTION'));
  console.log(' This command finds supported source code files and removes comments from them.');
  console.log(chalk.red(' It modifies the files directly in place. Use with caution!\n'));

  console.log(chalk.bold('USAGE'));
  console.log(' vx remove-comments [options]');
  console.log(' vx rcm [options]\n');

  console.log(chalk.bold('OPTIONS'));
  console.log(' ' + chalk.yellow('-f, --files <files...> ') + 'Specify specific files or glob patterns to process.');
  console.log('                         Example: `vx rcm -f src/app.js src/utils/*.ts`');
  console.log('                         If omitted, it searches for all supported file types in the');
  console.log('                         current directory and subdirectories (respecting exclusions).\n');

  console.log(' ' + chalk.yellow('-x, --exclude <ptns...> ') + 'Specify files or glob patterns to exclude from processing.');
  console.log('                         Defaults exclude `node_modules/**` and `vx_*.txt`.');
  console.log('                         Example: `vx rcm -x "**/__tests__/**" "**/dist/**"`\n');

  console.log(' ' + chalk.yellow('--force             ') + 'Force processing in normally excluded directories like `node_modules`.');
  console.log('                         Example: `vx rcm --force` (generally not recommended).\n');

  console.log(chalk.bold('EXAMPLES'));
  console.log(' # Remove comments from a specific Python file');
  console.log(' vx rcm -f my_app.py\n');

  console.log(' # Remove comments from all supported files (js, py, css, etc.) in the current project');
  console.log(' vx rcm\n');

  console.log(' # Remove comments from all .ts files inside the src directory');
  console.log(' vx rcm -f "src/**/*.ts"\n');

  console.log(' # Remove comments from all supported files, but skip the vendor directory');
  console.log(' vx rcm -x "vendor/**"\n');

  console.log(chalk.bold.red('IMPORTANT: This operation modifies your files directly.'));
  console.log(chalk.red('Ensure you have committed your changes to version control or have backups before running.\n'));
}
/**
 * Show detailed help for character cutting
 */
function showCutHelp() {
  console.log(chalk.bold.green('\nVibEx CLI: Character Cutting Help') + '\n');
  
  console.log(chalk.bold('DESCRIPTION'));
  console.log('  Character cutting allows you to exclude specific parts of files.\n');
  
  console.log(chalk.bold('USAGE'));
  console.log('  Use the --cut option with the combine command:\n');
  console.log('  vx c -f [files] --cut="start-end" [--cut="start-end" ...]\n');
  
  console.log(chalk.bold('RANGE FORMAT'));
  console.log('  Ranges are specified as "start-end" where:');
  console.log('  - start and end are character positions (0-based)');
  console.log('  - "s" can be used to represent the start of the file');
  console.log('  - "e" can be used to represent the end of the file\n');
  
  console.log(chalk.bold('EXAMPLES'));
  console.log('  # Exclude characters from position 200 to 500');
  console.log('  vx c -f app.js --cut="200-500"\n');
  
  console.log('  # Exclude the beginning of the file up to position 100');
  console.log('  vx c -f app.js --cut="s-100"\n');
  
  console.log('  # Exclude multiple ranges');
  console.log('  vx c -f app.js --cut="100-200" --cut="500-600"\n');
  
  console.log('  # Exclude a specific function (assuming you know its character range)');
  console.log('  vx c -f app.js --cut="1050-1500"\n');
  
  console.log(chalk.bold('COMBINING WITH TRIM'));
  console.log('  You can combine --cut and --trim options for precise control:');
  console.log('  vx c -f app.js --trim="s-500" --cut="200-300"\n');
  
  console.log(chalk.bold('TIPS'));
  console.log('  - Always use quotes around range values to avoid shell interpretation issues');
  console.log('  - You can combine multiple --cut options to exclude several ranges');
  console.log('  - Cut operations are processed after trim operations');
  console.log('  - Character positions are 0-based (first character is at position 0)');
  console.log('  - To find character positions, you can use text editors with position display\n');
}

export { showCommandHelp, showCombineHelp, showTrimHelp, showCutHelp, showRemoveCommentsHelp };