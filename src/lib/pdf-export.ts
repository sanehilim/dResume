/**
 * PDF Export functionality for resumes
 * Uses browser's print API with custom styling
 */

export interface ResumePDFData {
  name: string;
  email: string;
  phone?: string;
  summary?: string;
  skills: string[];
  education: Array<{
    institution: string;
    degree: string;
    field?: string;
    startDate?: string;
    endDate?: string;
  }>;
  experience: Array<{
    company: string;
    position: string;
    startDate?: string;
    endDate?: string;
    description?: string;
  }>;
  certifications?: Array<{
    name: string;
    issuer?: string;
    date?: string;
  }>;
  projects?: Array<{
    name: string;
    description?: string;
    technologies?: string[];
  }>;
  githubUrl?: string;
  linkedinUrl?: string;
}

export function generateResumeHTML(data: ResumePDFData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${data.name} - Resume</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      padding: 40px;
      background: #fff;
    }
    .header {
      border-bottom: 3px solid #0284c7;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      font-size: 32px;
      color: #0284c7;
      margin-bottom: 10px;
    }
    .contact-info {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      color: #666;
      font-size: 14px;
    }
    .section {
      margin-bottom: 30px;
    }
    .section-title {
      font-size: 20px;
      color: #0284c7;
      border-bottom: 2px solid #e0f2fe;
      padding-bottom: 5px;
      margin-bottom: 15px;
    }
    .skills {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .skill-tag {
      background: #e0f2fe;
      color: #0369a1;
      padding: 5px 12px;
      border-radius: 15px;
      font-size: 13px;
    }
    .item {
      margin-bottom: 20px;
    }
    .item-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
    }
    .item-title {
      font-weight: bold;
      font-size: 16px;
      color: #0c4a6e;
    }
    .item-subtitle {
      color: #64748b;
      font-size: 14px;
    }
    .item-date {
      color: #94a3b8;
      font-size: 13px;
    }
    .item-description {
      margin-top: 8px;
      color: #475569;
      font-size: 14px;
    }
    .summary {
      color: #475569;
      line-height: 1.8;
    }
    @media print {
      body {
        padding: 20px;
      }
      .no-print {
        display: none;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${escapeHtml(data.name)}</h1>
    <div class="contact-info">
      ${data.email ? `<span>📧 ${escapeHtml(data.email)}</span>` : ''}
      ${data.phone ? `<span>📱 ${escapeHtml(data.phone)}</span>` : ''}
      ${data.githubUrl ? `<span>🔗 GitHub: ${escapeHtml(data.githubUrl)}</span>` : ''}
      ${data.linkedinUrl ? `<span>💼 LinkedIn: ${escapeHtml(data.linkedinUrl)}</span>` : ''}
    </div>
  </div>

  ${data.summary ? `
  <div class="section">
    <h2 class="section-title">Summary</h2>
    <p class="summary">${escapeHtml(data.summary)}</p>
  </div>
  ` : ''}

  ${data.skills.length > 0 ? `
  <div class="section">
    <h2 class="section-title">Skills</h2>
    <div class="skills">
      ${data.skills.map(skill => `<span class="skill-tag">${escapeHtml(skill)}</span>`).join('')}
    </div>
  </div>
  ` : ''}

  ${data.experience.length > 0 ? `
  <div class="section">
    <h2 class="section-title">Experience</h2>
    ${data.experience.map(exp => `
      <div class="item">
        <div class="item-header">
          <div>
            <div class="item-title">${escapeHtml(exp.position)}</div>
            <div class="item-subtitle">${escapeHtml(exp.company)}</div>
          </div>
          ${exp.startDate || exp.endDate ? `
          <div class="item-date">
            ${exp.startDate || ''} ${exp.endDate ? ' - ' + exp.endDate : 'Present'}
          </div>
          ` : ''}
        </div>
        ${exp.description ? `<div class="item-description">${escapeHtml(exp.description)}</div>` : ''}
      </div>
    `).join('')}
  </div>
  ` : ''}

  ${data.education.length > 0 ? `
  <div class="section">
    <h2 class="section-title">Education</h2>
    ${data.education.map(edu => `
      <div class="item">
        <div class="item-header">
          <div>
            <div class="item-title">${escapeHtml(edu.degree)}${edu.field ? ` - ${escapeHtml(edu.field)}` : ''}</div>
            <div class="item-subtitle">${escapeHtml(edu.institution)}</div>
          </div>
          ${edu.startDate || edu.endDate ? `
          <div class="item-date">
            ${edu.startDate || ''} ${edu.endDate ? ' - ' + edu.endDate : 'Present'}
          </div>
          ` : ''}
        </div>
      </div>
    `).join('')}
  </div>
  ` : ''}

  ${data.certifications && data.certifications.length > 0 ? `
  <div class="section">
    <h2 class="section-title">Certifications</h2>
    ${data.certifications.map(cert => `
      <div class="item">
        <div class="item-title">${escapeHtml(cert.name)}</div>
        ${cert.issuer ? `<div class="item-subtitle">${escapeHtml(cert.issuer)}</div>` : ''}
        ${cert.date ? `<div class="item-date">${escapeHtml(cert.date)}</div>` : ''}
      </div>
    `).join('')}
  </div>
  ` : ''}

  ${data.projects && data.projects.length > 0 ? `
  <div class="section">
    <h2 class="section-title">Projects</h2>
    ${data.projects.map(project => `
      <div class="item">
        <div class="item-title">${escapeHtml(project.name)}</div>
        ${project.description ? `<div class="item-description">${escapeHtml(project.description)}</div>` : ''}
        ${project.technologies && project.technologies.length > 0 ? `
        <div class="skills" style="margin-top: 8px;">
          ${project.technologies.map(tech => `<span class="skill-tag">${escapeHtml(tech)}</span>`).join('')}
        </div>
        ` : ''}
      </div>
    `).join('')}
  </div>
  ` : ''}

  <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0f2fe; text-align: center; color: #94a3b8; font-size: 12px;">
    Generated by dResume - Decentralized Resume Verification Platform
  </div>
</body>
</html>
  `;
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

export async function exportResumeToPDF(data: ResumePDFData): Promise<void> {
  const html = generateResumeHTML(data);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  const printWindow = window.open(url, '_blank');
  if (printWindow) {
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        URL.revokeObjectURL(url);
      }, 250);
    };
  } else {
    // Fallback: create download link
    const link = document.createElement('a');
    link.href = url;
    link.download = `${data.name.replace(/\s+/g, '_')}_Resume.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
