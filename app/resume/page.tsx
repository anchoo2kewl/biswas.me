import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Resume - Anshuman Biswas',
  description: 'VP of Engineering - 18+ years scaling cloud platforms and distributed systems'
}

export default function Resume() {
  return (
    <div>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{
          __html: `
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
                padding: 2.5rem 2rem;
                display: flex;
                flex-direction: column;
                gap: 1.7rem;
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
                padding: 2.5rem 2rem;
                overflow-y: hidden;
            }

            header {
                text-align: left;
                margin-bottom: 1.8rem;
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
          `
        }} />
      <a href="/resume-pdf" className="pdf-link">📄 PDF Version</a>
        <div className="resume-container">
          {/* Sidebar */}
          <aside className="sidebar">
            <section className="about">
              <h2>About</h2>
              <p>
                Engineering leader w/ 18+ yrs building secure, high-performance cloud platforms & distributed systems. Led teams developing ransomware detection, malware analysis & threat identification. Expert in cloud security architecture, incident response automation & scaling infrastructure.
              </p>
            </section>

            <section className="skills">
              <h2>Skills</h2>
              <ul className="skills-list">

                <li>
                  <strong>Leadership & Strategy</strong>
                  Technology Leadership, Cloud Security Strategy, Team Scaling & Mentorship, Product Delivery, Roadmapping
                </li>

                <li>
                  <strong>Architecture & Systems</strong>
                  Distributed Systems, Cloud-Native Security (AWS, Azure), High-Availability Design, Microservices, Threat Detection
                </li>

                <li>
                  <strong>Technical Expertise</strong>
                  Backend Development (Go, Python, Node.js, Java, Rust), Database Design & Optimization (PostgreSQL, MySQL, MongoDB), Infrastructure as Code (Terraform, Ansible), API Design, Performance Tuning, Security Automation
                </li>

              </ul>
            </section>

            <section className="education">
              <h2>Education</h2>

              <div className="education-item">
                <p><strong>Ph.D. Electrical & Comp. Eng.</strong></p>
                <p>Carleton University, 2019</p>
              </div>

              <div className="education-item">
                <p><strong>M.Sc. Computer Science</strong></p>
                <p>University of Calcutta, 2009</p>
              </div>

              <div className="education-item">
                <p><strong>B.Sc. Computer Science</strong></p>
                <p>University of Calcutta, 2007</p>
              </div>

            </section>
          </aside>

          {/* Main Content */}
          <main className="main-content">
            <header>
              <h1 style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                Anshuman Biswas
                <a href="https://github.com/anchoo2kewl" target="_blank" rel="noopener noreferrer" style={{fontSize: '1.5rem', textDecoration: 'none'}}>
                  <svg width="32" height="32" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                  </svg>
                </a>
              </h1>
              <div className="job-title">VP of Engineering</div>
              <div className="contact-info">
                <div className="contact-item">
                  <a href="mailto:anshuman@biswas.me">📧 anshuman@biswas.me</a>
                </div>
                <div className="contact-item">
                  <a href="tel:+1 647-982-9354">📱 +1 647-982-9354</a>
                </div>
                <div className="contact-item">
                  <a href="https://biswas.me" target="_blank" rel="noopener noreferrer">🌐 biswas.me</a>
                </div>
                <div className="contact-item">
                  <a href="https://www.linkedin.com/in/anshuman-biswas-phd-613b0145/" target="_blank" rel="noopener noreferrer">💼 LinkedIn</a>
                </div>
              </div>
            </header>

            <section className="experience">

              <div className="experience-item">
                <div className="job-header">
                  <h3>VP of Engineering <span className="company">@ <a href="https://elastio.com" target="_blank" rel="noopener noreferrer">Elastio</a></span></h3>
                  <div className="date-location">Jan '25 – Present</div>
                </div>
                <ul>
                  <li>Lead teams building ransomware detection & malware scanning w/ AI-powered anomaly detection, behavioral analysis & threat identification</li><li>Design security infrastructure protecting from ransomware, zero-day exploits & APTs; implement secure SDLC w/ threat modeling & pen testing</li><li>Architect cloud-scale backup security scanning 100M+ files daily; integrate w/ AWS/Azure security services for defense-in-depth protection</li><li>Build automated incident response workflows reducing MTTR from hours to minutes; enable customers to recover from attacks in under 15 minutes</li><li>Direct cross-functional engineering teams across 3 product lines; accelerate feature delivery velocity 2x while maintaining 99.9% uptime</li>
                </ul>
                
              </div>
              
              <div className="experience-item">
                <div className="job-header">
                  <h3>Senior Engineering Manager <span className="company">@ <a href="https://veeva.com" target="_blank" rel="noopener noreferrer">Veeva Systems</a></span></h3>
                  <div className="date-location">Mar '24 – Jan '25</div>
                </div>
                <ul>
                  <li>Built secure contact center for Veeva CRM w/ encryption, access controls & SOC2/HIPAA compliance; led security audits & vulnerability remediation</li><li>Scaled team by hiring & mentoring engineers/managers; established secure coding standards & security practices</li>
                </ul>
                
              </div>
              
              <div className="experience-item">
                <div className="job-header">
                  <h3>Senior Engineering Manager <span className="company">@ <a href="https://turbonomic.com" target="_blank" rel="noopener noreferrer">IBM Turbonomic</a></span></h3>
                  <div className="date-location">Jul '17 – Mar '24</div>
                </div>
                <ul>
                  <li>Managed distributed teams building orchestration & monitoring w/ security controls; deployed Granite LLM for threat identification</li><li>Drove DevOps automation w/ security gates reducing onboarding 60%; built OAuth2/SAML integrations; led incident response</li><li>Established security champions program across 15+ teams; reduced vulnerabilities 40% via automated scanning & training</li>
                </ul>
                <p className="earlier-roles">Sr. Software Engineer → Engineering Mgr ('18) → Sr. Engineering Mgr ('21)</p>
              </div>
              
              <div className="experience-item">
                <div className="job-header">
                  <h3>Prior Engineering Roles <span className="company">@ Various</span></h3>
                  <div className="date-location">'07 – '17</div>
                </div>
                <ul>
                  <li><a href="https://trendmicro.com" target="_blank" rel="noopener noreferrer" className="company-link">Trend Micro</a> (Software Engineer, '16-'17): Broke monolith into microservices; real-time malware detection, heuristic analysis & online DB migration tool</li><li><a href="https://nearest.com" target="_blank" rel="noopener noreferrer" className="company-link">Nearest.com</a> (CTO, '12-'14): Architected hyper-local search engine & social community on AWS & OpenStack w/ DDoS protection & secure APIs</li><li><a href="https://tcs.com" target="_blank" rel="noopener noreferrer" className="company-link">Tata Consultancy Services</a> ('09-'12): Led SAP BI implementations & cloud migrations w/ security hardening for Fortune 500 clients</li><li>Additional: Cloud platforms research (Carleton, '15-'16), airline systems ('09), network stack ('07-'08)</li>
                </ul>
                
              </div>
              
            </section>
          </main>
        </div>
    </div>
  )
}