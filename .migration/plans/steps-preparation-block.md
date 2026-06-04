# Create Preparation Steps Block for Recipe Detail Page

## Overview

Create a new `steps-preparation` block for the `barley-greens-bowl` recipe detail page that displays numbered preparation steps matching the reference design:
- Orange "Preparation" heading
- Numbered steps with orange circle badges (auto-incrementing)
- Bold sub-heading per step (e.g., "For the salad", "For the dressing")
- Bullet-point instructions under each step
- Dark rounded pill-shaped category tags at the bottom (e.g., "Salads", "Tofu")

## Current State

The preparation content currently exists as **default content** (an `<ol>` with `<li>` items containing `<h4>` headings and `<ul>` instruction lists) in `content/recipe/barley-greens-bowl.plain.html`. It needs to be converted into a styled block with proper CSS and JS decoration.

## Design Requirements (from reference image)

| Element | Style |
|---------|-------|
| Section heading "Preparation" | Orange color (`#ff5a00`), ~24px, font-weight 600 |
| Step number badge | Orange filled circle (#ff5a00), white number inside, ~28px diameter |
| Step title (h4) | Bold, dark text, ~18px |
| Step instructions | Bullet list, normal weight, grey text, 16px |
| Category tags | Dark purple/brown pill buttons (#3d3349), white text, rounded corners, padding |
| Vertical connector | Orange line connecting step badges vertically |

## Implementation Plan

### 1. Create `blocks/steps-preparation/` block

- **`steps-preparation.js`** — Decorate function that:
  - Finds `<ol>` with `<li>` items
  - Wraps each `<li>` with a numbered badge element (auto-incrementing counter)
  - Adds CSS class hooks for the vertical connector line
  
- **`steps-preparation.css`** — Styles matching the reference:
  - CSS counter for auto-numbering badges
  - Orange circle badges with `::before` pseudo-element
  - Vertical orange line between steps
  - Bold step titles
  - Bullet lists for instructions
  - Dark pill-shaped tags at the bottom

### 2. Update `content/recipe/barley-greens-bowl.plain.html`

- Wrap the preparation `<ol>` content in a `<div class="steps-preparation">` block table
- Move the category tag links ("Salads", "Tofu") inside or below the block

### 3. Add block model (XWalk)

- Create `_steps-preparation.json` with the UE model definition

## Checklist

- [ ] Create `blocks/steps-preparation/steps-preparation.js` with decoration logic (auto-increment numbering)
- [ ] Create `blocks/steps-preparation/steps-preparation.css` matching reference design (orange badges, vertical line, pill tags)
- [ ] Create `blocks/steps-preparation/metadata.json` with block metadata
- [ ] Create `blocks/steps-preparation/_steps-preparation.json` with UE model definition
- [ ] Update `content/recipe/barley-greens-bowl.plain.html` to use the steps-preparation block
- [ ] Verify lint passes for new JS and CSS files
- [ ] Verify block renders correctly in preview

---

> **Note:** Execution requires Execute mode. Switch to Execute mode to begin implementation.
