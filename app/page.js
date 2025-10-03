"use client";
import React, { useState } from "react";
import Head from "next/head";
import { useSeoReport } from "../hooks/useSeoReport";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Home() {
  const [url, setUrl] = useState("");
  const [activeSection, setActiveSection] = useState("dashboard");
  const [activeTab, setActiveTab] = useState("technical");
  const { report, loading: reportLoading, error: reportError, analyze } = useSeoReport();

  const sidebarMenu = [
    { icon: "fa-tachometer-alt", label: "Dashboard", key: "dashboard" },
    { icon: "fa-search", label: "Keyword Research", key: "keyword" },
    { icon: "fa-file-alt", label: "Content Analysis", key: "content" },
    { icon: "fa-chart-line", label: "Performance", key: "performance" },
    { icon: "fa-external-link-alt", label: "Backlinks", key: "backlinks" },
    { icon: "fa-cog", label: "Settings", key: "settings" },
  ];

  return (
    <>
      <Head>
        <title>SEO Analysis Dashboard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      {/* Header */}
      <header className="dashboard-header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h1 className="h2 mb-2">SEO Analysis Dashboard</h1>
              <p className="mb-0">Monitor and improve your website's search engine performance</p>
            </div>
            <div className="col-md-6">
              <form className="d-flex" onSubmit={async (e) => {
                e.preventDefault();
                if (!url) return;
                analyze(url);
              }}>
                <input
                  type="url"
                  className="form-control w-75 me-2"
                  placeholder="Enter website URL (e.g. https://example.com)"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  required
                  style={{ borderRadius: 50, paddingLeft: 20, height: 45 }}
                  disabled={reportLoading}
                />
                <button className="btn btn-light rounded-pill px-4" type="submit" disabled={reportLoading}>
                  {reportLoading ? <span className="spinner-border spinner-border-sm"></span> : <><i className="fas fa-search me-2"></i>Analyze</>}
                </button>
              </form>
              {reportError && <div className="alert alert-danger mt-2">{reportError}</div>}
            </div>
          </div>
        </div>
      </header>
      <div className="container">
        <div className="row">
          {/* Sidebar Navigation */}
          <div className="col-lg-3">
            <div className="sidebar">
              <ul className="sidebar-menu">
                {sidebarMenu.map(item => (
                  <li key={item.key}>
                    <a
                      href="#"
                      className={activeSection === item.key ? "active" : ""}
                      onClick={e => {e.preventDefault(); setActiveSection(item.key);}}
                    >
                      <i className={`fas ${item.icon}`}></i> {item.label}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                <h6 className="fw-bold">Website Overview</h6>
                <div className="d-flex align-items-center mt-3">
                  <div className="flex-shrink-0">
                    {report && report.pageAudit.url ? (
                      <img
                        src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent((new URL(report.pageAudit.url)).hostname)}&sz=64`}
                        alt="Favicon"
                        className="rounded"
                        width={50}
                        height={50}
                        style={{ background: '#fff', border: '1px solid #eee' }}
                      />
                    ) : (
                      <img src="/seo-analyzer-logo.svg" alt="Logo" className="rounded" width={50} height={50} />
                    )}
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h6 className="mb-0">
                      {report && report.pageAudit.url
                        ? (new URL(report.pageAudit.url)).hostname
                        : 'Website'}
                    </h6>
                    <small className="text-muted">
                      {report && report.pageAudit.url ? `Analyzed: ${new Date().toLocaleString()}` : 'No analysis yet'}
                    </small>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <h6 className="fw-bold">SEO Score</h6>
                <div className="progress mt-2">
                  <div className="progress-bar bg-success" role="progressbar" style={{width:'78%'}} aria-valuenow={78} aria-valuemin={0} aria-valuemax={100}></div>
                </div>
                <div className="d-flex justify-content-between mt-1">
                  <small>Current: 78/100</small>
                  <small>Target: 90/100</small>
                </div>
              </div>
            </div>
          </div>
          {/* Main Content */}
          <div className="col-lg-9">
            {activeSection === "dashboard" && (
              <>
                {/* Show loading spinner while fetching report */}
                {reportLoading && <LoadingSpinner />}
                {/* Show nothing until report is loaded */}
                {!reportLoading && !report && (
                  <div className="alert alert-info my-5 text-center">Enter a website URL above to get a detailed SEO analysis report.</div>
                )}
                {/* Show dashboard only when report is loaded */}
                {report && (
                  <>
                    {/* KPI Cards (example: show key technical/onpage KPIs) */}
                    <div className="row">
                      <div className="col-md-3 col-sm-6">
                        <div className="card kpi-card">
                          <div className="card-body">
                            <i className="fas fa-file-alt fa-2x text-primary mb-2"></i>
                            <div className="kpi-value">{report.pageAudit ? 1 : 0}</div>
                            <div className="kpi-label">Total Pages</div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-6">
                        <div className="card kpi-card">
                          <div className="card-body">
                            <i className="fas fa-image fa-2x text-warning mb-2"></i>
                            <div className="kpi-value">{report.onpage.imagesMissingAlt}</div>
                            <div className="kpi-label">Images Missing Alt</div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-6">
                        <div className="card kpi-card">
                          <div className="card-body">
                            <i className="fas fa-star fa-2x text-success mb-2"></i>
                            <div className="kpi-value">{report.technical.brokenLinks}</div>
                            <div className="kpi-label">Broken Links</div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-6">
                        <div className="card kpi-card">
                          <div className="card-body">
                            <i className="fas fa-mobile-alt fa-2x text-info mb-2"></i>
                            <div className="kpi-value">{report.technical.mobileFriendly ? 'Yes' : 'No'}</div>
                            <div className="kpi-label">Mobile Friendly</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* SEO Audit Tabs */}
                    <div className="card mt-4">
                      <div className="card-header d-flex justify-content-between align-items-center">
                        <div>
                          <i className="fas fa-list-check section-icon"></i>
                          SEO Audit Checklist
                        </div>
                        <div>
                          <span className="badge bg-primary">Updated</span>
                        </div>
                      </div>
                      <div className="card-body">
                        <ul className="nav nav-pills mb-4" id="seoTabs" role="tablist">
                          <li className="nav-item" role="presentation">
                            <button className={`nav-link${activeTab === "pages" ? " active" : ""}`} id="pages-tab" type="button" role="tab" onClick={() => setActiveTab("pages")}>Pages</button>
                          </li>
                          {activeTab === "pages" && (
                            <div className="tab-pane fade show active" id="pages" role="tabpanel">
                              <h5>Analyzed Pages</h5>
                              <table className="table table-bordered">
                                <thead>
                                  <tr>
                                    <th>URL</th>
                                    <th>Title</th>
                                    <th>Status</th>
                                    <th>Meta Description</th>
                                    <th>H1</th>
                                    <th>Internal Links</th>
                                    <th>External Links</th>
                                    <th>Images</th>
                                    <th>Mobile Friendly</th>
                                    <th>Indexable</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {report.pageAudit && (
                                    <tr>
                                      <td>{report.pageAudit.url}</td>
                                      <td>{report.pageAudit.title}</td>
                                      <td>{report.technical.statusCode}</td>
                                      <td>{report.pageAudit.metaDescription}</td>
                                      <td>{report.pageAudit.h1}</td>
                                      <td>{report.pageAudit.internalLinks}</td>
                                      <td>{report.pageAudit.externalLinks}</td>
                                      <td>{report.pageAudit.images}</td>
                                      <td>{report.pageAudit.mobileFriendly ? 'Yes' : 'No'}</td>
                                      <td>{report.pageAudit.indexable ? 'Yes' : 'No'}</td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                              <div className="alert alert-info">Multi-page support coming soon. This table will show all pages when full crawling is implemented.</div>
                            </div>
                          )}
                          <li className="nav-item" role="presentation">
                            <button className={`nav-link${activeTab === "technical" ? " active" : ""}`} id="technical-tab" type="button" role="tab" onClick={() => setActiveTab("technical")}>Technical SEO</button>
                          </li>
                          <li className="nav-item" role="presentation">
                            <button className={`nav-link${activeTab === "onpage" ? " active" : ""}`} id="onpage-tab" type="button" role="tab" onClick={() => setActiveTab("onpage")}>On-Page SEO</button>
                          </li>
                          <li className="nav-item" role="presentation">
                            <button className={`nav-link${activeTab === "internal" ? " active" : ""}`} id="internal-tab" type="button" role="tab" onClick={() => setActiveTab("internal")}>Internal Linking</button>
                          </li>
                          <li className="nav-item" role="presentation">
                            <button className={`nav-link${activeTab === "offpage" ? " active" : ""}`} id="offpage-tab" type="button" role="tab" onClick={() => setActiveTab("offpage")}>Off-Page SEO</button>
                          </li>
                          <li className="nav-item" role="presentation">
                            <button className={`nav-link${activeTab === "analytics" ? " active" : ""}`} id="analytics-tab" type="button"  role="tab" onClick={() => setActiveTab("analytics")}>Analytics</button>
                          </li>
                          <li className="nav-item" role="presentation">
                            <button className={`nav-link${activeTab === "ux" ? " active" : ""}`} id="ux-tab" type="button" role="tab" onClick={() => setActiveTab("ux")}>UX</button>
                          </li>
                        </ul>
                        <div className="tab-content" id="seoTabContent">
                          {activeTab === "technical" && (
                            <div className="tab-pane fade show active" id="technical" role="tabpanel">
                              <ul>
                                <li>robots.txt: {report.technical.robotsTxt ? 'Found' : 'Missing'}</li>
                                <li>sitemap.xml: {report.technical.sitemapXml ? 'Found' : 'Missing'}</li>
                                <li>HTTPS: {report.technical.https ? 'Yes' : 'No'}</li>
                                <li>Mobile Friendly: {report.technical.mobileFriendly ? 'Yes' : 'No'}</li>
                                <li>Structured Data: {report.technical.structuredData ? 'Yes' : 'No'}</li>
                                <li>Canonical Tag: {report.technical.canonical ? 'Yes' : 'No'}</li>
                                <li>Status Code: {report.technical.statusCode}</li>
                                <li>Broken Links: {report.technical.brokenLinks}</li>
                                <li>AMP: {report.technical.amp ? 'Yes' : 'No'}</li>
                              </ul>
                            </div>
                          )}
                          {activeTab === "onpage" && (
                            <div className="tab-pane fade show active" id="onpage" role="tabpanel">
                              <ul>
                                <li>Title: {report.onpage.title}</li>
                                <li>Meta Description: {report.onpage.metaDescription}</li>
                                <li>Keywords: {report.onpage.keywords}</li>
                                <li>H1: {report.onpage.headings?.h1?.join(', ')}</li>
                                <li>Images: {report.onpage.images?.length}</li>
                                <li>Images Missing Alt: {report.onpage.imagesMissingAlt}</li>
                                <li>Images Not Lazy: {report.onpage.imagesNotLazy}</li>
                                <li>OG Title: {report.onpage.ogTitle}</li>
                                <li>OG Description: {report.onpage.ogDescription}</li>
                                <li>Twitter Card: {report.onpage.twitterCard}</li>
                              </ul>
                            </div>
                          )}
                          {activeTab === "internal" && (
                            <div className="tab-pane fade show active" id="internal" role="tabpanel">
                              <ul>
                                <li>Internal Links: {report.internalLinking.internalLinks}</li>
                                <li>External Links: {report.internalLinking.externalLinks}</li>
                                <li>Breadcrumbs: {report.internalLinking.breadcrumbs ? 'Yes' : 'No'}</li>
                              </ul>
                            </div>
                          )}
                          {activeTab === "offpage" && (
                            <div className="tab-pane fade show active" id="offpage" role="tabpanel">
                              <ul>
                                <li>Backlinks: {report.offpage.backlinks ?? 'N/A'}</li>
                                <li>Toxic Links: {report.offpage.toxicLinks ?? 'N/A'}</li>
                                <li>Competitor Backlinks: {report.offpage.competitorBacklinks ?? 'N/A'}</li>
                                <li>Social Signals: {report.offpage.socialSignals ?? 'N/A'}</li>
                                <li>Local Citations: {report.offpage.localCitations ?? 'N/A'}</li>
                                <li>Google Business Profile: {report.offpage.googleBusinessProfile ?? 'N/A'}</li>
                              </ul>
                            </div>
                          )}
                          {activeTab === "analytics" && (
                            <div className="tab-pane fade show active" id="analytics" role="tabpanel">
                              <ul>
                                <li>Google Analytics: {report.analytics.googleAnalytics ? 'Yes' : 'No'}</li>
                                <li>Google Search Console: {report.analytics.googleSearchConsole ? 'Yes' : 'No'}</li>
                                <li>Bing Webmaster: {report.analytics.bingWebmaster ? 'Yes' : 'No'}</li>
                                <li>Organic Traffic: {report.analytics.organicTraffic ?? 'N/A'}</li>
                                <li>Bounce Rate: {report.analytics.bounceRate ?? 'N/A'}</li>
                                <li>Conversion Rate: {report.analytics.conversionRate ?? 'N/A'}</li>
                                <li>Keyword Rankings: {report.analytics.keywordRankings ?? 'N/A'}</li>
                                <li>Crawl Errors: {report.analytics.crawlErrors ?? 'N/A'}</li>
                                <li>Indexed Pages: {report.analytics.indexedPages ?? 'N/A'}</li>
                              </ul>
                            </div>
                          )}
                          {activeTab === "ux" && (
                            <div className="tab-pane fade show active" id="ux" role="tabpanel">
                              <ul>
                                <li>Fast Load: {report.ux.fastLoad ? 'Yes' : 'No'}</li>
                                <li>Clear Navigation: {report.ux.clearNav ? 'Yes' : 'No'}</li>
                                <li>Mobile Usability: {report.ux.mobileUsability ? 'Yes' : 'No'}</li>
                                <li>No Popups: {report.ux.noPopups ? 'Yes' : 'No'}</li>
                                <li>Accessible: {report.ux.accessible ? 'Yes' : 'No'}</li>
                                <li>Consistent Branding: {report.ux.consistentBranding ? 'Yes' : 'No'}</li>
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Page-Level Audit */}
                    <div className="card mt-4">
                      <div className="card-header">
                        <i className="fas fa-file-alt section-icon"></i>
                        Page Audit
                      </div>
                      <div className="card-body">
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th>Element</th>
                              <th>Value</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr><td>URL</td><td>{report.pageAudit.url}</td></tr>
                            <tr><td>Title Tag</td><td>{report.pageAudit.title}</td></tr>
                            <tr><td>Meta Description</td><td>{report.pageAudit.metaDescription}</td></tr>
                            <tr><td>H1 Tag</td><td>{report.pageAudit.h1}</td></tr>
                            <tr><td>Internal Links</td><td>{report.pageAudit.internalLinks}</td></tr>
                            <tr><td>External Links</td><td>{report.pageAudit.externalLinks}</td></tr>
                            <tr><td>Images</td><td>{report.pageAudit.images}</td></tr>
                            <tr><td>Images With Alt</td><td>{report.pageAudit.imagesWithAlt}</td></tr>
                            <tr><td>Structured Data</td><td>{report.pageAudit.structuredData ? 'Yes' : 'No'}</td></tr>
                            <tr><td>Mobile Friendly</td><td>{report.pageAudit.mobileFriendly ? 'Yes' : 'No'}</td></tr>
                            <tr><td>Indexable</td><td>{report.pageAudit.indexable ? 'Yes' : 'No'}</td></tr>
                            <tr><td>Canonical Tag</td><td>{report.pageAudit.canonical}</td></tr>
                            <tr><td>Social Tags</td><td>{report.pageAudit.socialTags ? 'Yes' : 'No'}</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
            {activeSection !== "dashboard" && (
              <div className="card my-5">
                <div className="card-body text-center py-5">
                  <i className="fas fa-lock fa-3x text-warning mb-3"></i>
                  <h5 className="card-title">Subscription required for the feature</h5>
                  <p className="text-muted">Please subscribe to access this feature.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}