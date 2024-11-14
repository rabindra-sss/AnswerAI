// src/pages/UploadPage.js
import React, { useState } from 'react';
import './UploadFile.css';

function UploadFile() {
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch('http://localhost:5000/api/parse-file', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      setParsedData(result);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-page">
      <h1>Upload the Test Paper</h1>
      <div className="upload-container">
        <input type="file" onChange={handleFileChange} className="file-input" />
        <button onClick={handleUpload} disabled={loading} className="upload-button">
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>
      
      {parsedData && (
        <div className="result-container">
          <h2>Extracted Information:</h2>
          <pre className="result">{JSON.stringify(parsedData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default UploadFile;
