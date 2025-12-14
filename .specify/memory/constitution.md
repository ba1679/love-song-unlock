<!--
Sync Impact Report:
Version: (none) → 1.0.0
Modified Principles: N/A (initial creation)
Added Sections:
  - Core Principles (4 principles)
  - Technology Stack Requirements
  - Development Workflow
  - Governance
Templates requiring updates:
  ✅ plan-template.md - Constitution Check section aligned
  ✅ spec-template.md - No changes needed (already supports principles)
  ✅ tasks-template.md - No changes needed (already supports testing principles)
Follow-up TODOs: None
-->

# LoveUnlock Constitution

## Core Principles

### I. Code Quality & TypeScript Standards

All code MUST be written in TypeScript with strict type checking enabled. Type definitions MUST be explicit—avoid `any` types unless absolutely necessary and justified. Components and functions MUST have clear type signatures. Code MUST pass TypeScript compilation without errors or warnings. ESLint rules MUST be enforced, and code MUST follow consistent formatting (Prettier or equivalent). All exported functions, components, and types MUST be documented with JSDoc comments when their purpose is not immediately obvious from naming.

**Rationale**: Type safety prevents runtime errors, improves maintainability, and enables better IDE support. Consistent formatting reduces cognitive load during code review and collaboration.

### II. Testing Standards

All new features MUST include appropriate tests before implementation is considered complete. Unit tests MUST cover business logic, utility functions, and data transformations. Integration tests MUST verify component interactions and API integrations. Critical user flows (e.g., answer verification, song unlocking) MUST have end-to-end test coverage. Tests MUST be deterministic and independent—no shared state between tests. Test coverage for new code MUST meet or exceed 80% for business-critical paths. All tests MUST pass before code can be merged.

**Rationale**: Comprehensive testing ensures reliability, prevents regressions, and provides confidence for refactoring. Independent tests enable parallel execution and reliable CI/CD pipelines.

### III. User Experience Consistency

All user-facing interfaces MUST follow the established design system (ShadCN UI components, Tailwind CSS utilities). Color palette MUST adhere to the defined theme (soft pink #FFC0CB, light blush #FAE6E8, lavender #E6E6FA). Interactive elements MUST provide clear visual feedback (hover states, loading indicators, error messages). Animations MUST be gentle and purposeful—avoid jarring transitions. Responsive design MUST be tested across mobile, tablet, and desktop viewports. Accessibility standards MUST be met (keyboard navigation, screen reader support, sufficient color contrast). Error messages MUST be user-friendly and actionable.

**Rationale**: Consistent UX reduces user confusion, builds trust, and creates a cohesive brand experience. Accessibility ensures the app is usable by all users regardless of abilities.

### IV. Performance Requirements

Page load times MUST be under 2 seconds on 3G networks (Lighthouse Performance score ≥ 90). Client-side navigation MUST feel instant (< 100ms perceived latency). Images and media assets MUST be optimized (compressed, appropriate formats, lazy loading). Code splitting MUST be implemented for route-based chunks. Firebase queries MUST be optimized to minimize read operations and payload sizes. Local Storage usage MUST be efficient—avoid storing large objects. Bundle size MUST be monitored and kept reasonable (target: < 200KB initial JS bundle, gzipped).

**Rationale**: Performance directly impacts user satisfaction and engagement. Fast load times reduce bounce rates and improve the overall experience, especially on mobile devices.

## Technology Stack Requirements

The project MUST use the following core technologies:
- **Framework**: Next.js 15+ with App Router
- **Language**: TypeScript (strict mode)
- **UI Library**: React 18+
- **Styling**: Tailwind CSS with ShadCN UI components
- **Backend**: Firebase (Firestore for data, App Hosting for deployment)
- **Icons**: Lucide React

New dependencies MUST be justified and evaluated for:
- Bundle size impact
- Maintenance status and community support
- Compatibility with existing stack
- Security vulnerabilities

## Development Workflow

All feature development MUST follow the specification → plan → tasks workflow:
1. Feature specification (`/speckit.specify`) defines user stories and requirements
2. Implementation plan (`/speckit.plan`) outlines technical approach
3. Task breakdown (`/speckit.tasks`) provides actionable implementation steps

Code reviews MUST verify:
- Constitution compliance (all principles)
- TypeScript type safety
- Test coverage for new code
- Performance impact assessment
- UX consistency with design system

Before deployment, the following MUST pass:
- TypeScript compilation (`npm run typecheck`)
- Linting (`npm run lint`)
- All tests (if test suite exists)
- Manual QA on target devices

## Governance

This constitution supersedes all other development practices and guidelines. Amendments to principles or governance rules require:
1. Documentation of the proposed change and rationale
2. Impact assessment on existing codebase and workflows
3. Update to version number following semantic versioning:
   - **MAJOR**: Backward-incompatible principle changes or removals
   - **MINOR**: New principles added or existing principles materially expanded
   - **PATCH**: Clarifications, wording improvements, non-semantic refinements
4. Propagation of changes to dependent templates and documentation

All pull requests and code reviews MUST verify compliance with this constitution. Violations of principles MUST be justified in the Complexity Tracking section of implementation plans, or the code MUST be refactored to comply.

**Version**: 1.0.0 | **Ratified**: 2025-12-14 | **Last Amended**: 2025-12-14
