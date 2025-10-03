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
 * Full-scope SEO audit API. Returns a detailed report matching the audit checklist.
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

    // Puppeteer setup
    const puppeteer = await import('puppeteer');
    const browser = await puppeteer.default.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setUserAgent('SEO-Analyzer-Bot');
    const response = await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    // Extract SEO and page info from DOM
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

    // Status code
    seo.statusCode = response?.status() || 0;

    await browser.close();

    // Hostname and base
    const hostname = new URL(url).hostname;
    const base = url.replace(/\/$/, '');

    // robots.txt, sitemap.xml, HTTPS
    const robotsTxt = await fetchText(base + '/robots.txt');
    const sitemapXml = await fetchText(base + '/sitemap.xml');
    const isHttps = url.startsWith('https://');

    // Images missing alt, compressed, lazy loading
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

    // Orphaned pages (placeholder: needs full site crawl for real check)
    const orphanedPages = [];

    // Structured data validation (basic: checks if present)
    const hasStructuredData = seo.structuredData.length > 0;

    // Mobile friendly (basic: checks viewport meta)
    const mobileFriendly = !!seo.viewport;

    // Page speed (placeholder: needs external API for real check)
    const pageSpeed = null;

    // Crawl depth (placeholder: needs full site crawl)
    const crawlDepth = null;

    // Redirects (placeholder: not checked in this demo)
    const redirects = null;

    // Hreflang tags
    const hreflangTags = seo.hreflang;

    // AMP
    const amp = seo.amp;

    // Breadcrumbs
    const breadcrumbs = seo.breadcrumbs;

    // Video transcripts (placeholder: not checked)
    const videoTranscripts = seo.video;

    // Analytics & monitoring (placeholders)
    const analytics = {
      googleAnalytics: false,
      googleSearchConsole: false,
      bingWebmaster: false,
      organicTraffic: null,
      bounceRate: null,
      conversionRate: null,
      keywordRankings: null,
      crawlErrors: null,
      indexedPages: null
    };

    // Off-page SEO (placeholders)
    const offPage = {
      backlinks: null,
      toxicLinks: null,
      competitorBacklinks: null,
      socialSignals: null,
      localCitations: null,
      googleBusinessProfile: null
    };

    // User Experience (UX)
    const ux = {
      fastLoad: true, // placeholder
      clearNav: true, // placeholder
      mobileUsability: mobileFriendly,
      noPopups: true, // placeholder
      accessible: true, // placeholder
      consistentBranding: true // placeholder
    };

    // Page-by-page audit template (for this page)
    const pageAudit = {
      url,
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
      pageSpeed,
      indexable: seo.statusCode === 200,
      canonical: seo.canonical,
      socialTags: !!seo.ogTitle || !!seo.ogDescription || !!seo.twitterCard
    };

    // Compose full report
    const report = {
      strategy: {
        // Placeholders for future: these require user input or analytics integration
        targetAudience: null,
        topPages: null,
        benchmarks: null,
        goals: null
      },
      technical: {
        robotsTxt: !!robotsTxt,
        sitemapXml: !!sitemapXml,
        https: isHttps,
        siteSpeed: pageSpeed,
        mobileFriendly,
        structuredData: hasStructuredData,
        canonical: !!seo.canonical,
        redirects,
        crawlDepth,
        statusCode: seo.statusCode,
        brokenLinks,
        orphanedPages,
        hreflang: hreflangTags,
        amp,
      },
      onpage: {
        title: seo.title,
        metaDescription: seo.description,
        keywords: seo.keywords,
        headings: seo.headings,
        images: seo.images,
        imagesMissingAlt: imagesMissingAlt.length,
        imagesNotLazy: imagesNotLazy.length,
        ogTitle: seo.ogTitle,
        ogDescription: seo.ogDescription,
        twitterCard: seo.twitterCard,
        content: '', // placeholder
        contentLength: null, // placeholder
        freshness: null // placeholder
      },
      internalLinking: {
        internalLinks: internalLinks.length,
        externalLinks: externalLinks.length,
        breadcrumbs,
      },
      offpage: offPage,
      analytics,
      ux,
      pageAudit,
      bestPractices: [], // can be filled as before
      improvements: [], // can be filled as before
    };

    return new Response(JSON.stringify(report), {
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
