# Cinemate Movie Streaming App - Design Guidelines

## Design Approach

**Reference-Based Approach**: Drawing inspiration from leading streaming platforms (Netflix, Disney+, Prime Video) while maintaining mobile-first optimization. This entertainment-focused application requires strong visual appeal and immersive browsing experience.

## Core Design Principles

1. **Content-First Philosophy**: Movie posters and backdrops drive the interface
2. **Mobile-Optimized**: Thumb-friendly navigation, vertical scrolling patterns
3. **Immersive Experience**: Full-bleed imagery, minimal chrome, focus on content
4. **Smooth Interactions**: Gesture-based navigation, fluid transitions

## Typography System

**Font Stack**: Google Fonts - Poppins (UI) + Inter (body text)

- **Hero Titles**: Poppins Bold, 32px mobile / 48px desktop
- **Movie Titles**: Poppins SemiBold, 18px mobile / 24px desktop
- **Section Headers**: Poppins Medium, 20px mobile / 28px desktop
- **Body Text**: Inter Regular, 14px mobile / 16px desktop
- **Metadata** (ratings, dates): Inter Medium, 12px mobile / 14px desktop
- **Buttons/CTAs**: Poppins SemiBold, 14px mobile / 16px desktop

## Layout System

**Spacing Scale**: Tailwind units of 2, 4, 6, 8, 12, 16 (e.g., p-4, m-8, gap-6)

**Container Strategy**:
- Mobile: Full-width with px-4 padding
- Desktop: max-w-7xl centered with px-8

**Grid Patterns**:
- Mobile: Single column or 2-column grid (grid-cols-2 gap-4)
- Tablet: 3-column grid (md:grid-cols-3 gap-6)
- Desktop: 4-5 column grid (lg:grid-cols-4 xl:grid-cols-5 gap-6)

## Component Library

### Navigation
- **Bottom Navigation Bar** (Mobile Primary): Fixed bottom bar with Home, Search, Favorites, Profile icons. Use 56px height with icons centered
- **Top Header**: Transparent overlay on home, solid on detail pages. Logo left, user avatar right, height 64px

### Home Screen Components

**Hero Section**:
- Full-viewport backdrop image with gradient overlay (bottom fade)
- Featured movie poster positioned left on mobile, centered on desktop
- Movie title, rating badge, genre tags, short description
- Primary CTA: "Watch Now" button (blurred background, prominent)
- Secondary CTA: "Add to List" button (subtle, outlined)
- Height: 85vh mobile / 70vh desktop

**Category Carousels**:
- Horizontal scrolling movie cards (snap-scroll behavior)
- Section header with "See All" link
- Card design: Poster image with 2:3 aspect ratio
- On hover/tap: Scale slightly (1.05), show quick info overlay
- Spacing: gap-4 between cards, py-8 between sections

**Movie Cards**:
- Poster image with rounded corners (rounded-lg)
- Rating badge positioned top-right (absolute positioning)
- Title overlay at bottom with gradient background
- Mobile: w-40 (160px), Desktop: w-48 (192px)

### Search Page
- **Search Bar**: Sticky top position, large touch target (h-12)
- **Filter Chips**: Horizontal scroll of group filters (Anime, Movies, etc.)
- **Results Grid**: Same grid pattern as home, adapts to screen size
- **Empty State**: Illustration placeholder with search suggestions

### Video Player Page

**Video Section**:
- Full-width video player with custom controls
- Landscape orientation optimized (can go fullscreen)
- Controls: Play/pause, progress bar, volume, fullscreen, 10s skip buttons
- Height: 56.25vw (16:9 ratio) capped at 70vh

**Movie Details Section** (below player):
- Movie title (large, prominent)
- Rating stars + numerical score + release date row
- Genre tags (pill-shaped badges)
- Overview text (max-w-prose for readability)
- Vertical spacing: space-y-4

**Cast Section**:
- Horizontal scrolling row of actor cards
- Each card: Circular profile image (96px diameter), name, character name
- Snap-scroll behavior for smooth browsing

**Related Movies**:
- Grid of 2-4 related titles
- Same card design as home screen

### Favorites/Watchlist Page
- Grid layout matching home screen
- Empty state with CTA to browse movies
- Remove button on card hover (X icon, top-right)

## Images

**Hero Images**: Required for home page hero section - use backdrop images from JSON API data, apply dark gradient overlay (from transparent to rgba(0,0,0,0.7)) for text legibility

**Movie Posters**: Display throughout app from JSON API poster URLs, maintain 2:3 aspect ratio, implement lazy loading

**Actor Profiles**: Circular cropped images from TMDB API, 96px diameter for cast section

**Backdrop Images**: Full-width backdrop images on video player page and movie detail modals

## Interaction Patterns

- **Card Interactions**: Tap to navigate, no complex hover states on mobile
- **Scroll Behavior**: Smooth scrolling, snap points for carousels
- **Loading States**: Skeleton screens matching card layouts
- **Transitions**: Fade-in for images (200ms), slide-up for modals (300ms)
- **Video Controls**: Auto-hide after 3s of inactivity, show on tap/hover

## Icons

**Icon Library**: Heroicons (via CDN) - outline style for navigation, solid for actions

Required icons: Home, Search, Heart, User (navigation), Play, Pause, Volume, Fullscreen, Star (rating), Plus, X (close/remove)

## Accessibility

- Touch targets minimum 44px × 44px
- Video player keyboard controls (space to play/pause, arrow keys for seek)
- Focus indicators on all interactive elements
- ARIA labels for icon-only buttons
- Subtitle/caption support in video player