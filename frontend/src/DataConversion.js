import React, { useState } from "react";
import "./App.css";

export default function DataConversion() {
  const [agreed, setAgreed] = useState(false);
  const [subTab, setSubTab] = useState("manual");
  const [conversionType, setConversionType] = useState("");
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");

  const FREE_LIMIT = 50;
  const MOCK_RECORDS = 120; // temporary

  const allowedFormats = {
    "excel-csv": [".xls", ".xlsx"],
    "excel-txt": [".xls", ".xlsx"],
    "csv-excel": [".csv"],
  };

  const handleConversionChange = (type) => {
    setConversionType(type);
    setFile(null);
    setFileError("");
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    const ext = selected.name.split(".").pop().toLowerCase();
    const valid = allowedFormats[conversionType]?.includes("." + ext);

    if (!valid) {
      setFileError("Invalid file type for selected conversion");
      setFile(null);
      return;
    }

    if (selected.size > 5 * 1024 * 1024) {
      setFileError("File must be under 5MB");
      setFile(null);
      return;
    }

    setFile(selected);
    setFileError("");
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  const resetAll = () => {
    setConversionType("");
    setFile(null);
    setAgreed(false);
    setFileError("");
  };

  const recordCount = file ? MOCK_RECORDS : 0;
  const showPaid = recordCount > FREE_LIMIT;

  return (
    <div>

      {/* DISCLAIMER */}
      <div className="panel">
        <label>
          <input
            type="checkbox"
            checked={agreed}
            onChange={() => setAgreed(!agreed)}
          />
          I agree to the terms and disclaimer
        </label>
      </div>

      {/* SUB TABS */}
      <div className="subtabs">
        <button
          className={subTab === "manual" ? "active" : ""}
          onClick={() => setSubTab("manual")}
        >
          User Manual
        </button>
        <button
          className={subTab === "conversion" ? "active" : ""}
          onClick={() => setSubTab("conversion")}
          disabled={!agreed}
        >
          Go Data Conversion
        </button>
      </div>

      {/* USER MANUAL */}
      {subTab === "manual" && (
        <div className="content">
          <h3>User Manual</h3>
          <p>Select conversion → Upload → Process</p>
          <p>First 50 records FREE</p>
        </div>
      )}

      {/* MAIN UI */}
      {subTab === "conversion" && (
        <div className="content">

          {/* CONVERSION TYPE */}
          <div className="panel">
            <h4>Select Conversion Type</h4>

            <label>
              <input type="radio" onChange={() => handleConversionChange("excel-csv")} />
              Excel → CSV  
              <div className="hint">Convert Excel to comma-separated CSV file</div>
            </label>

            <label>
              <input type="radio" onChange={() => handleConversionChange("excel-txt")} />
              Excel → TXT  
              <div className="hint">Convert Excel to tab-separated text file</div>
            </label>

            <label>
              <input type="radio" onChange={() => handleConversionChange("csv-excel")} />
              CSV → Excel  
              <div className="hint">Convert CSV into Excel format</div>
            </label>
          </div>

          {/* FILE UPLOAD */}
          {conversionType && (
            <div className="panel">
              <h4>Upload File</h4>

              <p className="note">
                Uploading a new file will overwrite previous file
              </p>

              <input type="file" onChange={handleFileChange} />

              {fileError && <p className="error">{fileError}</p>}

              {file && (
                <div className="file-info">
                  <p><b>{file.name}</b></p>
                  <p>{(file.size / 1024).toFixed(2)} KB</p>
                  <p className="note">
                    File will be deleted after processing or exit
                  </p>

                  <button onClick={handleRemoveFile}>Remove File</button>
                </div>
              )}
            </div>
          )}

          {/* PRICING + ACTION */}
          {file && (
            <div className="panel">

              <p><b>Total Records:</b> {recordCount}</p>

              <div className="buttons">
                <button className="primary">
                  Process {Math.min(recordCount, FREE_LIMIT)} Records (Free)
                </button>

                {showPaid && (
                  <button className="secondary">
                    Unlock Full Data – ₹99
                  </button>
                )}
              </div>

              {showPaid && (
                <div className="pricing">
                  <p><b>Pricing:</b></p>
                  <p>Flat ₹99 for full file processing</p>
                  <div className="payment-box">
                    Payment gateway integration (coming next)
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ACTION BUTTONS */}
          <div className="panel">
            <button onClick={resetAll}>Reset</button>
            <button onClick={() => window.location.reload()}>Exit</button>
          </div>

        </div>
      )}
    </div>
  );
}