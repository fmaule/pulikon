import JSZip from "jszip";
import { type ChangeEvent, type DragEvent, useRef, useState } from "react";
import "./FileUpload.css";

interface ZipFileEntry {
  name: string;
  size: number;
}

interface InstagramUser {
  username: string;
  url: string;
}

interface FollowersDiff {
  notFollowingBack: InstagramUser[]; // You follow them, but they don't follow you
  notFollowedBack: InstagramUser[]; // They follow you, but you don't follow them
  mutual: InstagramUser[]; // Both follow each other
}

const MAX_FILE_SIZE = 1024 * 1024; // 1MB in bytes

export function FileUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [zipContents, setZipContents] = useState<ZipFileEntry[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [diff, setDiff] = useState<FollowersDiff | null>(null);
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

  const parseFollowing = (jsonData: {
    relationships_following: Array<{
      title: string;
      string_list_data?: Array<{ href: string; value?: string }>;
    }>;
  }): InstagramUser[] => {
    if (!jsonData.relationships_following) return [];
    return jsonData.relationships_following.map((item) => ({
      username: item.title || item.string_list_data?.[0]?.value || "",
      url: item.string_list_data?.[0]?.href || "",
    }));
  };

  const parseFollowers = (
    jsonData: Array<{
      string_list_data?: Array<{ href: string; value: string }>;
    }>
  ): InstagramUser[] => {
    if (!Array.isArray(jsonData)) return [];
    return jsonData.map((item) => ({
      username: item.string_list_data?.[0]?.value || "",
      url: item.string_list_data?.[0]?.href || "",
    }));
  };

  const calculateDiff = (
    following: InstagramUser[],
    followers: InstagramUser[]
  ): FollowersDiff => {
    const followersMap = new Set(followers.map((u) => u.username));
    const followingMap = new Set(following.map((u) => u.username));

    const notFollowingBack = following.filter(
      (u) => !followersMap.has(u.username)
    );
    const notFollowedBack = followers.filter(
      (u) => !followingMap.has(u.username)
    );
    const mutual = following.filter((u) => followersMap.has(u.username));

    return {
      notFollowingBack,
      notFollowedBack,
      mutual,
    };
  };

  const processFile = async (file: File) => {
    // Reset state
    setError(null);
    setZipContents([]);
    setFileName(null);
    setDiff(null);

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
      let followingData: InstagramUser[] = [];
      let followersData: InstagramUser[] = [];

      // Extract file information and Instagram data
      for (const [relativePath, zipEntry] of Object.entries(zipData.files)) {
        if (!zipEntry.dir) {
          const data = await zipEntry.async("uint8array");
          entries.push({
            name: relativePath,
            size: data.length,
          });

          // Check for Instagram JSON files
          if (
            relativePath ===
            "connections/followers_and_following/following.json"
          ) {
            const text = await zipEntry.async("text");
            const json = JSON.parse(text);
            followingData = parseFollowing(json);
          } else if (
            relativePath ===
            "connections/followers_and_following/followers_1.json"
          ) {
            const text = await zipEntry.async("text");
            const json = JSON.parse(text);
            followersData = parseFollowers(json);
          }
        }
      }

      if (entries.length === 0) {
        setError("The ZIP file is empty");
      } else {
        setZipContents(entries);

        // Calculate diff if we found both files
        if (followingData.length > 0 && followersData.length > 0) {
          const diffResult = calculateDiff(followingData, followersData);
          setDiff(diffResult);
        } else if (followingData.length === 0 && followersData.length === 0) {
          setError(
            "Could not find Instagram data files (following.json and followers_1.json) in the expected location"
          );
        }
      }
    } catch (err) {
      setError(
        "Failed to read ZIP file. Please ensure it's a valid Instagram export ZIP archive"
      );
      console.error("ZIP processing error:", err);
    } finally {
      setIsProcessing(false);
    }
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
            <p>Processing Instagram data...</p>
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
            <p className="upload-hint">
              Instagram export ZIP files only (max 1MB)
            </p>
          </div>
        )}
      </button>

      {error && (
        <div className="message error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      {fileName && zipContents.length > 0 && !error && (
        <div className="message success-message">
          <strong>Success!</strong> Uploaded {fileName} with{" "}
          {zipContents.length} {zipContents.length === 1 ? "file" : "files"}
        </div>
      )}

      {diff && (
        <div className="followers-diff">
          <h2>Followers Analysis</h2>

          <div className="diff-section not-following-back">
            <h3>
              <span className="emoji">😔</span> Not Following You Back (
              {diff.notFollowingBack.length})
            </h3>
            <p className="section-description">
              You follow them, but they don't follow you back
            </p>
            {diff.notFollowingBack.length > 0 ? (
              <div className="user-list">
                {diff.notFollowingBack.map((user) => (
                  <a
                    key={user.username}
                    href={user.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="user-item"
                  >
                    <span className="username">@{user.username}</span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-label="External link"
                    >
                      <title>Open Instagram profile</title>
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                ))}
              </div>
            ) : (
              <p className="empty-message">
                Everyone you follow is following you back! 🎉
              </p>
            )}
          </div>

          <div className="diff-section not-followed-back">
            <h3>
              <span className="emoji">👥</span> Your Followers (
              {diff.notFollowedBack.length})
            </h3>
            <p className="section-description">
              They follow you, but you don't follow them back
            </p>
            {diff.notFollowedBack.length > 0 ? (
              <div className="user-list">
                {diff.notFollowedBack.map((user) => (
                  <a
                    key={user.username}
                    href={user.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="user-item"
                  >
                    <span className="username">@{user.username}</span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-label="External link"
                    >
                      <title>Open Instagram profile</title>
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                ))}
              </div>
            ) : (
              <p className="empty-message">
                You follow all of your followers! ✨
              </p>
            )}
          </div>

          <div className="diff-section mutual">
            <h3>
              <span className="emoji">💚</span> Mutual Followers (
              {diff.mutual.length})
            </h3>
            <p className="section-description">
              You follow each other - the real connections!
            </p>
            {diff.mutual.length > 0 ? (
              <div className="user-list">
                {diff.mutual.map((user) => (
                  <a
                    key={user.username}
                    href={user.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="user-item"
                  >
                    <span className="username">@{user.username}</span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-label="External link"
                    >
                      <title>Open Instagram profile</title>
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                ))}
              </div>
            ) : (
              <p className="empty-message">No mutual followers found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
