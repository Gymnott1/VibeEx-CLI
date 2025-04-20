# VibEx CLI

[![npm version](https://img.shields.io/npm/v/vibex-cli.svg)](https://www.npmjs.com/package/vibex-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

VibEx (`vx`) is a developer-friendly CLI tool that streamlines the process of working with AI coding assistants. It helps developers prepare, consolidate, and clean code for AI analysis without exposing sensitive information.

![vibex-cli](images\vibex-cli.jpg)

## 🚀 Features

- **Combine multiple files** into a single document for AI analysis
- **Remove comments** to reduce token usage and noise
- **Scrub sensitive information** like API keys and personal data
- **Monitor files** for changes and auto-update the combined output
- **Character trimming** to include only specific parts of files
- **Character cutting** to exclude specific parts of files
- **Support for many file types** with varying levels of processing
- **Highly configurable** with simple command line options

## 📦 Installation

```bash
npm install -g vibex-cli
```

## 🔧 Usage

### Basic Commands

```bash
# Combine all files in current directory
vx c

# Combine specific files
vx c -f app.js config.js

# Combine files but exclude some
vx c -x node_modules/ .env

# Remove comments from combined output
vx c --rc

# Remove sensitive information
vx c --rp

# Combine both options
vx c --rc --rp

# Monitor files for changes
vx c -mx
```

### Output

By default, VibEx creates a file named `vx_{folder_name}.txt` in the current directory containing the combined and processed content.

## 🛠️ Command Options

| Command | Alias | Description |
|---------|-------|-------------|
| `c` | `--combine` | Combine files for AI analysis |
| `-f <files...>` | `--files <files...>` | Specify files to include |
| `-s` | `--separate` | Keep files visually separated in output |
| `-x <files...>` | `--exclude <files...>` | Files or directories to exclude |
| `--rc` | `--remove-comments` | Remove code comments |
| `--rp` | `--remove-private` | Remove private/sensitive information |
| `-mx` | `--monitor` | Monitor files for changes and update output |
| `--trim <ranges...>` | | Only include characters in specified ranges |
| `--cut <ranges...>` | | Exclude characters in specified ranges |
| `--force` | | Force inclusion of sensitive folders |

## ✨ Examples

### Combining Multiple JavaScript Files

```bash
vx c -f src/app.js src/utils.js src/api.js
```

Creates a file `vx_app.js.txt` containing the combined contents of all three files.

### Preparing Code for AI Review Without Sensitive Info

```bash
vx c --rc --rp
```

Combines all files in the current directory, removes comments, and scrubs sensitive information.

### Setting Up Automatic Updates for a Project

```bash
vx c -mx
```

Creates a combined file that automatically updates when any source file changes.

### Working with Specific Files While Excluding Others

```bash
vx c -f src/ -x src/tests/ src/deprecated/
```

Combines all files in the `src/` directory except those in the `tests/` and `deprecated/` subdirectories.

### Including Only Specific Parts of Files

```bash
vx c -f large-file.js --trim="s-200" --trim="500-e"
```

Combines only the first 200 characters and from position 500 to the end of the file.

### Excluding Specific Parts of Files

```bash
vx c -f app.js --cut="300-500"
```

Combines the file while excluding characters from position 300 to 500.

## 🔍 Advanced Features

### Character Range Trimming

The `--trim` option allows you to specify character ranges to include in the output:

```bash
# Include only characters 100-500
vx c -f app.js --trim="100-500"

# Include from start to position 200
vx c -f app.js --trim="s-200"

# Include from position 500 to end
vx c -f app.js --trim="500-e"

# Include multiple ranges
vx c -f app.js --trim="s-200" --trim="500-e"
```

### Character Range Cutting

The `--cut` option allows you to specify character ranges to exclude from the output:

```bash
# Exclude characters 100-500
vx c -f app.js --cut="100-500"

# Exclude from start to position 100
vx c -f app.js --cut="s-100"

# Exclude from position 500 to end
vx c -f app.js --cut="500-e"

# Exclude multiple ranges
vx c -f app.js --cut="100-200" --cut="400-500"
```

### Combining Trim and Cut

You can combine trim and cut operations for precise control:

```bash
vx c -f app.js --trim="s-1000" --cut="200-300"
```

This includes only the first 1000 characters but excludes the characters from 200-300.

## 📊 File Type Support

VibEx supports various file types with different levels of processing:

### Full Support
JavaScript, TypeScript, Python, HTML, CSS, Markdown, JSON, and more.

### Partial Support
Ruby, Go, Swift, Kotlin, Java, C/C++, PHP, Rust, Shell scripts, and more.

### Basic Support
Plain text, CSV, INI, configuration files, environment variables, and more.

## 🔒 Privacy Protection

The `--rp` flag identifies and replaces these patterns:

- API keys → `"API_KEY"`
- Authentication tokens → `"AUTH_TOKEN"`
- Email addresses → `"example@email.com"`
- Phone numbers → `"+123456789"`
- Numeric codes → `"11111"`
- Personal names → `"FIRST_NAME"`

## 💬 Comment Removal

The `--rc` flag removes comments from many languages including:

- JavaScript/TypeScript (`//`, `/*...*/`)
- Python (`#`, docstrings)
- HTML/XML (`<!-- -->`)
- CSS (`/*...*/)
- Shell scripts (`#`)
- Ruby (`#`, `=begin...=end`)
- And many more

## 🔄 Monitoring Changes

The monitoring feature (`-mx`) watches for file changes in real-time:

```bash
vx c -f src/ -mx
```

When any monitored file changes, VibEx automatically updates the combined output file.

## 🤝 Contributing

Contributions are welcome! Check out our [Contributing Guide](CONTRIBUTING.md) for details on:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Areas for Contribution

- Additional language support for comment removal
- Better regex patterns for identifying sensitive information
- Performance improvements for large codebases
- Support for additional file formats
- Integration with development tools and platforms
- Adding support for handling images and media files

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the challenges developers face when working with AI coding assistants
- Built with open-source tools and community support

---

📣 **Found VibEx helpful?** Star us on GitHub and share your experience!

💡 **Have ideas for improvements?** Open an issue or submit a pull request!
