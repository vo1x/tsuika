# Tsuika - Windows App Installer

Tsuika is a modern, user-friendly application that simplifies the process of installing your favorite Windows applications.
I built this because I find myself nuking my Windows installation every 6 months as if it's some sacred ritual. Rather than manually hunting down installers, I created this webapp to streamline the whole process.

## Features

- **Curated App Selection**: Browse through a carefully selected collection of popular Windows applications
- **One-Click Installation**: Generate batch scripts to install multiple applications at once
- **Clean Interface**: Modern UI built with Next.js and styled with Rosé Pine theme
- **Easy to Use**: Simple, intuitive interface for selecting and installing applications

## Getting Started

### Prerequisites

- Windows 10 or later with [winget](https://learn.microsoft.com/en-us/windows/package-manager/winget/) installed
- A modern web browser

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/vo1x/tsuika.git
   cd tsuika
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
# or
yarn build
```

## How It Works

1. Browse the collection of applications categorized for easy navigation
2. Select the applications you want to install
3. Generate a batch file with all the necessary winget commands
4. Run the batch file on your Windows machine to install all selected applications

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Attributions

- [winget](https://github.com/microsoft/winget-cli) - Windows Package Manager
- [Rosé Pine](https://rosepinetheme.com/) - Beautiful color scheme
- [Inter](https://rsms.me/inter/) & [JetBrains Mono](https://www.jetbrains.com/lp/mono/) - Fonts
