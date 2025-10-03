export const runtime = "nodejs";
import { NextResponse } from 'next/server';


// Helper to extract meta tag content
function getMeta(html, name) {
  const regex = new RegExp(`<meta[^>]*name=["']${name}["'][^>]*content=["']([^"']*)["'][^>]*>`, 'i');
  return html.match(regex)?.[1] || '';
}
// Helper to extract link rel
function getLinkRel(html, rel) {
  const regex = new RegExp(`<link[^>]*rel=["']${rel}["'][^>]*href=["']([^"']*)["'][^>]*>`, 'i');
  return html.match(regex)?.[1] || '';
}
// Helper to extract robots.txt and sitemap.xml
async function fetchText(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return '';
    return await res.text();
  } catch {
    return '';
  }
}



/**
 * POST /api/seo
 * Crawl up to 500 internal pages (using sitemap.xml if available, otherwise recursively) and return an array of page-by-page SEO reports.
 */
export async function POST(request) {
  try {
    const { url } = await request.json();
    if (!url) {
      return NextResponse.json({ error: 'No URL provided.' }, { status: 400 });
    }
    if (!/^https?:\/\//i.test(url)) {
      return NextResponse.json({ error: 'Invalid URL format.' }, { status: 400 });
    }

    const MAX_PAGES = 500;
    const visited = new Set();
    const toVisit = [];
    let discoveredUrls = [];

    // Helper: parse sitemap.xml for URLs
    async function parseSitemap(sitemapXml) {
      const urls = [];
      try {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(sitemapXml, 'text/xml');
        const locs = xmlDoc.getElementsByTagName('loc');
        for (let i = 0; i < locs.length && urls.length < MAX_PAGES; i++) {
          urls.push(locs[i].textContent.trim());
        }
      } catch {}
      return urls;
    }

    // Helper: fetch and parse sitemap.xml
    async function getSitemapUrls(base) {
      try {
        const res = await fetch(base + '/sitemap.xml');
        if (!res.ok) return [];
        const xml = await res.text();
        // Use regex as fallback if DOMParser is not available
        const urls = Array.from(xml.matchAll(/<loc>(.*?)<\/loc>/g)).map(m => m[1]);
        return urls.slice(0, MAX_PAGES);
      } catch {
        return [];
      }
    }

    // Helper: recursively crawl internal links
    async function crawlInternalLinks(startUrl, hostname) {
      const queue = [startUrl];
      const found = new Set();
      while (queue.length > 0 && found.size < MAX_PAGES) {
        const current = queue.shift();
        if (found.has(current)) continue;
        found.add(current);
        try {
          const res = await fetch(current);
          if (!res.ok) continue;
          const html = await res.text();
          // Find all internal links
          const links = Array.from(html.matchAll(/href=["']([^"'#?]+)["']/g)).map(m => m[1]);
          for (let link of links) {
            if (link.startsWith('http')) {
              if (link.includes(hostname) && !found.has(link) && found.size < MAX_PAGES) {
                queue.push(link);
              }
            } else if (link.startsWith('/')) {
              const abs = new URL(link, startUrl).href;
              if (!found.has(abs) && found.size < MAX_PAGES) {
                queue.push(abs);
              }
            }
          }
        } catch {}
      }
      return Array.from(found);
    }

    // Discover URLs to analyze
    const base = url.replace(/\/$/, '');
    let urls = await getSitemapUrls(base);
    if (urls.length === 0) {
      // Fallback: crawl internal links
      const hostname = new URL(url).hostname;
      urls = await crawlInternalLinks(url, hostname);
    }
    if (!urls.includes(url)) urls.unshift(url); // Ensure homepage is included
    discoveredUrls = urls.slice(0, MAX_PAGES);

    // Puppeteer setup
    const puppeteer = await import('puppeteer');
    const browser = await puppeteer.default.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });

    // Analyze each page
    const pageReports = [];
    for (let pageUrl of discoveredUrls) {
      try {
        const page = await browser.newPage();
        await page.setUserAgent('SEO-Analyzer-Bot');
        const response = await page.goto(pageUrl, { waitUntil: 'networkidle2', timeout: 30000 });
        const seo = await page.evaluate(() => {
          const getMeta = (name) => {
            const el = document.querySelector(`meta[name='${name}']`);
            return el ? el.content : '';
          };
          const getMetaProp = (prop) => {
            const el = document.querySelector(`meta[property='${prop}']`);
            return el ? el.content : '';
          };
          const getLinkRel = (rel) => {
            const el = document.querySelector(`link[rel='${rel}']`);
            return el ? el.href : '';
          };
          const getHreflang = () => {
            return Array.from(document.querySelectorAll('link[rel="alternate"][hreflang]')).map(l => l.getAttribute('hreflang'));
          };
          const getStructuredData = () => {
            return Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map(s => s.innerText);
          };
          return {
            title: document.title || '',
            description: getMeta('description'),
            keywords: getMeta('keywords'),
            viewport: getMeta('viewport'),
            canonical: getLinkRel('canonical'),
            ogTitle: getMetaProp('og:title'),
            ogDescription: getMetaProp('og:description'),
            twitterCard: getMeta('twitter:card'),
            headings: {
              h1: Array.from(document.querySelectorAll('h1')).map(h => h.textContent.trim()),
              h2: Array.from(document.querySelectorAll('h2')).map(h => h.textContent.trim()),
            },
            images: Array.from(document.querySelectorAll('img')).map(img => ({ src: img.src, alt: img.alt, loading: img.loading || '' })),
            links: Array.from(document.querySelectorAll('a')).map(a => a.href),
            hreflang: getHreflang(),
            structuredData: getStructuredData(),
            amp: !!document.querySelector('link[rel="amphtml"]'),
            breadcrumbs: !!document.querySelector('nav.breadcrumb, .breadcrumb'),
            video: !!document.querySelector('video'),
            statusCode: 200 // will be overwritten below
          };
        });
        seo.statusCode = response?.status() || 0;
        await page.close();

        // Hostname
        const hostname = new URL(pageUrl).hostname;
        // Images missing alt, lazy loading
        const imagesMissingAlt = seo.images.filter(img => !img.alt);
        const imagesNotLazy = seo.images.filter(img => img.loading !== 'lazy');
        // Internal/external links
        const internalLinks = seo.links.filter(l => l.startsWith('/') || l.includes(hostname));
        const externalLinks = seo.links.filter(l => /^https?:\/\//i.test(l) && !l.includes(hostname));
        // Broken links: links that return 404 (check up to 10 for performance)
        let brokenLinks = 0;
        const checkLinks = seo.links.slice(0, 10);
        for (const link of checkLinks) {
          try {
            const res = await fetch(link, { method: 'HEAD', redirect: 'manual' });
            if (res.status === 404) brokenLinks++;
          } catch {}
        }
        // Structured data validation (basic: checks if present)
        const hasStructuredData = seo.structuredData.length > 0;
        // Mobile friendly (basic: checks viewport meta)
        const mobileFriendly = !!seo.viewport;
        // Page-by-page audit template
        const pageAudit = {
          url: pageUrl,
          title: seo.title,
          metaDescription: seo.description,
          h1: seo.headings.h1[0] || '',
          content: '', // placeholder
          internalLinks: internalLinks.length,
          externalLinks: externalLinks.length,
          images: seo.images.length,
          imagesWithAlt: seo.images.length - imagesMissingAlt.length,
          structuredData: hasStructuredData,
          mobileFriendly,
          pageSpeed: null,
          indexable: seo.statusCode === 200,
          canonical: seo.canonical,
          socialTags: !!seo.ogTitle || !!seo.ogDescription || !!seo.twitterCard
        };
        // Compose per-page report
        pageReports.push({
          url: pageUrl,
          statusCode: seo.statusCode,
          title: seo.title,
          metaDescription: seo.description,
          h1: seo.headings.h1[0] || '',
          internalLinks: internalLinks.length,
          externalLinks: externalLinks.length,
          images: seo.images.length,
          imagesMissingAlt: imagesMissingAlt.length,
          imagesNotLazy: imagesNotLazy.length,
          ogTitle: seo.ogTitle,
          ogDescription: seo.ogDescription,
          twitterCard: seo.twitterCard,
          structuredData: hasStructuredData,
          mobileFriendly,
          amp: seo.amp,
          breadcrumbs: seo.breadcrumbs,
          indexable: seo.statusCode === 200,
          canonical: seo.canonical,
          socialTags: !!seo.ogTitle || !!seo.ogDescription || !!seo.twitterCard,
          brokenLinks,
          pageAudit
        });
      } catch (err) {
        // Skip failed pages
      }
    }

    await browser.close();

    return new Response(JSON.stringify({
      totalPages: pageReports.length,
      pages: pageReports
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
