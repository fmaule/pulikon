# Change: Add ZIP File Upload with Content Display

## Why
Enable users to upload Instagram export ZIP files for future processing. The upload mechanism provides foundation for Instagram data analysis features while ensuring file size constraints are enforced.

## What Changes
- Add file upload component with drag-and-drop support
- Implement ZIP file validation (max 1MB size limit)
- Extract and display ZIP file contents as a list
- Add visual feedback for upload states (idle, uploading, success, error)
- Create reusable file upload UI component

## Impact
- Affected specs: file-upload (new capability)
- Affected code: New FileUpload component, updated App.tsx
- Dependencies: JSZip library for ZIP file handling
- User experience: Enables Instagram data import workflow
