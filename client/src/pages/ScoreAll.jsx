import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ScoreAll = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [scores, setScores] = useState({});  // Stores scores for answers by answerId

  // Fetch all questions on component mount
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('/questions');
        setQuestions(response.data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };
    fetchQuestions();
  }, []);

  // Fetch answers for the selected question
  useEffect(() => {
    if (selectedQuestion) {
      const fetchAnswers = async () => {
        try {
          const response = await axios.get(`/questions/${selectedQuestion}/answers`);
          setAnswers(response.data);
        } catch (error) {
          console.error("Error fetching answers:", error);
        }
      };
      fetchAnswers();
    }
  }, [selectedQuestion]);

  // Handle fetching score for a specific answer
  const fetchScore = async (answerId) => {
    try {
      const response = await axios.get(`/answers/${answerId}/score`);
      setScores(prevScores => ({
        ...prevScores,
        [answerId]: response.data.score
      }));
    } catch (error) {
      console.error("Error fetching score:", error);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Left Panel - Questions List */}
      <div style={{ flex: 1, borderRight: '1px solid #ddd', padding: '20px' }}>
        <h2>Questions</h2>
        <ul>
          {questions.map((question) => (
            <li key={question.id} onClick={() => setSelectedQuestion(question.id)} style={{ cursor: 'pointer', marginBottom: '10px' }}>
              {question.title}
            </li>
          ))}
        </ul>
      </div>

      {/* Right Panel - Answers for Selected Question */}
      <div style={{ flex: 2, padding: '20px' }}>
        <h2>Answers</h2>
        {selectedQuestion && answers.length === 0 && <p>No answers available for this question.</p>}
        {answers.map((answer) => (
          <div key={answer.id} style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px', marginBottom: '10px' }}>
            <p><strong>Answer:</strong> {answer.text}</p>
            <p><strong>By:</strong> {answer.studentName}</p>
            <button onClick={() => fetchScore(answer.id)}>
              Get Score
            </button>
            {scores[answer.id] !== undefined && <p>Score: {scores[answer.id]}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScoreAll;
