import React, { useState } from 'react';
import axios from 'axios';
import './Score.css'; // Import the CSS file

function QuestionAnswerScorer() {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [score, setScore] = useState(null);
    const [why, setWhy]= useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setScore(null);

        try {
            const response = await axios.post('http://localhost:5000/api/score', {
                question,
                answer,
            });
            setScore(response.data.score);
            setWhy(response.data.why);
        } catch (error) {
            setError('Error scoring the answer.');
        } finally {
            setLoading(false);
        }

    };

    const handleAnswerChange = (e) => {
        const { value } = e.target;
        setAnswer(value);
        autoResizeTextarea(e.target);
    };

    const autoResizeTextarea = (textarea) => {
        textarea.style.height = 'auto'; // Reset height
        textarea.style.height = `${textarea.scrollHeight}px`; // Set to scroll height
    };


    return (
        <div className="scorer-container">
            <h1>Question-Answer Scorer</h1>
            <form onSubmit={handleSubmit} className="scorer-form">
                <div className="form-group">
                    <label>Question:</label>
                    <input
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Answer:</label>
                    <textarea
                        value={answer}
                        onChange={handleAnswerChange}
                        required
                    ></textarea>
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Scoring...' : 'Submit'}
                </button>
            </form>

            {score && (
                <div className="score-result">
                    <h2>AI Score: {score}/10</h2>
                    <h3>Why: {why}</h3>
                </div>

            )}

            {error && (
                <div className="error-message">
                    <h2>{error}</h2>
                </div>
            )}
        </div>
    );
}

export default QuestionAnswerScorer;
