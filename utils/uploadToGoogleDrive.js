// * Upload result file (.csv) to Google Drive

import dotenv from "dotenv";
import fs from "fs";
import path from "path";

import { GoogleDriveService } from "./googleDriveService.js";

dotenv.config();

export async function uploadToGoogleDrive(fileName) {
  console.log("Uploading file...");

  const driveClientId = process.env.GOOGLE_DRIVE_CLIENT_ID || '';
  const driveClientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET || '';
  const driveRedirectUri = process.env.GOOGLE_DRIVE_REDIRECT_URI || '';
  const driveRefreshToken = process.env.GOOGLE_DRIVE_REFRESH_TOKEN || '';

  const googleDriveService = new GoogleDriveService(driveClientId, driveClientSecret, driveRedirectUri, driveRefreshToken);

  const finalPath = path.join(import.meta.dirname, "..", fileName);
  const folderName = "[jsonToCsv]_result";

  if (!fs.existsSync(finalPath)) {
    console.error("[-ERROR-] File not found!");
    return;
  }

  try {
    let folder = await googleDriveService.searchFolder(folderName);

    if (!folder) {
      folder = await googleDriveService.createFolder(folderName);
    }

    await googleDriveService.saveFile(fileName, finalPath, "text/csv", folder.id);
    console.log(`[UPLOAD] Successfully! '${fileName}' has been uploaded in '${folderName}' folder.`);

    // ! Delete the file on the server
    // fs.unlinkSync(finalPath);
    // console.log("[REMOVE] File has been removed from server.");

  } catch (err) {
    console.error("[-ERROR-] Working with Google Drive API failed: ", err);
  }
}