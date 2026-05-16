import React, { useState, useRef } from "react";
import "./App.css";
import * as XLSX from "xlsx";

export default function DataConversion() {

  /* =========================================================
     STATES
  ========================================================= */

  const [conversionType, setConversionType] = useState("");

  const [file, setFile] = useState(null);

  const [sheetName, setSheetName] = useState("");

  const [recordCount, setRecordCount] = useState(0);

  const [columns, setColumns] = useState([]);

  const [previewData, setPreviewData] = useState([]);

  const [price, setPrice] = useState(0);

  const [agreed, setAgreed] = useState(false);

  /* VALIDATION STATES */

  const [validationStatus, setValidationStatus] = useState("");

  const [validationProgress, setValidationProgress] = useState(0);

  const [currentValidationStep, setCurrentValidationStep] = useState("");

  const [validationErrors, setValidationErrors] = useState([]);

  const [validationWarnings, setValidationWarnings] = useState([]);

  const [validationSuccess, setValidationSuccess] = useState([]);

  const [isValidating, setIsValidating] = useState(false);

  const FREE_LIMIT = 50;

  const pricingRules = [
    { min: 1, max: 50, price: 0 },
    { min: 51, max: 500, price: 99 },
    { min: 501, max: 2000, price: 299 }
  ];

  const fileInputRef = useRef();

  /* =========================================================
     FILE TYPES
  ========================================================= */

  const getAcceptedTypes = () => {

    if (
      conversionType === "excel-csv" ||
      conversionType === "excel-txt"
    ) {
      return ".xls,.xlsx";
    }

    if (conversionType === "csv-excel") {
      return ".csv";
    }

    return "*";
  };

  /* =========================================================
     VALIDATION ENGINE
  ========================================================= */

  const runValidation = async (
    workbook,
    jsonData,
    headers,
    uploadedFile
  ) => {

    setIsValidating(true);

    setValidationErrors([]);
    setValidationWarnings([]);
    setValidationSuccess([]);

    let errors = [];
    let warnings = [];
    let success = [];

    /* STEP 1 */

    setCurrentValidationStep("Checking file existence...");
    setValidationProgress(10);

    if (!uploadedFile) {
      errors.push("No file selected.");
    } else {
      //      success.push("File uploaded successfully.");
    }

    /* STEP 2 */

    setCurrentValidationStep("Checking workbook...");
    setValidationProgress(25);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (!workbook.SheetNames.length) {
      errors.push("No worksheet found.");
    } else {
      success.push(
        //        `${workbook.SheetNames.length} worksheet(s) detected.`
      );
    }

    /* STEP 3 */

    setCurrentValidationStep("Checking headers...");
    setValidationProgress(45);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (headers.length === 0) {
      errors.push("Header row missing.");
    } else {
      success.push(`${headers.length} columns detected.`);
    }

    /* DUPLICATE HEADERS */

    const duplicateHeaders = headers.filter(
      (item, index) => headers.indexOf(item) !== index
    );

    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (duplicateHeaders.length > 0) {
      warnings.push("Duplicate column headers detected.");
    }

    /* STEP 4 */

    setCurrentValidationStep("Checking records...");
    setValidationProgress(65);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (jsonData.length === 0) {
      errors.push("No data rows found.");
    } else {
      success.push(`${jsonData.length} records ready.`);
    }

    /* LARGE FILE WARNING */

    if (jsonData.length > 5000) {
      warnings.push(
        "Large file detected. Processing may take longer."
      );
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

    /* BLANK ROW CHECK */

    const blankRows = jsonData.filter((row) =>
      Object.values(row).every((value) => value === "")
    );

    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (blankRows.length > 0) {
      warnings.push(
        `${blankRows.length} blank row(s) detected.`
      );
    }

    /* STEP 5 */

    setCurrentValidationStep("Finalizing validation...");
    setValidationProgress(100);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    /* FINAL STATUS */

    if (errors.length > 0) {
      setValidationStatus("failed");
    } else if (warnings.length > 0) {
      setValidationStatus("warning");
    } else {
      setValidationStatus("success");
    }

    setValidationErrors(errors);

    setValidationWarnings(warnings);

    setValidationSuccess(success);

    setIsValidating(false);
  };

  /* =========================================================
     FILE HANDLER
  ========================================================= */

  const handleFile = (e) => {

    const f = e.target.files[0];

    if (!f) return;

    setFile({
      name: f.name,
      path: f.name
    });

    const reader = new FileReader();

    reader.onload = async (evt) => {

      try {

        const data = evt.target.result;

        const workbook = XLSX.read(data, {
          type: "binary"
        });

        const firstSheetName = workbook.SheetNames[0];

        setSheetName(firstSheetName);

        const worksheet =
          workbook.Sheets[firstSheetName];

        const jsonData =
          XLSX.utils.sheet_to_json(worksheet, {
            defval: ""
          });

        /* PREVIEW */

        setPreviewData(jsonData.slice(0, 20));

        /* HEADERS */

        let detectedHeaders = [];

        if (jsonData.length > 0) {
          detectedHeaders =
            Object.keys(jsonData[0]);

          setColumns(detectedHeaders);
        }

        /* RECORDS */

        setRecordCount(jsonData.length);

        /* PRICE */

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

        /* RUN VALIDATION */

        await runValidation(
          workbook,
          jsonData,
          detectedHeaders,
          f
        );

      } catch (error) {

        setValidationStatus("failed");

        setValidationErrors([
          "Unable to read file or invalid format."
        ]);

        setValidationWarnings([]);

        setValidationSuccess([]);
      }
    };

    reader.readAsBinaryString(f);
  };

  /* =========================================================
     RESET
  ========================================================= */

  const resetAll = () => {

    setConversionType("");

    setFile(null);

    setSheetName("");

    setRecordCount(0);

    setColumns([]);

    setPreviewData([]);

    setPrice(0);

    setAgreed(false);

    setValidationStatus("");

    setValidationProgress(0);

    setCurrentValidationStep("");

    setValidationErrors([]);

    setValidationWarnings([]);

    setValidationSuccess([]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const showPaid =
    validationStatus !== "failed" &&
    recordCount > FREE_LIMIT;

  const processingAllowed =
    validationStatus === "success" ||
    validationStatus === "warning";

  /* =========================================================
     UI
  ========================================================= */

  return (

    <div className="workspace-container">

      {/* =====================================================
          TOP DASHBOARD
      ===================================================== */}

      <div className="top-grid">

        {/* =========================================
            CONVERSION PANEL
        ========================================= */}

        <div className="dashboard-panel">

          <h3>Select Conversion Type</h3>

          <div className="radio-group">

            <label>
              <input
                type="radio"
                name="conversion"
                checked={conversionType === "excel-csv"}
                onChange={() =>
                  setConversionType("excel-csv")
                }
              />

              Excel → CSV
            </label>

            <label>
              <input
                type="radio"
                name="conversion"
                checked={conversionType === "excel-txt"}
                onChange={() =>
                  setConversionType("excel-txt")
                }
              />

              Excel → TXT
            </label>

            <label>
              <input
                type="radio"
                name="conversion"
                checked={conversionType === "csv-excel"}
                onChange={() =>
                  setConversionType("csv-excel")
                }
              />

              CSV → Excel
            </label>

          </div>

        </div>

        {/* =========================================
            UPLOAD PANEL
        ========================================= */}

        <div className="dashboard-panel">

          <h3>Upload File</h3>

          <div className="buttons">

            <button
              type="button"
              className="btn primary"
              disabled={!conversionType}
              onClick={() =>
                fileInputRef.current.click()
              }
            >
              Choose File
            </button>

            {file && (
              <button
                className="btn neutral"
                onClick={resetAll}
              >
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
                ✓ File uploaded successfully
              </p>

              <p>
                ✓ {sheetName
                  ? `Worksheet: ${sheetName}`
                  : "Worksheet detected"}
              </p>

              <p>
                ✓ {recordCount} records detected
              </p>

              <p>
                <b>File:</b> {file.path}
              </p>

            </div>
          )}

        </div>

        {/* =========================================
            VALIDATION PANEL
        ========================================= */}

        <div className="dashboard-panel validation-panel">

          <div className="validation-header">

            <h3 className="preview-title">
              Upload File Validation Status
            </h3>

            {(validationErrors.length > 0 ||
              validationWarnings.length > 0) && (

                <div className="assist-link">
                  Having issues with your import file?
                  <span>
                    {" "}
                    Request File Repair Assistance
                  </span>
                </div>
              )}

          </div>

          {/* PROGRESS */}

          {isValidating && (

            <>
              <div className="progress-bar">

                <div
                  className="progress-fill"
                  style={{
                    width: `${validationProgress}%`
                  }}
                ></div>

              </div>

              <p className="small-note">
                {currentValidationStep}
              </p>
            </>
          )}

          {/* STATUS */}

          {validationStatus && (

            <div className={`status-box ${validationStatus}`}>

              <p>
                <b>Status:</b>{" "}

                {validationStatus.toUpperCase()}
              </p>

            </div>
          )}

          {/* SUCCESS */}

          {validationSuccess.length > 0 && (

            <div>

              <h4 className="success-title">
                Success
              </h4>

              {validationSuccess.map((msg, index) => (
                <p key={index}>✓ {msg}</p>
              ))}

            </div>
          )}

          {/* WARNINGS */}

          {validationWarnings.length > 0 && (

            <div>

              <h4 className="warning-title">
                Warnings
              </h4>

              {validationWarnings.map((msg, index) => (
                <p key={index}>⚠ {msg}</p>

              ))}

            </div>
          )}

          {/* ERRORS */}

          {validationErrors.length > 0 && (

            <div>

              <h4 className="error-title">
                Errors
              </h4>

              {validationErrors.map((msg, index) => (
                <p key={index}>✖ {msg}</p>
              ))}

            </div>
          )}

        </div>

      </div>

      {/* =====================================================
          PREVIEW TABLE
      ===================================================== */}

      {previewData.length > 0 && (

        <div className="panel preview-panel">

          <h3>
            Preview Data
            <span className="small-note">
              {" "} (Max 20 records)
            </span>
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
                      <td key={col}>
                        {row[col]}
                      </td>
                    ))}

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </div>
      )}

      {/* =====================================================
          DISCLAIMER + ACTIONS
      ===================================================== */}

      {file && (

        <div className="panel">

          <div className="disclaimer-box">

            <input
              type="checkbox"
              checked={agreed}
              onChange={() =>
                setAgreed(!agreed)
              }
            />

            <label>
              I agree to the terms & disclaimer
            </label>

          </div>

          <div className="action-buttons">

            <button
              className="btn primary"
              disabled={
                !agreed ||
                !processingAllowed
              }
              onClick={() => {

                const confirmAction =
                  window.confirm(
                    "Proceed with free processing?"
                  );

                if (confirmAction) {
                  alert(
                    "Free processing started (demo)"
                  );
                }
              }}
            >

              {recordCount <= 50
                ? "Convert Data For Free"
                : "Try 50 Records Free"}

            </button>

            {showPaid && (

              <button
                className="btn secondary"
                disabled={
                  !agreed ||
                  !processingAllowed
                }
                onClick={() => {

                  const confirmAction =
                    window.confirm(
                      `Proceed with paid processing (₹${price})?`
                    );

                  if (confirmAction) {
                    alert(
                      "Paid processing started (demo)"
                    );
                  }
                }}
              >

                Convert Full Data For ₹{price}/-

              </button>
            )}

            <div className="custom-service-link">
              Need complex or customised data conversion?
            </div>

          </div>

        </div>
      )}

    </div>
  );
}