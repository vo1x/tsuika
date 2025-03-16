import { App } from "@/types";
import { applications } from "@/constants";

interface BatchGeneratorOptions {
  selectedApps: Array<App>;
  operatingSystem: "windows" | "osx";
}

/**
 * Generates a Windows batch script for installing selected apps with winget
 */
export const generateWindowsBatchFile = (selectedApps: Array<App>): string => {
  let batchContent = `@echo off
echo Tsuika App Installer
echo ============================
echo Installing selected applications...
echo.

`;

  const appsWithWinget: string[] = [];
  const appsWithoutWinget: string[] = [];

  selectedApps.forEach((app) => {
    const originalApp =
      app.category &&
      applications[app.category]?.find((a: App) => a.id === app.id);

    if (originalApp && originalApp.winget) {
      appsWithWinget.push(app.name || app.id);
      batchContent += `echo Installing ${app.name || app.id}...\n`;
      batchContent += `winget install -e --accept-source-agreements --accept-package-agreements --id ${originalApp.winget}\n`;
      batchContent += `if %ERRORLEVEL% NEQ 0 echo Failed to install ${
        app.name || app.id
      }\n`;
      batchContent += `echo.\n\n`;
    } else {
      appsWithoutWinget.push(app.name || app.id);
    }
  });

  batchContent += `echo ============================\n`;
  batchContent += `echo Installation complete!\n`;

  if (appsWithoutWinget.length > 0) {
    batchContent += `echo.\n`;
    batchContent += `echo Note: The following apps couldn't be installed automatically (no winget ID):\n`;
    appsWithoutWinget.forEach((appName) => {
      batchContent += `echo - ${appName}\n`;
    });
  }

  batchContent += `echo.\n`;
  batchContent += `pause`;

  return batchContent;
};

/**
 * Generates a OSX shell script for installing selected apps with Homebrew
 */
export const generateOSXShellScript = (selectedApps: Array<App>): string => {
  let shellContent = `#!/bin/bash
echo "Tsuika App Installer"
echo "============================"
echo "Installing selected applications..."
echo ""

if ! command -v brew &>/dev/null
then
    echo "Homebrew not found, installing"
    sudo ls &>/dev/null
    curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh -o /tmp/homebrew_install.sh
    /bin/bash /tmp/homebrew_install.sh
    echo "" >> ~/.zprofile
    echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
    eval "$(/opt/homebrew/bin/brew shellenv)"
fi

`;

  const appsWithHomebrew: string[] = [];
  const appsWithoutHomebrew: string[] = [];

  selectedApps.forEach((app) => {
    const originalApp =
      app.category &&
      applications[app.category]?.find((a: App) => a.id === app.id);

    if (originalApp && originalApp.brew) {
      appsWithHomebrew.push(app.name || app.id);
      shellContent += `echo "Installing ${app.name || app.id}..."\n`;
      shellContent += `brew install ${originalApp.brew}\n`;
      shellContent += `if [ $? -ne 0 ]; then echo "Failed to install ${
        app.name || app.id
      }"; fi\n`;
      shellContent += `echo ""\n\n`;
    } else {
      appsWithoutHomebrew.push(app.name || app.id);
    }
  });

  shellContent += `echo "============================"\n`;
  shellContent += `echo "Installation complete!"\n`;

  if (appsWithoutHomebrew.length > 0) {
    shellContent += `echo ""\n`;
    shellContent += `echo "Note: The following apps couldn't be installed automatically (no Homebrew formula):"\n`;
    appsWithoutHomebrew.forEach((appName) => {
      shellContent += `echo "- ${appName}"\n`;
    });
  }

  shellContent += `echo ""\n`;
  shellContent += `read -p "Press Enter to continue..."`;

  return shellContent;
};

/**
 * Downloads a batch file with the given content
 */
export const downloadBatchFile = (batchContent: string): void => {
  const blob = new Blob([batchContent], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = "install_apps.bat";

  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);
};

/**
 * Downloads a shell script with the given content
 */
export const downloadShellScript = (scriptContent: string): void => {
  const blob = new Blob([scriptContent], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = "install_apps.sh";

  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);
};

/**
 * Convenience function to generate and download batch file in one step
 */
export const generateAndDownloadInstallScript = (
  options: BatchGeneratorOptions
): void => {
  const { selectedApps, operatingSystem } = options;
  let scriptContent = "";
  if (operatingSystem === "windows") {
    scriptContent = generateWindowsBatchFile(selectedApps);
    if (scriptContent !== "") downloadBatchFile(scriptContent);
  }

  if (operatingSystem === "osx") {
    scriptContent = generateOSXShellScript(selectedApps);
    if (scriptContent !== "") downloadShellScript(scriptContent);
  }
};
