# Deploy Skill

Deploys the biswas.me website to production.

## Usage

When the user asks to "deploy" or "deploy to production" or "push to production", run this skill.

## Steps

1. Check git status to see if there are uncommitted changes
2. If there are changes, commit them with a descriptive message including:
   - Summary of what changed
   - Why it changed
   - Include Claude Code attribution footer
3. Push to GitHub (origin master)
4. Deploy to server using SSH:
   ```bash
   ssh ubuntu@biswas.me "cd /home/ubuntu/projects/biswas.me && git pull origin master && docker-compose build --no-cache && docker-compose down && docker-compose up -d"
   ```
5. Wait for deployment to complete (may take 3-5 minutes for Docker build without cache)
6. Verify deployment by checking https://biswas.me

## Script Details

The `deploy.sh` script:
- In local mode: commits changes and pushes to GitHub, then shows SSH instructions
- In server mode: pulls latest code, rebuilds Docker containers, restarts services
- Includes health checks for both frontend and backend
- Cleans up old Docker images

## Common Issues

- 502 Bad Gateway: Docker containers are still building/starting, wait 1-2 minutes
- Git push errors: Check if branch is 'master' not 'main'
- SSH timeout: Deployment continues in background, check site in a few minutes

## Post-Deployment

- Check https://biswas.me to verify site is live
- Check https://biswas.me/resume for updated resume
- Verify PDF is accessible at https://biswas.me/AnshumanBiswas.pdf or via resume page
