import JSZip from "jszip";
import { type ChangeEvent, type DragEvent, useRef, useState } from "react";
import "./FileUpload.css";

interface InstagramUser {
  username: string;
  url: string;
}

interface FollowersDiff {
  notFollowingBack: InstagramUser[]; // You follow them, but they don't follow you
  notFollowedBack: InstagramUser[]; // They follow you, but you don't follow them
  mutual: InstagramUser[]; // Both follow each other
}

interface StoredBaseline {
  timestamp: number;
  followers: string[];
  following: string[];
}

interface FollowerChanges {
  newUnfollows: InstagramUser[];
  newFollowers: InstagramUser[];
  youUnfollowed: InstagramUser[];
  newMutual: InstagramUser[];
}

const MAX_FILE_SIZE = 1024 * 1024; // 1MB in bytes
const BASELINE_KEY = "instagram_baseline";

export function FileUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [diff, setDiff] = useState<FollowersDiff | null>(null);
  const [baseline, setBaseline] = useState<StoredBaseline | null>(null);
  const [changes, setChanges] = useState<FollowerChanges | null>(null);
  const [currentData, setCurrentData] = useState<{
    followers: InstagramUser[];
    following: InstagramUser[];
  } | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
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

  const loadBaseline = (): StoredBaseline | null => {
    try {
      const stored = localStorage.getItem(BASELINE_KEY);
      if (stored) {
        return JSON.parse(stored) as StoredBaseline;
      }
    } catch (err) {
      console.error("Failed to load baseline:", err);
    }
    return null;
  };

  const saveBaseline = (
    followers: InstagramUser[],
    following: InstagramUser[]
  ): boolean => {
    try {
      const baseline: StoredBaseline = {
        timestamp: Date.now(),
        followers: followers.map((u) => u.username),
        following: following.map((u) => u.username),
      };
      localStorage.setItem(BASELINE_KEY, JSON.stringify(baseline));
      return true;
    } catch (err) {
      console.error("Failed to save baseline:", err);
      return false;
    }
  };

  const clearBaseline = (): void => {
    try {
      localStorage.removeItem(BASELINE_KEY);
      setBaseline(null);
      setChanges(null);
      setSaveMessage("Baseline cleared");
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err) {
      console.error("Failed to clear baseline:", err);
    }
  };

  const calculateChanges = (
    currentFollowers: InstagramUser[],
    currentFollowing: InstagramUser[],
    baseline: StoredBaseline
  ): FollowerChanges => {
    const baselineFollowersSet = new Set(baseline.followers);
    const baselineFollowingSet = new Set(baseline.following);

    const currentFollowersSet = new Set(
      currentFollowers.map((u) => u.username)
    );
    const currentFollowingSet = new Set(
      currentFollowing.map((u) => u.username)
    );

    // New unfollows: people who were following you but aren't anymore
    const newUnfollows = currentFollowers.filter(
      (u) => !baselineFollowersSet.has(u.username)
    );

    // New followers: people following you now who weren't before
    const newFollowers = currentFollowers.filter(
      (u) =>
        baselineFollowersSet.has(u.username) &&
        !currentFollowersSet.has(u.username)
    );

    // You unfollowed: people you were following but aren't anymore
    const youUnfollowed = currentFollowing.filter(
      (u) =>
        baselineFollowingSet.has(u.username) &&
        !currentFollowingSet.has(u.username)
    );

    // New mutual: people who are now mutual but weren't before
    const newMutual = currentFollowing.filter(
      (u) =>
        currentFollowersSet.has(u.username) &&
        baselineFollowingSet.has(u.username) &&
        !baselineFollowersSet.has(u.username)
    );

    return {
      newUnfollows,
      newFollowers,
      youUnfollowed,
      newMutual,
    };
  };

  const handleSaveBaseline = (): void => {
    if (!currentData) return;

    const success = saveBaseline(currentData.followers, currentData.following);
    if (success) {
      const newBaseline = loadBaseline();
      setBaseline(newBaseline);
      setChanges(null);
      setSaveMessage("Baseline saved successfully!");
      setTimeout(() => setSaveMessage(null), 3000);
    } else {
      setSaveMessage("Failed to save baseline");
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  const processFile = async (file: File) => {
    // Reset state
    setError(null);
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

    try {
      const zip = new JSZip();
      const zipData = await zip.loadAsync(file);

      let followingData: InstagramUser[] = [];
      let followersData: InstagramUser[] = [];
      let fileCount = 0;

      // Extract file information and Instagram data
      for (const [relativePath, zipEntry] of Object.entries(zipData.files)) {
        if (!zipEntry.dir) {
          fileCount++;

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

      if (fileCount === 0) {
        setError("The ZIP file is empty");
      } else if (followingData.length > 0 && followersData.length > 0) {
        // Calculate diff if we found both files
        const diffResult = calculateDiff(followingData, followersData);
        setDiff(diffResult);

        // Load existing baseline
        const existingBaseline = loadBaseline();
        setBaseline(existingBaseline);

        // Save current data
        setCurrentData({
          followers: followersData,
          following: followingData,
        });

        // If baseline exists, calculate changes
        if (existingBaseline) {
          const followerChanges = calculateChanges(
            followersData,
            followingData,
            existingBaseline
          );
          setChanges(followerChanges);
        } else {
          // No baseline exists, auto-save first upload
          const success = saveBaseline(followersData, followingData);
          if (success) {
            const newBaseline = loadBaseline();
            setBaseline(newBaseline);
            setSaveMessage("First upload saved as baseline");
            setTimeout(() => setSaveMessage(null), 3000);
          }
        }
      } else if (followingData.length === 0 && followersData.length === 0) {
        setError(
          "Could not find Instagram data files (following.json and followers_1.json) in the expected location"
        );
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

      {saveMessage && <div className="message info-message">{saveMessage}</div>}

      {changes && baseline && (
        <div className="changes-section">
          <h2>Changes Since Last Upload</h2>
          <p className="baseline-timestamp">
            Baseline from: {new Date(baseline.timestamp).toLocaleString()}
          </p>

          <div className="baseline-actions">
            <button
              type="button"
              onClick={handleSaveBaseline}
              className="save-baseline-btn"
            >
              Save as New Baseline
            </button>
            <button
              type="button"
              onClick={clearBaseline}
              className="clear-baseline-btn"
            >
              Clear Baseline
            </button>
          </div>

          <div className="followers-diff">
            {changes.newUnfollows.length > 0 && (
              <div className="diff-section new-unfollows">
                <h3>
                  People Who Unfollowed You ({changes.newUnfollows.length})
                </h3>
                <div className="user-list">
                  {changes.newUnfollows.map((user) => (
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
              </div>
            )}

            {changes.newFollowers.length > 0 && (
              <div className="diff-section new-followers">
                <h3>New Followers ({changes.newFollowers.length})</h3>
                <div className="user-list">
                  {changes.newFollowers.map((user) => (
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
              </div>
            )}

            {changes.youUnfollowed.length > 0 && (
              <div className="diff-section you-unfollowed">
                <h3>People You Unfollowed ({changes.youUnfollowed.length})</h3>
                <div className="user-list">
                  {changes.youUnfollowed.map((user) => (
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
              </div>
            )}

            {changes.newMutual.length > 0 && (
              <div className="diff-section new-mutual">
                <h3>New Mutual Followers ({changes.newMutual.length})</h3>
                <div className="user-list">
                  {changes.newMutual.map((user) => (
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
              </div>
            )}
          </div>
        </div>
      )}

      {diff && (
        <div className="current-snapshot">
          <h2>Current Snapshot</h2>
          <div className="followers-diff">
            <div className="diff-section not-following-back">
              <h3>Not Following You Back ({diff.notFollowingBack.length})</h3>
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
              <h3>Your Followers ({diff.notFollowedBack.length})</h3>
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
              <h3>Mutual Followers ({diff.mutual.length})</h3>
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
        </div>
      )}
    </div>
  );
}
