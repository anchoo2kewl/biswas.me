#!/usr/bin/env python3
"""Generate the one-page PDF and standalone HTML from lib/profile.json.

Run: python3 -m pip install reportlab && python3 scripts/generate-resume.py
No network calls. The generator checks that the PDF fits a single Letter page.
"""
from pathlib import Path
from html import escape
import json
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph

ROOT = Path(__file__).resolve().parents[1]
P = json.loads((ROOT / 'lib/profile.json').read_text())
OUT = ROOT / 'public'
OUT.mkdir(exist_ok=True)

CSS = '''
.resume-page{font-family:Arial,Helvetica,sans-serif;color:#173247;background:#e8eef2;line-height:1.4;padding:24px 12px;font-size:10pt;min-height:100vh}
.resume-page *{box-sizing:border-box}.resume-page a{color:#087c82;text-decoration:none}.resume-page a:hover{text-decoration:underline}.resume-page a:focus-visible{outline:2px solid #087c82;outline-offset:4px}
.r-toolbar{max-width:8.5in;margin:0 auto 16px;display:flex;justify-content:space-between;gap:15px;font-size:13px;font-weight:700}.r-sheet{display:grid;grid-template-columns:194pt 1fr;grid-template-rows:min-content 1fr;width:8.5in;min-height:11in;margin:auto;background:#fff;box-shadow:0 8px 35px #17324720}
.r-aside{grid-column:1;grid-row:1/3;background:#edf4f8;padding:26pt 17pt;color:#42535e}.r-aside section{margin-bottom:20pt}.resume-page h2{font-size:10pt;text-transform:uppercase;letter-spacing:.6pt;color:#087c82;margin:0 0 9pt;padding-bottom:5pt;border-bottom:1px solid #c7d8e0;font-weight:700;line-height:1.25}.r-aside p{font-size:9.3pt;line-height:12.3pt;margin:0 0 8pt}.r-aside h3{font-size:9.5pt;margin:0 0 4pt;color:#173247;font-weight:700}.r-skill,.r-education{margin-bottom:12pt}.r-aside .r-research{font-size:8.5pt;line-height:11.5pt;color:#5d6e78}.r-header{grid-column:2;padding:27pt 18pt 13pt}.r-header h1{font-size:27pt;line-height:1.15;letter-spacing:-.7pt;margin:0 0 6pt;font-weight:700}.r-title{font-size:13pt;margin:0 0 4pt}.r-focus{font-size:9pt;text-transform:uppercase;letter-spacing:.5pt;font-weight:700;color:#087c82;margin:0 0 8pt}.r-contact{font-size:8pt;color:#5d6e78;margin:0 0 3pt;line-height:11pt}.r-body{grid-column:2;padding:0 18pt 22pt}.r-job{margin-bottom:9pt;break-inside:avoid}.r-job-heading{display:flex;justify-content:space-between;align-items:baseline;gap:6pt;margin-bottom:4pt}.r-job h3{font-size:9.7pt;line-height:12pt;font-weight:700;margin:0}.r-date{font-size:7.5pt;color:#677983;white-space:nowrap;font-style:italic}.r-body ul{margin:0;padding-left:10pt;list-style:disc}.r-body li{font-size:9.1pt;line-height:12.1pt;color:#42535e;padding-left:0;margin-bottom:3pt}.r-body li::marker{color:#087c82}.r-note{font-size:7.8pt;color:#677983;line-height:10.5pt;margin:4pt 0 0}.r-earlier{margin:0 0 11pt}.r-projects li{margin-bottom:5pt}.r-projects a{font-weight:700}
@page{size:Letter;margin:0}
@media print{html,body{margin:0!important;padding:0!important;background:#fff!important}.resume-page{padding:0;background:#fff;min-height:0;-webkit-print-color-adjust:exact;print-color-adjust:exact}.r-toolbar{display:none}.r-sheet{margin:0;box-shadow:none;width:8.5in;min-height:11in}.r-aside{print-color-adjust:exact}}
@media screen and (max-width:850px){.r-sheet{width:100%;max-width:8.5in;grid-template-columns:30% 1fr}.r-job-heading{flex-wrap:wrap}.r-header h1{font-size:25pt}}
@media screen and (max-width:620px){.resume-page{padding:16px 10px}.r-sheet{display:flex;flex-direction:column;min-height:0}.r-header{order:0;padding:24px 20px 16px}.r-header h1{font-size:29px}.r-body{order:1;padding:0 20px 24px}.r-aside{order:2;padding:24px 20px}.r-aside section:last-child{margin-bottom:0}.r-body li,.r-aside p{font-size:14px;line-height:1.6}.r-job h3,.r-aside h3{font-size:15px;line-height:1.5}.resume-page h2{font-size:14px}.r-job{margin-bottom:20px}.r-job-heading{display:block}.r-date,.r-contact,.r-note{font-size:12px;line-height:1.5}.r-header .r-title{font-size:18px}.r-focus{font-size:12px}.r-toolbar{font-size:12px}.r-projects li{margin-bottom:12px}}
'''


def e(value):
    return escape(str(value), quote=True)


def emphasize(value):
    text = e(value)
    for phrase in ['~40 engineers', '~15-engineer organization', '~70 engineers', 'patent-pending database-security technology', '99.99% uptime SLAs', 'onboarding time 60%', 'multiple paying customers']:
        text = text.replace(e(phrase), f'<strong>{e(phrase)}</strong>')
    return text


def make_html():
    skills = ''.join(f'<div class="r-skill"><h3>{e(s["name"])}</h3><p>{e(s["text"])}</p></div>' for s in P['skills'])
    education = ''.join(f'<div class="r-education"><h3>{e(s["degree"])}</h3><p>{e(s["school"])}, {e(s["year"])}</p>' + (f'<p class="r-research">{e(s["note"])}</p>' if s.get('note') else '') + '</div>' for s in P['education'])
    jobs = ''
    for j in P['experience']:
        bullets = ''.join(f'<li>{emphasize(b)}</li>' for b in j['bullets'])
        note = f'<p class="r-note">{e(j["note"])}</p>' if j.get('note') else ''
        jobs += f'<article class="r-job"><div class="r-job-heading"><h3>{e(j["title"])} @ {e(j["company"])}</h3><span class="r-date">{e(j["period"])}</span></div><ul>{bullets}</ul>{note}</article>'
    projects = ''.join(f'<li><a href="{e(s["url"])}">{e(s["name"])}</a> — {emphasize(s["text"])}</li>' for s in P['projects'])
    content = f'''<main class="resume-page"><nav class="r-toolbar" aria-label="Resume actions"><a href="/">← Back to website</a><a href="/AnshumanBiswas.pdf" download="Anshuman_Biswas_Resume.pdf">Download PDF ↓</a></nav>
<article class="r-sheet" aria-label="Anshuman Biswas resume">
<header class="r-header"><h1>{e(P['name'])}</h1><p class="r-title">{e(P['title'])}</p><p class="r-focus">{e(P['focus'])}</p><p class="r-contact">{e(P['location'])} | <a href="mailto:{e(P['email'])}">{e(P['email'])}</a> | {e(P['phone'])}</p><p class="r-contact"><a href="{e(P['website'])}">biswas.me</a> | <a href="{e(P['linkedin'])}">LinkedIn</a> | <a href="{e(P['github'])}">github.com/anchoo2kewl</a></p></header>
<aside class="r-aside"><section><h2>About</h2><p>{e(P['about'])}</p><p>{e(P['ai'])}</p></section><section><h2>Skills</h2>{skills}</section><section><h2>Education</h2>{education}</section></aside>
<div class="r-body"><section aria-label="Experience"><h2>Experience</h2>{jobs}<p class="r-note r-earlier">{e(P['earlier'])}</p></section><section class="r-projects"><h2>Selected hands-on work</h2><ul>{projects}</ul></section></div>
</article></main>'''
    document = f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Anshuman Biswas | Engineering Leadership Resume</title><meta name="description" content="Hands-on engineering executive in AI, cloud and cybersecurity. Multi-team leadership, IBM Granite experience and patent-pending database security."><link rel="canonical" href="https://biswas.me/resume"><style>{CSS}</style></head><body style="margin:0">{content}</body></html>'''
    (OUT / 'resume.html').write_text(document)


NAVY, TEAL, BODY, MUTED = map(HexColor, ['#173247', '#087c82', '#42535e', '#677983'])


def make_pdf():
    c = canvas.Canvas(str(OUT / 'AnshumanBiswas.pdf'), pagesize=(612, 792), pageCompression=1, invariant=1)
    c.setTitle('Anshuman Biswas - VP of Engineering | AI, Cloud & Cybersecurity')
    c.setAuthor('Anshuman Biswas')
    c.setSubject('Hands-on engineering leadership resume')
    c.setFillColor(HexColor('#edf4f8')); c.rect(0, 0, 194, 792, fill=1, stroke=0)

    def para(text, x, y, width, size=9.1, leading=12.1, color=BODY, bold=False):
        style = ParagraphStyle('p', fontName='Helvetica-Bold' if bold else 'Helvetica', fontSize=size, leading=leading, textColor=color, spaceAfter=0)
        p = Paragraph(text, style)
        _, height = p.wrap(width, 1000)
        p.drawOn(c, x, y-height)
        return y-height

    def heading(text, x, y, width):
        c.setFillColor(TEAL); c.setFont('Helvetica-Bold', 10)
        c.drawString(x, y-10, text.upper())
        c.setStrokeColor(HexColor('#c7d8e0')); c.setLineWidth(.7); c.line(x,y-17,x+width,y-17)
        return y-27

    y=763
    y=heading('About',17,y,160)
    y=para(e(P['about']),17,y,160,9.3,12.3)-9
    y=para(e(P['ai']),17,y,160,9.3,12.3)-20
    y=heading('Skills',17,y,160)
    for s in P['skills']:
        y=para(e(s['name']),17,y,160,9.5,12.2,NAVY,True)-4
        y=para(e(s['text']),17,y,160,9.3,12.3)-13
    y-=4
    y=heading('Education',17,y,160)
    for s in P['education']:
        y=para(e(s['degree']),17,y,160,9.5,12.2,NAVY,True)-4
        y=para(e(f'{s["school"]}, {s["year"]}'),17,y,160,9.3,12.3)-4
        if s.get('note'): y=para(e(s['note']),17,y,160,8.5,11.5,MUTED)-4
        y-=10
    if y < 24: raise ValueError(f'Sidebar overflows: {y}')
    x,w=212,382
    y=para(e(P['name']),x,763,w,27,31,NAVY,True)-4
    y=para(e(P['title']),x,y,w,13,16,NAVY)-4
    y=para(e(P['focus'].upper()),x,y,w,9,12,TEAL,True)-8
    y=para(e(f'{P["location"]} | {P["email"]} | {P["phone"]}'),x,y,w,8,11,MUTED)-2
    y=para(f'<a href="{P["website"]}" color="#087c82">biswas.me</a> | <a href="{P["linkedin"]}" color="#087c82">LinkedIn</a> | <a href="{P["github"]}" color="#087c82">github.com/anchoo2kewl</a>',x,y,w,8,11,MUTED)-14
    y=heading('Experience',x,y,w)
    for j in P['experience']:
        title=f'{j["title"]} @ {j["company"]}'
        title_width=c.stringWidth(title,'Helvetica-Bold',9.7)
        date_width=c.stringWidth(j['period'],'Helvetica-Oblique',7.5)
        start=y
        y=para(e(title),x,y,w-date_width-9 if title_width+date_width+9<w else w,9.7,12,NAVY,True)
        if title_width+date_width+9<w:
            c.setFillColor(MUTED);c.setFont('Helvetica-Oblique',7.5);c.drawRightString(x+w,start-9,j['period'])
        else:
            y=para(e(j['period']),x,y-2,w,7.5,10,MUTED)
        y-=5
        for b in j['bullets']:
            c.setFillColor(TEAL);c.circle(x+2,y-5,1.25,fill=1,stroke=0)
            text=emphasize(b).replace('<strong>','<b>').replace('</strong>','</b>')
            y=para(text,x+9,y,w-9)-3
        if j.get('note'): y=para(e(j['note']),x,y-1,w,7.8,10.5,MUTED)-3
        y-=6
    y=para(e(P['earlier']),x,y,w,7.8,10.5,MUTED)-12
    y=heading('Selected hands-on work',x,y,w)
    for s in P['projects']:
        c.setFillColor(TEAL);c.circle(x+2,y-5,1.25,fill=1,stroke=0)
        text=f'<a href="{e(s["url"])}" color="#087c82"><b>{e(s["name"])}</b></a> - {e(s["text"])}'
        text=text.replace('multiple paying customers','<b>multiple paying customers</b>')
        y=para(text,x+9,y,w-9)-5
    if y < 20: raise ValueError(f'Resume overflows page: bottom y={y:.1f}')
    c.showPage(); c.save()
    print(f'PDF content ends at {y:.1f} pt; one Letter page written.')


if __name__=='__main__':
    make_html()
    make_pdf()
    print('Generated public/resume.html and public/AnshumanBiswas.pdf')
