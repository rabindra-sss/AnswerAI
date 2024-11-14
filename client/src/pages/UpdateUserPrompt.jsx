import React, { useState } from 'react';
import axios from 'axios';

const UpdateUserPrompt = () => {
    const [userPrompt, setUserPrompt] = useState('');
    const [response, setResponse] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/update-user-prompt', { userPrompt });
            setResponse(res.data.result);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Update User Prompt</h2>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    rows={6}
                    cols={50}
                    placeholder="Enter the user prompt"
                    required
                />
                <br />
                <button type="submit">Update User Prompt</button>
            </form>
            {response && (
                <div>
                    <h3>Generated Response:</h3>
                    <pre>{response}</pre>
                </div>
            )}
        </div>
    );
};

export default UpdateUserPrompt;
