// ScoreTestpaper.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ScoreTestpapers() {
    const [testpapers, setTestpapers] = useState([]);
    const [selectedTestpaperId, setSelectedTestpaperId] = useState(null);
    const [scores, setScores] = useState([]);

    useEffect(() => {
        const fetchTestpapers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/testpaper/get-testpapers');
                setTestpapers(response.data);
            } catch (error) {
                console.error('Error fetching testpapers:', error);
            }
        };
        fetchTestpapers();
    }, []);

    const handleScoreTestpaper = async (testpaperId) => {
        setSelectedTestpaperId(testpaperId);
        try {
            const response = await axios.get(`http://localhost:5000/api/testpaper/score-testpaper/${testpaperId}`);
            setScores(response.data);
        } catch (error) {
            console.error('Error fetching scores:', error);
        }
    };

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <div style={{ flex: 1, padding: '20px', borderRight: '1px solid #ccc', overflowY: 'auto' }}>
                <h2>Test Papers</h2>
                {testpapers.map((testpaper) => (
                    <div key={testpaper._id} style={{ marginBottom: '10px' }}>
                        <h3>Subject: {testpaper.subject}</h3>
                        <p>Standard: {testpaper.standard}</p>
                        <button onClick={() => handleScoreTestpaper(testpaper.testpaperId)}>
                            Score the Paper
                        </button>
                    </div>
                ))}
            </div>

            <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
                <h2>Scores</h2>
                {scores.length === 0 && selectedTestpaperId && (
                    <p>Select a test paper and click "Score the Paper" to view scores.</p>
                )}
                {scores.length > 0 && (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Student ID</th>
                                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Name</th>
                                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Total Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {scores.map((score, index) => (
                                <tr key={index}>
                                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>{score.studentId}</td>
                                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>{score.name}</td>
                                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>{score.totalScore}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default ScoreTestpapers;
