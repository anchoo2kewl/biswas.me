# Resume and portfolio updates

`lib/profile.json` is the shared, public source for career facts on the homepage,
HTML resume, and PDF. Organization sizes are approximate and are not direct-report
counts. `lib/portfolio.json` contains the project directory.

After editing career content:

```sh
python3 -m pip install reportlab
node scripts/generate-resume.js
```

Commit `lib/profile.json`, `public/resume.html`, and `public/AnshumanBiswas.pdf`
together. The `/resume` page renders the same generated document as the standalone
HTML, with route-specific metadata. No third-party fonts or JavaScript are needed
by the standalone resume. The generator refuses PDF content that runs off the page.
Python and ReportLab are generation tools only, not website runtime dependencies.

Validate with `yarn lint`, `npx tsc --noEmit`, `yarn test`, and `yarn build`.
Visually inspect the PDF and print the HTML at Letter size; both must remain one
page. Check the website and HTML resume at phone, tablet, and desktop widths.

Deployment remains unchanged: `main` is staging, `uat` is UAT, and `production`
is the live-site branch. Respect the existing branch protections and CI checks.
