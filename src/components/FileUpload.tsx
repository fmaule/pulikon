import JSZip from "jszip";
import { type ChangeEvent, type DragEvent, useRef, useState } from "react";
import "./FileUpload.css";

interface ZipFileEntry {
  name: string;
  size: number;
}

const MAX_FILE_SIZE = 1024 * 1024; // 1MB in bytes

export function FileUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [zipContents, setZipContents] = useState<ZipFileEntry[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const processFile = async (file: File) => {
    // Reset state
    setError(null);
    setZipContents([]);
    setFileName(null);

    // Validate file type
    if (!file.name.toLowerCase().endsWith(".zip")) {
      setError("Please upload a ZIP file");
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      setError(`File is too large (${sizeMB}MB). Maximum size is 1MB`);
      return;
    }

    setIsProcessing(true);
    setFileName(file.name);

    try {
      const zip = new JSZip();
      const zipData = await zip.loadAsync(file);

      const entries: ZipFileEntry[] = [];

      // Extract file information
      for (const [relativePath, zipEntry] of Object.entries(zipData.files)) {
        if (!zipEntry.dir) {
          const data = await zipEntry.async("uint8array");
          entries.push({
            name: relativePath,
            size: data.length,
          });
        }
      }

      if (entries.length === 0) {
        setError("The ZIP file is empty");
      } else {
        setZipContents(entries);
      }
    } catch (err) {
      setError(
        "Failed to read ZIP file. Please ensure it's a valid ZIP archive"
      );
      console.error("ZIP processing error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / k ** i).toFixed(2)} ${sizes[i]}`;
  };

  return (
    <div className="file-upload-container">
      <button
        type="button"
        className={`upload-zone ${isDragging ? "dragging" : ""} ${isProcessing ? "processing" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        disabled={isProcessing}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".zip"
          onChange={handleFileInput}
          style={{ display: "none" }}
        />

        {isProcessing ? (
          <div className="upload-message">
            <div className="spinner" />
            <p>Processing ZIP file...</p>
          </div>
        ) : (
          <div className="upload-message">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-label="Upload icon"
            >
              <title>Upload</title>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <p>
              <strong>Click to upload</strong> or drag and drop
            </p>
            <p className="upload-hint">ZIP files only (max 1MB)</p>
          </div>
        )}
      </button>

      {error && (
        <div className="message error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      {fileName && zipContents.length > 0 && (
        <div className="message success-message">
          <strong>Success!</strong> Uploaded {fileName} with{" "}
          {zipContents.length} {zipContents.length === 1 ? "file" : "files"}
        </div>
      )}

      {zipContents.length > 0 && (
        <div className="zip-contents">
          <h3>ZIP Contents ({zipContents.length} files)</h3>
          <div className="file-list">
            {zipContents.map((entry) => (
              <div key={entry.name} className="file-entry">
                <span className="file-name">{entry.name}</span>
                <span className="file-size">{formatFileSize(entry.size)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
