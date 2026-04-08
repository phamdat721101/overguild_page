# Design System Document: The Web3 Frontier

## 1. Overview & Creative North Star

### The Creative North Star: "The Terminal Sovereign"
This design system is built for the "Web3 Frontier." It rejects the soft, rounded aesthetics of traditional SaaS to embrace a high-fidelity, industrial-tech ethos. We represent **Respect, Prestige, and Contribution** not through friendly metaphors, but through sharp precision, neon luminosity, and data-dense layouts.

The design breaks the "template" look through:
*   **Intentional Asymmetry:** Utilizing staggered grids and offset containers to mimic the unpredictability of a frontier.
*   **Brutalist Precision:** Zero-radius corners (0px) that communicate a rigid, architectural strength.
*   **Tonal Depth:** Moving beyond flat dark modes into a world of layered glass and ambient neon glows.

---

## 2. Colors

The color palette is a study in high-contrast "Void Space." We use deep blacks to create a vacuum, allowing neon accents to behave like light sources rather than just flat UI colors.

### Color Roles
*   **Primary (`#FFFFFF`):** Reserved for core data and high-priority content.
*   **Primary Container (`#00FEE5`):** Our "Cyan/Aqua" neon. Used for the most vital action points and states of prestige.
*   **Secondary (`#FFB694` / `#FF6A00`):** Our "Ember" accent. Used to signify urgency, power, and high-tier contribution.
*   **Tertiary (`#C3F400`):** Our "Lime Green." Dedicated to growth, onboarding, and new builder activities.

### The "No-Line" Rule
**Prohibit 1px solid borders for sectioning.** To separate large content blocks, do not draw lines. Instead, shift the background color. Use a `surface-container-low` section sitting against a `surface` background. Let the change in tonal value define the boundary.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. 
*   **Base:** `surface` (`#10131a`)
*   **Low Elevation:** `surface-container-low`
*   **High Elevation:** `surface-container-highest`
Each nested container should move up the tier scale to create a natural, "stacked" sense of importance.

### Signature Textures
*   **Neon Bleed:** Use 0% to 100% gradients of `#00FEE5` at low opacities (5-10%) to create "environmental lighting" in the corners of sections.
*   **Glassmorphism:** For floating overlays, use the `surface` color at 60% opacity with a `backdrop-filter: blur(12px)`.

---

## 3. Typography

Typography must feel like an encrypted terminal translated for a premium editorial.

*   **Display & Headlines (Space Grotesk):** This is our "Command Center" font. It is utilitarian yet modern. Use `display-lg` for heroic moments, and always keep letter-spacing tight (-0.02em) to maintain a sleek, technical edge.
*   **Body & Titles (Inter):** For high-density information. Inter provides the necessary legibility to balance the "techy" display headers.
*   **The "Glitch" Utility (VT323):** Use this monospaced font sparingly (10% of the UI) for metadata, coordinates, or "system logs" to reinforce the Web3 frontier aesthetic.

### Hierarchy & Brand Voice
The massive scale difference between `display-lg` (3.5rem) and `label-sm` (0.68rem) creates an editorial tension. It suggests that while the "Big Vision" is grand, the "Technical Detail" is precise.

---

## 4. Elevation & Depth

We eschew traditional shadows for **Tonal Layering** and **Luminescent Depth**.

*   **The Layering Principle:** Depth is achieved by placing a `surface-container-lowest` card on a `surface-container-low` section. This "recessed" look feels more like a hardware interface than a software app.
*   **Ambient Shadows:** If an element must float (e.g., a modal), use a shadow color tinted with `#00FEE5` at 5% opacity, with a massive blur (40px-60px). This mimics a neon sign casting light against a dark wall.
*   **The "Ghost Border" Fallback:** If accessibility requires a border, use the `outline-variant` token at **20% opacity**. It should be felt, not seen.
*   **Glow Effects:** Critical text (like "Building the Web3 Frontier") should utilize a `text-shadow` of the `primary-container` color to simulate a cathode-ray tube (CRT) glow.

---

## 5. Components

### Buttons
*   **Primary:** Solid `#00FEE5` with `#00201c` text. 0px corner radius. High-glow on hover.
*   **Secondary:** Ghost style. `outline-variant` (20% opacity) border with `#00FEE5` text.
*   **Tertiary:** All caps, `label-md` Inter, with a `>` leading character.

### Cards
Cards must never have shadows. They use **Glassmorphism** (Backdrop blur) or **Tonal Shift**. 
*   *Requirement:* A "Cyan Notch." A 2px wide vertical line of `#00FEE5` on the left or top edge to denote "Active" or "Premium" status.

### Input Fields
*   **Default:** `surface-container-highest` background, 0px radius, bottom-only border using `outline`.
*   **Focus State:** The bottom border transforms into a 2px `#00FEE5` glow line.

### Chips (Badges)
Use `VT323` for chip text. They should look like terminal tags. 
*   **Style:** `surface-container-lowest` background with a subtle `#C3F400` text for "Contribution" metrics.

### Lists
**Forbid divider lines.** Use vertical white space from the spacing scale (e.g., 24px or 32px) to separate items. If separation is visually impossible, use a subtle background hover state shift.

---

## 6. Do's and Don'ts

### Do
*   **Do** use 0px border radius for everything. Sharpness is prestige.
*   **Do** use extreme contrast in typography. Pair a huge headline with tiny, monospaced metadata.
*   **Do** treat neon colors as "light sources"—they should glow, not just be flat fills.
*   **Do** use asymmetrical layouts where content is pushed to the edges, creating "active" negative space.

### Don't
*   **Don't** use 1px solid borders to define boxes. It looks "cheap" and "standard."
*   **Don't** use rounded corners. It breaks the "Frontier" toughness.
*   **Don't** use generic drop shadows. If it doesn't look like a glowing light, don't use it.
*   **Don't** use more than three neon colors in a single view. Keep the "Void" dominant.