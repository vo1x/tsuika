import { App } from "@/types";
import { applications } from "@/constants";

interface BatchGeneratorOptions {
  selectedApps: Array<App>;
}

/**
 * Generates a Windows batch script for installing selected apps with winget
 */
export const generateBatchFile = ({
  selectedApps,
}: BatchGeneratorOptions): string => {
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
 * Convenience function to generate and download batch file in one step
 */
export const generateAndDownloadBatchFile = (
  options: BatchGeneratorOptions
): void => {
  const batchContent = generateBatchFile(options);
  downloadBatchFile(batchContent);
};
