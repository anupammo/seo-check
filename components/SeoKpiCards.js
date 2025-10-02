// Example: SEO KPI Cards component
import React from "react";

export default function SeoKpiCards({ report }) {
  return (
    <div className="row">
      <div className="col-md-3 col-sm-6">
        <div className="card kpi-card">
          <div className="card-body">
            <i className="fas fa-file-alt fa-2x text-primary mb-2"></i>
            <div className="kpi-value">{report?.totalPages ?? '-'}</div>
            <div className="kpi-label">Total Pages</div>
          </div>
        </div>
      </div>
      <div className="col-md-3 col-sm-6">
        <div className="card kpi-card">
          <div className="card-body">
            <i className="fas fa-image fa-2x text-warning mb-2"></i>
            <div className="kpi-value">{report?.imagesMissingAlt ?? '-'}</div>
            <div className="kpi-label">Images Without Alt Tags</div>
          </div>
        </div>
      </div>
      <div className="col-md-3 col-sm-6">
        <div className="card kpi-card">
          <div className="card-body">
            <i className="fas fa-star fa-2x text-success mb-2"></i>
            <div className="kpi-value">{report?.onpageSeoScore ? `${report.onpageSeoScore}%` : '-'}</div>
            <div className="kpi-label">Onpage SEO Score</div>
          </div>
        </div>
      </div>
      <div className="col-md-3 col-sm-6">
        <div className="card kpi-card">
          <div className="card-body">
            <i className="fas fa-unlink fa-2x text-danger mb-2"></i>
            <div className="kpi-value">{report?.brokenLinks ?? '-'}</div>
            <div className="kpi-label">Broken Links</div>
          </div>
        </div>
      </div>
    </div>
  );
}
