import React, { useState } from 'react';
import axios from 'axios';

const TestScore = () => {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Handle file input change for file1
  const handleFile1Change = (e) => {
    const file = e.target.files[0];
    setFile1(file);
  };

  // Handle file input change for file2
  const handleFile2Change = (e) => {
    const file = e.target.files[0];
    setFile2(file);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file1 || !file2) {
      setError('Please select both files.');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file1', file1);
    formData.append('file2', file2);

    try { 
      const response = await axios.post('http://localhost:5000/api/score-test', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(response.data.result);
    } catch (err) {
      console.error(err);
      setError('An error occurred while processing the files.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Score Test</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="file1">File 1:</label>
          <input type="file" id="file1" onChange={handleFile1Change} />
        </div>
        <div>
          <label htmlFor="file2">File 2:</label>
          <input type="file" id="file2" onChange={handleFile2Change} />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Submit'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {result && (
        <div>
          <h3>Results:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default TestScore;
