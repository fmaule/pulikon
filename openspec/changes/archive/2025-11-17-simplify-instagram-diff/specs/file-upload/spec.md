## MODIFIED Requirements

### Requirement: Upload State Feedback
The system SHALL provide clear visual feedback for upload states focused on essential information.

#### Scenario: Idle state
- **WHEN** no file is uploaded
- **THEN** the upload area displays instructions
- **AND** indicates drag-and-drop is supported

#### Scenario: Processing state
- **WHEN** a file is being processed
- **THEN** a loading indicator is shown
- **AND** user interactions are prevented during processing

#### Scenario: Error state
- **WHEN** a validation or processing error occurs
- **THEN** a clear error message is displayed
- **AND** the user can attempt another upload

### Requirement: Instagram Diff Display
The system SHALL display Instagram follower analysis in a clean, minimal interface.

#### Scenario: Section headers
- **WHEN** Instagram data is analyzed
- **THEN** three sections are displayed with counts
- **AND** section titles contain no decorative elements
- **AND** each section shows "Not Following You Back (N)", "Your Followers (N)", or "Mutual Followers (N)"

#### Scenario: User lists
- **WHEN** displaying users in each section
- **THEN** only usernames and profile links are shown
- **AND** no additional text or descriptions appear

## REMOVED Requirements

### Requirement: Upload State Feedback - Success state scenario
**Reason**: Success message after upload is redundant when diff results are immediately displayed
**Migration**: Success is implied by the presence of diff results

### Requirement: ZIP Content Display
**Reason**: ZIP file listing is not needed for Instagram analysis workflow - users only care about the diff results
**Migration**: ZIP contents are processed internally but not displayed to users
