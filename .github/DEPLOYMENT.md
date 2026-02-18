# Deployment Documentation

## GitHub Actions CI/CD Setup

This repository is configured with automatic deployment to production using GitHub Actions.

### How it works

1. **Trigger**: Every push to the `master` branch automatically triggers a deployment
2. **Build**: The GitHub Actions workflow builds the Docker image on the production server
3. **Deploy**: The new container replaces the old one with zero-downtime deployment
4. **Verify**: Automated health checks ensure the deployment was successful

### Manual Deployment

You can also trigger a deployment manually:
1. Go to the [Actions tab](https://github.com/anchoo2kewl/biswas.me/actions)
2. Select "Deploy to Production" workflow
3. Click "Run workflow" and select the `master` branch

## Setup Instructions

### 1. GitHub Secrets Configuration

You need to add the following secrets to your GitHub repository:

#### SSH_PRIVATE_KEY

This is the private SSH key used to connect to the production server.

**To add the secret:**

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `SSH_PRIVATE_KEY`
5. Value: Paste the contents of your SSH private key (the one that can access `ubuntu@biswas.me`)

**To get your SSH private key:**

```bash
# On your local machine (macOS/Linux)
cat ~/.ssh/id_rsa

# Or if you use a different key
cat ~/.ssh/your_key_name
```

**Important**: Make sure this key is added to the `authorized_keys` on the server:

```bash
# Verify the key is authorized on the server
ssh ubuntu@biswas.me "cat ~/.ssh/authorized_keys"
```

#### SONAR_TOKEN

The authentication token for SonarQube analysis.

**To get your SonarQube token:**

1. Log in to your SonarQube instance at https://sonar.taskai.cc
2. Go to **My Account** → **Security** → **Generate Tokens**
3. Create a new token with name: `biswas.me-github-actions`
4. Copy the generated token
5. Add it to GitHub Secrets as `SONAR_TOKEN`

#### SONAR_HOST_URL

The URL of your SonarQube server.

**Value:** `https://sonar.taskai.cc`

Add this to GitHub Secrets as `SONAR_HOST_URL`

### 2. Server Requirements

The production server (`ubuntu@biswas.me`) must have:

- ✅ Docker and Docker Compose installed
- ✅ Git installed
- ✅ SSH access configured for the GitHub Actions runner
- ✅ Project cloned at `~/projects/biswas.me`
- ✅ Backend `.env` file configured at `~/projects/biswas.me/backend/.env`

### 3. Environment Variables

Make sure the following environment variables are configured on the server:

**In `~/projects/biswas.me/backend/.env`:**
```bash
# Email configuration (Brevo)
BREVO_API_KEY=your_brevo_api_key
FROM_EMAIL=anshuman@biswas.me
TO_EMAIL=anshuman@biswas.me

# Database
DB_PATH=./messages.db

# Server
BACKEND_PORT=8080
```

**In `~/projects/biswas.me/docker-compose.yml`:**
Already configured with:
- `NODE_ENV=production`
- `MAIL_PROVIDER=brevo`
- Frontend on port 3000
- Backend on port 8081

## Deployment Process

### What happens during deployment:

1. **Code Pull**: Latest code is pulled from GitHub
   ```bash
   git fetch origin
   git reset --hard origin/master
   ```

2. **Container Stop**: Existing container is gracefully stopped
   ```bash
   docker-compose stop portfolio
   docker-compose rm -f portfolio
   ```

3. **Image Rebuild**: Fresh Docker image is built (no cache to ensure latest code)
   ```bash
   docker-compose build --no-cache portfolio
   ```

4. **Container Start**: New container starts with updated code
   ```bash
   docker-compose up -d portfolio
   ```

5. **Health Check**: Automated verification that the site is responding
   ```bash
   curl -f https://biswas.me
   ```

### Deployment Timeline

- **Build Time**: ~2-3 minutes (Next.js build + Go compilation)
- **Downtime**: ~10-15 seconds (container swap)
- **Total Duration**: ~3-4 minutes from push to live

## Monitoring

### View Deployment Status

1. **GitHub Actions**: https://github.com/anchoo2kewl/biswas.me/actions
2. **SonarQube Dashboard**: https://sonar.taskai.cc/dashboard?id=biswas.me
3. **Server Logs**: `ssh ubuntu@biswas.me "docker logs biswas-me -f"`
4. **Container Status**: `ssh ubuntu@biswas.me "docker ps | grep biswas-me"`

### Troubleshooting

**If deployment fails:**

1. Check the GitHub Actions logs for errors
2. SSH into the server and check Docker logs:
   ```bash
   ssh ubuntu@biswas.me
   cd ~/projects/biswas.me
   docker-compose logs portfolio --tail 50
   ```

3. Verify the container is running:
   ```bash
   docker ps | grep biswas-me
   ```

4. Check if the frontend is accessible:
   ```bash
   curl http://localhost:3000
   ```

5. Check if the backend is accessible:
   ```bash
   curl http://localhost:8080/api/health
   ```

**Manual rollback:**

If you need to rollback to a previous version:

```bash
ssh ubuntu@biswas.me
cd ~/projects/biswas.me

# Reset to a specific commit
git reset --hard <commit-hash>

# Rebuild and restart
docker-compose build --no-cache portfolio
docker-compose up -d portfolio
```

## Security Notes

- ⚠️ **Never commit** SSH private keys to the repository
- ⚠️ **Never commit** `.env` files with sensitive credentials
- ✅ Always use GitHub Secrets for sensitive data
- ✅ The SSH key should be read-only on the production server (no write access needed)
- ✅ Use strong passwords for all services

## CI/CD Workflow File

The deployment workflow is defined in `.github/workflows/deploy.yml`

Key features:
- ✅ Automated deployment on push to `master`
- ✅ Manual deployment trigger available
- ✅ Secure SSH key handling
- ✅ Docker image rebuild with no cache
- ✅ Automated health checks
- ✅ Deployment verification
- ✅ Automatic cleanup of SSH keys

## Local Development

For local development without triggering deployment:

```bash
# Work on a feature branch
git checkout -b feature/my-feature

# Make changes, commit, and push
git add .
git commit -m "Add new feature"
git push origin feature/my-feature

# Create a PR on GitHub - this won't trigger deployment
# Only merging to master triggers automatic deployment
```

## Support

If you encounter issues with deployment:

1. Check the GitHub Actions logs
2. Verify SSH access to the server
3. Check Docker logs on the server
4. Ensure all environment variables are set correctly
5. Verify the Docker Compose configuration

---

**Last Updated**: February 2026
**Maintainer**: Anshuman Biswas
**Production URL**: https://biswas.me
**Repository**: https://github.com/anchoo2kewl/biswas.me
