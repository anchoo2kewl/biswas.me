# Deploy Skill

Deploys the biswas.me website to production with proper tracking and verification.

## Usage

When the user asks to "deploy" or "deploy to production" or "push to production", run this skill.

## Deployment Steps

### 1. Pre-Deployment Checks
- Check git status for uncommitted changes
- If changes exist, commit with descriptive message + Claude Code attribution
- Push to GitHub (origin master)
- Note the commit hash being deployed

### 2. Server Deployment
Deploy to server using SSH with --no-cache to ensure fresh build:
```bash
ssh ubuntu@biswas.me "cd /home/ubuntu/projects/biswas.me && git pull origin master && docker-compose build --no-cache && docker-compose down && docker-compose up -d"
```

**IMPORTANT:** Always use `--no-cache` flag to avoid stale cached layers

### 3. Monitor Deployment Status
- Run deployment in background if it will take >2 minutes
- Check deployment progress using BashOutput tool periodically
- Wait for "Creating biswas-me ... done" message indicating containers are up

### 4. Verify Deployment
After containers are up, wait 15-20 seconds for services to start, then verify:
```bash
curl -s https://biswas.me/resume | grep -o "SEARCH_PATTERN" | head -1
```
Where SEARCH_PATTERN is a unique string from the latest changes (e.g., new text, company name, etc.)

### 5. Report Status
Inform user:
- ✅ Committed (commit hash)
- ✅ Pushed to GitHub
- ✅ Deployed to production
- ✅ Verified live at https://biswas.me/resume

## Disk Space Management

If deployment fails with "ENOSPC: no space left on device":
```bash
ssh ubuntu@biswas.me "docker system prune -af && docker volume prune -f"
```
This will free up Docker cache/images (typically 20-30GB)

## Deployment Timing

- With cache: ~2 minutes
- Without cache (--no-cache): 3-5 minutes
- Always use --no-cache to prevent stale content issues

## Common Issues

### Stale Content
- **Problem:** Site shows old content after deployment
- **Cause:** Docker cached layers from previous build
- **Solution:** Always use `--no-cache` flag

### 502 Bad Gateway
- **Problem:** Site returns 502 error
- **Cause:** Docker containers still starting up
- **Solution:** Wait 15-20 seconds after "Creating biswas-me ... done"

### Deployment Timeout
- **Problem:** SSH command times out after 2-3 minutes
- **Cause:** Docker build takes longer than bash timeout
- **Solution:** Run in background mode, check status with BashOutput

## Verification Examples

After deployment, verify specific changes:
```bash
# Check for new text
curl -s https://biswas.me/resume | grep -o "Backend Development"

# Check for GitHub icon
curl -s https://biswas.me/resume | grep -o "github.com/anchoo2kewl"

# Check date format
curl -s https://biswas.me/resume | grep -o "Jan &#x27;25"
```
