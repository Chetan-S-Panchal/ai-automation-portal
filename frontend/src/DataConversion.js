import React, { useState, useRef } from "react";
import "./App.css";
import * as XLSX from "xlsx";

export default function DataConversion() {
  const [subTab, setSubTab] = useState("manual");
  const [conversionType, setConversionType] = useState("");
  const [file, setFile] = useState(null);
  const [recordCount, setRecordCount] = useState(0);
  const [previewData, setPreviewData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [price, setPrice] = useState(0);
  const [agreed, setAgreed] = useState(false);

  const FREE_LIMIT = 50;

  const pricingRules = [
    { min: 1, max: 50, price: 0 },
    { min: 51, max: 500, price: 99 },
    { min: 501, max: 2000, price: 299 }
  ];

  const showPaid = recordCount > FREE_LIMIT;

  const fileInputRef = useRef();

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;

    setFile({
      name: f.name,
      //path: e.target.value
      path: f.name
    });

    const reader = new FileReader();

    reader.onload = (evt) => {
      const data = evt.target.result;

      const workbook = XLSX.read(data, { type: "binary" });

      const sheetName = workbook.SheetNames[0];

      const worksheet = workbook.Sheets[sheetName];

      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // RECORD COUNT
      setRecordCount(jsonData.length);

      // PREVIEW DATA (FIRST 10 ROWS)
      setPreviewData(jsonData.slice(0, 10));

      // COLUMN HEADERS
      if (jsonData.length > 0) {
        setColumns(Object.keys(jsonData[0]));
      }

      // PRICE CALCULATION
      let calculatedPrice = 0;

      pricingRules.forEach((rule) => {
        if (
          jsonData.length >= rule.min &&
          jsonData.length <= rule.max
        ) {
          calculatedPrice = rule.price;
        }
      });

      setPrice(calculatedPrice);
    };

    reader.readAsBinaryString(f);
  };

  const removeFile = () => {
    setFile(null);

    setPreviewData([]);
    setColumns([]);
    setRecordCount(0);
    setPrice(0);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const resetAll = () => {
    setFile(null);
    setConversionType("");
    setAgreed(false);

    setPreviewData([]);
    setColumns([]);
    setRecordCount(0);
    setPrice(0);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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

            <h3 className="preview-title">
              Select Data Conversion Type
            </h3>

            <label>
              <input type="radio" name="conversion" checked={conversionType === "excel-csv"} onChange={() => setConversionType("excel-csv")} />
              Excel → CSV (Convert Excel to CSV)
            </label>

            <label>
              <input type="radio" name="conversion" checked={conversionType === "excel-txt"} onChange={() => setConversionType("excel-txt")} />
              Excel → TXT (Convert Excel to Text)
            </label>

            <label>
              <input type="radio" name="conversion" checked={conversionType === "csv-excel"} onChange={() => setConversionType("csv-excel")} />
              CSV → Excel (Convert CSV to Excel)
            </label>

          </div>

          {/* FILE UPLOAD */}
          {conversionType && (
            <div className="panel">

              <button
                type="button"
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
                    <p>
                      <b>No. of Records:</b> {recordCount}
                      <span className="small-note">
                        {" "} (1st Row Considered as Header row excluded in Row Count)
                      </span>
                    </p>
                  </div>

                  <button className="btn neutral" onClick={removeFile}>
                    Remove File
                  </button>
                </>
              )}

            </div>
          )}
          {/* DATA PREVIEW */}
          {previewData.length > 0 && (
            <div className="panel">

              <h3 className="preview-title">
                Preview Data
                <span className="small-note"> (Max 20 records)</span>
              </h3>

              <div className="table-container">

                <table className="preview-table">

                  <thead>
                    <tr>
                      {columns.map((col) => (
                        <th key={col}>{col}</th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {previewData.map((row, index) => (
                      <tr key={index}>
                        {columns.map((col) => (
                          <td key={col}>{row[col]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>
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
                  Convert full data for Rs.{price}/-
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