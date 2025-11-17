# Project Context

## Purpose
This is an OpenSpec-based project focused on specification-driven development. The project uses OpenSpec framework to manage change proposals, requirements specifications, and implementation tracking through a structured workflow. The project now includes a React + Vite + TypeScript web application.

## Tech Stack
- **OpenSpec Framework** - Specification-driven development workflow
- **React** - Frontend UI library with hooks and modern patterns
- **Vite** - Fast build tool and development server
- **TypeScript** - Type-safe JavaScript development
- **Biome** - Fast linting and formatting toolchain
- **Markdown** - Documentation and specification format
- **GitHub Actions** - CI/CD and automation workflows
- **Fish Shell** - Primary development shell environment
- **Ripgrep (rg)** - Code search and content discovery
- **JSON/YAML** - Configuration and data formats

## Project Conventions

### Code Style
- Use kebab-case for change IDs (e.g., `add-user-auth`, `update-payment-flow`)
- Verb-led naming for changes: `add-`, `update-`, `remove-`, `refactor-`
- Markdown files use clear hierarchical structure with proper heading levels
- Code references use `file.ts:42` format for line-specific locations
- Spec references use `specs/capability/spec.md` format
- Use 2-space indentation for TypeScript/JavaScript
- Double quotes for strings, semicolons always
- Use explicit button types (`type="button"`) for non-submit buttons

### Architecture Patterns
- **Three-stage workflow**: Propose → Implement → Archive
- **Capability-based organization**: Single-purpose specifications in `specs/[capability]/`
- **Change isolation**: Each proposal in separate `changes/[change-id]/` directory
- **Delta-based modifications**: Use ADDED/MODIFIED/REMOVED operations for spec changes
- **Validation-first**: Strict validation required before approval
- **Simplicity bias**: Favor straightforward, minimal implementations; add complexity only when justified
- **Component-based UI**: React functional components with hooks
- **Type safety**: TypeScript for all frontend code

### OpenSpec Workflow
- **Stage 1 (Creating)**: Draft proposals with validation before approval
- **Stage 2 (Implementing)**: Sequential task completion with progress tracking
- **Stage 3 (Archiving)**: Move completed changes to archive with spec updates
- **Scenario requirements**: Every requirement must have at least one `#### Scenario:`
- **Requirement format**: Use SHALL/MUST for normative requirements

### Testing Strategy
- Validation through `openspec validate --strict` for all proposals
- Scenario-driven requirements with clear WHEN/THEN conditions
- Implementation verification through task completion checklists
- Cross-capability impact assessment for breaking changes
- Biome linting for code quality assurance
- TypeScript compilation checks for type safety

### Git Workflow
- Feature branches for implementation work
- Separate PRs for proposals vs implementation vs archiving
- Commit messages reference change IDs when applicable
- Approval required before implementation begins

## Domain Context
- **OpenSpec terminology**: Changes (proposals), Specs (current truth), Archive (completed)
- **Capability scope**: 10-minute understandability rule - split if description needs "AND"
- **Change scope**: Default to <100 lines of new code, prove need for complexity
- **Breaking changes**: Must be explicitly marked as **BREAKING** in proposals
- **Migration patterns**: Always include migration plans for breaking changes
- **Web application**: React-based SPA with modern development tooling

## Important Constraints
- All changes require proposal → approval → implementation → archive workflow
- Strict validation must pass before sharing proposals
- No implementation without approved proposal (except bug fixes restoring spec behavior)
- Scenarios must use exact `#### Scenario:` format (4 hashtags)
- Each requirement needs at least one scenario with WHEN/THEN structure
- MODIFIED requirements must include complete updated content (not partial deltas)
- Use TypeScript for type safety in all React components
- Follow Biome linting rules for code consistency

## External Dependencies
- **OpenSpec CLI** - Core workflow management (`openspec list`, `validate`, `show`, `archive`)
- **Ripgrep (rg)** - Fast full-text search across specifications and code
- **GitHub** - Repository hosting and automation workflows
- **Markdown processors** - For rendering documentation and specifications
- **Node.js/npm** - JavaScript runtime and package management
- **React ecosystem** - Component library and tooling

## File Organization
```
├── openspec/
│   ├── project.md              # This file - project conventions
│   ├── specs/                  # Current specifications (what IS built)
│   │   └── web-app/           # Web application capability
│   ├── changes/                # Active proposals (what SHOULD change)
│   │   └── archive/            # Completed and deployed changes
│   └── AGENTS.md              # AI assistant instructions
├── src/                       # React application source code
│   ├── App.tsx               # Main application component
│   ├── App.css              # Application styles
│   ├── main.tsx              # React application entry point
│   └── index.css             # Global styles
├── public/                    # Static assets
├── dist/                      # Build output (generated)
├── package.json              # Node.js project configuration
├── vite.config.ts            # Vite build configuration
├── biome.json               # Biome linting/formatting config
└── tsconfig*.json           # TypeScript configuration
```

## Quick Reference Commands
```bash
# OpenSpec Discovery
openspec list                    # Show active changes
openspec list --specs            # Show current capabilities
openspec show [item]             # View change or spec details

# OpenSpec Validation
openspec validate [change] --strict    # Comprehensive validation
openspec show [change] --json --deltas-only  # Debug parsing

# OpenSpec Lifecycle
openspec archive <change-id> --yes    # Complete and archive change

# Development
npm run dev                      # Start development server
npm run build                    # Build for production
npm run lint                     # Run Biome linting
npm run lint:fix                 # Auto-fix lint issues
npm run format                   # Format code with Biome
```
