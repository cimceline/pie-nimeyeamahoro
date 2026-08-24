/**
 * QR Code generator using a lightweight approach.
 * Uses the qr-code-styling concept with a free API fallback.
 */

const QR_API = 'https://api.qrserver.com/v1/create-qr-code/';

/**
 * Get a QR code image URL for the given data.
 * @param {string} data - The URL or text to encode
 * @param {number} size - Image size in pixels (default 200)
 * @returns {string} URL to the QR code image
 */
export function getQRCodeUrl(data, size = 200) {
  return `${QR_API}?size=${size}x${size}&data=${encodeURIComponent(data)}`;
}

/**
 * Download a QR code image.
 * @param {string} data - The URL or text to encode
 * @param {string} filename - Download filename
 * @param {number} size - Image size in pixels
 */
export async function downloadQRCode(data, filename = 'qrcode.png', size = 300) {
  const url = getQRCodeUrl(data, size);
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    // Fallback: open in new tab
    window.open(url, '_blank');
  }
}
