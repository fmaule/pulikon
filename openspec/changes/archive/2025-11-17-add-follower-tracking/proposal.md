# Change: Add Follower Tracking with localStorage

## Why
Users want to detect changes in their Instagram followers over time - specifically who unfollowed them, who started following them, and who remains mutual. Currently, each ZIP upload shows a static snapshot. By saving the previous state to localStorage, we can compare uploads and show deltas (new unfollows, new followers, etc.).

## What Changes
Add follower tracking functionality that:
- Saves the current followers/following lists to browser localStorage after each upload
- On subsequent uploads, compares the new data with the saved baseline
- Shows a "Changes Since Last Upload" section highlighting:
  - **New Unfollows**: People who were mutual/following you before but unfollowed since
  - **New Followers**: People who weren't following you before but are now
  - **Lost Follows**: People you were following before but aren't anymore (you unfollowed them)
  - **New Mutual**: People who became mutual since last check
- Provides a "Save as Baseline" button to update the stored reference point
- Stores data with timestamps for tracking history
- Handles cases where no previous data exists (first upload)

## Implementation Approach

### localStorage Structure
```typescript
interface StoredSnapshot {
  timestamp: number;
  followers: string[];  // Just usernames for efficiency
  following: string[];
}
```

Store under key: `instagram_baseline`

### UI Changes
1. Show "Changes Since Last Upload" section when previous data exists
2. Add timestamp showing when baseline was created
3. Add "Save as New Baseline" button to update reference point
4. Keep existing diff sections (not following back, etc.) as current snapshot analysis

### Advantages of localStorage
- ✅ No server needed - fully client-side
- ✅ Persists across browser sessions
- ✅ ~5-10MB storage limit (sufficient for thousands of usernames)
- ✅ Simple API: `localStorage.setItem()`, `localStorage.getItem()`
- ✅ Privacy-preserving - data never leaves the browser

### Disadvantages to Consider
- ❌ Data lost if user clears browser data
- ❌ Not synced across devices/browsers
- ❌ No backup mechanism
- ❌ Limited to ~5MB (but should be fine for most use cases)

### Alternative Approaches Considered

**Option 1: IndexedDB**
- Pros: More storage (50MB+), better for large datasets, structured queries
- Cons: More complex API, overkill for simple string arrays
- **Decision**: Too complex for current needs, localStorage is simpler

**Option 2: Download JSON file**
- Pros: User controls backup, portable across devices
- Cons: Manual workflow (save/load files), easy to lose files
- **Decision**: Could add as future enhancement, but localStorage better for primary workflow

**Option 3: URL parameters / file system API**
- Pros: Stateless
- Cons: URL too long, file system API limited browser support
- **Decision**: Not practical

### Recommended Solution
Use **localStorage** as the primary mechanism with these features:
1. Auto-save after each successful upload (with confirmation)
2. Clear button to reset baseline
3. Export/import baseline as JSON file (future enhancement for backup)

## Impact
- Affected specs: file-upload
- Affected code: src/components/FileUpload.tsx
- New functionality: Change tracking over time
- Storage: Browser localStorage (~5KB per snapshot typical)
- UX: Users can track follower changes between uploads

## Open Questions
1. Should we auto-save the baseline after every upload, or require manual "Save as Baseline" action?
   - **Suggestion**: Auto-save with visual confirmation, plus manual save button for control

2. Should we show full history or just last snapshot?
   - **Suggestion**: Start with single baseline (last save), can add history later

3. How to handle the case where someone clears localStorage?
   - **Suggestion**: Show helpful message on first upload: "No baseline found. This will be saved as your baseline."

4. Should we compress the data or store full Instagram URLs?
   - **Suggestion**: Store only usernames (smaller), reconstruct URLs when needed

5. Export/Import feature priority?
   - **Suggestion**: Phase 2 - nice to have but not essential for MVP
