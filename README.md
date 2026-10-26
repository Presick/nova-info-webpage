# Missed-Call Guides (Astro site)

Static site for the AI Receptionist project. In the working project, pages come from `../pages` (Markdown with front matter) and Census data from `../data`, and `npm run build` first copies both into `./content` (`scripts/sync-content.mjs`). When this folder is deployed on its own, the copy in `./content` is used, so the repository is self-contained. Edit pages in `./content/pages` if you work from this repository alone.

## Commands

```
npm install
npm run dev        # local preview
npm run build      # writes ./dist
```

Set the production address before a deploy build, or the sitemap and canonical links point to example.com:

```
$env:SITE_URL = "https://your-domain.com"; npm run build     # PowerShell
```

## Adding a page

1. Write and gate the Markdown file in `../pages` (front matter fields: title, description, slug, status, last_updated, owner_disclosure; optional trade, state, type, data_pulled).
2. For a trade page, set `trade` to a key in `src/lib/cbp.ts` (`tradeNaics`) to get the at-a-glance stats and county chart.
3. Add the page to the nav arrays in `src/layouts/Base.astro` if it should be linked sitewide.
4. Run `npm run build` and check the output.

## Deploy to Vercel (Pro plan)

1. This folder is the repository root (the `.gitignore` excludes `.env`, `node_modules` and `dist`).
2. In Vercel, import the repository. The Root Directory is the repository root.
3. Framework preset: Astro. Build command `npm run build`, output directory `dist`.
4. Add the environment variable `SITE_URL` with the production address, then attach the custom domain.
5. After deploy: add the site to Google Search Console and Bing Webmaster Tools, submit `/sitemap-index.xml`, and send IndexNow pings for new URLs.

## Not built yet

IndexNow key file, analytics, per-page social images, the other Kentucky trades, and other states.
