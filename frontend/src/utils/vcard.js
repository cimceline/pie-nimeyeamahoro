/**
 * Generate a vCard (.vcf) string for download.
 */
export function generateVCard(profile) {
  const p = profile || {};
  const name = p.professionalName || 'Professional';
  const parts = name.split(' ');
  const firstName = parts[0] || '';
  const lastName = parts.slice(1).join(' ') || '';

  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${name}`,
    `N:${lastName};${firstName};;;`,
  ];

  if (p.contactInfo?.email) lines.push(`EMAIL:${p.contactInfo.email}`);
  if (p.contactInfo?.phone) lines.push(`TEL:${p.contactInfo.phone}`);
  if (p.currentPosition) lines.push(`TITLE:${p.currentPosition}`);
  if (p.location) lines.push(`ADR;TYPE=WORK:;;${p.location.city || ''};${p.location.country || ''};;;`);
  if (p.socialLinks?.linkedin) lines.push(`URL:${p.socialLinks.linkedin}`);
  if (p.seoDescription) lines.push(`NOTE:${p.seoDescription.replace(/\n/g, '\\n')}`);

  lines.push('END:VCARD');
  return lines.join('\r\n');
}

/**
 * Trigger download of a vCard file.
 */
export function downloadVCard(profile) {
  const vcard = generateVCard(profile);
  const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${(profile?.professionalName || 'contact').replace(/\s+/g, '_')}.vcf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
