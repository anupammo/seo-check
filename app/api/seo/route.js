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

export async function POST(request) {
  try {
    const { url } = await request.json();
    if (!url) {
      return NextResponse.json({ error: 'No URL provided.' }, { status: 400 });
    }
    if (!/^https?:\/\//i.test(url)) {
      return NextResponse.json({ error: 'Invalid URL format.' }, { status: 400 });
    }

    // Use Puppeteer to render the page and extract SEO info
    const puppeteer = await import('puppeteer');
    const browser = await puppeteer.default.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setUserAgent('SEO-Analyzer-Bot');
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    // Extract SEO data from the rendered DOM
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
        images: Array.from(document.querySelectorAll('img')).map(img => ({ src: img.src, alt: img.alt })),
        links: Array.from(document.querySelectorAll('a')).map(a => a.href),
      };
    });

    await browser.close();

    // Images missing alt
    const imagesMissingAlt = seo.images.filter(img => !img.alt);
    // Internal/external links
    const hostname = new URL(url).hostname;
    const internalLinks = seo.links.filter(l => l.startsWith('/') || l.includes(hostname));
    const externalLinks = seo.links.filter(l => /^https?:\/\//i.test(l) && !l.includes(hostname));

    // robots.txt and sitemap.xml
    const base = url.replace(/\/$/, '');
    const robotsTxt = await fetchText(base + '/robots.txt');
    const sitemapXml = await fetchText(base + '/sitemap.xml');

    // Best practices & improvements
    const bestPractices = [];
    const improvements = [];
    if (!seo.title) improvements.push('Missing <title> tag.');
    if (seo.title && seo.title.length > 60) improvements.push('Title is too long (max 60 chars).');
    if (!seo.description) improvements.push('Missing meta description.');
    if (seo.description && seo.description.length > 160) improvements.push('Meta description is too long (max 160 chars).');
    if (seo.headings.h1.length === 0) improvements.push('No <h1> tags found.');
    if (seo.headings.h1.length > 1) improvements.push('Multiple <h1> tags found. Use only one for best SEO.');
    if (imagesMissingAlt.length > 0) improvements.push(`${imagesMissingAlt.length} image(s) missing alt attribute.`);
    if (!seo.canonical) improvements.push('Missing canonical link tag.');
    if (!robotsTxt) improvements.push('robots.txt not found.');
    if (!sitemapXml) improvements.push('sitemap.xml not found.');
    if (!seo.viewport) improvements.push('Missing viewport meta tag (important for mobile SEO).');

    if (seo.title && seo.title.length <= 60) bestPractices.push('Title tag present and optimal length.');
    if (seo.description && seo.description.length <= 160) bestPractices.push('Meta description present and optimal length.');
    if (seo.headings.h1.length === 1) bestPractices.push('Single <h1> tag present.');
    if (seo.images.length > 0 && imagesMissingAlt.length === 0) bestPractices.push('All images have alt attributes.');
    if (seo.canonical) bestPractices.push('Canonical link tag present.');
    if (robotsTxt) bestPractices.push('robots.txt found.');
    if (sitemapXml) bestPractices.push('sitemap.xml found.');
    if (seo.viewport) bestPractices.push('Viewport meta tag present.');

    // Report
    const report = {
      title: seo.title,
      description: seo.description,
      keywords: seo.keywords,
      viewport: seo.viewport,
      canonical: seo.canonical,
      ogTitle: seo.ogTitle,
      ogDescription: seo.ogDescription,
      twitterCard: seo.twitterCard,
      // This file is intentionally left blank to resolve route conflicts. Safe to delete.
      links: { total: seo.links.length, internal: internalLinks.length, external: externalLinks.length },
      bestPractices,
      improvements,
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
