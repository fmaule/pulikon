# Change: Simplify Instagram Diff Display

## Why
The current Instagram diff display includes unnecessary decorative elements (emojis, descriptions, success messages) that clutter the interface. Users primarily need to see the usernames and access their profiles.

## What Changes
- Remove emoji indicators from section headers
- Remove descriptive text under each section
- Remove success message after ZIP upload
- Remove unused state variables (zipContents, fileName)
- Remove ZipFileEntry interface
- Simplify file processing logic to focus on Instagram data extraction

## Impact
- Affected specs: web-app
- Affected code: src/components/FileUpload.tsx
- UI becomes cleaner and more focused on essential information
- Code becomes simpler with less state management
