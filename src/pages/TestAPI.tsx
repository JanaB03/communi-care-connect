// src/pages/TestAPI.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TestAPI = () => {
  const [status, setStatus] = useState('Testing...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test basic connection
        const response = await axios.get('https://communi-care-connect.onrender.com');
        setStatus('Connection successful!');
        console.log('Response:', response.data);

        // Test API route
        const apiResponse = await axios.get('https://communi-care-connect.onrender.com/api/auth/test');
        console.log('API Response:', apiResponse.data);
      } catch (err: any) {
        console.error('Connection error:', err);
        setError(err.message);
        setStatus('Connection failed');
      }
    };

    testConnection();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>API Connection Test</h1>
      <p>Status: {status}</p>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </div>
  );
};

export default TestAPI;