"use client";
import React, { useState } from "react";
import Head from "next/head";
import { useSeoReport } from "../hooks/useSeoReport";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState("dashboard");
  const [activeTab, setActiveTab] = useState("technical");
  const [search, setSearch] = useState("");
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
                  disabled={loading}
                />
                <button className="btn btn-light rounded-pill px-4" type="submit" disabled={loading}>
                  {loading ? <span className="spinner-border spinner-border-sm"></span> : <><i className="fas fa-search me-2"></i>Analyze</>}
                </button>
              </form>
              {error && <div className="alert alert-danger mt-2">{error}</div>}
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
                    <img src="https://via.placeholder.com/50" alt="Website" className="rounded" width={50} height={50} />
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h6 className="mb-0">ExampleWebsite.com</h6>
                    <small className="text-muted">Last updated: 2 hours ago</small>
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
                    {/* KPI Cards */}
                    <div className="row">
                      <div className="col-md-3 col-sm-6">
                        <div className="card kpi-card">
                          <div className="card-body">
                            <i className="fas fa-file-alt fa-2x text-primary mb-2"></i>
                            <div className="kpi-value">{report.totalPages}</div>
                            <div className="kpi-label">Total Pages</div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-6">
                        <div className="card kpi-card">
                          <div className="card-body">
                            <i className="fas fa-image fa-2x text-warning mb-2"></i>
                            <div className="kpi-value">{report.imagesMissingAlt}</div>
                            <div className="kpi-label">Without Alt Tags</div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-6">
                        <div className="card kpi-card">
                          <div className="card-body">
                            <i className="fas fa-star fa-2x text-success mb-2"></i>
                            <div className="kpi-value">{report.onpageSeoScore}%</div>
                            <div className="kpi-label">Onpage SEO</div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-6">
                        <div className="card kpi-card">
                          <div className="card-body">
                            <i className="fas fa-unlink fa-2x text-danger mb-2"></i>
                            <div className="kpi-value">{report.brokenLinks}</div>
                            <div className="kpi-label">Broken Links</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* SEO Analysis Checklist */}
                    <div className="card">
                      <div className="card-header d-flex justify-content-between align-items-center">
                        <div>
                          <i className="fas fa-list-check section-icon"></i>
                          SEO Analysis Checklist
                        </div>
                        <div>
                          <span className="badge bg-primary">Updated Today</span>
                        </div>
                      </div>
                      <div className="card-body">
                        <ul className="nav nav-pills mb-4" id="seoTabs" role="tablist">
                          <li className="nav-item" role="presentation">
                            <button className={`nav-link${activeTab === "technical" ? " active" : ""}`} id="technical-tab" type="button" role="tab" onClick={() => setActiveTab("technical")}>Technical SEO</button>
                          </li>
                          <li className="nav-item" role="presentation">
                            <button className={`nav-link${activeTab === "onpage" ? " active" : ""}`} id="onpage-tab" type="button" role="tab" onClick={() => setActiveTab("onpage")}>On-Page SEO</button>
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
                              <div className="checklist-item">
                                <div className="d-flex justify-content-between align-items-center">
                                  <div>
                                    <span className="status-indicator status-complete"></span>
                                    Check robots.txt and ensure important pages are not blocked
                                  </div>
                                  <span className="badge bg-success">Complete</span>
                                </div>
                              </div>
                              <div className="checklist-item">
                                <div className="d-flex justify-content-between align-items-center">
                                  <div>
                                    <span className="status-indicator status-complete"></span>
                                    Verify XML sitemap is submitted to Google Search Console
                                  </div>
                                  <span className="badge bg-success">Complete</span>
                                </div>
                              </div>
                              <div className="checklist-item">
                                <div className="d-flex justify-content-between align-items-center">
                                  <div>
                                    <span className="status-indicator status-complete"></span>
                                    Ensure HTTPS is enabled and SSL certificate is valid
                                  </div>
                                  <span className="badge bg-success">Complete</span>
                                </div>
                              </div>
                              <div className="checklist-item">
                                <div className="d-flex justify-content-between align-items-center">
                                  <div>
                                    <span className="status-indicator status-in-progress"></span>
                                    Test with Google PageSpeed Insights and Core Web Vitals
                                  </div>
                                  <span className="badge bg-warning">In Progress</span>
                                </div>
                              </div>
                              <div className="checklist-item">
                                <div className="d-flex justify-content-between align-items-center">
                                  <div>
                                    <span className="status-indicator status-in-progress"></span>
                                    Optimize images and enable lazy loading
                                  </div>
                                  <span className="badge bg-warning">In Progress</span>
                                </div>
                              </div>
                              <div className="checklist-item">
                                <div className="d-flex justify-content-between align-items-center">
                                  <div>
                                    <span className="status-indicator status-not-started"></span>
                                    Implement schema markup and validate with Rich Results Test
                                  </div>
                                  <span className="badge bg-secondary">Not Started</span>
                                </div>
                              </div>
                            </div>
                          )}
                          {activeTab === "onpage" && (
                            <div className="tab-pane fade show active" id="onpage" role="tabpanel">
                              <div className="checklist-item">
                                <div className="d-flex justify-content-between align-items-center">
                                  <div>
                                    <span className="status-indicator status-complete"></span>
                                    Perform keyword research for each page
                                  </div>
                                  <span className="badge bg-success">Complete</span>
                                </div>
                              </div>
                              <div className="checklist-item">
                                <div className="d-flex justify-content-between align-items-center">
                                  <div>
                                    <span className="status-indicator status-in-progress"></span>
                                    Use primary and secondary keywords naturally
                                  </div>
                                  <span className="badge bg-warning">In Progress</span>
                                </div>
                              </div>
                              <div className="checklist-item">
                                <div className="d-flex justify-content-between align-items-center">
                                  <div>
                                    <span className="status-indicator status-in-progress"></span>
                                    Write unique and compelling title tags
                                  </div>
                                  <span className="badge bg-warning">In Progress</span>
                                </div>
                              </div>
                              <div className="checklist-item">
                                <div className="d-flex justify-content-between align-items-center">
                                  <div>
                                    <span className="status-indicator status-not-started"></span>
                                    Write meta descriptions with keywords
                                  </div>
                                  <span className="badge bg-secondary">Not Started</span>
                                </div>
                              </div>
                              <div className="checklist-item">
                                <div className="d-flex justify-content-between align-items-center">
                                  <div>
                                    <span className="status-indicator status-not-started"></span>
                                    Use alt text for all images
                                  </div>
                                  <span className="badge bg-secondary">Not Started</span>
                                </div>
                              </div>
                            </div>
                          )}
                          {activeTab === "offpage" && (
                            <div className="tab-pane fade show active" id="offpage" role="tabpanel">
                              <ul className="list-group mb-4">
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                  <span><i className="fas fa-link me-2 text-info"></i>Build quality backlinks from reputable sources</span>
                                  <span className="badge bg-warning">In Progress</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                  <span><i className="fas fa-bullhorn me-2 text-primary"></i>Monitor brand mentions and citations</span>
                                  <span className="badge bg-secondary">Not Started</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                  <span><i className="fas fa-share-alt me-2 text-success"></i>Engage on social media platforms</span>
                                  <span className="badge bg-success">Complete</span>
                                </li>
                              </ul>
                              <div className="alert alert-info">Off-page SEO focuses on activities outside your website to improve rankings.</div>
                            </div>
                          )}
                          {activeTab === "analytics" && (
                            <div className="tab-pane fade show active" id="analytics" role="tabpanel">
                              <ul className="list-group mb-4">
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                  <span><i className="fas fa-chart-pie me-2 text-success"></i>Google Analytics is installed and tracking</span>
                                  <span className="badge bg-success">Complete</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                  <span><i className="fas fa-search me-2 text-info"></i>Google Search Console is connected</span>
                                  <span className="badge bg-success">Complete</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                  <span><i className="fas fa-bullseye me-2 text-warning"></i>Set up conversion tracking for key actions</span>
                                  <span className="badge bg-warning">In Progress</span>
                                </li>
                              </ul>
                              <div className="alert alert-info">Analytics help you measure and optimize your SEO efforts.</div>
                            </div>
                          )}
                          {activeTab === "ux" && (
                            <div className="tab-pane fade show active" id="ux" role="tabpanel">
                              <ul className="list-group mb-4">
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                  <span><i className="fas fa-mobile-alt me-2 text-primary"></i>Ensure mobile-friendly and responsive design</span>
                                  <span className="badge bg-success">Complete</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                  <span><i className="fas fa-tachometer-alt me-2 text-info"></i>Improve page load speed and interactivity</span>
                                  <span className="badge bg-warning">In Progress</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                  <span><i className="fas fa-eye me-2 text-secondary"></i>Use accessible colors and readable fonts</span>
                                  <span className="badge bg-secondary">Not Started</span>
                                </li>
                              </ul>
                              <div className="alert alert-info">Good UX ensures visitors have a positive experience on your site.</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Page-Level Audit */}
                    <div className="card">
                      <div className="card-header">
                        <i className="fas fa-file-alt section-icon"></i>
                        Page-Level Audit
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="page-audit-item">
                              <div className="page-score score-excellent">92</div>
                              <div>
                                <h6 className="mb-1">Homepage</h6>
                                <small className="text-muted">Last updated: 2 days ago</small>
                              </div>
                            </div>
                            <div className="page-audit-item">
                              <div className="page-score score-good">78</div>
                              <div>
                                <h6 className="mb-1">About Us</h6>
                                <small className="text-muted">Last updated: 1 week ago</small>
                              </div>
                            </div>
                            <div className="page-audit-item">
                              <div className="page-score score-poor">45</div>
                              <div>
                                <h6 className="mb-1">Services</h6>
                                <small className="text-muted">Last updated: 3 weeks ago</small>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="page-audit-item">
                              <div className="page-score score-excellent">88</div>
                              <div>
                                <h6 className="mb-1">Blog</h6>
                                <small className="text-muted">Last updated: 1 day ago</small>
                              </div>
                            </div>
                            <div className="page-audit-item">
                              <div className="page-score score-good">72</div>
                              <div>
                                <h6 className="mb-1">Contact</h6>
                                <small className="text-muted">Last updated: 2 weeks ago</small>
                              </div>
                            </div>
                            <div className="page-audit-item">
                              <div className="page-score score-poor">52</div>
                              <div>
                                <h6 className="mb-1">Portfolio</h6>
                                <small className="text-muted">Last updated: 1 month ago</small>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-center mt-3">
                          <button className="btn btn-outline-primary">View All Pages</button>
                        </div>
                      </div>
                    </div>
                    {/* Recommendations */}
                    <div className="card">
                      <div className="card-header">
                        <i className="fas fa-lightbulb section-icon"></i>
                        Top Recommendations
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <div className="d-flex">
                              <div className="flex-shrink-0">
                                <span className="badge bg-danger me-2">High</span>
                              </div>
                              <div className="flex-grow-1">
                                <h6 className="mb-1">Improve Page Load Speed</h6>
                                <p className="mb-0 text-muted">Your homepage takes 3.2 seconds to load. Consider optimizing images and reducing render-blocking resources.</p>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6 mb-3">
                            <div className="d-flex">
                              <div className="flex-shrink-0">
                                <span className="badge bg-warning me-2">Medium</span>
                              </div>
                              <div className="flex-grow-1">
                                <h6 className="mb-1">Add Missing Meta Descriptions</h6>
                                <p className="mb-0 text-muted">12 pages are missing meta descriptions which can impact click-through rates.</p>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6 mb-3">
                            <div className="d-flex">
                              <div className="flex-shrink-0">
                                <span className="badge bg-warning me-2">Medium</span>
                              </div>
                              <div className="flex-grow-1">
                                <h6 className="mb-1">Fix Broken Internal Links</h6>
                                <p className="mb-0 text-muted">We found 7 broken internal links that may be affecting user experience and crawlability.</p>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6 mb-3">
                            <div className="d-flex">
                              <div className="flex-shrink-0">
                                <span className="badge bg-info me-2">Low</span>
                              </div>
                              <div className="flex-grow-1">
                                <h6 className="mb-1">Optimize for Featured Snippets</h6>
                                <p className="mb-0 text-muted">5 of your pages have potential to rank for featured snippets with minor content adjustments.</p>
                              </div>
                            </div>
                          </div>
                        </div>
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