// Example: Loading Spinner component
import React from "react";

export default function LoadingSpinner() {
  return (
    <div className="d-flex justify-content-center align-items-center py-5">
      <div className="spinner-border text-primary" style={{ width: 48, height: 48 }} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}
