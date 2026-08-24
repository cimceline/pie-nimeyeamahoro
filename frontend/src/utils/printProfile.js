/**
 * Print the current page or a specific element.
 */
export function printPage() {
  window.print();
}

/**
 * Generate a printable HTML profile and open it in a new window.
 */
export function printProfile(profile, sections = ['bio', 'education', 'experience', 'expertise', 'skills', 'contact']) {
  const p = profile || {};
  const w = window.open('', '_blank');
  if (!w) return;

  let html = `<!DOCTYPE html><html><head><title>${p.professionalName || 'Profile'}</title>
  <style>
    body { font-family: 'Georgia', serif; max-width: 800px; margin: 0 auto; padding: 40px; color: #333; line-height: 1.6; }
    h1 { font-size: 24px; border-bottom: 2px solid #1a5276; padding-bottom: 8px; }
    h2 { font-size: 18px; color: #1a5276; margin-top: 24px; }
    p { margin: 8px 0; }
    .section { margin-bottom: 24px; }
    .item { margin-bottom: 12px; padding-left: 16px; border-left: 2px solid #ddd; }
    .label { font-weight: bold; color: #555; }
    @media print { body { padding: 20px; } }
  </style></head><body>`;

  html += `<h1>${p.professionalName || ''}</h1>`;
  if (p.headline) html += `<p><em>${p.headline}</em></p>`;

  if (sections.includes('bio') && p.shortBio) {
    html += `<div class="section"><h2>Professional Summary</h2><p>${p.shortBio}</p></div>`;
  }

  if (sections.includes('contact')) {
    html += `<div class="section"><h2>Contact</h2>`;
    if (p.contactInfo?.email) html += `<p>Email: ${p.contactInfo.email}</p>`;
    if (p.location) html += `<p>Location: ${p.location.city || ''}, ${p.location.country || ''}</p>`;
    if (p.socialLinks?.linkedin) html += `<p>LinkedIn: ${p.socialLinks.linkedin}</p>`;
    html += `</div>`;
  }

  html += `</body></html>`;
  w.document.write(html);
  w.document.close();
  w.print();
}
