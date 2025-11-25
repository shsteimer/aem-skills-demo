# Content Driven Development (CDD) Improvement Plan

## Context

Analysis of page-import vs content-driven-development skills revealed that agents follow page-import workflow significantly better. This plan documents decisions to improve CDD by applying lessons from page-import's success.

## Problem Statement

**page-import characteristics (agents follow well):**
- Strictly linear workflow (5 numbered steps)
- Self-contained (204 lines, no external resources)
- Todo list creation as Step 0
- Each step has concrete deliverables with checkboxes
- Very prescriptive: "Invoke X skill, provide Y inputs, verify Z outputs"
- Clear success criteria for marking todos complete

**content-driven-development issues (agents struggle):**
- Flexible workflow with conditional branches ("When to use / Skip this step when")
- Distributed across multiple files (164 lines + 1,192 lines in 4 resources)
- Todo list mentioned in checklist (less prominent)
- Steps have conceptual goals and principles
- Less prescriptive: "Ask user to choose", "read X for complete guidance"
- Abstract validation criteria
- Frequent "Ask user" instructions introducing uncertainty

**Goal:** Make CDD more linear, prescriptive, and concrete while maintaining appropriate flexibility.

---

## File Locations Reference

```
.claude/skills/content-driven-development/
├── SKILL.md (to be rewritten)
├── resources/
│   ├── cdd-philosophy.md (keep as optional reading)
│   ├── content-creation.md (consolidate into SKILL.md, then delete)
│   ├── content-discovery.md (delete - replaced by skill)
│   └── html-structure.md (keep as shared reference)

.claude/skills/find-test-content/
└── scripts/
    └── find-block-content.js (moved from content-driven-development)

.claude/skills/building-blocks/
└── SKILL.md (update description to mention core changes)

.claude/skills/find-test-content/
└── SKILL.md (create new)

Reference for structure:
.claude/skills/page-import/SKILL.md (204 lines, self-contained)
```

---

## Key Decisions

### Decision 1: CDD Workflow Structure

**Chosen:** 7-step linear workflow (Step 0-6)

```
Step 0: Create TodoList (define all 6 tasks upfront)
Step 1: Start Dev Server (if not running)
Step 2: Find/Identify Test Content (invoke find-test-content skill)
Step 3: Design/Identify Content Model (invoke skill or document inline)
Step 4: Create Test Content if needed (inline guidance)
Step 5: Implement Code Changes (invoke building-blocks skill)
Step 6: Validate in Browser (invoke testing-blocks skill)
```

**Rationale:**
- Matches page-import's linear structure
- Each step has clear action (invoke skill or explicit inline guidance)
- Added Step 1 for dev server to ensure validation capability throughout
- Step 3 always identifies model (even for existing content) to inform implementation
- Clear progression from content → model → implementation → validation

**CSS-only exception:** Can skip Step 3 (content model) for pure styling changes

### Decision 2: find-test-content Skill Scope

**Chosen:** Automated validation with dual purpose

**Capabilities:**
- **Input:** Block name (optional) OR URL (optional) - at least one required
- **Actions:**
  - If block name: run find-block-content.js script
  - Validate all URLs in browser (playwright)
  - Check: page loads, block renders, capture screenshots
  - Note console errors
- **Output:**
  - List of validated URLs with pass/fail status
  - Screenshots for reference
  - Error notes
  - Coverage assessment left to user/orchestrator

**Rationale:**
- Makes Step 2 concrete: "Invoke find-test-content skill"
- Removes decision fatigue (validate all, not "which ones?")
- Dual purpose handles both finding existing and validating provided URLs
- Similar to page-import's block-inventory skill

### Decision 3: Resource File Strategy

**Chosen:** Aggressive consolidation with optional reading

**Actions:**
- **Delete:** `content-discovery.md` (replaced by find-test-content skill)
- **Consolidate:** `content-creation.md` → pull essentials into Step 4
- **Keep:** `html-structure.md` (shared reference, 542 lines, used by multiple skills)
- **Keep:** `cdd-philosophy.md` (move to optional reading section with guidance)

**For cdd-philosophy.md:**
```markdown
## Optional: Understanding CDD Principles

**Read resources/cdd-philosophy.md if:**
- User asks "why" questions about content-first approach
- You need to understand reasoning behind CDD decisions
- You're unsure whether to prioritize author vs developer experience

**Otherwise:** Follow the workflow steps below
```

**Result:** ~300-400 line SKILL.md (mostly self-contained), 2 resources (1 shared, 1 optional)

**Rationale:**
- page-import is self-contained (no separate resources)
- Reduces cognitive load and context switching
- Philosophy valuable but adds load during execution
- html-structure.md shared across skills (also used by generate-import-html)

### Decision 4: Step 3 Content Model Handling

**Chosen:** Conditional - invoke skill for new/structural, document inline for existing

```markdown
**Skip if:** CSS-only changes

**For new blocks or structural changes:**
- Invoke content-modeling skill

**For existing blocks without structural changes:**
- Document existing structure inline
- Inspect initial HTML, note patterns

**Success criteria:**
- ✅ Content model documented
```

**Rationale:**
- Always understand content model (even for existing blocks)
- New/structural changes need full content-modeling skill
- Existing models simpler to document inline
- Clear conditions for which path to take

### Decision 5: Step 5 Implementation

**Chosen:** Always invoke building-blocks skill, no escape hatch

```markdown
### Step 5: Implement Code Changes

**Invoke:** building-blocks skill

**Provide:**
- Content model from Step 3
- Test content URL(s) from Step 2 or 4
- Type of changes: block code, core functionality, or both

**Note:** The building-blocks skill handles all types of code changes:
- Block-specific code (decoration, styling)
- Core changes needed for blocks (utilities, global styles, auto-blocking)
- Core-only changes (scripts.js, styles, delayed.js modifications)
```

**Rationale:**
- No "core-only" escape hatch prevents agents from skipping structured workflow
- Core changes often accompany block changes
- building-blocks skill can handle or guide core modifications
- Keeps workflow simple: always one clear action
- Rare core-only changes don't justify separate path

**Note:** building-blocks skill description needs update to clarify it handles core changes

### Decision 6: Implementation Order

**Chosen:** CDD structure first, then skill (Option B)

**Sequence:**
1. Rewrite CDD SKILL.md with new 7-step structure
2. Document expected find-test-content skill behavior in CDD
3. Update building-blocks skill description (handles core changes)
4. Consolidate resources (delete content-discovery.md, consolidate content-creation.md)
5. Test CDD workflow manually (simulate find-test-content behavior)
6. Create find-test-content skill to match specification
7. Test full CDD workflow end-to-end

**Rationale:**
- Define requirements from workflow perspective
- Skill built to fit CDD needs exactly
- Can validate workflow logic manually before building skill
- Similar to planning process - workflow first, implementation details second

### Decision 7: Success Validation

**Chosen:** User will handle validation and iteration

**Approach:**
- User will test with real development tasks
- Observe agent behavior and adherence to workflow
- Iterate based on findings

**Rationale:**
- User has best context for validation
- Real-world usage more valuable than synthetic tests
- Flexibility for iteration based on actual agent behavior

---

## Detailed Implementation Specifications

### Task 1: Rewrite CDD SKILL.md

**File:** `.claude/skills/content-driven-development/SKILL.md`

**Structure to follow:** Use `.claude/skills/page-import/SKILL.md` as template

**Complete structure:**

```markdown
---
name: content-driven-development
description: Apply a Content Driven Development process to AEM Edge Delivery Services development. Use for all development tasks, including building new blocks, modifying existing blocks, making changes to core decoration functionality, etc.
---

# Content Driven Development (CDD)

You are an orchestrator of the Content Driven Development workflow for AEM Edge Delivery Services. You have specialized Skills at your disposal for each phase of development. Below is a high-level overview of what you're going to do.

## When to Use This Skill

Use this skill for ALL AEM development tasks:
- ✅ Creating new blocks
- ✅ Modifying existing blocks (structural or functional changes)
- ✅ Changes to core decoration functionality
- ✅ Bug fixes that require validation
- ✅ Any code that affects how authors create or structure content

**Do NOT use this skill for:**
- Documentation-only changes
- Configuration changes that don't affect authoring

## Philosophy

Content Driven Development prioritizes creating or identifying test content before writing code. This ensures:
- Code is built against real content
- Author-friendly content models
- Validation throughout development

**CRITICAL: Never start writing or modifying code without first identifying or creating the content you will use to test your changes.**

## Optional: Understanding CDD Principles

**Read resources/cdd-philosophy.md if:**
- User asks "why" questions about content-first approach
- You need to understand reasoning behind CDD decisions
- You're unsure whether to prioritize author vs developer experience

**Otherwise:** Follow the workflow steps below

## Available Sub-Skills

This orchestrator delegates work to:
- **find-test-content** - Find existing content or validate provided URLs
- **content-modeling** - Design author-friendly content models
- **building-blocks** - Implement code changes (blocks, core, or both)
- **testing-blocks** - Validate changes in browser

## Development Workflow

### Step 0: Create TodoList

Use the TodoWrite tool to create a todo list with the following tasks:

1. **Start dev server** (if not running)
   - Success: Dev server running, can access http://localhost:3000

2. **Find or validate test content** (find-test-content skill)
   - Success: URL(s) to test content identified and validated in browser

3. **Design/identify content model** (content-modeling skill or inline)
   - Success: Content structure documented

4. **Create test content (if needed)** (inline guidance)
   - Success: Test content exists and renders in browser

5. **Implement code changes** (building-blocks skill)
   - Success: Code written, linting passes

6. **Validate in browser** (testing-blocks skill)
   - Success: All test content renders correctly, tests pass

---

### Step 1: Start Dev Server

**Check if running:**
```bash
curl -I http://localhost:3000
```

**If not running, start it:**
```bash
aem up --no-open --forward-browser-logs
```

**Success criteria:**
- ✅ Dev server running
- ✅ http://localhost:3000 accessible
- ✅ Can load test pages

**Mark todo complete when:** Dev server confirmed running

---

### Step 2: Find/Identify Test Content

**Invoke:** find-test-content skill

**Provide:**
- Block name (if modifying existing block)
- Feature description (if new functionality)
- URL (if user provided specific test content)

**Success criteria:**
- ✅ At least one test content URL identified
- ✅ Content validated in browser
- ✅ Content loads without errors

**Mark todo complete when:** Test content URL(s) validated

---

### Step 3: Design/Identify Content Model

**Skip if:** CSS-only changes

**For new blocks or structural changes:**

**Invoke:** content-modeling skill

**Provide:**
- Block name and purpose
- Test content URL from Step 2 (if modifying existing)

---

**For existing blocks without structural changes:**

**Document existing structure:**
1. Load test content from Step 2 in browser
2. Inspect initial HTML structure: `curl http://localhost:3000/path/to/content`
3. Document the content model as it exists
4. Note any patterns or variants

---

**Success criteria:**
- ✅ Content model documented
- ✅ Author experience understood

**Mark todo complete when:** Content model documented

---

### Step 4: Create Test Content (if needed)

**Skip if:** Existing content found in Step 2 covers all test scenarios

**Choose approach:**

**Option 1: CMS Content (Recommended)**

**Benefits:**
- Required for PR validation link (PSI checks)
- Serves as author documentation
- Tests full authoring pipeline

**Process:**
1. Prepare content structure based on model from Step 3
2. Ask user to create content in CMS (Google Drive/SharePoint/DA/Universal Editor)
3. Provide clear instructions with examples
4. Wait for user to provide URL(s)
5. Validate content loads in browser

**Example instructions for user:**
```
Please create test content in your CMS:

Structure: [provide table/content structure from content model]
Example content: [provide realistic examples]

Once created:
1. Preview the content in AEM
2. Provide the content URL(s)
```

---

**Option 2: Local HTML Files (Temporary)**

**Use when:**
- Rapid prototyping
- No CMS access
- Will create CMS content before PR

**Process:**

**Create file:** `drafts/tmp/{block-name}-test.plain.html`

**Structure template:**
```html
<div>
  <div class="{block-name}">
    <!-- Use content model from Step 3 -->
    <!-- See resources/html-structure.md for detailed patterns -->

    <!-- Example for simple block: -->
    <div>
      <div>Heading</div>
      <div>Content text here</div>
    </div>
  </div>
</div>
```

**For detailed HTML structure patterns:** See `resources/html-structure.md`

**Validate:**
```bash
# Restart dev server with html-folder flag
aem up --html-folder drafts --no-open --forward-browser-logs

# Test URL: http://localhost:3000/drafts/tmp/{block-name}-test
```

**IMPORTANT:** Local HTML files are temporary. CMS content required before PR.

---

**Success criteria:**
- ✅ Test content URL accessible
- ✅ Content matches content model from Step 3
- ✅ Content renders in browser (even if unstyled)

**Mark todo complete when:** Test content validated in browser

---

### Step 5: Implement Code Changes

**Invoke:** building-blocks skill

**Provide:**
- Content model from Step 3
- Test content URL(s) from Step 2 or 4
- Type of changes: block code, core functionality, or both

**Note:** The building-blocks skill handles all types of code changes:
- Block-specific code (decoration, styling)
- Core changes needed for blocks (utilities, global styles, auto-blocking)
- Core-only changes (scripts.js, styles, delayed.js modifications)

**Success criteria:**
- ✅ Code written
- ✅ Linting passes: `npm run lint`
- ✅ Basic functionality works in browser

**Mark todo complete when:** Implementation complete, linting passes

---

### Step 6: Validate in Browser

**Invoke:** testing-blocks skill

**Provide:**
- Test content URL(s) from Step 2 or 4
- Description of changes made
- Any specific scenarios to test

**Success criteria:**
- ✅ Browser testing complete
- ✅ All test scenarios pass
- ✅ No regressions in existing functionality
- ✅ No console errors

**Mark todo complete when:** All validation complete

---

## High-Level Dos and Don'ts

**DO:**
- ✅ Create todo list before starting (Step 0)
- ✅ Follow steps in order (1→2→3→4→5→6)
- ✅ Start dev server before content validation
- ✅ Validate test content in browser before implementing
- ✅ Mark each todo complete after verification
- ✅ Invoke skills when specified
- ✅ Test in browser throughout development

**DON'T:**
- ❌ Write code before test content exists
- ❌ Skip steps or combine steps
- ❌ Make assumptions about content structure
- ❌ Skip browser validation
- ❌ Mark todos complete without concrete validation
- ❌ Skip dev server startup
- ❌ Use escape hatches to avoid structured workflow

## Success Criteria

Development is complete when:
- ✅ All 6 todos marked complete
- ✅ Test content renders correctly in browser
- ✅ Code passes linting
- ✅ All tests pass
- ✅ No regressions

## Related Skills

- **content-modeling**: Invoked in Step 3 for new blocks or structural changes
- **building-blocks**: Invoked in Step 5 for all implementation
- **testing-blocks**: Invoked in Step 6 for validation
- **find-test-content**: Invoked in Step 2 for content discovery/validation

## Resources

- **Philosophy:** `resources/cdd-philosophy.md` - Optional reading on content-first principles
- **HTML Structure:** `resources/html-structure.md` - Detailed guide for creating local HTML test files (referenced in Step 4)
```

---

### Task 2: Update building-blocks Skill Description

**File:** `.claude/skills/building-blocks/SKILL.md`

**Change:** Update the description field and the "When to Use This Skill" section

**Current description:**
```yaml
description: Guide for creating new AEM Edge Delivery blocks or modifying existing blocks. Use this skill whenever you are creating a new block from scratch or making significant changes to existing blocks that involve JavaScript decoration, CSS styling, or content model changes.
```

**New description:**
```yaml
description: Guide for implementing code changes in AEM Edge Delivery Services. Handles block development (new or modified), core functionality changes (scripts.js, styles, etc.), or both. Use this skill for all implementation work guided by the content-driven-development workflow.
```

**Current "When to Use This Skill" section (lines 20-32):**
```markdown
## When to Use This Skill

This skill is invoked automatically by **content-driven-development** during implementation. It handles:
- Creating new block files and structure
- Implementing JavaScript decoration
- Adding CSS styling
- Testing and documentation

Prerequisites (verified by CDD):
- ✅ Test content exists (in CMS or local drafts)
- ✅ Content model is defined
- ✅ Test content URL is available
```

**New "When to Use This Skill" section:**
```markdown
## When to Use This Skill

This skill is invoked automatically by **content-driven-development** during Step 5 (Implementation). It handles:

**Block Development:**
- Creating new block files and structure
- Implementing JavaScript decoration
- Adding CSS styling

**Core Functionality:**
- Scripts.js modifications (decoration, utilities, auto-blocking)
- Global styles (styles.css, lazy-styles.css)
- Delayed functionality (delayed.js)
- Configuration changes

**Combined:**
- Blocks with supporting core changes (utilities, global styles, etc.)

Prerequisites (verified by CDD):
- ✅ Test content exists (in CMS or local drafts)
- ✅ Content model is defined/documented
- ✅ Test content URL is available
- ✅ Dev server is running
```

---

### Task 3: Create find-test-content Skill

**File:** `.claude/skills/find-test-content/SKILL.md` (new file)

**Full content:**

```markdown
---
name: find-test-content
description: Find existing content with specific blocks or validate provided URLs for testing. Searches codebase for block usage, validates URLs in browser, captures screenshots, and reports validation status.
---

# Find Test Content

Find existing test content for AEM Edge Delivery development or validate provided URLs. This skill automates content discovery and browser-based validation to ensure test content is available before implementation.

## When to Use This Skill

**Invoked by:** content-driven-development skill (Step 2)

Use this skill when:
- Finding existing content that uses a specific block
- Validating user-provided test content URLs
- Confirming content loads and renders correctly

**Prerequisites:**
- ✅ Dev server is running (validated in CDD Step 1)

## Inputs

**At least one must be provided:**
- `block_name` (optional) - Block name to search for (e.g., "hero", "cards")
- `url` (optional) - Specific URL(s) to validate

**Examples:**
- Find existing hero block content: `block_name: "hero"`
- Validate specific URL: `url: "/products/widget"`
- Both: `block_name: "hero", url: "/products/widget"`

## Workflow

### Phase 1: Find Content (if block_name provided)

**Action:** Run find-block-content.js script

```bash
node .claude/skills/find-test-content/scripts/find-block-content.js {block_name}
```

**Script output:**
- List of URLs containing the block
- Usage count per URL
- Sorted by most recent

**Parse results:**
- Extract all URLs found
- Note usage frequency
- Prepare for validation

---

### Phase 2: Validate URLs in Browser

**For each URL (from script results or provided url parameter):**

1. **Navigate to URL:**
   ```
   http://localhost:3000{url_path}
   ```

2. **Check page loads:**
   - Wait for page load
   - Check for HTTP errors
   - Note loading time

3. **Validate block rendering (if block_name provided):**
   - Check block exists in DOM
   - Verify block has content
   - Note if block appears multiple times

4. **Capture screenshot:**
   - Take full-page screenshot
   - Save as: `find-test-content-{block_name}-{index}.png`
   - Store in working directory

5. **Check console:**
   - Note any console errors
   - Note any console warnings
   - Flag JavaScript errors

6. **Record status:**
   - ✅ Pass: Page loads, block renders (if applicable), no errors
   - ⚠️ Warning: Page loads but has warnings/issues
   - ❌ Fail: Page doesn't load, block missing, or errors

---

### Phase 3: Report Results

**Output format:**

```markdown
## Test Content Validation Results

**Block searched:** {block_name} (if provided)

**URLs found:** {count} (if search performed)

**Validated URLs:**

1. **http://localhost:3000/path/to/content**
   - Status: ✅ Pass
   - Block instances: 1
   - Screenshot: find-test-content-hero-1.png
   - Notes: Loads correctly, no errors

2. **http://localhost:3000/another/path**
   - Status: ⚠️ Warning
   - Block instances: 2
   - Screenshot: find-test-content-hero-2.png
   - Notes: Console warning about image loading

3. **http://localhost:3000/broken/path**
   - Status: ❌ Fail
   - Block instances: 0
   - Screenshot: find-test-content-hero-3.png
   - Notes: 404 error, page not found

**Recommendation:**
Use URL #1 for testing (passes all checks)

**Coverage note:**
Coverage assessment left to user - review screenshots and determine if test content covers required scenarios (variants, edge cases, etc.)
```

---

## Success Criteria

- ✅ All provided/found URLs validated in browser
- ✅ Screenshots captured for visual reference
- ✅ Status reported for each URL (pass/warning/fail)
- ✅ At least one passing URL identified (or report if none found)

## Output

This skill provides:
- ✅ List of validated URLs with status
- ✅ Screenshots for each URL
- ✅ Console error/warning notes
- ✅ Recommendation for which URL to use
- ✅ Note about coverage assessment (user decides)

**Next step:** Return to CDD Step 2 with validated URL(s)

## Error Handling

**If no URLs found (search):**
- Report that no content found for block
- Suggest user provide specific URL to validate
- Or proceed to Step 4 (Create Test Content)

**If validation fails for all URLs:**
- Report validation failures
- Suggest checking if pages exist or dev server issues
- Ask user if they want to provide different URL

**If dev server not running:**
- Report that validation requires dev server
- Return to CDD Step 1 to start dev server
```

---

### Task 4: Consolidate Resources

**Actions:**

1. **Delete:** `.claude/skills/content-driven-development/resources/content-discovery.md`
   - Functionality replaced by find-test-content skill

2. **Delete:** `.claude/skills/content-driven-development/resources/content-creation.md`
   - Essential content consolidated into CDD SKILL.md Step 4

3. **Keep:** `.claude/skills/content-driven-development/resources/html-structure.md`
   - Shared reference used by multiple skills
   - Referenced in CDD Step 4

4. **Keep:** `.claude/skills/content-driven-development/resources/cdd-philosophy.md`
   - Moved to optional reading (referenced in new SKILL.md)

---

## Implementation Todo List

Complete these tasks in order:

1. **Rewrite CDD SKILL.md**
   - File: `.claude/skills/content-driven-development/SKILL.md`
   - Use specification in "Task 1" above
   - Model after page-import structure
   - ~300-400 lines, self-contained

2. **Update building-blocks description**
   - File: `.claude/skills/building-blocks/SKILL.md`
   - Update description field (line 3)
   - Update "When to Use This Skill" section (lines 20-32)
   - Use specification in "Task 2" above

3. **Create find-test-content skill**
   - Create directory: `.claude/skills/find-test-content/`
   - Create file: `.claude/skills/find-test-content/SKILL.md`
   - Use specification in "Task 3" above
   - ~150-200 lines

4. **Delete content-discovery.md**
   - File: `.claude/skills/content-driven-development/resources/content-discovery.md`
   - Functionality replaced by find-test-content skill

5. **Delete content-creation.md**
   - File: `.claude/skills/content-driven-development/resources/content-creation.md`
   - Content consolidated into CDD SKILL.md Step 4

6. **Test CDD workflow manually**
   - Use new CDD SKILL.md
   - Simulate find-test-content skill behavior (manual validation)
   - Verify steps flow correctly
   - Check for missing details or unclear instructions

7. **Test find-test-content skill**
   - Test with existing block name
   - Test with provided URL
   - Test with both
   - Verify outputs match specification

8. **Test full CDD workflow end-to-end**
   - Test with real development task (new block or modification)
   - Verify agent follows steps 0-6 in order
   - Verify agent creates todo list
   - Verify agent marks todos complete
   - Note any issues for iteration

---

## Expected Outcomes

**Quantitative:**
- CDD SKILL.md: ~300-400 lines (vs current 164 + 1,192 in resources)
- 7 clear steps (vs current flexible checklist)
- 4/7 steps invoke skills (vs current 3/5 with gaps)
- 2 resources remaining (vs current 4)

**Qualitative:**
- Agents create todo list immediately (Step 0)
- Agents follow linear progression (0→1→2→3→4→5→6)
- Agents invoke skills when specified (no escape hatches)
- Agents mark todos complete after each step with concrete validation
- Reduced decision fatigue and uncertainty
- Workflow feels as prescriptive and clear as page-import

**Behavioral changes expected:**
- Agents always start dev server before validation
- Agents always find/validate test content before implementing
- Agents always use building-blocks skill (no skipping to "simple" implementations)
- Agents follow structured workflow consistently

---

## Notes for Implementation

- Use `.claude/skills/page-import/SKILL.md` as structural template
- Maintain consistent formatting with other skills (yaml frontmatter, markdown structure)
- Keep success criteria concrete with checkboxes
- Use "Mark todo complete when:" pattern for each step
- Include DO/DON'T sections for clarity
- Test each component before moving to next
- Iterate based on actual agent behavior

## Notes

- building-blocks skill already exists and works well - just needs description update
- find-test-content skill is new - similar in scope to page-import's block-inventory skill
- html-structure.md stays as shared resource (used by multiple skills including generate-import-html)
- Keep option to iterate based on actual agent behavior in practice
- User (Sean) will handle final validation and testing
