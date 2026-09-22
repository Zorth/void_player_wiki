# Void Wiki - Self-Hosted Wiki.js Setup Guide

This guide walks you through deploying **Wiki.js** on your home server using **Docker Compose**, authenticating users with your production **Clerk instance** (`clerk.tarragon.be`), and maintaining **two-way Git sync** with your GitHub repository and local Obsidian vault.

---

## Architecture Overview

```
[Browser / Mobile (wiki.tarragon.be)]
               │ (HTTPS)
               ▼
[Nginx Reverse Proxy (Port 443)]
               │ (Proxy to 127.0.0.1:3002)
               ▼
[Wiki.js Container (Node.js)] ◄─── OIDC Auth ───► [Clerk (clerk.tarragon.be)]
               │
               ├─► [PostgreSQL Container (Content, Revisions, Full-Text Search)]
               │
               └─► [Bidirectional Git Sync] ◄───► [GitHub (void_player_wiki)]
                                                         │
                                                         ▼
                                            [GM Local Obsidian Vault]
```

---

## 1. Quickstart: Running on Your Home Server

### Step 1.1: Clone & Configure
On your home server:

```bash
# Clone the repository or checkout the docker-wiki branch
git clone -b docker-wiki https://github.com/Zorth/void_player_wiki.git ~/void-wiki
cd ~/void-wiki

# Copy environment template
cp .env.example .env
```

### Step 1.2: Edit `.env`
Open `.env` and set a secure database password:

```bash
DB_USER=wikijs
DB_PASS=YourSecurePasswordHere123!
DB_NAME=wiki
WIKI_PORT=3002
WIKI_BIND_IP=127.0.0.1
WIKI_URL=https://wiki.tarragon.be
```

### Step 1.3: Start the Containers

```bash
docker compose up -d
```

Check that both containers are running and healthy:

```bash
docker compose ps
```

You should see:
- `void-wiki-db`: `Up (healthy)`
- `void-wiki`: `Up`

---

## 2. Nginx Reverse Proxy Configuration

Copy the provided Nginx configuration to your server's Nginx configuration directory:

```bash
sudo cp ~/void-wiki/nginx/wiki.tarragon.be.conf /etc/nginx/sites-available/wiki.tarragon.be.conf
sudo ln -s /etc/nginx/sites-available/wiki.tarragon.be.conf /etc/nginx/sites-enabled/
```

### Obtain SSL Certificate (Let's Encrypt / Certbot)

```bash
sudo certbot --nginx -d wiki.tarragon.be
```

Test and reload Nginx:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

Now open `https://wiki.tarragon.be` in your browser.

---

## 3. Initial Setup Wizard

1. On your first visit to `https://wiki.tarragon.be`, you will see the **Wiki.js Initial Setup** screen.
2. Enter:
   - **Administrator Email**: your email
   - **Administrator Password**: a secure master password
   - **Site URL**: `https://wiki.tarragon.be`
3. Click **Install**. Within a few seconds, you will be taken to the login screen.

---

## 4. Clerk Authentication Setup (Production: `clerk.tarragon.be`)

To let players log in using their Void Guild accounts:

### Step 4.1: Register OAuth Application in Clerk
1. Go to your **Clerk Dashboard** (for `clerk.tarragon.be`).
2. Navigate to **Configure** -> **OAuth Applications** (or **SSO / Integrations**).
3. Click **Add OAuth Application**:
   - **Name**: `Void Player Wiki`
   - **Redirect URI / Callback URL**: `https://wiki.tarragon.be/login/callback`
   - **Scopes**: `openid`, `profile`, `email`
4. Copy the generated **Client ID** and **Client Secret**.

### Step 4.2: Enable Generic OIDC in Wiki.js
1. Log into Wiki.js as Administrator (`https://wiki.tarragon.be`).
2. Open the **Administration Area** (gear icon in the sidebar).
3. In the left menu, click **Authentication** -> **Add Strategy**.
4. Select **Generic OIDC (OpenID Connect)**.
5. Fill in the fields:
   - **Client ID**: `<Your Clerk Client ID>`
   - **Client Secret**: `<Your Clerk Client Secret>`
   - **Discovery / Issuer URL**: `https://clerk.tarragon.be`
   - **Authorization URL**: `https://clerk.tarragon.be/oauth/authorize`
   - **Token URL**: `https://clerk.tarragon.be/oauth/token`
   - **User Info URL**: `https://clerk.tarragon.be/oauth/userinfo`
   - **Display Name**: `Guild of The Void`
   - **Allow Self-Registration**: Toggle **ON** (so existing guild members are automatically assigned the default `Users` group on first login).
   - **Assign to Group**: `Users` (or default group with Edit permissions).
6. Click **Save** in the top right.

Players will now see a **"Log in with Guild of The Void"** button on the login screen.

---

## 5. Connecting Git Storage (Two-Way Sync with Obsidian)

Wiki.js has built-in **Bidirectional Git Sync**, meaning every edit made on the web is automatically committed to your GitHub repo, and notes pushed from Obsidian are automatically pulled into Wiki.js.

### Step 5.1: Configure Git Storage in Wiki.js
1. In the Wiki.js Administration Area, click **Storage**.
2. Click **Git** from the list of storage targets.
3. Configure the settings:
   - **Repository URL**: `https://github.com/Zorth/void_player_wiki.git` (or your preferred repo/fork)
   - **Branch**: `v4` (or create a dedicated content branch)
   - **Authentication**:
     - **Username**: `Zorth` (or a bot account)
     - **Personal Access Token**: GitHub token with `repo` read/write permissions
   - **Sync Direction**:
     - Select **Bidirectional (Storage <-> Database)**:
       - Edits on the web are pushed to GitHub.
       - Edits pushed to GitHub (from Obsidian) are pulled into Wiki.js.
   - **Sync Schedule**: Every 5 minutes (or trigger manually).
4. Click **Apply**.
5. Click **Import Everything from Git** to pull all 212 existing articles into Wiki.js.

---

## 6. Tags, Worlds, and Fuzzy Search

### Tags Over Folders
- In Wiki.js, pages can be given tags directly in the editor sidebar (e.g. `session`, `pc`, `kalogeron`, `the-void`).
- Existing `#tags` and frontmatter `tags: [...]` in your markdown files are indexed.
- Clicking any tag provides an instant filtered list of all matching articles across all categories.

### Fuzzy Search Engine
- In Wiki.js Admin -> **Search Engines**, ensure **PostgreSQL Full-Text Search** is active.
- PostgreSQL full-text search supports partial and fuzzy keyword matching across titles, bodies, and tags with zero external overhead.

---

## 7. Backups & Maintenance

All persistent data is contained in two Docker volumes:
- `void-wiki-data`: Wiki.js configuration, avatars, and Git local cache.
- `void-wiki-pg-data`: PostgreSQL database (articles, users, revisions).

To create a fast backup of the database:

```bash
docker exec -t void-wiki-db pg_dumpall -c -U wikijs > ~/backup_wiki_$(date +%Y%m%d).sql
```
