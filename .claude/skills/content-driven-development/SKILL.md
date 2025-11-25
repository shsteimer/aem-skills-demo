---
name: content-driven-development
description: Apply a Content Driven Development process to AEM Edge Delivery Services development. Use for ALL code changes - new blocks, block modifications, CSS styling, bug fixes, core functionality (scripts.js, styles, etc.), or any JavaScript/CSS work that needs validation.
---

# Content Driven Development (CDD)

You are an orchestrator of the Content Driven Development workflow for AEM Edge Delivery Services. This workflow ensures code is built against real content with author-friendly content models.

**CRITICAL: Never start writing or modifying code without first identifying or creating the content you will use to test your changes.**

## When to Use This Skill

Use CDD for ALL AEM development tasks:
- ✅ Creating new blocks
- ✅ Modifying existing blocks (structural or functional changes)
- ✅ Changes to core decoration functionality
- ✅ Bug fixes that require validation
- ✅ Any code that affects how authors create or structure content

Do NOT use for:
- Documentation-only changes
- Configuration changes that don't affect authoring
- Research tasks that don't require making any code changes yet

## Philosophy

Content Driven Development prioritizes creating or identifying test content before writing code. This ensures:
- Code is built against real content
- Author-friendly content models
- Validation throughout development

**Optional: Understanding CDD Principles**

Read `resources/cdd-philosophy.md` if:
- User asks "why" questions about content-first approach
- You need to understand reasoning behind CDD decisions
- You're unsure whether to prioritize author vs developer experience

Otherwise: Follow the workflow steps below

## Step 0: Create TodoList

**FIRST STEP:** Use the TodoWrite tool to create a todo list with the following 8 tasks:

1. **Start dev server** (if not running)
   - Success: Dev server running, can access http://localhost:3000

2. **Analyze & plan**
   - Success: Clear understanding documented + acceptance criteria defined

3. **Design content model**
   - Success: Content structure documented and validated

4. **Identify/create test content**
   - Success: Test content accessible covering all scenarios

5. **Implement**
   - Success: Functionality works across all viewports

6. **Lint & test**
   - Success: All checks pass

7. **Final validation**
   - Success: All acceptance criteria met, everything works

8. **Ship it**
   - Success: PR created with preview link for validation

**Mark todo complete when:** Todo list created with all 8 tasks

---

## Step 1: Start Dev Server

**Check if dev server is running:**

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
```

Expected: `200` (server running) or connection error (server not running)

**If not running, start it:**

```bash
aem up --no-open --forward-browser-logs
```

**Notes:**
- Run in background if possible (dev server needs to stay running)
- Requires AEM CLI installed globally: `npm install -g @adobe/aem-cli`
- Alternative: `npx -y @adobe/aem-cli up --no-open --forward-browser-logs`

**IMPORTANT:** Check the command output for errors. Common issues:
- Port 3000 already in use
- AEM CLI not installed
- Configuration errors

**After starting, verify it's running:**

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
```

Expected: `200`

**Success criteria:**
- ✅ Dev server running
- ✅ http://localhost:3000 returns 200
- ✅ No errors in server startup output

**Mark todo complete when:** Dev server confirmed running and accessible

---

## Step 2: Analyze & Plan

**Invoke:** analyze-and-plan skill

**Provide:**
- Task description from user
- Screenshots, design files, or existing URLs to match design from (if available)

**The analyze-and-plan skill will:**
- Guide you through task-specific analysis
- Help define acceptance criteria
- Optionally analyze visual designs/mockups if provided
- Create documented analysis for reference

**Success criteria:**
- ✅ Requirements analyzed
- ✅ Acceptance criteria defined
- ✅ Analysis documented to file for later steps

**Mark todo complete when:** Analysis documented and acceptance criteria defined

---

## Step 3: Design Content Model

**Skip if:** CSS-only changes that don't affect content structure

**Invoke:** content-modeling skill

**Provide:**
- Analysis from Step 2 (content requirements, author inputs)
- Block name and purpose

**The content-modeling skill will:**
- Design table structure (rows, columns, semantic formatting)
- Validate against best practices (4 cells/row, semantic formatting)
- Document content model for authors

**Success criteria:**
- ✅ Content model designed (table structure defined)
- ✅ Validated against best practices
- ✅ Content model documented

**Mark todo complete when:** Content model designed and documented

---

## Step 4: Identify/Create Test Content

**Goal:** End this step with accessible test content URL(s) covering all test scenarios

**Choose the best ath based on your situation:**

---

### Option A: User Provided Test URL(s)

**When to use:** User already has content and provided URL(s)

**What to do:**
1. Validate URL loads: `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/path`
2. Expected: `200` status
3. Document URL(s)
4. Mark complete

---

### Option B: New Block (No Existing Content)

**When to use:** Building a brand new block that doesn't exist yet

**What to do:**
1. Skip search (nothing exists yet to find)
2. Create test content using one of these approaches:

**Approach 1: CMS Content (Recommended)**
1. Ask user to create content in their CMS (Google Drive/SharePoint/DA/Universal Editor)
2. Provide content model from Step 3 as reference
3. Wait for user to provide URL(s)
4. Validate: `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/path`
5. Expected: `200` status

**Approach 2: Local HTML (Temporary)**
1. Create HTML file in `drafts/tmp/{block-name}.plain.html`
2. Follow structure from Step 3 content model
3. Read `resources/html-structure.md` for local HTML file format guidance
4. Restart dev server: `aem up --html-folder drafts --no-open --forward-browser-logs`
5. Validate: `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/drafts/tmp/{block-name}`
6. Expected: `200` status
7. **Note:** User must create CMS content before PR (required for preview link)

---

### Option C: Existing Block

**When to use:** Modifying, fixing, or styling an existing block

**What to do:**

**First: Search for existing content**
1. Invoke find-test-content skill
2. Provide: block name, dev server URL (optional, defaults to localhost:3000)

**What find-test-content will do:**
- Search for existing content pages containing the block
- Automatically detect and report all variants found
- Report: URLs with instance counts and variant info

**Then: Assess search results**

**If sufficient content found:**
1. Document URL(s)
2. Validate URLs load: `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/path`
3. Expected: `200` status
4. Mark complete

**If no content found OR insufficient coverage:**
1. Create additional test content using approaches from Option B
2. Validate URLs load
3. Mark complete

---

**Success criteria:**
- ✅ Test content accessible at known URL(s)
- ✅ Content covers all test scenarios (variants, edge cases)
- ✅ URLs validated (return 200)

**Mark todo complete when:** Test content identified/created and validated

---

## Related Skills

- **analyze-and-plan**: Invoked in Step 2 for requirements analysis and acceptance criteria
- **content-modeling**: Invoked in Step 3 for designing content models
- **find-test-content**: Invoked in Step 4, Option C for finding existing content
- **building-blocks**: Invoked during block implementation
- **testing-blocks**: Referenced during validation phase
- **block-collection-and-party**: Used to find similar blocks and reference implementations

## CDD Checklist

Copy this checklist and track your progress:

- [ ] Step 1: Find existing test content. See "Finding Existing Content" below
- [ ] Step 2: Design content model, if needed. See "Content Modeling" below
- [ ] Step 3: Create test content, if needed. See "Creating Test Content" below
- [ ] Step 4: Implement against real content. See "Implementation" below
- [ ] Step 5: Validate with test content. See "Validation" below

## Finding Existing Content

**When to use:** Modifications to existing blocks or functionality

**Skip this step when:** Building a brand new block that definitely doesn't exist yet

**Quick start:**
1. Ask user: "Does content using this block already exist that we can use for testing? If so, what are the path(s) to page(s) with this block?"
2. If user doesn't know, offer: "I can help search for existing content using the find-block-content script"
3. Use the script if needed:

```bash
# Search for pages containing a block
node .claude/skills/content-driven-development/scripts/find-block-content.js <block-name>

# Search on live site
node .claude/skills/content-driven-development/scripts/find-block-content.js <block-name> main--about-boa--aemsites.aem.live
```

**If doing content discovery, read `resources/content-discovery.md` for complete guidance** on:
- Detailed script usage and examples
- Validating discovered content
- Assessing content variety and coverage
- Determining if existing content is sufficient

## Content Modeling

**When to use:** New blocks or structural changes to existing blocks

**Skip this step when:** Making non-structural changes (CSS only, decoration logic that doesn't affect content model)

**Workflow:**
1. Ask user: "Would you like me to use the content-modeling skill to design an author-friendly content model?"
2. If YES → Invoke **content-modeling** skill (it provides complete guidance)
3. If NO → Ask user to describe the content structure and document it

## Creating Test Content

**When to use:** After content model is defined and no existing content is available

**Skip this step when:** Existing content was found in Step 1 that covers all test scenarios

**Quick start:**
1. Ask user to choose:
   - **CMS Content (Recommended)** - Create in Google Drive/SharePoint/DA/Universal Editor
   - **Local HTML Files (Temporary)** - Create in `drafts/tmp/` for quick testing

2. **For CMS Content:**
   - Guide user through CMS creation process
   - Wait for user to provide URL(s)
   - Validate content loads in local dev environment

3. **For Local HTML:**
   - Create HTML file(s) in `drafts/tmp/{block-name}.plain.html`
   - Restart dev server: `aem up --html-folder drafts`
   - Remind user that CMS content will be needed before PR

**If creating test content, read `resources/content-creation.md` for complete guidance** on:
- HTML structure for local files (see also `resources/html-structure.md`)
- Making test content serve as documentation
- Content variety requirements (variants, edge cases)
- Validating test content quality

## Implementation

**CRITICAL: Do not begin implementation until test content exists and is accessible.**

**For blocks:**
- Invoke **building-blocks** skill (it handles implementation and testing)
- Provide: content model and test content URL(s)

**For core functionality (scripts, styles, etc.):**
- Make changes to scripts, styles, or configuration
- Test against identified content throughout development in browser
- Run linting regularly: `npm run lint`
- Verify existing functionality still works

## Validation

**CRITICAL: Browser validation is MANDATORY. Testing must be performed in a real browser environment, not with curl or command-line tools.**

**Workflow:**
1. Invoke **testing-blocks** skill (it provides complete guidance on testing and validation)
2. The testing-blocks skill covers:
   - Mandatory browser testing
   - Unit tests (if needed)
   - Linting and existing test verification
   - PR preparation requirements

## Anti-Patterns to Avoid

Common mistakes that violate CDD principles:
- ❌ Starting with code before understanding the content model
- ❌ Making assumptions about content structure without seeing real examples
- ❌ Creating developer-friendly but author-hostile content models
- ❌ Skipping content creation "to save time" (costs more time later)

## Resources

- **Philosophy:** `resources/cdd-philosophy.md` - Why content-first matters
- **Content Discovery:** `resources/content-discovery.md` - Finding and identifying existing content
- **Content Creation:** `resources/content-creation.md` - Creating test content (CMS vs local HTML)
- **HTML Structure:** `resources/html-structure.md` - Guide for creating local HTML test files

## Integration with Other Skills

This skill orchestrates the AEM development workflow:

**At Content Discovery stage:**
- Use `scripts/find-block-content.js` to locate existing content

**At Content Modeling stage:**
- Invoke **content-modeling** skill for author-friendly design

**At Implementation stage:**
- Invoke **building-blocks** skill for block development
- Reference **block-collection-and-party** skill for patterns

**At Validation stage:**
- Reference **testing-blocks** skill for comprehensive testing

Following this orchestration ensures all development follows content-first principles.
