# Deployment Workflow

## 🚀 Deployment Pipeline

```
main → Staging → UAT → Production
```

### Environments

| Environment | Branch | Server | IP | Domain | Status |
|------------|---------|---------|-----|---------|--------|
| **Staging** | `main` | 129.213.82.37 | Oracle US | staging.biswas.me | ✅ Auto-deploy |
| **UAT** | `uat` | 92.4.83.28 | Oracle Mumbai | uat.biswas.me | ✅ Auto-deploy |
| **Production** | `production` | 31.97.102.48 | - | biswas.me | ✅ Auto-deploy |

## 📝 Workflow Steps

### 1. Development → Staging

**Trigger:** Push to `main` branch

```bash
git checkout main
git add .
git commit -m "feat: new feature"
git push origin main
```

**What happens:**
- ✅ GitHub Actions runs `deploy-staging.yml`
- ✅ Deploys to 129.213.82.37
- ✅ Builds Docker image natively on server
- ✅ Starts container on ports 3000 (frontend) and 8081 (backend)
- ✅ Accessible at https://staging.biswas.me (via Cloudflare)

### 2. Staging → UAT

**Trigger:** Promote to `uat` branch

```bash
# After testing staging, promote to UAT
git checkout uat
git merge main
git push origin uat
```

**What happens:**
- ✅ GitHub Actions runs `deploy-uat.yml`
- ✅ Deploys to 92.4.83.28
- ✅ Builds Docker image natively on ARM64 server
- ✅ Starts container on ports 3000 (frontend) and 8080 (backend)
- ✅ Accessible at https://uat.biswas.me (via Cloudflare)

### 3. UAT → Production

**Trigger:** Promote to `production` branch

```bash
# After UAT testing passes, promote to production
git checkout production
git merge uat
git push origin production
```

**What happens:**
- ✅ GitHub Actions runs `deploy.yml`
- ✅ Deploys to 31.97.102.48
- ✅ Uses pre-built Mac-clean image
- ✅ Starts container on ports 3000 (frontend) and 8081 (backend)
- ✅ Accessible at https://biswas.me

## 🔐 Required GitHub Secrets

### For All Environments
- `BREVO_API_KEY` - Email service API key
- `RECAPTCHA_SECRET_KEY` - reCAPTCHA secret
- `BLOG_API_TOKEN` - Blog API authentication token

### Per Environment
- `STAGING_SSH_PRIVATE_KEY` - SSH key for staging server (129.213.82.37)
- `UAT_SSH_PRIVATE_KEY` - SSH key for UAT server (92.4.83.28)
- `SSH_PRIVATE_KEY` - SSH key for production server (31.97.102.48)

## 🧪 Testing Before Promotion

### Test Staging
```bash
# Direct IP test
curl -I http://129.213.82.37:3000

# Via Cloudflare
curl -I https://staging.biswas.me
```

### Test UAT
```bash
# Direct IP test
curl -I http://92.4.83.28:3000

# Via Cloudflare
curl -I https://uat.biswas.me
```

### Test Production
```bash
# Direct IP test
curl -I http://31.97.102.48:3000

# Live site
curl -I https://biswas.me
```

## 🔄 Rollback Procedures

### Rollback Staging
```bash
git checkout main
git revert <bad-commit-sha>
git push origin main
# Auto-deploys reverted code
```

### Rollback UAT
```bash
git checkout uat
git reset --hard <good-commit-sha>
git push --force origin uat
# Auto-deploys previous version
```

### Rollback Production
```bash
git checkout production
git reset --hard <good-commit-sha>
git push --force origin production
# Auto-deploys previous version
```

## 📊 Deployment Workflow Diagram

```
┌─────────────┐
│ Development │
│   (main)    │
└──────┬──────┘
       │ git push origin main
       ▼
┌─────────────────────────────┐
│ GitHub Actions              │
│ deploy-staging.yml          │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ Staging: 129.213.82.37      │
│ staging.biswas.me           │
│ ✅ Test features here       │
└──────┬──────────────────────┘
       │ git merge main into uat
       ▼
┌─────────────────────────────┐
│ GitHub Actions              │
│ deploy-uat.yml              │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ UAT: 92.4.83.28             │
│ uat.biswas.me               │
│ ✅ Final validation         │
└──────┬──────────────────────┘
       │ git merge uat into production
       ▼
┌─────────────────────────────┐
│ GitHub Actions              │
│ deploy.yml                  │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ Production: 31.97.102.48    │
│ biswas.me                   │
│ 🚀 Live to users            │
└─────────────────────────────┘
```

## ⚙️ Configuration Per Environment

### Staging (129.213.82.37)
- **Frontend Port:** 3000
- **Backend Port:** 8081
- **Container Name:** biswas-me-staging
- **Deploy Directory:** ~/biswas-me-staging
- **Cloudflare:** Yes (SSL + Zero Trust)

### UAT (92.4.83.28)
- **Frontend Port:** 3000
- **Backend Port:** 8080
- **Container Name:** biswas-me-uat
- **Deploy Directory:** ~/biswas-me-uat
- **Cloudflare:** Yes (SSL + Zero Trust)

### Production (31.97.102.48)
- **Frontend Port:** 3000
- **Backend Port:** 8081
- **Container Name:** biswas-me
- **Deploy Directory:** ~/projects/biswas.me
- **Cloudflare:** Public access

## 🏗️ Infrastructure

All servers managed via Infrastructure as Code:
- **Repository:** https://github.com/anchoo2kewl/biswas-infrastructure
- **Terraform:** For provisioning Oracle Cloud VMs
- **Ansible:** For server configuration (Nginx, Docker, security)

## 📞 Support

If deployment fails:
1. Check GitHub Actions logs
2. Verify server is accessible: `ssh ubuntu@<IP>`
3. Check container logs: `docker logs biswas-me-{env}`
4. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
5. Verify Cloudflare settings for domain
