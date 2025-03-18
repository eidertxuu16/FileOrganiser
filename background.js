// Function to extract the domain name without TLD
function getDomainName(hostname) {
    let parts = hostname.split('.');
    return parts.length > 2 ? parts[parts.length - 2] : parts[0]; // Get the second-to-last part
}

// Function to determine folder based on file type and source
function getFolder(downloadItem) {
    let url = new URL(downloadItem.finalUrl);
    let domain = getDomainName(url.hostname); // Extract clean domain name

    let fileType = downloadItem.filename.split('.').pop().toLowerCase();
    let folder = "Misc"; // Default folder

    if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(fileType)) {
        folder = "Images";
    } else if (["mp4", "avi", "mkv", "webm"].includes(fileType)) {
        folder = "Videos";
    } else if (["pdf", "doc", "docx", "ppt", "pptx", "xls", "xlsx"].includes(fileType)) {
        folder = "Documents";
    } else if (["zip", "rar", "7z", "tar", "gz"].includes(fileType)) {
        folder = "Compressed";
    } else if (["mp3", "wav", "flac", "ogg"].includes(fileType)) {
        folder = "Audio";
    }

    // Append the website domain as a subfolder
    folder += `/${domain}`;

    return folder;
}

// Listen for new downloads
browser.downloads.onDeterminingFilename.addListener((downloadItem, suggest) => {
    let folderName = getFolder(downloadItem);
    let newPath = `${folderName}/${downloadItem.filename}`;

    suggest({ filename: newPath });

    // Show a notification when the file is saved
    browser.notifications.create({
        "type": "basic",
        "iconUrl": "icon.png",
        "title": "Download Organized",
        "message": `File saved in ${folderName}!`
    });
});
