import React, { useState } from 'react';
import axios from 'axios';

const UploadCertificate = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState({
    file_hash: '',
    name: '',
    certificate_name: '',
    organization_name: ''
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setResult({
      file_hash: '',
      name: '',
      certificate_name: '',
      organization_name: ''
    });
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
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const data = response.data;
      setResult({
        file_hash: data.file_hash || 'No hash returned',
        name: data.name || 'Not detected',
        certificate_name: data.certificate_name || 'Not detected',
        organization_name: data.organization_name || 'Not detected'
      });

    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Certificate Hash & OCR Extractor</h2>
      <input type="file" onChange={handleFileChange} accept=".pdf,image/*" />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? 'Uploading...' : 'Upload & Process'}
      </button>

      {result.file_hash && (
        <div className="result-section">
          <h3>Extracted Information:</h3>
          <p><strong>SHA-256 Hash:</strong> {result.file_hash}</p>
          <p><strong>Organization Name:</strong> {result.organization_name}</p>
          <p><strong>Certificate Name:</strong> {result.certificate_name}</p>
          <p><strong>Name:</strong> {result.name}</p>
        </div>
      )}
    </div>
  );
};

export default UploadCertificate;
