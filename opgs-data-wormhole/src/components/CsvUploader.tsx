import React, { useRef } from 'react';

interface CsvUploaderProps {
  onUpload: (file: File) => void;
  onReset: () => void;
  hasCustomData: boolean;
}

export const CsvUploader: React.FC<CsvUploaderProps> = ({ onUpload, onReset, hasCustomData }) => {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
  };

  return (
    <div className="csv-uploader">
      <span className="upload-hint">
        {hasCustomData ? (
          <>
            <span className="upload-badge upload-badge--custom">Custom data loaded</span>
            <button className="btn-link" onClick={onReset}>
              Reset to sample data
            </button>
          </>
        ) : (
          <span className="upload-badge upload-badge--sample">Showing sample data</span>
        )}
      </span>
      <button
        className="btn-upload"
        onClick={() => fileRef.current?.click()}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={16} height={16}>
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        Upload CSV
      </button>
      <input
        ref={fileRef}
        type="file"
        accept=".csv"
        style={{ display: 'none' }}
        onChange={handleChange}
      />
    </div>
  );
};
