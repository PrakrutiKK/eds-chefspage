# Migrate Recipe Detail Page

## Overview

Migrate the recipe detail page from `https://www.unileverfoodsolutions.co.uk/recipe/barley-greens-bowl-with-matcha-yuzu-dressing-R90033590.html` and create it as `barley-greens-bowl` under the recipes section. This is a new page type (recipe detail) that will require new block variants specific to recipe content (hero, ingredients, method steps, etc.).

## Source Page

- **URL:** `https://www.unileverfoodsolutions.co.uk/recipe/barley-greens-bowl-with-matcha-yuzu-dressing-R90033590.html`
- **Output name:** `barley-greens-bowl`
- **Location:** Under recipes (`content/recipe/barley-greens-bowl.plain.html`)

## Existing Project Context

- **Project type:** XWalk
- **Existing blocks:** cards-theme, cards-recipe, carousel-recipe, hero, columns, cards, fragment, header, footer
- **Existing templates:** chefpage, recipes (listings page)

## Migration Steps

1. **Page Analysis** — Scrape and analyze the recipe detail page structure (hero image, recipe info, ingredients, method, nutritional info, etc.)
2. **Block Identification** — Identify which blocks are needed for recipe detail (likely: hero-recipe, columns for ingredients/method, etc.)
3. **Block Variant Creation** — Create new block JS/CSS for any new variants
4. **Import Infrastructure** — Generate parser(s) and transformer(s) for the recipe-detail template
5. **Content Import** — Import the page content as `barley-greens-bowl.plain.html`
6. **Design Matching** — Style blocks to match the original page's design

## Checklist

- [ ] Analyze page structure at source URL
- [ ] Identify sections and blocks needed for recipe detail layout
- [ ] Create new block variants (hero-recipe, recipe info, ingredients, method)
- [ ] Add "recipe-detail" template to page-templates.json
- [ ] Generate import parser(s) for recipe detail blocks
- [ ] Generate import transformer for recipe detail cleanup
- [ ] Generate import script for recipe-detail template
- [ ] Import content and save as `barley-greens-bowl`
- [ ] Apply CSS to match original page design
- [ ] Verify page renders correctly in preview

---

> **Note:** Execution requires Execute mode. Switch to Execute mode to begin implementation.
