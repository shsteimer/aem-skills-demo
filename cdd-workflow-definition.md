# Content Driven Development (CDD) Workflow Definition

## Purpose

This document defines the actual workflow for content-driven development in AEM Edge Delivery Services. This is the process developers follow when building or modifying blocks.

**Key principle:** Always identify or create test content before writing code. Code is built against real content, ensuring author-friendly patterns and enabling validation throughout development.

## When to Use CDD

Use this workflow for:
- Creating new blocks
- Adding variants to existing blocks
- Modifying existing block behavior
- CSS-only styling changes to blocks
- Bug fixes that require validation

Do NOT use for:
- Documentation-only changes
- Configuration changes that don't affect authoring

## Core Workflow

### 1. Start Dev Server

**If not running:**
```bash
aem up --no-open --forward-browser-logs
```

**Done when:** `http://localhost:3000` accessible

---

### 2. Analyze & Plan

**What to do:**
- Understand what you're building and why
- Identify requirements (see task-specific guidance below)
- Define acceptance criteria for validating success
- For agents: Write analysis notes to MD file (don't rely on context)

**Done when:** Clear understanding documented + acceptance criteria defined

---

### 3. Design Content Model

**What to do:**
- Define the structure authors will use
- Document in MD file (explicit, not implicit)
- For existing blocks: Document current structure
- Consider authoring ease and flexibility

**Done when:** Content structure documented and validated

---

### 4. Identify/Validate Test Content

**Choose your path based on situation:**

**Path A: Know where content is**
- Validate URL with curl: `curl -I http://localhost:3000/path/to/content`
- Confirm accessible (not 404)
- Confirm covers test scenarios

**Path B: Suspect content exists (existing block, don't know URLs)**
- Search for content (use find-block-content script)
- Validate found URLs load with curl
- Confirm covers test scenarios

**Path C: Suspect content doesn't exist (new block)**
- Create local HTML in `drafts/` for immediate testing
- Validate local URL loads
- Note: User must create CMS content before PR (for validation link)

**Done when:** You have URL(s) that load successfully covering all test scenarios (new functionality + regression testing)

---

### 5. Implement (Iterative)

**What to do:**
1. Write block JS (skip if CSS-only)
2. Write mobile CSS
3. Test mobile viewport in browser
4. Add desktop/tablet styling
5. Test tablet/desktop viewports in browser
6. Iterate as needed

**Done when:** Functionality works across all viewports

---

### 6. Lint & Test

**What to do:**
```bash
npm run lint
# Fix any issues
# Run any tests
```

**Done when:** All checks pass

---

### 7. Final Validation

**What to do:**
- Review implementation against acceptance criteria from step 2
- Final browser sanity check across viewports
- Verify no regressions

**Done when:** All acceptance criteria met, everything works

---

### 8. Ship It

**What to do:**
```bash
git add [files]
git commit -m "message"
git push
# Create PR with preview link
```

**Done when:** PR created with preview link for validation

---

## Task-Specific Analysis Requirements

### New Block

**Must analyze:**
- Content requirements (what inputs from authors?)
- Authoring needs (how easy to create/modify?)
- Variations needed
- Styling and layout requirements
- Interactive behavior requirements
- Responsive behavior across viewports

**Acceptance criteria should cover:**
- Styling and layout match requirements across viewports
- All variations work
- Authors can easily create/modify
- Interactive behavior functions
- No console errors

---

### Add Variant to Existing Block

**Must analyze:**
- What does the variant do?
- How does author use it? (class name? content marker?)
- Style-only (CSS) or behavior change (JS)?
- Styling/layout changes for variant
- Responsive considerations

**Acceptance criteria should cover:**
- Variant styling/layout matches requirements across viewports
- Variant applies correctly when specified
- Doesn't break existing variants/default behavior
- Author enablement is clear and simple

---

### Modify Existing Block Behavior

**Must analyze:**
- What behavior is changing and why?
- Impact on existing content using this block?
- Content/authoring implications?
- JS and/or CSS changes needed?
- Responsive implications?

**Acceptance criteria should cover:**
- New behavior works as expected
- Existing functionality not broken (regression check)
- Works across viewports
- Existing content still works

---

### CSS-Only Styling Change

**Must analyze:**
- What's changing visually
- Which viewports affected
- Layout implications

**Acceptance criteria should cover:**
- Styling/layout changes match requirements across viewports
- No layout breaks
- No regressions

---

### Bug Fix

**Must analyze:**
- What is the bug?
- What should happen instead?
- Root cause (if not obvious)

**Acceptance criteria should cover:**
- Bug no longer occurs
- No regressions (existing behavior unchanged)
- Works across viewports if relevant

---

## Key Notes

**Content Model Documentation:**
- For humans: Often implicit through test content
- For agents: Must be explicit and written down

**Test Content Validation:**
- For humans: Visual inspection of starting point
- For agents: Use curl to validate URL loads (avoid expensive screenshots)

**Analysis Depth:**
- Minimum requirements defined per task type above
- Start with minimums, adjust if needed based on complexity

**Acceptance Criteria:**
- Define upfront in step 2 (analyze & plan)
- Review against criteria in step 7 (final validation)
- Should be specific and testable

**Implementation Details:**
- Workflow defines WHAT and WHEN
- Skills (like building-blocks) define HOW
- Keep workflow at right abstraction level
