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
  const [sheetName, setSheetName] = useState("");


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

      const firstSheetName = workbook.SheetNames[0];

      setSheetName(firstSheetName);

      const worksheet = workbook.Sheets[firstSheetName];

      

      //const jsonData = XLSX.utils.sheet_to_json(worksheet);
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        defval: ""
      });

      // RECORD COUNT
      setRecordCount(jsonData.length);

      // PREVIEW DATA (FIRST 10 ROWS)
      setPreviewData(jsonData.slice(0, 20));

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
    setSheetName("");

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
    setSheetName("");

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

              <div className="buttons">

                <button
                  type="button"
                  className="btn primary"
                  onClick={() => fileInputRef.current.click()}
                >
                  Choose File
                </button>

                {file && (
                  <button className="btn neutral" onClick={removeFile}>
                    Remove File
                  </button>
                )}

              </div>

              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFile}
                accept={getAcceptedTypes()}
              />

              {file && (
                <div className="file-info">
                  <p>
                    <b>Import File:</b> {file.path}

                    {sheetName && (
                      <span className="small-note">
                        {" "} (Worksheet: {sheetName})
                      </span>
                    )}
                  </p>

                  <p>
                    <b>No. of Records:</b> {recordCount}
                    <span className="small-note">
                      {" "} (1st Row Considered as Header row excluded in Row Count)
                    </span>
                  </p>
                </div>
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
              {/* DISCLAIMER */}
              <div className="disclaimer-box">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={() => setAgreed(!agreed)}
                />

                <label>
                  I have read and agree to the terms & disclaimer
                </label>
              </div>

              <div className="disclaimer-text">

                <p className="disclaimer-heading">
                  IMPORT FILE — GENERAL GUIDELINES
                </p>

                <p>
                  • The uploaded file must match the selected conversion type and format.
                </p>

                <p>
                  • Users are responsible for verifying the correctness and completeness of the data before upload.
                </p>

                <p>
                  • Files containing invalid structure, unreadable content, unsupported formatting, or improper data arrangement may not be processed correctly.
                </p>

                <p>
                  • Password protected, encrypted, locked, or restricted files are not supported.
                </p>

                <p>
                  • Ensure that required data reading areas, rows, columns, and cells are accessible and not protected.
                </p>

                <p>
                  • The uploaded file may be automatically deleted from the system after processing completion or session exit.
                </p>

                <p className="disclaimer-heading">
                  EXCEL FILE SPECIFIC GUIDELINES
                </p>

                <p>
                  • Only the first worksheet of the Excel file will be considered for data conversion.
                </p>

                <p>
                  • Additional sheets/tabs within the workbook will be ignored.
                </p>

                <p>
                  • The first row of the worksheet will be treated as column headers and excluded from record count.
                </p>

                <p>
                  • Proper and meaningful column headers are recommended for accurate processing.
                </p>

                <p className="disclaimer-heading">
                  OUTPUT FILE & LIABILITY DISCLAIMER
                </p>

                <p>
                  • Output files are generated automatically by the system based on uploaded data and selected conversion options.
                </p>

                <p>
                  • Users must independently verify the accuracy, completeness, formatting, and usability of the generated output before official or commercial use.
                </p>

                <p>
                  • We do not guarantee error-free processing for all file structures, formats, or data conditions.
                </p>

                <p>
                  • We shall not be responsible or liable for any direct, indirect, commercial, financial, technical, operational, or personal loss/damage arising from use of the generated output files.
                </p>

                <p>
                  • Uploading confidential, regulated, financial, legal, medical, or sensitive data is solely at the user's discretion and responsibility.
                </p>

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