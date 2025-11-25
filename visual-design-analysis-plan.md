# Visual Design Analysis Skill Plan

## Problem Statement

**Current behavior:**
- Agents do OK with "vibe coding" blocks when allowed to determine design elements themselves
- Agents struggle when given specific design requirements through:
  - Screenshots of designs from existing sites
  - Mockups or Figma exports
  - Detailed design descriptions
  - URLs to match design from existing pages
- No systematic approach to analyzing visual design and translating to CSS
- Agents "eyeball it" during implementation, leading to mismatches
- Agents get lazy during testing/validation, taking screenshots and saying they look ok when they look nothing like the expected design

**Example scenarios that fail:**
- "Match the spacing and typography from this screenshot"
- "Make it look like this Figma mockup" (with screenshot)
- "Match the design at example.com/page"
- "Use these specific spacing values and color palette"

---

## Current State

**Where visual design is mentioned in existing skills:**

1. **building-blocks/SKILL.md (line 216):**
   - Mentions passing "Screenshots of existing implementation/design/mockup to verify against" to testing-blocks
   - But this is for validation AFTER implementation
   - No guidance on HOW to analyze the design during implementation

2. **page-import workflow:**
   - Scrapes existing pages and matches design
   - But specifically for migration/import use case
   - Not applicable to building new blocks that match a design

3. **testing-blocks:**
   - Receives screenshots for validation comparison
   - Post-implementation only

**The gap:**
- No skill or guidance for systematically analyzing visual design BEFORE/DURING implementation
- No process for extracting specific values (spacing, colors, typography) from designs
- No structured approach to translating visual requirements into CSS

---

## Relationship to CDD

**This is NOT strictly part of the CDD workflow:**
- CDD is about content-first development workflow (content → model → implementation → validation)
- Visual design analysis is about translating visual requirements into CSS implementation

**This IS related to CDD implementation phase:**
- CDD Step 5 invokes building-blocks skill for implementation
- building-blocks Step 4 handles CSS styling
- Visual design analysis would be invoked during building-blocks Step 4 when specific design requirements exist

**Parallel to content-modeling:**
- content-modeling analyzes CONTENT structure
- visual-design-analysis analyzes VISUAL design
- Both inform implementation but address different concerns

---

## Proposed Solution

### Create New Skill: visual-design-analysis

**Purpose:** Systematically analyze visual designs (screenshots, mockups, URLs) and extract specific CSS implementation guidance

**Scope:** Visual design only (spacing, typography, colors, layout, responsive behavior)

**Type:** Standalone skill that can be invoked from building-blocks or used ad-hoc

---

## Skill Specification

### Inputs (at least one required):

- `screenshot` - Path to screenshot/mockup/figma export image
- `url` - URL of page to match design from
- `description` - Detailed textual description of design requirements
- `context` - What element/block/component is being designed

### Workflow:

**Phase 1: Visual Analysis**

If screenshot provided:
1. Read and analyze the screenshot/mockup image
2. Identify visual design elements:
   - Layout structure (grid, flex, alignment patterns)
   - Spacing system (padding, margins, gaps)
   - Typography hierarchy (sizes, weights, line-heights, families)
   - Color palette (backgrounds, text, borders, accents)
   - Border radius, shadows, other visual effects
   - Responsive behavior hints (if multiple viewports shown)

If URL provided:
1. Navigate to URL in browser (playwright)
2. Take screenshots at different viewport sizes (mobile, tablet, desktop)
3. Inspect computed styles of relevant elements
4. Extract actual CSS values used
5. Identify responsive breakpoints and behavior changes

If description provided:
1. Parse design requirements from description
2. Identify specific values mentioned (colors, spacing, fonts)
3. Note any design system references

**Phase 2: Extract Specific Values**

Output structured design tokens:

```markdown
## Spacing System
- Base unit: 8px (or identified system)
- Padding values: 16px, 24px, 32px, 48px
- Margin values: 16px, 24px, 32px
- Gap values: 16px, 24px

## Typography
- Heading: 48px/1.2, weight 700, family: [detected]
- Subheading: 24px/1.4, weight 600
- Body: 16px/1.6, weight 400
- Small: 14px/1.5, weight 400

## Colors
- Primary: #1a73e8
- Background: #ffffff
- Text: #202124
- Border: #e0e0e0
- Accent: #ea4335

## Layout
- Max-width: 1200px
- Columns: 12-column grid at desktop, single column mobile
- Breakpoints: 600px (tablet), 900px (desktop)

## Visual Effects
- Border radius: 8px
- Box shadow: 0 2px 4px rgba(0,0,0,0.1)
```

**Phase 3: CSS Implementation Guidance**

Translate design tokens into CSS recommendations:

```css
/* Custom properties to define */
--block-spacing-base: 8px;
--block-spacing-2x: 16px;
--block-spacing-3x: 24px;
--block-primary-color: #1a73e8;
--block-heading-size: 48px;

/* Layout pattern recommendation */
display: grid;
grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
gap: var(--block-spacing-3x);

/* Responsive approach */
Mobile-first: Start with single column, stack elements
Tablet (600px): 2-column layout
Desktop (900px): 3-column layout with max-width constraint
```

**Phase 4: Comparison Validation (if URL provided)**

- Render the implemented block
- Compare side-by-side with target design
- Identify specific mismatches (spacing off by Xpx, color doesn't match, etc.)
- Provide specific fix recommendations

### Success Criteria:

- ✅ Specific numeric values extracted (not "generous padding" but "32px padding")
- ✅ Color values as hex codes
- ✅ Typography values in px/rem with line-heights
- ✅ Layout structure identified (grid vs flex, alignment, etc.)
- ✅ Responsive breakpoints and behavior documented
- ✅ CSS implementation patterns provided
- ✅ If URL provided: Comparison validation performed

### Outputs:

This skill provides:
- Design tokens (specific values for spacing, colors, typography, etc.)
- CSS custom property recommendations
- CSS implementation patterns (layout, responsive, effects)
- Responsive breakpoint strategy
- If URL provided: Side-by-side comparison and mismatch notes

**Next step:** Return to building-blocks Step 4 with specific CSS guidance

---

## Integration with Existing Skills

### building-blocks/SKILL.md

Update Step 4 (Add CSS Styling) to reference visual design analysis:

```markdown
## Step 4: Add CSS Styling

**For specific design requirements (screenshot, mockup, URL to match):**

**Invoke:** visual-design-analysis skill

**Provide:**
- Screenshot of design/mockup (if available)
- URL to match design from (if available)
- Description of design requirements
- Context: block name and purpose

**This will provide specific CSS values and patterns before implementing.**

---

**Otherwise (vibe coding, general styling):**

Follow the essential patterns below...

[Rest of existing Step 4 content]
```

### testing-blocks/SKILL.md

Update to reference visual-design-analysis for comparison testing:

```markdown
**For design validation against specific requirements:**

If original design screenshot/URL was provided during implementation:
- Invoke visual-design-analysis skill with:
  - Original design screenshot/URL
  - Screenshot of current implementation
  - Request comparison validation
- Address any mismatches identified
```

---

## File Structure

```
.claude/skills/visual-design-analysis/
├── SKILL.md (new)
└── resources/
    └── design-analysis-patterns.md (optional - common design patterns reference)
```

---

## Implementation Tasks

1. **Create visual-design-analysis skill**
   - File: `.claude/skills/visual-design-analysis/SKILL.md`
   - ~200-300 lines
   - Follow page-import structure (numbered workflow steps)

2. **Update building-blocks/SKILL.md**
   - Add conditional section to Step 4 (CSS Styling)
   - Reference visual-design-analysis skill when design requirements exist
   - Keep existing patterns for "vibe coding" scenarios

3. **Update testing-blocks/SKILL.md**
   - Add reference to visual-design-analysis for design validation
   - Provide pattern for comparison testing against original designs

4. **Test the skill**
   - Test with screenshot input
   - Test with URL input
   - Test with description input
   - Verify specific values are extracted (not vague descriptions)
   - Test integration with building-blocks workflow

---

## Expected Outcomes

**Quantitative:**
- Agents extract specific numeric values (spacing in px, exact colors, typography values)
- Agents identify layout patterns systematically (grid/flex, columns, alignment)
- Agents implement responsive designs matching specific breakpoints

**Qualitative:**
- Agents stop guessing at design requirements
- Agents systematically analyze designs before implementing CSS
- Design mismatches reduced (spacing, colors, typography match requirements)
- Better results when implementing from mockups/screenshots/URLs

**Behavioral changes expected:**
- Agents invoke visual-design-analysis when screenshots/URLs provided
- Agents extract and document design tokens before writing CSS
- Agents use specific values extracted rather than approximating
- Agents validate against original design systematically

---

## Key Capabilities

The visual-design-analysis skill should be able to:

1. **Read and analyze screenshots/mockups** (image analysis capability)
2. **Navigate to URLs and extract computed styles** (playwright + DOM inspection)
3. **Compare rendered output to target design** (screenshot comparison)
4. **Extract specific numeric values** (not "generous padding" but "32px")
5. **Identify design systems** (8px grid system, 1.5 scale typography, etc.)
6. **Translate visual design to CSS patterns** (specific implementation guidance)

---

## Open Questions

1. **Comparison accuracy:** How precise should screenshot comparison be? Pixel-perfect or "close enough"?
2. **Design system detection:** Should skill try to infer design systems (e.g., Material Design, Bootstrap) or just extract values?
3. **Responsive analysis:** If only desktop screenshot provided, should skill infer mobile/tablet behavior or request additional screenshots?
4. **Color extraction:** How to handle gradients, transparency, or complex color scenarios?
5. **Typography matching:** How to handle web font detection and fallback recommendations?

---

## Success Validation

**Test scenarios:**

1. **Screenshot matching:**
   - Provide screenshot of a card component with specific spacing
   - Verify agent extracts exact padding/margin values
   - Verify implemented CSS matches screenshot

2. **URL matching:**
   - Provide URL of existing site section to match
   - Verify agent extracts actual CSS values from target
   - Verify implemented design matches target URL

3. **Figma export:**
   - Export Figma design to PNG
   - Provide to agent with context
   - Verify agent identifies layout structure, spacing, colors
   - Verify implemented component matches Figma design

4. **Description-based:**
   - Provide detailed textual design requirements
   - Verify agent translates to specific CSS values
   - Verify implementation matches description

**Success criteria:**
- ✅ Agents invoke skill when design requirements provided
- ✅ Agents extract specific numeric values
- ✅ Implemented designs match requirements (validated by human)
- ✅ Fewer iterations needed to match design
- ✅ CSS is more maintainable (uses design tokens/custom properties)

---

## Notes

- This skill is NOT about creating new design systems - it's about analyzing existing designs and matching them
- This skill focuses on CSS implementation, not JavaScript behavior
- This skill complements (not replaces) content-modeling - both inform implementation from different perspectives
- Consider whether this should integrate with existing design system detection tools or remain standalone
- May want to add reference material about common design systems (Material, Bootstrap, Tailwind patterns) to help identify them
