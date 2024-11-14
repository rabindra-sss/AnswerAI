import React, { useState } from 'react';
import axios from 'axios';
import './CompareScoring.css';

const CompareScoring = () => {
  // State for single-file upload
  const [singleFile, setSingleFile] = useState(null);
  const [singleFileResult, setSingleFileResult] = useState(null);
  const [isSingleFileLoading, setIsSingleFileLoading] = useState(false);

  // Handler for single-file upload form submission
  const handleSingleFileSubmit = async (e) => {
    e.preventDefault();
    setIsSingleFileLoading(true);

    const formData = new FormData();
    formData.append('file', singleFile);

    try {
      const response = await axios.post('https://answerai-faon.onrender.com/api/score-test-file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSingleFileResult(response.data.result);
    } catch (error) {
      console.error('Error scoring single file:', error);
    } finally {
      setIsSingleFileLoading(false);
    }
  };

  // Function to render results in a new tab
  const handleViewResults = (result) => {
    // Open a new tab
    const newTab = window.open();
    newTab.document.write('<html><head><title>Scoring Results</title></head><body>');
    newTab.document.write('<h2>Scoring Results</h2>');

    // Add download button
    newTab.document.write('<button id="downloadCSV">Download as CSV</button>');

    // Create table structure in new tab
    newTab.document.write(
      '<table border="1"><thead><tr><th>Question Sequence</th><th>Question Text</th><th>Question Number</th><th>Options</th><th>Answer</th><th>Surity</th></tr></thead><tbody>'
    );
    result.forEach((item) => {
      newTab.document.write(
        `<tr>
          <td>${item.questionSequence}</td>
          <td>${item.questionText}</td>
          <td>${item.questionNumber}</td>
          <td>${item.option}</td>
          <td>${item.answer}</td>
          <td>${item.surity}</td>
        </tr>`
      );
    });
    newTab.document.write('</tbody></table>');

    // Add CSV download functionality
    newTab.document.getElementById('downloadCSV').addEventListener('click', () => {
      const csvHeaders = ['Question Sequence', 'Question Text', 'Question Number', 'Options', 'Answer', 'Surity'];
      const csvRows = result.map((row) => [
        row.QuestionSequence,
        `"${row.QuestionText}"`,
        row.QuestionNumber,
        row.option,
        row.answer,
        row.surity,
      ]);

      const csvContent = [
        csvHeaders.join(','),
        ...csvRows.map((row) => row.join(',')),
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'scoring_results.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });

    newTab.document.write('</body></html>');
  };

  return (
    <>
      <div className="test-scoring-container">
        {/* Section for Single-File Upload */}
        <div className="section">
          <h2>Upload Single File (Questions & Answers)</h2>
          <form onSubmit={handleSingleFileSubmit}>
            <div>
              <label>Test & Answer File:</label>
              <input type="file" onChange={(e) => setSingleFile(e.target.files[0])} required />
            </div>
            <button type="submit" disabled={isSingleFileLoading} className={isSingleFileLoading ? 'loading-button' : ''}>
              {isSingleFileLoading ? 'Scoring...' : 'Score Test'}
            </button>
          </form>
          {singleFileResult && (
            <div className="result">
              <h3>Scoring Result</h3>
              <button onClick={() => handleViewResults(singleFileResult)}>See the result in table</button>
              {/* <pre className="result">{JSON.stringify(singleFileResult, null, 2)}</pre> */}
              </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CompareScoring;
