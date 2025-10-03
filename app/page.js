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
              {/* Error display, outside form but inside col-md-6 */}
              {reportError && (
                <div className="alert alert-danger mt-2">{reportError}</div>
              )}
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
                    {report && report.pages && report.pages[0] && report.pages[0].url ? (
                      <img
                        src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent((new URL(report.pages[0].url)).hostname)}&sz=64`}
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
                      {report && report.pages && report.pages[0] && report.pages[0].url
                        ? (new URL(report.pages[0].url)).hostname
                        : 'Website'}
                    </h6>
                    <small className="text-muted">
                      {report && report.pages && report.pages[0] && report.pages[0].url ? `Analyzed: ${new Date().toLocaleString()}` : 'No analysis yet'}
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
                            <div className="kpi-value">{report.pages ? report.pages.length : 0}</div>
                            <div className="kpi-label">Total Pages</div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-6">
                        <div className="card kpi-card">
                          <div className="card-body">
                            <i className="fas fa-image fa-2x text-warning mb-2"></i>
                            <div className="kpi-value">{report.pages && report.pages[0] ? report.pages[0].imagesMissingAlt : '-'}</div>
                            <div className="kpi-label">Images Missing Alt</div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-6">
                        <div className="card kpi-card">
                          <div className="card-body">
                            <i className="fas fa-star fa-2x text-success mb-2"></i>
                            <div className="kpi-value">{report.pages && report.pages[0] ? report.pages[0].brokenLinks : '-'}</div>
                            <div className="kpi-label">Broken Links</div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-6">
                        <div className="card kpi-card">
                          <div className="card-body">
                            <i className="fas fa-mobile-alt fa-2x text-info mb-2"></i>
                            <div className="kpi-value">{report.pages && report.pages[0] ? (report.pages[0].mobileFriendly ? 'Yes' : 'No') : '-'}</div>
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
                              <table className="table table-bordered table-sm">
                                <thead>
                                  <tr>
                                    <th>URL</th>
                                    <th>Status</th>
                                    <th>robots.txt</th>
                                    <th>sitemap.xml</th>
                                    <th>HTTPS</th>
                                    <th>Mobile Friendly</th>
                                    <th>Structured Data</th>
                                    <th>Canonical</th>
                                    <th>Broken Links</th>
                                    <th>AMP</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {report.pages && report.pages.length > 0 ? report.pages.map((p, i) => (
                                    <tr key={i}>
                                      <td>{p.url}</td>
                                      <td>{p.statusCode}</td>
                                      <td>{p.robotsTxt ? 'Found' : 'Missing'}</td>
                                      <td>{p.sitemapXml ? 'Found' : 'Missing'}</td>
                                      <td>{p.https ? 'Yes' : 'No'}</td>
                                      <td>{p.mobileFriendly ? 'Yes' : 'No'}</td>
                                      <td>{p.structuredData ? 'Yes' : 'No'}</td>
                                      <td>{p.canonical ? 'Yes' : 'No'}</td>
                                      <td>{p.brokenLinks}</td>
                                      <td>{p.amp ? 'Yes' : 'No'}</td>
                                    </tr>
                                  )) : (
                                    <tr><td colSpan={10}>No data</td></tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          )}
                          {activeTab === "onpage" && (
                            <div className="tab-pane fade show active" id="onpage" role="tabpanel">
                              <table className="table table-bordered table-sm">
                                <thead>
                                  <tr>
                                    <th>URL</th>
                                    <th>Title</th>
                                    <th>Meta Description</th>
                                    <th>H1</th>
                                    <th>Images</th>
                                    <th>Images Missing Alt</th>
                                    <th>OG Title</th>
                                    <th>OG Description</th>
                                    <th>Twitter Card</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {report.pages && report.pages.length > 0 ? report.pages.map((p, i) => (
                                    <tr key={i}>
                                      <td>{p.url}</td>
                                      <td>{p.title}</td>
                                      <td>{p.metaDescription}</td>
                                      <td>{p.h1}</td>
                                      <td>{p.images}</td>
                                      <td>{p.imagesMissingAlt}</td>
                                      <td>{p.ogTitle}</td>
                                      <td>{p.ogDescription}</td>
                                      <td>{p.twitterCard}</td>
                                    </tr>
                                  )) : (
                                    <tr><td colSpan={9}>No data</td></tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          )}
                          {activeTab === "internal" && (
                            <div className="tab-pane fade show active" id="internal" role="tabpanel">
                              <table className="table table-bordered table-sm">
                                <thead>
                                  <tr>
                                    <th>URL</th>
                                    <th>Internal Links</th>
                                    <th>External Links</th>
                                    <th>Breadcrumbs</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {report.pages && report.pages.length > 0 ? report.pages.map((p, i) => (
                                    <tr key={i}>
                                      <td>{p.url}</td>
                                      <td>{p.internalLinks}</td>
                                      <td>{p.externalLinks}</td>
                                      <td>{p.breadcrumbs ? 'Yes' : 'No'}</td>
                                    </tr>
                                  )) : (
                                    <tr><td colSpan={4}>No data</td></tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          )}
                          {activeTab === "offpage" && (
                            <div className="tab-pane fade show active" id="offpage" role="tabpanel">
                              <table className="table table-bordered table-sm">
                                <thead>
                                  <tr>
                                    <th>URL</th>
                                    <th>Backlinks</th>
                                    <th>Toxic Links</th>
                                    <th>Competitor Backlinks</th>
                                    <th>Social Signals</th>
                                    <th>Local Citations</th>
                                    <th>Google Business Profile</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {report.pages && report.pages.length > 0 ? report.pages.map((p, i) => (
                                    <tr key={i}>
                                      <td>{p.url}</td>
                                      <td>{p.backlinks ?? 'N/A'}</td>
                                      <td>{p.toxicLinks ?? 'N/A'}</td>
                                      <td>{p.competitorBacklinks ?? 'N/A'}</td>
                                      <td>{p.socialSignals ?? 'N/A'}</td>
                                      <td>{p.localCitations ?? 'N/A'}</td>
                                      <td>{p.googleBusinessProfile ?? 'N/A'}</td>
                                    </tr>
                                  )) : (
                                    <tr><td colSpan={7}>No data</td></tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          )}
                          {activeTab === "analytics" && (
                            <div className="tab-pane fade show active" id="analytics" role="tabpanel">
                              <table className="table table-bordered table-sm">
                                <thead>
                                  <tr>
                                    <th>URL</th>
                                    <th>Google Analytics</th>
                                    <th>Google Search Console</th>
                                    <th>Bing Webmaster</th>
                                    <th>Organic Traffic</th>
                                    <th>Bounce Rate</th>
                                    <th>Conversion Rate</th>
                                    <th>Keyword Rankings</th>
                                    <th>Crawl Errors</th>
                                    <th>Indexed Pages</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {report.pages && report.pages.length > 0 ? report.pages.map((p, i) => (
                                    <tr key={i}>
                                      <td>{p.url}</td>
                                      <td>{p.googleAnalytics ? 'Yes' : 'No'}</td>
                                      <td>{p.googleSearchConsole ? 'Yes' : 'No'}</td>
                                      <td>{p.bingWebmaster ? 'Yes' : 'No'}</td>
                                      <td>{p.organicTraffic ?? 'N/A'}</td>
                                      <td>{p.bounceRate ?? 'N/A'}</td>
                                      <td>{p.conversionRate ?? 'N/A'}</td>
                                      <td>{p.keywordRankings ?? 'N/A'}</td>
                                      <td>{p.crawlErrors ?? 'N/A'}</td>
                                      <td>{p.indexedPages ?? 'N/A'}</td>
                                    </tr>
                                  )) : (
                                    <tr><td colSpan={10}>No data</td></tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          )}
                          {activeTab === "ux" && (
                            <div className="tab-pane fade show active" id="ux" role="tabpanel">
                              <table className="table table-bordered table-sm">
                                <thead>
                                  <tr>
                                    <th>URL</th>
                                    <th>Fast Load</th>
                                    <th>Clear Navigation</th>
                                    <th>Mobile Usability</th>
                                    <th>No Popups</th>
                                    <th>Accessible</th>
                                    <th>Consistent Branding</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {report.pages && report.pages.length > 0 ? report.pages.map((p, i) => (
                                    <tr key={i}>
                                      <td>{p.url}</td>
                                      <td>{p.fastLoad ? 'Yes' : 'No'}</td>
                                      <td>{p.clearNav ? 'Yes' : 'No'}</td>
                                      <td>{p.mobileUsability ? 'Yes' : 'No'}</td>
                                      <td>{p.noPopups ? 'Yes' : 'No'}</td>
                                      <td>{p.accessible ? 'Yes' : 'No'}</td>
                                      <td>{p.consistentBranding ? 'Yes' : 'No'}</td>
                                    </tr>
                                  )) : (
                                    <tr><td colSpan={7}>No data</td></tr>
                                  )}
                                </tbody>
                              </table>
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
                            {report.pages && report.pages[0] ? (
                              <>
                                <tr><td>URL</td><td>{report.pages[0].url}</td></tr>
                                <tr><td>Title Tag</td><td>{report.pages[0].title}</td></tr>
                                <tr><td>Meta Description</td><td>{report.pages[0].metaDescription}</td></tr>
                                <tr><td>H1 Tag</td><td>{report.pages[0].h1}</td></tr>
                                <tr><td>Internal Links</td><td>{report.pages[0].internalLinks}</td></tr>
                                <tr><td>External Links</td><td>{report.pages[0].externalLinks}</td></tr>
                                <tr><td>Images</td><td>{report.pages[0].images}</td></tr>
                                <tr><td>Images With Alt</td><td>{report.pages[0].imagesWithAlt}</td></tr>
                                <tr><td>Structured Data</td><td>{report.pages[0].structuredData ? 'Yes' : 'No'}</td></tr>
                                <tr><td>Mobile Friendly</td><td>{report.pages[0].mobileFriendly ? 'Yes' : 'No'}</td></tr>
                                <tr><td>Indexable</td><td>{report.pages[0].indexable ? 'Yes' : 'No'}</td></tr>
                                <tr><td>Canonical Tag</td><td>{report.pages[0].canonical}</td></tr>
                                <tr><td>Social Tags</td><td>{report.pages[0].socialTags ? 'Yes' : 'No'}</td></tr>
                              </>
                            ) : (
                              <tr><td colSpan={2}>No page data available.</td></tr>
                            )}
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