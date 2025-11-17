## ADDED Requirements

### Requirement: Follower Change Tracking
The system SHALL track follower changes over time using browser localStorage.

#### Scenario: First upload with no baseline
- **WHEN** a user uploads an Instagram export for the first time
- **THEN** a message indicates no baseline exists
- **AND** the current data is automatically saved as the baseline
- **AND** the timestamp is recorded

#### Scenario: Subsequent upload with existing baseline
- **WHEN** a user uploads an Instagram export and a baseline exists
- **THEN** the system compares the new data with the saved baseline
- **AND** displays a "Changes Since Last Upload" section
- **AND** shows the baseline timestamp

#### Scenario: localStorage unavailable
- **WHEN** localStorage is disabled or unavailable
- **THEN** the system displays a warning message
- **AND** continues to show current snapshot analysis
- **AND** does not crash or fail

### Requirement: Change Detection Display
The system SHALL display detected changes in follower relationships since the last baseline.

#### Scenario: New unfollows detected
- **WHEN** comparing with baseline
- **THEN** users who previously followed you but no longer do are listed under "New Unfollows"
- **AND** the count is displayed
- **AND** each user is shown with their username and profile link

#### Scenario: New followers detected
- **WHEN** comparing with baseline
- **THEN** users who didn't follow you before but do now are listed under "New Followers"
- **AND** the count is displayed

#### Scenario: Lost follows detected
- **WHEN** comparing with baseline
- **THEN** users you previously followed but no longer do are listed under "You Unfollowed"
- **AND** the count is displayed

#### Scenario: New mutual connections
- **WHEN** comparing with baseline
- **THEN** users who became mutual connections are listed under "New Mutual"
- **AND** the count is displayed

#### Scenario: No changes detected
- **WHEN** comparing with baseline and no changes exist
- **THEN** a message indicates "No changes since last upload"
- **AND** the baseline timestamp is still displayed

### Requirement: Baseline Management
The system SHALL provide controls for managing the stored baseline.

#### Scenario: Manual baseline save
- **WHEN** a user clicks "Save as New Baseline"
- **THEN** the current upload data replaces the stored baseline
- **AND** the timestamp is updated
- **AND** a confirmation message is shown

#### Scenario: Clear baseline
- **WHEN** a user clicks "Clear Baseline"
- **THEN** the stored baseline is removed from localStorage
- **AND** a confirmation message is shown
- **AND** the next upload will be treated as a first upload

#### Scenario: Automatic baseline save
- **WHEN** a user successfully uploads a ZIP file
- **THEN** the system automatically saves the data as baseline (if auto-save enabled)
- **AND** shows a subtle confirmation indicator

### Requirement: Data Storage Format
The system SHALL store follower data efficiently in localStorage.

#### Scenario: Data serialization
- **WHEN** saving a baseline
- **THEN** only usernames are stored (not full URLs)
- **AND** a timestamp is included
- **AND** data is serialized as JSON

#### Scenario: Data size management
- **WHEN** storing follower data
- **THEN** the system uses minimal storage (usernames only)
- **AND** handles typical Instagram accounts (up to 10,000 followers/following)
- **AND** stays within localStorage limits (~5MB)

#### Scenario: Data corruption handling
- **WHEN** loading baseline data that is corrupted or invalid
- **THEN** the system shows an error message
- **AND** offers to clear the corrupted data
- **AND** continues to function with current upload analysis
