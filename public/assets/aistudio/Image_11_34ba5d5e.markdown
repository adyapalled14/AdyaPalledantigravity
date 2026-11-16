---
name: Civic Emerald
colors:
  surface: '#071610'
  surface-dim: '#071610'
  surface-bright: '#2d3c35'
  surface-container-lowest: '#04110b'
  surface-container-low: '#101e18'
  surface-container: '#14231c'
  surface-container-high: '#1e2d26'
  surface-container-highest: '#293831'
  on-surface: '#d5e7dc'
  on-surface-variant: '#c0c9c3'
  inverse-surface: '#d5e7dc'
  inverse-on-surface: '#25342d'
  outline: '#8a938e'
  outline-variant: '#404945'
  surface-tint: '#9ed1bd'
  primary: '#9ed1bd'
  on-primary: '#00382a'
  primary-container: '#1b4d3e'
  on-primary-container: '#8abda9'
  inverse-primary: '#376757'
  secondary: '#86db70'
  on-secondary: '#033900'
  secondary-container: '#0b6302'
  on-secondary-container: '#89de73'
  tertiary: '#88d982'
  on-tertiary: '#003909'
  tertiary-container: '#005111'
  on-tertiary-container: '#74c570'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#baeed9'
  primary-fixed-dim: '#9ed1bd'
  on-primary-fixed: '#002117'
  on-primary-fixed-variant: '#1d4f40'
  secondary-fixed: '#a1f889'
  secondary-fixed-dim: '#86db70'
  on-secondary-fixed: '#012200'
  on-secondary-fixed-variant: '#055300'
  tertiary-fixed: '#a3f69c'
  tertiary-fixed-dim: '#88d982'
  on-tertiary-fixed: '#002204'
  on-tertiary-fixed-variant: '#005312'
  background: '#071610'
  on-background: '#d5e7dc'
  surface-variant: '#293831'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 28px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 26px
  title-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-tablet: 1.5rem
  gutter-desktop: 2rem
  margin: 1rem
  margin-tablet: 2rem
  margin-desktop: 3rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

The design system establishes a trustworthy, civic-minded, and eco-responsive aesthetic tailored for rapid municipal waste reporting and tracking, now presented in an immersive dark mode theme. The audience ranges from everyday residents and commercial facility managers to field-level municipal supervisors operating under varying outdoor lighting conditions. 

The emotional tone balances institutional reliability with contemporary environmental stewardship: clean, high-contrast, welcoming, and decisively actionable.

To support high-utility mobile interactions, the design direction fuses **Modern Civic Utility** with **Tactile Elements**:
- **Structured Whitespace & Hierarchy:** High typographic contrast ensures instant legibility for citizens filing requests on the go or field workers operating in low-light environments.
- **Eco-Forward Palette:** Deep civic forest greens establish institutional authority, while energetic vibrant mint provides forward-moving clarity and alert tokens handle hazard classification.
- **Physical Affordance & Tactility:** Cards have deliberate surface containment, while touch targets feature crisp edge delineation and tactile pressed feedback to make digital civic participation feel concrete and reliable.

## Colors

The color architecture is built to support clarity in dark environments while clearly categorizing waste streams and urgency levels.

- **Primary (`#1B4D3E`):** Deep Forest Green. Represents municipal integrity, governance, and institutional authority. Used for primary navigation headers, top-level brand markers, high-emphasis action triggers, and primary text hierarchy.
- **Secondary (`#4E9F3D`):** Vibrant Fresh Mint. Symbolizes active cleanliness and operational vitality. Applied to forward actions, progress steps, verified badges, and actionable micro-interactions.
- **Tertiary (`#2E7D32`):** Grounded Botanical Green. Serves as intermediate utility accenting, subtle borders, and balanced contextual tags.
- **Neutral (`#24332C`):** Deep Slate Green. Neutral surfaces and body copy avoid harsh carbon black in favor of this deeply saturated mineral slate, reducing visual fatigue while exceeding WCAG AAA contrast against dark backgrounds.

### Named Domain Colors
- **`surface-canvas` (`#F4F8F5`):** Soft emerald-tinted off-white for the main background to eliminate screen glare during field usage.
- **`surface-card` (`#FFFFFF`):** High-density pure white card surfaces to cleanly separate request payloads and camera AI insights from the background canvas.
- **`hazard-alert` (`#D32F2F`):** High-urgency alert red for severe civic hazards, blocked arterial drains, and medical waste alerts.
- **`hazard-amber` (`#F57C00`):** Precautionary amber for bulk overflows, pending validations, and volume escalations.
- **Category Colors (`waste-wet`, `waste-dry`, `waste-hazardous`, `waste-cd`):** Explicit categorical tokens for visual waste type recognition across AI output screens.

## Typography

The design system employs **Plus Jakarta Sans** uniformly across all typographic scales. Its geometric balance, open apertures, and sturdy counters maintain exceptional legibility across varied device resolutions and outdoor glare environments.

### Typographic Hierarchy & Guidelines
- **Weight Strategy:** Restrict usage to `400` (Regular) for body and metadata, `600` (SemiBold) for structural titles and actionable buttons, and `700` (Bold) for critical headlines, metrics, and emergency badges.
- **Multilingual Accommodation:** Plus Jakarta Sans provides generous ascenders and descenders that align harmoniously alongside localized regional typefaces (such as Kannada script implementations), maintaining consistent vertical bounding boxes.
- **Tabular Data:** Use monospaced figure settings (`font-variant-numeric: tabular-nums`) for tracking ticket IDs, Ward Numbers, and GPS coordinates to prevent UI jitter during status updates.

## Layout & Spacing

The layout operates on an **8px base grid** (represented in 0.25rem increments) prioritizing mobile field utility with adaptable fluid structures.

### Grid Architecture
- **Mobile (< 600px):** Single-column fluid layout with `1rem` outer canvas margin and `1rem` gutters. Touch components must satisfy a minimum height of 48px to accommodate single-handed field operation.
- **Tablet (600px - 1024px):** 6-column fluid grid with `2rem` outer margins. Inspection cards, image split-views, and ward analytics reflow into dual-column cards.
- **Desktop / Dashboard (> 1024px):** 12-column fixed grid with a max-width container of `1280px` centered with `3rem` margins. Primary navigation converts to a persistent left-rail drawer for ward-level routing.

### Spacing Principles
- Compact metadata blocks (e.g., ticket ID tags, coordinate badges) utilize `space-xs` and `space-sm`.
- Card internal paddings strictly standardize to `space-md` for standard cards and `space-lg` for focal AI classification summaries.
- Section stacks enforce `space-xl` separation to guarantee clear cognitive transitions between image verification and ward dispatch actions.

## Elevation & Depth

Visual hierarchy uses a refined hybrid of **low-contrast emerald borders** and **ambient natural shadows** to establish physical presence without distracting visual noise in a dark mode context.

### Layering Model
- **Level 0 (Canvas):** Grounded background tone (`#F4F8F5`), fully matte.
- **Level 1 (Cards & Containers):** Pure white background (`#FFFFFF`) framed by a 1px structural outline using `#1B4D3E` at 10% opacity (`rgba(27, 77, 62, 0.1)`), layered over an ambient diffused shadow: `0px 2px 8px rgba(27, 77, 62, 0.04)`.
- **Level 2 (Interactive Floating Elements & Bottom Sheets):** Used for bottom submission trays, sticky camera shutter panels, and floating ward trackers: `0px 8px 24px rgba(27, 77, 62, 0.12)`, bordered by `rgba(27, 77, 62, 0.14)`.
- **Level 3 (Modals & Hazard Dialogs):** High-priority alerts float above a dim backdrop scrim (`rgba(36, 51, 44, 0.6)`) with elevation shadow: `0px 16px 32px rgba(27, 77, 62, 0.18)`.

## Shapes

The design system embraces a **Rounded (Level 2)** shape language, conveying friendliness, environmental approachability, and structured civic modernity.

### Corner Radius Tokens
- **Base Components (`rounded`, 0.5rem / 8px):** Form input fields, dropdown triggers, checkboxes, and inline category badges.
- **Cards & Visual Containers (`rounded-lg`, 1rem / 16px):** Primary camera viewfinders, verification cards, ticket status modules, and modal containers.
- **Interactive Action Trays (`rounded-xl`, 1.5rem / 24px):** Bottom action sheets, high-priority alert cards, and top navigation header containers.
- **Pill Shapes (`rounded-full`, 9999px):** Status chips, counter markers, and circular floating camera controls.

## Components

### 1. Buttons
- **Primary Civic Button:** Solid Forest Green (`#1B4D3E`) surface with white text, font `label-lg`, 48px height, 12px horizontal padding, `rounded` (8px). Pressed state depresses slightly with an overlay of 15% black and subtle inset depth.
- **Secondary / Action Button:** Solid Fresh Mint (`#4E9F3D`) with white text for positive progression (e.g., "Verify AI Scan", "Dispatch Crew").
- **Hazard Action Button:** Solid Hazard Red (`#D32F2F`) for emergency reports and toxic waste escalation.
- **Ghost / Outlined Button:** Transparent fill with 1.5px border of `#1B4D3E` and matching label color.

### 2. Status Chips & Waste Badges
- **Status Chips:** Height 28px, `rounded-full`, uppercase `label-sm` tracking.
  - *Submitted:* Neutral Slate tint (`rgba(36, 51, 44, 0.08)`) with `#24332C` text.
  - *Assigned to Truck:* Amber tint (`rgba(245, 124, 0, 0.12)`) with `#F57C00` text.
  - *Collected / Resolved:* Fresh Mint tint (`rgba(78, 159, 61, 0.14)`) with `#1B4D3E` text.
- **Waste Classification Chips:** Incorporate a 6px solid category-colored leading dot alongside descriptive text (`Organic/Wet`, `Dry/Recyclable`, `Hazardous/E-Waste`, `C&D`).

### 3. Cards & Verification Modules
- **Standard Content Card:** White (`#FFFFFF`) surface, `rounded-lg` (16px), 16px internal padding, subtle emerald outline (`rgba(27, 77, 62, 0.08)`).
- **AI Vision Output Card:** Dual-panel architecture. Top pane displays the captured waste photo with bounding boxes; bottom pane presents confidence bars for waste classification, volume estimates, and urgency scores.

### 4. Input Fields & Selectors
- **Text & Geolocation Inputs:** 48px height, background `#FFFFFF`, border 1px solid `rgba(27, 77, 62, 0.2)`, `rounded` (8px). On focus, 2px border ring of `#1B4D3E` without glow rings.
- **Source Category Selector (Segmented Control):** Pill or soft-corner container wrapping 3 equal segments (`Residential`, `Office`, `Public Event`) with smooth mechanical slide transitions.

### 5. Checkboxes & Radio Buttons
- 20px x 20px form factor with a 2px border of `#1B4D3E`. Active states fill completely with `#1B4D3E` featuring a crisp white SVG check icon. 
- Radio selections feature a centered 8px solid core when selected.

### 6. Ward & GPS Indicator Bar
- Specialized civic status banner anchored directly beneath the app header: displays live GPS lock, current Ward Number, and Ward Name in bold `label-md` alongside a pulsating mint connection dot.