/**
 * Convert Google Drive share/view links to directly viewable image URLs.
 * Passes through non-Drive URLs unchanged.
 */
export function toViewableImageUrl(url: string): string {
  if (!url) return "";

  // https://drive.google.com/file/d/FILE_ID/view?...
  const fileMatch = url.match(/drive\.google\.com\/file\/d\/([^/?#]+)/);
  if (fileMatch) {
    return `https://lh3.googleusercontent.com/d/${fileMatch[1]}`;
  }

  // https://drive.google.com/open?id=FILE_ID
  const openMatch = url.match(/drive\.google\.com\/open\?id=([^&#]+)/);
  if (openMatch) {
    return `https://lh3.googleusercontent.com/d/${openMatch[1]}`;
  }

  // https://drive.google.com/uc?id=FILE_ID&...
  const ucMatch = url.match(/drive\.google\.com\/uc\?.*id=([^&#]+)/);
  if (ucMatch) {
    return `https://lh3.googleusercontent.com/d/${ucMatch[1]}`;
  }

  return url;
}
