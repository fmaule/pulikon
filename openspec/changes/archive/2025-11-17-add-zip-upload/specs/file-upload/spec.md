## ADDED Requirements

### Requirement: ZIP File Upload
The system SHALL provide a file upload interface that accepts ZIP files via click or drag-and-drop.

#### Scenario: Click to upload
- **WHEN** a user clicks the upload area
- **THEN** a file picker dialog opens
- **AND** only ZIP files are selectable

#### Scenario: Drag and drop upload
- **WHEN** a user drags a file over the upload area
- **THEN** visual feedback indicates the drop zone is active
- **AND** dropping the file initiates upload processing

#### Scenario: Multiple upload attempts
- **WHEN** a user uploads a file
- **THEN** the previous file data is cleared
- **AND** the new file is processed

### Requirement: File Size Validation
The system SHALL enforce a 1MB maximum file size limit for uploaded ZIP files.

#### Scenario: Valid file size
- **WHEN** a user uploads a ZIP file under 1MB
- **THEN** the file is accepted and processed
- **AND** the contents are displayed

#### Scenario: Oversized file rejection
- **WHEN** a user uploads a ZIP file over 1MB
- **THEN** an error message is displayed
- **AND** the file is not processed
- **AND** the message indicates the size limit

### Requirement: ZIP Content Display
The system SHALL extract and display the contents of uploaded ZIP files as a readable list.

#### Scenario: Display file list
- **WHEN** a valid ZIP file is uploaded
- **THEN** all files within the ZIP are listed
- **AND** each file shows its name and size
- **AND** the list is scrollable if many files exist

#### Scenario: Empty ZIP handling
- **WHEN** an empty ZIP file is uploaded
- **THEN** a message indicates the ZIP contains no files
- **AND** no error is thrown

#### Scenario: Nested folder display
- **WHEN** a ZIP contains folders
- **THEN** full file paths are displayed
- **AND** folder structure is evident from the paths

### Requirement: Upload State Feedback
The system SHALL provide clear visual feedback for all upload states.

#### Scenario: Idle state
- **WHEN** no file is uploaded
- **THEN** the upload area displays instructions
- **AND** indicates drag-and-drop is supported

#### Scenario: Processing state
- **WHEN** a file is being processed
- **THEN** a loading indicator is shown
- **AND** user interactions are prevented during processing

#### Scenario: Success state
- **WHEN** a file is successfully processed
- **THEN** a success message is displayed
- **AND** the file contents are visible

#### Scenario: Error state
- **WHEN** a validation or processing error occurs
- **THEN** a clear error message is displayed
- **AND** the user can attempt another upload
