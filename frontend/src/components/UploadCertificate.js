 import React, { useState } from 'react';
import axios from 'axios';

const UploadCertificate = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [hash, setHash] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setHash('');
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a certificate file.');
      return;
    }

    const formData = new FormData();
    formData.append('certificate', selectedFile);

    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/certificates/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setHash(response.data.file_hash || 'No hash returned');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Certificate Hash Creator</h2>
      <input type="file" onChange={handleFileChange} accept=".pdf,image/*" />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? 'Uploading...' : 'Upload & Generate Hash'}
      </button>
      {hash && (
        <div className="hash-result">
          <h3>SHA-256 Hash:</h3>
          <p>{hash}</p>
        </div>
      )}
    </div>
  );
};

export default UploadCertificate;
