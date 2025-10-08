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
                Engineering leader with 18+ years of experience scaling high-performance cloud platforms and distributed systems. Proven ability to translate complex technical challenges into high-impact business solutions, driving product innovation by building and mentoring elite engineering teams.
              </p>
            </section>
            
            <section className="skills">
              <h2>Skills</h2>
              <ul className="skills-list">
                
                <li>
                  <strong>Leadership & Strategy</strong>
                  Technology Leadership, Product & Cloud Strategy, Team Scaling & Mentorship, Product Delivery, Roadmapping, Risk Management
                </li>
                
                <li>
                  <strong>Architecture & Systems</strong>
                  Distributed Systems Design, Cloud-Native Architecture (AWS, OpenStack), Enterprise Integrations, Microservices
                </li>
                
                <li>
                  <strong>Technical Expertise</strong>
                  DevOps & CI/CD, Infrastructure as Code (Terraform, Ansible), Performance Optimization, Automation, Data Warehousing
                </li>
                
              </ul>
            </section>

            <section className="education">
              <h2>Education</h2>
              
              <div className="education-item">
                <p><strong>Ph.D., Electrical & Computer Engineering</strong></p>
                <p>Carleton University, 2019</p>
              </div>
              
              <div className="education-item">
                <p><strong>M.Sc., Computer Science</strong></p>
                <p>University of Calcutta, 2009</p>
              </div>
              
              <div className="education-item">
                <p><strong>B.Sc., Computer Science</strong></p>
                <p>University of Calcutta, 2007</p>
              </div>
              
            </section>
          </aside>

          {/* Main Content */}
          <main className="main-content">
            <header>
              <h1>Anshuman Biswas</h1>
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
                  <a href="https://linkedin.com/in/anshumanbiswas" target="_blank" rel="noopener noreferrer">💼 LinkedIn</a>
                </div>
              </div>
            </header>

            <section className="experience">
              <h2>Experience</h2>

              
              <div className="experience-item">
                <div className="job-header">
                  <h3>VP of Engineering <span className="company">@ <a href="https://elastio.com" target="_blank" rel="noopener noreferrer">Elastio</a></span></h3>
                  <div className="date-location">Jan 2025 – Present</div>
                </div>
                <ul>
                  <li>Driving engineering teams to create scalable cloud ransomware detection platforms, pioneering AI-first development</li><li>Enabling MCP servers that power intelligent threat detection, automated response, and internal AI innovation</li><li>Scaling engineering teams to build high-availability, cloud-native threat detection platforms with advanced LLM integration</li>
                </ul>
                
              </div>
              
              <div className="experience-item">
                <div className="job-header">
                  <h3>Senior Engineering Manager <span className="company">@ <a href="https://veeva.com" target="_blank" rel="noopener noreferrer">Veeva Systems</a></span></h3>
                  <div className="date-location">Mar 2024 – Jan 2025</div>
                </div>
                <ul>
                  <li>Led the team that engineered and embedded scalable contact center capabilities into Veeva CRM, improving global customer engagement</li><li>Scaled the organization by hiring and mentoring top-tier engineers and managers while owning the full product delivery lifecycle</li>
                </ul>
                
              </div>
              
              <div className="experience-item">
                <div className="job-header">
                  <h3>Senior Engineering Manager <span className="company">@ <a href="https://turbonomic.com" target="_blank" rel="noopener noreferrer">IBM Turbonomic</a></span></h3>
                  <div className="date-location">Jul 2017 – Mar 2024</div>
                </div>
                <ul>
                  <li>Managed globally distributed teams responsible for core orchestration and monitoring products for the Turbonomic platform</li><li>Created and utilized Granite LLM models for advanced code analysis and security threat identification in enterprise environments</li><li>Drove DevOps automation initiatives that significantly reduced developer onboarding time and architected critical enterprise integrations</li>
                </ul>
                <p className="earlier-roles">*Promoted from Sr. Software Engineer → Eng. Manager (2017–2018)*</p>
              </div>
              
              <div className="experience-item">
                <div className="job-header">
                  <h3>Prior Engineering Roles <span className="company">@ Various</span></h3>
                  <div className="date-location">2007 – 2017</div>
                </div>
                <ul>
                  <li><a href="https://nearest.com" target="_blank" rel="noopener noreferrer" className="company-link">Nearest.com</a> (CTO): Architected and scaled a hyper-local search engine and its fault-tolerant infrastructure from concept to production on AWS & OpenStack</li><li><a href="https://trendmicro.com" target="_blank" rel="noopener noreferrer" className="company-link">Trend Micro</a>: Developed distributed cloud security systems on AWS</li><li><a href="https://carleton.ca" target="_blank" rel="noopener noreferrer" className="company-link">Carleton University</a>: Built a research collaboration cloud app</li><li><a href="https://tcs.com" target="_blank" rel="noopener noreferrer" className="company-link">Tata Consultancy Services</a>: Led early on-prem to cloud migrations</li><li><a href="https://globaltravelsolutions.com" target="_blank" rel="noopener noreferrer" className="company-link">Global Travel Solutions</a>: Built an airline reservation system</li><li><a href="https://2piradian.com" target="_blank" rel="noopener noreferrer" className="company-link">2PiRadian</a>: Developed a network stack over optical media</li>
                </ul>
                
              </div>
              
            </section>
          </main>
        </div>
    </div>
  )
}