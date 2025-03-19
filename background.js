// Log whenever a download is created
chrome.downloads.onCreated.addListener((downloadItem) => {
    console.log("Download Created:", downloadItem);
});

// Function to extract the domain name without TLD
function getDomainName(hostname) {
    let parts = hostname.split('.');
    return parts.length > 2 ? parts[parts.length - 2] : parts[0]; // Get the second-to-last part
}

// Function to determine folder based on file type and source
function getFolder(downloadItem) {
    // Log the finalUrl and url to the console for debugging
    console.log('finalUrl:', downloadItem.finalUrl);
    console.log('url:', downloadItem.url);

    let url = new URL(downloadItem.finalUrl || downloadItem.url);  // Make sure the URL is parsed correctly
    console.log('Parsed URL:', url);  // Debugging line to check the URL being parsed
    
    let domain = getDomainName(url.hostname); // Extract clean domain name
    console.log('Extracted Domain:', domain);  // Debugging line to check the extracted domain

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

// Listen for downloads and organize files accordingly
chrome.downloads.onDeterminingFilename.addListener((downloadItem, suggest) => {
    console.log("onDeterminingFilename triggered");
    let folderName = getFolder(downloadItem);  // Get the folder based on the file type and domain
    let newPath = `${folderName}/${downloadItem.filename}`;  // Set new path with folder and filename

    suggest({ filename: newPath });

    // Show a notification when the file is saved
    chrome.notifications.create('', {
        "type": "basic",
        "iconUrl": "icon.png",  // Make sure you have an icon.png file in the extension directory
        "title": "Download Organized",
        "message": `File saved in ${folderName}!`
    });
});

