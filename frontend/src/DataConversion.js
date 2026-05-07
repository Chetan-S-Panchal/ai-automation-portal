import React, { useState, useRef } from "react";
import "./App.css";
import * as XLSX from "xlsx";

export default function DataConversion() {
  const [subTab, setSubTab] = useState("manual");
  const [conversionType, setConversionType] = useState("");
  const [file, setFile] = useState(null);
  const [agreed, setAgreed] = useState(false);

  const FREE_LIMIT = 50;
  const MOCK_RECORDS = 120;

  const recordCount = file ? MOCK_RECORDS : 0;
  const showPaid = recordCount > FREE_LIMIT;

  const fileInputRef = useRef();

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;

    setFile({
      name: f.name,
      path: e.target.value
    });
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const resetAll = () => {
    setFile(null);
    setConversionType("");
    setAgreed(false);
  };

  const getAcceptedTypes = () => {
    if (conversionType === "excel-csv" || conversionType === "excel-txt")
      return ".xls,.xlsx";
    if (conversionType === "csv-excel")
      return ".csv";
    return "*";
  };

  return (
    <div>

      {/* SUB TABS */}
      <div className="subtabs">
        <button className={subTab === "manual" ? "active" : ""} onClick={() => setSubTab("manual")}>User Manual</button>
        <button className={subTab === "conversion" ? "active" : ""} onClick={() => setSubTab("conversion")}>Go Data Conversion</button>
        <button className={subTab === "custom" ? "active" : ""} onClick={() => setSubTab("custom")}>Customised Services</button>
      </div>

      {/* USER MANUAL */}
      {subTab === "manual" && (
        <div className="content">
          <h3>User Manual</h3>
          <p>Select conversion → Upload → Process</p>
        </div>
      )}

      {/* CUSTOM */}
      {subTab === "custom" && (
        <div className="content">
          <h3>Customised Services</h3>
          <p>Request for tailored solutions</p>
        </div>
      )}

      {/* MAIN */}
      {subTab === "conversion" && (
        <div className="content">

          {/* CONVERSION TYPE */}
          <div className="panel radio-group">

            <label>
              <input type="radio" name="conversion" onChange={() => setConversionType("excel-csv")} />
              Excel → CSV (Convert Excel to CSV)
            </label>

            <label>
              <input type="radio" name="conversion" onChange={() => setConversionType("excel-txt")} />
              Excel → TXT (Convert Excel to Text)
            </label>

            <label>
              <input type="radio" name="conversion" onChange={() => setConversionType("csv-excel")} />
              CSV → Excel (Convert CSV to Excel)
            </label>

          </div>

          {/* FILE UPLOAD */}
          {conversionType && (
            <div className="panel">

              <button
                className="btn primary"
                onClick={() => fileInputRef.current.click()}
              >
                Choose File
              </button>

              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFile}
                accept={getAcceptedTypes()}
              />

              {file && (
                <>
                  <div className="file-info">
                    <p><b>Import File:</b> {file.path}</p>
                    <p>No. of Records: {recordCount}</p>
                  </div>

                  <button className="btn neutral" onClick={removeFile}>
                    Remove File
                  </button>
                </>
              )}

            </div>
          )}

          {/* DISCLAIMER + BUTTONS */}
          {file && (
            <div className="panel">

              {/* DISCLAIMER */}
              <div className="disclaimer-box">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={() => setAgreed(!agreed)}
                />
                <label>I agree to the terms</label>
              </div>

              <div className="disclaimer-text">
                <p>Ensure your data is correct before upload</p>
                <p>Do not upload confidential data without permission</p>
                <p>System processes automatically</p>
              </div>

              {/* ACTION BUTTONS */}
              <button
                className="btn primary"
                disabled={!agreed}
                onClick={() => {
                  if (!agreed) return;

                  const confirmAction = window.confirm("Proceed with free processing?");
                  if (confirmAction) {
                    alert("Free processing started (demo)");
                  }
                }}
              >
                {recordCount <= 50
                  ? "Convert Data For Free"
                  : "Try 50 Records Free before you pay"}
              </button>

              {/* PAID BUTTON */}
              {showPaid && (
                <button
                  className="btn secondary"
                  disabled={!agreed}
                  onClick={() => {
                    if (!agreed) return;

                    const confirmAction = window.confirm("Proceed with full data conversion (₹99)?");
                    if (confirmAction) {
                      alert("Paid processing started (demo)");
                    }
                  }}
                >
                  Convert full data for Rs.99/-
                </button>
              )}

            </div>

            
      )}

      {/* RESET / EXIT */}
      <div className="panel">
        <button className="btn neutral" onClick={resetAll}>Reset</button>
        <button className="btn neutral" onClick={() => window.location.reload()}>Exit</button>
      </div>

    </div>
  )
}
    </div >
  );
}