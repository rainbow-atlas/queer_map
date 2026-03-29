# Custom domain: queermap.at and admin.queermap.at

This guide connects your **World4You** domain to **GitHub Pages** so that:

- **https://queermap.at** — public map (`rainbow-atlas/queer_map`)
- **https://admin.queermap.at** — admin app (`rainbow-atlas/map_manager`)

GitHub hosts each repo as its own site. You point **different hostnames** (apex vs `admin`) at the same GitHub host (`rainbow-atlas.github.io`); GitHub uses each repo’s **Custom domain** setting to know which site to show.

DNS changes can take a few minutes up to 24–48 hours.

---

## 1. Prepare GitHub (organization)

1. Open **https://github.com/organizations/rainbow-atlas/settings/domains** (or: org **Settings** → **Verified domains**).
2. **Verify** `queermap.at` if GitHub asks you to (TXT record at World4You). This protects your domain and is required for smooth HTTPS on subdomains.

---

## 2. Map site — `queermap.at` (repo `queer_map`)

1. Open **https://github.com/rainbow-atlas/queer_map/settings/pages**.
2. Under **Custom domain**, enter: `queermap.at`  
3. Click **Save**.  
4. After DNS works (step 4), come back and enable **Enforce HTTPS** when GitHub allows it.

**Build path:** The map must be built with asset **`base: '/'`** when served at **https://queermap.at/** (not under `/queer_map/`). This repo’s GitHub Actions workflow sets `VITE_BASE_PATH=/` on build so deployed Pages match the custom domain. Local `npm run build` still defaults to `/queer_map/` unless you set `VITE_BASE_PATH=/`. After that, **https://rainbow-atlas.github.io/queer_map/** no longer matches the built asset paths; use **https://queermap.at** (or remove `VITE_BASE_PATH` from the workflow if you must keep the github.io URL as primary).

Optional: also add **`www.queermap.at`** in the same **Custom domain** field if you want `www` to work; GitHub will explain redirects between apex and `www`.

---

## 3. Admin site — `admin.queermap.at` (repo `map_manager`)

1. Open **https://github.com/rainbow-atlas/map_manager/settings/pages**.
2. Under **Custom domain**, enter: `admin.queermap.at`
3. Click **Save**.
4. If that app also uses a `/map_manager/` base path for GitHub Pages, set its Vite (or equivalent) **`base: '/'`** for the admin subdomain, then redeploy.
5. Later, enable **Enforce HTTPS** here too.

---

## 4. DNS at World4You

Log in at World4You → your domain **queermap.at** → **DNS** / **Nameserver & DNS** (wording may vary). Edit the zone for `queermap.at`.

### Apex — `queermap.at`

Add **four A records** for the root (`@` or blank hostname — follow World4You’s labels):

| Type | Host / Name | Value |
|------|-------------|--------|
| A | `@` (or root) | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |

(Optional IPv6: **AAAA** for `@` — see [GitHub Pages DNS](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).)

Remove any old **A** records for `@` that pointed to parking or old hosting.

### `www` (optional)

If you use **www.queermap.at**:

| Type | Host / Name | Value |
|------|-------------|--------|
| CNAME | `www` | `rainbow-atlas.github.io` |

### Admin subdomain

| Type | Host / Name | Value |
|------|-------------|--------|
| CNAME | `admin` | `rainbow-atlas.github.io` |

**Note:** The CNAME **target** is always **`rainbow-atlas.github.io`** — no `/queer_map` or `/map_manager` in DNS. GitHub routes by hostname using each repo’s custom domain.

---

## 5. Check that it worked

- In a terminal: `dig queermap.at +short` — should list GitHub’s `185.199.108.x` addresses.  
- `dig admin.queermap.at +short` — should eventually show GitHub-related targets (often via `github.io`).
- Open **https://queermap.at** and **https://admin.queermap.at** in the browser after HTTPS is available.

Official reference: [Managing a custom domain for your GitHub Pages site](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

---

## Summary

| Hostname | GitHub repo | DNS |
|----------|-------------|-----|
| `queermap.at` | `queer_map` → Pages custom domain | Four **A** records on `@` |
| `admin.queermap.at` | `map_manager` → Pages custom domain | **CNAME** `admin` → `rainbow-atlas.github.io` |

Verify the domain on the GitHub org, set **`base: '/'`** for both apps when served on these hostnames, redeploy, then turn on **Enforce HTTPS** in each repo’s Pages settings.
