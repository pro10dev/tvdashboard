/**
 * Convert Google Drive share/view links to directly viewable image URLs.
 * Passes through non-Drive URLs unchanged.
 */
export function toViewableImageUrl(url: string): string {
  if (!url) return "";

  const fileId = extractDriveFileId(url);
  if (fileId) {
    return `https://drive.usercontent.google.com/download?id=${fileId}&export=view`;
  }

  return url;
}

function extractDriveFileId(url: string): string | null {
  // https://drive.google.com/file/d/FILE_ID/view?...
  const fileMatch = url.match(/drive\.google\.com\/file\/d\/([^/?#]+)/);
  if (fileMatch) return fileMatch[1];

  // https://drive.google.com/open?id=FILE_ID
  const openMatch = url.match(/drive\.google\.com\/open\?id=([^&#]+)/);
  if (openMatch) return openMatch[1];

  // https://drive.google.com/uc?id=FILE_ID&...
  const ucMatch = url.match(/drive\.google\.com\/uc\?.*id=([^&#]+)/);
  if (ucMatch) return ucMatch[1];

  // https://drive.google.com/thumbnail?id=FILE_ID
  const thumbMatch = url.match(/drive\.google\.com\/thumbnail\?.*id=([^&#]+)/);
  if (thumbMatch) return thumbMatch[1];

  return null;
}
