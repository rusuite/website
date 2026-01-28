# RuSuite – RuneScape Private Server Listing Platform

## Project overview

Build a fully functional web application inspired by the structure and features of **RuneTopic** (https://www.runetopic.com), but **without copying any logos, or branding** from that site.

The goal is to create a modern RuneScape private server listing and discovery platform with:

- Server listings
- Ranking and voting
- Categories and filters
- Search
- User accounts
- Admin panel
- SEO-friendly public pages

All names, and branding must be **original** and use the project name **RuSuite**.

---

## Tech stack

**Preferred stack (can be adjusted, but keep it consistent):**

- **Frontend:**  
  - React (Next.js preferred for SEO and routing)  
  - TypeScript  
  - Tailwind CSS or another utility-first CSS framework

- **Backend:**  
  - Node.js with Express or NestJS  
  - TypeScript  
  - RESTful API (or GraphQL if justified)

- **Database:**  
  - PostgreSQL (preferred) or MySQL  
  - Use an ORM like Prisma or TypeORM

- **Auth & security:**  
  - JWT-based authentication (access + refresh tokens)  
  - Password hashing (e.g., bcrypt)  
  - Role-based access control (user, moderator, admin)

- **Infrastructure (initial dev assumptions):**
  - Single repo (monorepo optional)  
  - Docker support for local development  
  - Environment-based config (`.env`)

---

## Core features

### 1. Public server listing

Build a public-facing server list similar in *function* to RuneTopic:

- **Server list page**
  - Paginated list of servers
  - Each server shows:
    - Name
    - Short description
    - Game type (e.g., OSRS, RS3, custom)
    - Online/offline status (mocked at first)
    - Player count (mocked at first)
    - Vote count
    - Tags (e.g., PvP, Eco, Spawn, Ironman-friendly)
  - Sorting options:
    - By votes (default)
    - By newest
    - By player count

- **Filters & search**
  - Filter by:
    - Game type
    - Tags
  - Search by:
    - Server name
    - Keywords in description

- **Server detail page**
  - Full description
  - Custom banner image (URL)
  - Website link
  - Discord link
  - Client download link (optional field)
  - Region (e.g., NA, EU)
  - Uptime (mocked or calculated later)
  - SEO-friendly URL slugs

### 2. Voting system

Implement a voting system similar in concept to top lists:

- **Vote model**
  - Users can vote for a server once per defined period (e.g., every 12 or 24 hours)
  - Track:
    - User ID (if logged in)
    - IP address (basic anti-abuse)
    - Timestamp

- **Vote flow**
  - Public users can vote (with or without account—design a secure but simple approach)
  - Increment server’s vote count
  - Show confirmation and updated count

- **Anti-abuse basics**
  - Rate limiting by IP + time window
  - Optional: reCAPTCHA or similar (stub integration)

### 3. User accounts & server ownership

- **User registration & login**
  - Email + password
  - Email verification (stub or basic implementation)
  - Password reset flow (token-based)

- **User dashboard**
  - Add new server
  - Edit owned servers
  - View server stats:
    - Votes over time (basic chart)
    - Clicks on website/Discord links (tracked as counters)

- **Server ownership**
  - Each server is owned by a user
  - Only the owner (or admin) can edit/delete

### 4. Admin panel

Create an admin interface (can be a protected route in the same frontend):

- **Admin capabilities**
  - View all servers
  - Approve/reject servers (optional moderation queue)
  - Edit or remove any server
  - View user list
  - Ban users
  - View basic analytics:
    - Total servers
    - Total users
    - Total votes (per day/week)

### 5. SEO & public pages

- **SEO-friendly pages**
  - Server detail pages with meta tags
  - Static pages:
    - Home
    - About
    - Terms of Service
    - Privacy Policy
  - Clean URLs and proper `<title>` and `<meta>` tags

- **Homepage**
  - Hero section explaining the platform
  - Top voted servers
  - Recently added servers
  - Call-to-action to add a server

---

## Architecture

### High-level architecture

- **Frontend**
  - Next.js app in `/frontend`
  - Pages:
    - `/` – homepage
    - `/servers` – server list
    - `/servers/[slug]` – server detail
    - `/login`, `/register`
    - `/dashboard` – user dashboard
    - `/admin` – admin panel

- **Backend**
  - Node.js API in `/backend`
  - Modules:
    - `auth` – login, register, tokens
    - `users` – user management
    - `servers` – CRUD for servers
    - `votes` – voting logic
    - `admin` – admin-only endpoints

- **Database schema (example)**

  - `users`
    - `id`
    - `email`
    - `password_hash`
    - `role` (`user`, `admin`)
    - `created_at`

  - `servers`
    - `id`
    - `owner_id` (FK → users.id)
    - `name`
    - `slug`
    - `short_description`
    - `long_description`
    - `game_type`
    - `tags` (JSON or join table)
    - `website_url`
    - `discord_url`
    - `client_download_url`
    - `region`
    - `banner_image_url`
    - `status` (`pending`, `approved`, `rejected`)
    - `created_at`

  - `votes`
    - `id`
    - `server_id` (FK → servers.id)
    - `user_id` (nullable, FK → users.id)
    - `ip_address`
    - `created_at`

  - `click_stats`
    - `id`
    - `server_id`
    - `type` (`website`, `discord`, `client`)
    - `count`
    - `last_updated`

---

## Non-functional requirements

- **Code quality**
  - Use TypeScript end-to-end
  - ESLint + Prettier configuration
  - Clear folder structure and modular design

- **Security**
  - Never store plain-text passwords
  - Validate and sanitize all inputs
  - Protect admin routes with role checks

- **Performance**
  - Server list should be paginated
  - Use indexes on frequently queried fields (e.g., `servers.slug`, `votes.server_id`)

---

## Legal & IP constraints

- Do **not**:
  - Use the RuneTopic name, logo, or branding

- Do:
  - Create original copy, design, and branding under the project name **RuSuite**
  - Copy any HTML, CSS, JS, or backend code from RuneTopic
  - Copy any text, descriptions, or UI wording from RuneTopic

---

## Getting started (dev environment)

- **Backend**
  1. `cd backend`
  2. `npm install`
  3. Create `.env` with DB connection and JWT secrets
  4. Run migrations
  5. `npm run dev`

- **Frontend**
  1. `cd frontend`
  2. `npm install`
  3. Create `.env.local` with API base URL
  4. `npm run dev`

---

## Future enhancements

- Server uptime monitoring integration
- Advanced analytics dashboards
- Premium listing options
- API for external tools to fetch server data

