#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read the resume data
const resumeData = JSON.parse(fs.readFileSync('data/resume.json', 'utf8'));

// Generate React component
function generateReactComponent() {
  const { personalInfo, about, skills, education, experience } = resumeData;
  
  return `import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Resume - ${personalInfo.name}',
  description: '${personalInfo.title} - 18+ years scaling cloud platforms and distributed systems'
}

export default function Resume() {
  return (
    <div>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{
          __html: \`
            :root {
                --page-bg: #ffffff;
                --main-text: #111827;
                --secondary-text: #4b5563;
                --light-text: #9ca3af;
                --sidebar-bg: #f9fafb;
                --divider: #e5e7eb;
            }

            body {
                font-family: 'Inter', sans-serif;
                background-color: #e5e7eb;
                color: var(--main-text);
                margin: 0;
                padding: 0;
                font-size: 10pt;
                line-height: 1.5;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
            }

            .pdf-link {
                position: fixed;
                top: 20px;
                right: 20px;
                background: #3b82f6;
                color: white;
                padding: 8px 16px;
                border-radius: 6px;
                text-decoration: none;
                font-size: 0.9rem;
                font-weight: 500;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                transition: background-color 0.2s;
                z-index: 1000;
            }

            .pdf-link:hover {
                background: #2563eb;
            }

            .resume-container {
                display: flex;
                width: 8.5in;
                height: 11in;
                margin: 2rem auto;
                background: var(--page-bg);
                box-shadow: 0 0 15px rgba(0,0,0,0.1);
            }

            .sidebar {
                width: 30%;
                background-color: var(--sidebar-bg);
                padding: 2rem 1.5rem;
                display: flex;
                flex-direction: column;
                gap: 1.3rem;
                overflow: hidden;
            }

            .sidebar h2 {
                font-size: 1rem;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                color: var(--main-text);
                margin: 0 0 0.75rem 0;
                padding-bottom: 0.5rem;
                border-bottom: 1px solid var(--divider);
            }
            
            .sidebar p, .sidebar ul {
                margin: 0;
                font-size: 0.8rem;
                color: var(--secondary-text);
            }

            .skills-list {
                list-style: none;
                padding: 0;
            }

            .skills-list li {
                margin-bottom: 0.75rem;
            }

            .skills-list strong {
                display: block;
                font-weight: 600;
                font-size: 0.85rem;
                color: var(--main-text);
                margin-bottom: 0.25rem;
            }
            
            .education-item {
                margin-bottom: 0.6rem;
            }

            .education-item p {
                margin:0;
                line-height: 1.35;
            }

            .education-item strong {
                font-weight: 600;
                color: var(--main-text);
            }

            .main-content {
                width: 70%;
                padding: 2rem 1.5rem;
                overflow-y: hidden;
            }

            header {
                text-align: left;
                margin-bottom: 1.2rem;
            }
            
            header h1 {
                font-size: 2.5rem;
                font-weight: 700;
                margin: 0;
                letter-spacing: -1px;
            }

            header .job-title {
                font-size: 1.2rem;
                font-weight: 500;
                color: var(--secondary-text);
                margin: 0.25rem 0 0.75rem 0;
            }

            .contact-info {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem 1.5rem;
                font-size: 0.75rem;
            }
            
            .contact-item {
                display: flex;
                align-items: center;
                gap: 0.4rem;
                color: var(--secondary-text);
            }

            .contact-item svg {
                width: 12px;
                height: 12px;
                fill: var(--secondary-text);
            }

            .contact-item a {
                color: var(--secondary-text);
                text-decoration: none;
                transition: color 0.2s;
            }

            .contact-item a:hover {
                color: var(--main-text);
            }

            .main-content h2 {
                font-size: 1rem;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                color: var(--main-text);
                margin: 0 0 1rem 0;
                padding-bottom: 0.5rem;
                border-bottom: 1px solid var(--divider);
            }

            .experience-item {
                margin-bottom: 1.1rem;
            }
            
            .job-header {
                display: flex;
                justify-content: space-between;
                align-items: baseline;
                margin-bottom: 0.5rem;
            }
            
            .job-header h3 {
                margin: 0;
                font-size: 1rem;
                font-weight: 600;
            }

            .job-header .company {
                font-weight: 500;
            }

            .job-header .company a {
                color: inherit;
                text-decoration: none;
            }

            .job-header .company a:hover {
                text-decoration: underline;
            }

            .company-link {
                color: inherit;
                text-decoration: none;
            }

            .company-link:hover {
                text-decoration: underline;
            }

            .job-header .date-location {
                font-size: 0.8rem;
                font-weight: 500;
                color: var(--secondary-text);
                white-space: nowrap;
                font-style: italic;
            }

            .experience-item ul {
                list-style-position: outside;
                padding-left: 1.2rem;
                margin: 0;
                font-size: 0.85rem;
                color: var(--secondary-text);
            }
            
            .experience-item li {
                margin-bottom: 0.35rem;
            }
            
            .earlier-roles {
                font-style: italic;
                color: var(--secondary-text);
                font-size: 0.8rem;
                margin-top: 0.5rem;
            }

            @media print {
                * {
                    -webkit-print-color-adjust: exact !important;
                    color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }
                
                @page {
                    size: 8.5in 11in;
                    margin: 0;
                    padding: 0;
                }
                
                html, body {
                    background-color: var(--page-bg) !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    height: 11in !important;
                    width: 8.5in !important;
                    overflow: hidden !important;
                }
                
                .resume-container {
                    width: 8.5in !important;
                    height: 11in !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    box-shadow: none !important;
                    page-break-inside: avoid !important;
                    transform: none !important;
                }
                
                .pdf-link {
                    display: none !important;
                }
                
                body::after,
                body::before,
                html::after,
                html::before,
                *[style*="position: fixed"]:not(.pdf-link),
                *[style*="position: absolute"]:not(.resume-container *),
                *[style*="bottom"]:not(.resume-container *),
                *[style*="z-index"]:not(.resume-container *):not(.pdf-link) {
                    display: none !important;
                    visibility: hidden !important;
                    opacity: 0 !important;
                }
                
                .sidebar {
                    padding: 2rem 1.5rem !important;
                    gap: 1.3rem !important;
                }
                
                .main-content {
                    padding: 2rem 1.5rem !important;
                }
                
                .experience-item {
                    margin-bottom: 0.8rem !important;
                }
                
                header {
                    margin-bottom: 1.2rem !important;
                }
            }
          \`
        }} />
      <a href="/resume-pdf" className="pdf-link">📄 PDF Version</a>
        <div className="resume-container">
          {/* Sidebar */}
          <aside className="sidebar">
            <section className="about">
              <h2>About</h2>
              <p>
                ${about}
              </p>
            </section>
            
            <section className="skills">
              <h2>Skills</h2>
              <ul className="skills-list">
                ${skills.map(skill => `
                <li>
                  <strong>${skill.category}</strong>
                  ${skill.items}
                </li>
                `).join('')}
              </ul>
            </section>

            <section className="education">
              <h2>Education</h2>
              ${education.map(edu => `
              <div className="education-item">
                <p><strong>${edu.degree}</strong></p>
                <p>${edu.institution}, ${edu.year}</p>
              </div>
              `).join('')}
            </section>
          </aside>

          {/* Main Content */}
          <main className="main-content">
            <header>
              <h1>${personalInfo.name}</h1>
              <div className="job-title">${personalInfo.title}</div>
              <div className="contact-info">
                <div className="contact-item">
                  <a href="mailto:${personalInfo.email}">📧 ${personalInfo.email}</a>
                </div>
                <div className="contact-item">
                  <a href="tel:${personalInfo.phone}">📱 ${personalInfo.phone}</a>
                </div>
                <div className="contact-item">
                  <a href="${personalInfo.website}" target="_blank" rel="noopener noreferrer">🌐 ${personalInfo.website.replace('https://', '')}</a>
                </div>
                <div className="contact-item">
                  <a href="${personalInfo.linkedin}" target="_blank" rel="noopener noreferrer">💼 LinkedIn</a>
                </div>
              </div>
            </header>

            <section className="experience">
              <h2>Experience</h2>

              ${experience.map(exp => `
              <div className="experience-item">
                <div className="job-header">
                  <h3>${exp.title} <span className="company">@ ${exp.companyUrl ? `<a href="${exp.companyUrl}" target="_blank" rel="noopener noreferrer">${exp.company}</a>` : exp.company}</span></h3>
                  <div className="date-location">${exp.period}</div>
                </div>
                <ul>
                  ${exp.responsibilities.map(resp => {
                    // Handle prior companies with links
                    if (exp.priorCompanies) {
                      let processedResp = resp;
                      exp.priorCompanies.forEach(company => {
                        processedResp = processedResp.replace(
                          new RegExp(`\\b${company.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g'),
                          `<a href="${company.url}" target="_blank" rel="noopener noreferrer" className="company-link">${company.name}</a>`
                        );
                      });
                      return `<li>${processedResp}</li>`;
                    }
                    return `<li>${resp}</li>`;
                  }).join('')}
                </ul>
                ${exp.note ? `<p className="earlier-roles">*${exp.note}*</p>` : ''}
              </div>
              `).join('')}
            </section>
          </main>
        </div>
    </div>
  )
}`;
}

// Generate static HTML
function generateStaticHTML() {
  const { personalInfo, about, skills, education, experience } = resumeData;
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resume - ${personalInfo.name}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --page-bg: #ffffff;
            --main-text: #111827;
            --secondary-text: #4b5563;
            --light-text: #9ca3af;
            --sidebar-bg: #f9fafb;
            --divider: #e5e7eb;
        }

        * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
        }
        
        @page {
            size: 8.5in 11in;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Inter', sans-serif;
            background-color: var(--page-bg);
            color: var(--main-text);
            margin: 0;
            padding: 0;
            font-size: 10pt;
            line-height: 1.5;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            height: 11in;
            width: 8.5in;
            overflow: hidden;
        }

        .resume-container {
            display: flex;
            width: 8.5in;
            height: 11in;
            margin: 0;
            padding: 0;
            background: var(--page-bg);
        }

        .sidebar {
            width: 30%;
            background-color: var(--sidebar-bg);
            padding: 2rem 1.5rem;
            display: flex;
            flex-direction: column;
            gap: 1.3rem;
        }

        .sidebar h2 {
            font-size: 1rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: var(--main-text);
            margin: 0 0 0.75rem 0;
            padding-bottom: 0.5rem;
            border-bottom: 1px solid var(--divider);
        }
        
        .sidebar p, .sidebar ul {
            margin: 0;
            font-size: 0.8rem;
            color: var(--secondary-text);
        }

        .skills-list {
            list-style: none;
            padding: 0;
        }

        .skills-list li {
            margin-bottom: 0.75rem;
        }

        .skills-list strong {
            display: block;
            font-weight: 600;
            font-size: 0.85rem;
            color: var(--main-text);
            margin-bottom: 0.25rem;
        }
        
        .education-item {
            margin-bottom: 1rem;
        }

        .education-item p {
            margin:0;
            line-height: 1.4;
        }

        .education-item strong {
            font-weight: 600;
            color: var(--main-text);
        }

        .main-content {
            width: 70%;
            padding: 2rem 1.5rem;
            overflow-y: hidden;
        }

        header {
            text-align: left;
            margin-bottom: 1.2rem;
        }
        
        header h1 {
            font-size: 2.5rem;
            font-weight: 700;
            margin: 0;
            letter-spacing: -1px;
        }

        header .job-title {
            font-size: 1.2rem;
            font-weight: 500;
            color: var(--secondary-text);
            margin: 0.25rem 0 0.75rem 0;
        }

        .contact-info {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem 1.5rem;
            font-size: 0.75rem;
        }
        
        .contact-item {
            display: flex;
            align-items: center;
            gap: 0.4rem;
            color: var(--secondary-text);
        }

        .contact-item a {
            color: var(--secondary-text);
            text-decoration: none;
        }

        .main-content h2 {
            font-size: 1rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: var(--main-text);
            margin: 0 0 1rem 0;
            padding-bottom: 0.5rem;
            border-bottom: 1px solid var(--divider);
        }

        .experience-item {
            margin-bottom: 0.8rem;
        }
        
        .job-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 0.5rem;
        }
        
        .job-header h3 {
            margin: 0;
            font-size: 1rem;
            font-weight: 600;
        }

        .job-header .company {
            font-weight: 500;
        }

        .job-header .company a {
            color: inherit;
            text-decoration: none;
        }

        .job-header .company a:hover {
            text-decoration: underline;
        }

        .company-link {
            color: inherit;
            text-decoration: none;
        }

        .company-link:hover {
            text-decoration: underline;
        }

        .job-header .date-location {
            font-size: 0.8rem;
            font-weight: 500;
            color: var(--secondary-text);
            white-space: nowrap;
            font-style: italic;
        }

        .experience-item ul {
            list-style-position: outside;
            padding-left: 1.2rem;
            margin: 0;
            font-size: 0.85rem;
            color: var(--secondary-text);
        }
        
        .experience-item li {
            margin-bottom: 0.35rem;
        }
        
        .earlier-roles {
            font-style: italic;
            color: var(--secondary-text);
            font-size: 0.8rem;
            margin-top: 0.5rem;
        }
    </style>
</head>
<body>
    <div class="resume-container">
        <!-- Sidebar -->
        <aside class="sidebar">
            <section class="about">
                <h2>About</h2>
                <p>
                    ${about}
                </p>
            </section>
            
            <section class="skills">
                <h2>Skills</h2>
                <ul class="skills-list">
                    ${skills.map(skill => `
                    <li>
                        <strong>${skill.category}</strong>
                        ${skill.items}
                    </li>
                    `).join('')}
                </ul>
            </section>

            <section class="education">
                <h2>Education</h2>
                ${education.map(edu => `
                <div class="education-item">
                    <p><strong>${edu.degree}</strong></p>
                    <p>${edu.institution}, ${edu.year}</p>
                </div>
                `).join('')}
            </section>
        </aside>

        <!-- Main Content -->
        <main class="main-content">
            <header>
                <h1>${personalInfo.name}</h1>
                <div class="job-title">${personalInfo.title}</div>
                <div class="contact-info">
                    <div class="contact-item">
                        <a href="mailto:${personalInfo.email}">📧 ${personalInfo.email}</a>
                    </div>
                    <div class="contact-item">
                        <a href="tel:${personalInfo.phone}">📱 ${personalInfo.phone}</a>
                    </div>
                    <div class="contact-item">
                        <a href="${personalInfo.website}" target="_blank" rel="noopener noreferrer">🌐 ${personalInfo.website.replace('https://', '')}</a>
                    </div>
                    <div class="contact-item">
                        <a href="${personalInfo.linkedin}" target="_blank" rel="noopener noreferrer">💼 LinkedIn</a>
                    </div>
                </div>
            </header>

            <section class="experience">
                <h2>Experience</h2>

                ${experience.map(exp => `
                <div class="experience-item">
                    <div class="job-header">
                        <h3>${exp.title} <span class="company">@ ${exp.companyUrl ? `<a href="${exp.companyUrl}" target="_blank" rel="noopener noreferrer">${exp.company}</a>` : exp.company}</span></h3>
                        <div class="date-location">${exp.period}</div>
                    </div>
                    <ul>
                        ${exp.responsibilities.map(resp => {
                            // Handle prior companies with links
                            if (exp.priorCompanies) {
                                let processedResp = resp;
                                exp.priorCompanies.forEach(company => {
                                    processedResp = processedResp.replace(
                                        new RegExp(`\\b${company.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g'),
                                        `<a href="${company.url}" target="_blank" rel="noopener noreferrer" class="company-link">${company.name}</a>`
                                    );
                                });
                                return `<li>${processedResp}</li>`;
                            }
                            return `<li>${resp}</li>`;
                        }).join('')}
                    </ul>
                    ${exp.note ? `<p class="earlier-roles">*${exp.note}*</p>` : ''}
                </div>
                `).join('')}
            </section>
        </main>
    </div>
</body>
</html>`;
}

// Generate files
const reactComponent = generateReactComponent();
const staticHTML = generateStaticHTML();

// Write React component
fs.writeFileSync('app/resume/page.tsx', reactComponent);

// Write static HTML
fs.writeFileSync('static-resume.html', staticHTML);

console.log('✅ Resume files generated successfully!');
console.log('📄 React component: app/resume/page.tsx');
console.log('🌐 Static HTML: static-resume.html');
console.log('💾 Source data: data/resume.json');
