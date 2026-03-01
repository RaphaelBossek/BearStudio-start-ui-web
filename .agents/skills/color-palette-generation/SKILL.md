---
name: color-palette-generation
description: Systematic color palette generation for topic visualization. Generates extendable, consistent, and readable HSL/OKLCH colors based on topic indices or identifiers.
---

# Systematic Color Palette Generation for Topics

This skill describes how to generate an **extendable**, **consistent**, and **readable** color palette for topic visualization in documentation and UI.

## Purpose

To produce distinct colors for an arbitrary number of topics following a deterministic rule, ensuring readability and harmony across light and dark themes.

## Core Design Goals

1.  **Qualitative Scaling**: Colors are for categories, not numeric scales.
2.  **Visual Consistency**: Similar saturation and lightness across topics so no single topic is visually "louder."
3.  **Deterministic**: Same topic index or ID must always result in the same color.
4.  **Infinite Scalability**: Works for `N = 1...∞` topics.

## Color Models

### 1. HSL (Hue, Saturation, Lightness)
Simple, widely supported, and sufficient for most documentation use cases.

### 2. HCL / OKLCH (Hue, Chroma, Luminance)
Perceptually uniform. Recommended when consistent perceived contrast is critical across many categories.

## Implementation Rules

### 1. HSL Algorithm (Golden Angle Distribution)

Use a golden-angle step ($\Delta H \approx 137.5^\circ$) to distribute hues evenly.

**Parameters for Light Background:**
- $S = 65\%$
- $L = 45\%$
- $H_0 = 30^\circ$ (Starting hue)
- $\Delta H = 137^\circ$

**Algorithm:**
Given a zero-based topic index `i`:
1. $H_i = (H_0 + i \cdot \Delta H) \bmod 360$
2. $S_i = S, L_i = L$
3. Convert $(H_i, S_i, L_i)$ to Hex.

### 2. Theme Support

| Theme | Saturation ($S$) | Lightness ($L$) |
| :--- | :--- | :--- |
| **Light** | 65% | 45% |
| **Dark** | 70% | 65% |

### 3. Deterministic Mapping from Identifiers

To keep colors stable across sessions for named topics:
1. Hash the string identifier (e.g., `"billing"`) to an integer.
2. Use the hash as the index `i` in the algorithm.

```ts
function topicIndexFromId(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return hash;
}
```

## Seeding with Known Palette

For the first $N$ topics (e.g., 8-10), you may use a predefined "seed" palette for better aesthetic control before falling back to the generated algorithm.

**Recommended Seed Colors:**
`#1F77B4` (Blue), `#FF7F0E` (Orange), `#2CA02C` (Green), `#D62728` (Red), `#9467BD` (Purple), `#8C564B` (Brown), `#E377C2` (Pink), `#7F7F7F` (Gray).

## Accessibility & Contrast

- **WCAG AA Compliance**: Ensure final text on background meets at least 4.5:1 ratio.
- **Helper**: Use an `ensureContrast(fg, bg, minRatio)` function to adjust lightness if the generated color is used for text.
- **Usage**: Prefer using topic colors for accents (icons, borders, chart lines) rather than large blocks of text.

## Configuration Interface

Allow overrides for:
- `H0` (Starting hue)
- `step` (Hue step, default `137`)
- `S`, `L` for both themes
- `seedColors` array
