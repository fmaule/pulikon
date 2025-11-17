## 1. Data Layer
- [ ] 1.1 Define TypeScript interfaces for stored snapshot
- [ ] 1.2 Create utility functions for localStorage access (save/load/clear)
- [ ] 1.3 Handle JSON serialization/deserialization
- [ ] 1.4 Add error handling for localStorage failures (quota exceeded, disabled, etc.)

## 2. Change Detection Logic
- [ ] 2.1 Implement comparison function to detect new unfollows
- [ ] 2.2 Implement comparison function to detect new followers
- [ ] 2.3 Implement comparison function to detect lost follows (you unfollowed)
- [ ] 2.4 Implement comparison function to detect new mutual connections
- [ ] 2.5 Calculate timestamps and format dates

## 3. UI Components
- [ ] 3.1 Add "Changes Since Last Upload" section (conditional on baseline existing)
- [ ] 3.2 Display baseline timestamp
- [ ] 3.3 Show change categories with counts
- [ ] 3.4 Add "Save as New Baseline" button
- [ ] 3.5 Add "Clear Baseline" button
- [ ] 3.6 Show first-time user message when no baseline exists
- [ ] 3.7 Add visual confirmation when baseline is saved

## 4. User Experience
- [ ] 4.1 Auto-save after successful upload (optional based on decision)
- [ ] 4.2 Handle edge cases (empty lists, no changes, etc.)
- [ ] 4.3 Add tooltips/help text explaining the feature
- [ ] 4.4 Ensure changes section is visually distinct from current snapshot

## 5. Error Handling
- [ ] 5.1 Handle localStorage quota exceeded
- [ ] 5.2 Handle disabled localStorage (private browsing)
- [ ] 5.3 Handle corrupted data in localStorage
- [ ] 5.4 Provide clear error messages to users

## 6. Testing
- [ ] 6.1 Test with no baseline (first upload)
- [ ] 6.2 Test with existing baseline (show changes)
- [ ] 6.3 Test save baseline functionality
- [ ] 6.4 Test clear baseline functionality
- [ ] 6.5 Test with large datasets (thousands of users)
- [ ] 6.6 Test localStorage disabled scenarios
- [ ] 6.7 Verify lint passes
- [ ] 6.8 Verify build succeeds

## 7. Documentation
- [ ] 7.1 Add inline code comments explaining storage format
- [ ] 7.2 Document localStorage key naming convention

## Future Enhancements (Not in this change)
- Export/import baseline as JSON file
- Multiple baseline history
- Graphs/charts of follower trends over time
