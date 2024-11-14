import React, { useState } from 'react';
import axios from 'axios';

const UpdateBasePrompt = () => {
    const [basePrompt, setBasePrompt] = useState('');
    const [response, setResponse] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/update-base-prompt', { basePrompt });
            setResponse(res.data.result);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Update Base Prompt</h2>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={basePrompt}
                    onChange={(e) => setBasePrompt(e.target.value)}
                    rows={6}
                    cols={50}
                    placeholder="Enter the base prompt"
                    required
                />
                <br />
                <button type="submit">Update Base Prompt</button>
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

export default UpdateBasePrompt;
