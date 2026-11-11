# Viewfinder Map: publishing on your own domain

This folder is the complete website. It's static files only: no server code and no database.

```
index.html             the app
sw.js                  offline support (service worker)
manifest.webmanifest   makes it installable on phone / desktop
icon-192.png, icon-512.png
```

Publishing on **https** unlocks everything that the local file can't do:
- the 📍 GPS and 🧭 phone-compass buttons
- installing the app and using it offline, including saved imagery
- share links that open for anyone

## Option A: Cloudflare Pages (recommended, free)
1. Go to dash.cloudflare.com → **Workers & Pages** → **Create** → **Pages** → **Upload assets**.
2. Name the project (e.g. `viewfinder`) and drag this whole folder in. Click **Deploy**.
   It goes live at `https://viewfinder.pages.dev`.
3. In the project, go to **Custom domains** → **Set up a domain** → enter e.g. `viewfinder.yourdomain.com`.
   - If your domain's DNS is on Cloudflare, the record is created for you.
   - If not, add the **CNAME** record it shows you (`viewfinder` → `viewfinder.pages.dev`) at your DNS provider.
4. HTTPS is issued automatically within a few minutes.

**To update:** open the project → **Create new deployment** → drag the folder again.

## Option B: Netlify Drop (no account setup)
1. Open app.netlify.com/drop and drag this folder in. You get a `*.netlify.app` URL.
2. Go to **Domain management** → **Add a domain** → follow the CNAME instructions for a subdomain.

## Option C: GitHub Pages
1. Create a public repository and upload these files to it, with `index.html` in the root.
2. Go to **Settings → Pages**: Source = *Deploy from a branch*, branch `main`, folder `/ (root)`.
3. Enter your subdomain under **Custom domain**, then add a CNAME record pointing it to `<your-github-username>.github.io`.
4. Tick **Enforce HTTPS** once it's offered.

## Option D: your existing web hosting
Upload the folder by FTP or cPanel, for example to `yourdomain.com/viewfinder/`. All paths are relative, so it works in any subfolder. Make sure the site is served over **https**.

## After publishing
- **Google Map Tiles key** (optional): in Google Cloud Console, restrict the key to
  *HTTP referrers* `https://viewfinder.yourdomain.com/*`. Then it can't be abused from other sites.
- **Mapbox / MapTiler / Stadia keys:** restrict them to your domain the same way.
- **Your settings, keys, shots and imported files** live in each visitor's own browser. Nothing is uploaded to your server.
- **Updates:** replace `index.html`. If you also change `sw.js`, bump its `VERSION` string.
- **Usage policies:** OpenStreetMap's tile server, Nominatim search and the public Overpass servers are free community services meant for light use.
  - For heavy or commercial use, default to CARTO / Esri basemaps (already the default).
  - Point the Overpass setting at a paid or self-hosted instance.
- **Attribution:** keep the map attributions visible. They're required by the data licences (OSM ODbL, Overture CDLA/ODbL, Esri, EOX CC-BY 4.0, Mapterhorn).
