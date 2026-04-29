import React, { useState } from "react";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("conversion");

  const renderContent = () => {
    <div className="tabs">
      <button
        className={activeTab === "conversion" ? "active" : ""}
        onClick={() => setActiveTab("conversion")}
      >
        Data Conversion
      </button>

      <button
        className={activeTab === "document" ? "active" : ""}
        onClick={() => setActiveTab("document")}
      >
        Bulk Document
      </button>

      <button
        className={activeTab === "report" ? "active" : ""}
        onClick={() => setActiveTab("report")}
      >
        AI Reports
      </button>

      <button
        className={activeTab === "custom" ? "active" : ""}
        onClick={() => setActiveTab("custom")}
      >
        Custom Services
      </button>
    </div>;
  };

  return (
    <div className="container">
      <h1 className="title">AI Automation Portal</h1>

      <div className="tabs">
        <button onClick={() => setActiveTab("conversion")}>
          Data Conversion
        </button>
        <button onClick={() => setActiveTab("document")}>Bulk Document</button>
        <button onClick={() => setActiveTab("report")}>AI Reports</button>
        <button onClick={() => setActiveTab("custom")}>Custom Services</button>
      </div>

      <div className="content">{renderContent()}</div>
    </div>
  );
}

export default App;
