# Panel Schedule Feature Implementation Summary

## What Was Accomplished

### 1. **Panel Schedule Feature - Core Implementation** ✅

#### Created `schedule.js`
- New data file to store panel schedule information
- Structured by day (Friday/Saturday), then by panel
- Currently contains Doug Van Pelt's two panels:
  - **Friday 6:30-7:45pm**: "90s Heavy Music" panel with 5 panelists
  - **Saturday 11:15am-12:30pm**: "Remembering Mike Knott" panel with 5 panelists

#### Updated `index.html`
- Changed section heading from "Guest Panel Moderators" to "Guest Panel Hosts"
- Updated descriptive text to reference "hosts" instead of "moderators"

#### Updated `guests.js`
- Added `gender` field to all 80+ guest objects (`"male"`, `"female"`, or `"they"`)
- Updated Jyro Xhan's name to "Jyro La Villa" and image reference
- Updated MorZan's band members list with bullet points: "Jyro La Villa • Dale Dimapindan • Luke Olver • Frank Lenz"

#### Updated `script.js` - Major Additions
- Imported `schedule` data from `schedule.js`
- Added global state tracking: `currentExpandedHost` and `panelSection`
- Created helper functions:
  - `hostHasPanels(hostName)` - checks if host has panels in schedule
  - `getHostPanels(hostName)` - retrieves host's panel data
  - `createMiniPanelistCard(panelistName)` - renders mini guest cards (photo + name only)
  - `createPanelSection(hostName)` - generates full panel schedule HTML
  - `showPanelSection(hostName)` - displays panel section with blur/scroll effects
  - `closePanelSection()` - hides panel section and restores normal view
  - `setupScrollBoundaries()` - locks scrolling between host card and schedule bottom
- Modified `renderGuests()` to add "Show [FirstName]'s Panel Schedule" button to moderator cards
- Added event listeners for:
  - `.show-panels-btn` clicks
  - `.panel-close-btn` clicks
  - Clicking outside card/schedule to close
- Updated hover text to use gender-aware pronouns: "Tap [name]'s photo to ask [him/her/them] a question..."

#### Updated `style.css` - Panel Schedule Styles
- Added styles for:
  - `.panel-section` - full-width expandable section
  - `.panel-section-container` - wrapper for panel content
  - `.panel-close-btn` - X button (1.5rem, bold)
  - `.panel-section-title` - main heading using Noto Sans Black (900)
  - `.panel-day-section` - day groupings
  - `.panel-day-heading` - day/date headers
  - `.panel-name` - emphasized panel names
  - `.mini-panelists-grid` - responsive grid (2 cols mobile, 3 cols tablet/desktop)
  - `.mini-panelist-card` - dark background (#2a2a2a), cream text, square 1:1 images with `object-position: top`
- Added `slideDown` and `slideUp` keyframe animations
- Updated `.panel-expanded` blur effect to exclude moderators section and panel section
- Adjusted moderator card spacing:
  - Removed extra vertical padding above name and below projects
  - Increased guest name size by 25%
  - Tightened spacing to match between elements
- Made close button bigger and bolder on both card back and panel schedule

### 2. **UX Behaviors Implemented**

- **Single Panel View**: Only one host's panel schedule can be open at a time
- **Blur Effect**: When panel schedule is open, all other sections are blurred
- **Smart Scrolling**: 
  - Page scrolls down to show the panel schedule
  - Scrolling is locked between top of host card and bottom of schedule
  - Clicking outside or close button restores free scrolling
- **Smooth Transitions**: Panel section slides down when opening, wipes up when closing
- **Non-interactive Blurred Cards**: Blurred guest cards don't respond to clicks
- **Mini Cards**: Simplified panelist cards showing only photo (square, top-aligned) and name

### 3. **File Renames via Terminal**
- Renamed `jyro-xhan.jpg` to `jyro-la-villa.jpg`
- Renamed `jyro-xhan.webp` to `jyro-la-villa.webp`

## Current State

### What's Working
- ✅ Doug Van Pelt's card shows "Show Doug's Panel Schedule" button
- ✅ Clicking button reveals his two panels (Friday & Saturday)
- ✅ Mini panelist cards display correctly with square images and names
- ✅ Blur effect works on other sections
- ✅ Scroll locking keeps view focused on host card and schedule
- ✅ Close button (X) appears and works
- ✅ Clicking outside closes the panel schedule
- ✅ Gender-aware hover text on all guest cards

### Next Steps for Panel Schedule Feature
1. **Collect panel data** for remaining hosts sequentially
2. **Add to `schedule.js`** as data is provided
3. **Test each host** before moving to the next
4. **Add JSON Structured Data** once all Friday & Saturday details are complete

## Technical Notes

### Data Structure in `schedule.js`
```javascript
export const schedule = [
    {
        day: "Friday",
        date: "October 24, 2025",
        panels: [
            {
                hostName: "Doug Van Pelt",
                time: "06:30-07:45pm",
                panelName: "90s Heavy Music",
                panelists: ["Doug Thieme", "Klank", "Pat Servedio", "Josh Hagquist", "Timothy Mann"]
            }
        ]
    },
    // ... more days
];
```

### Key CSS Classes
- `.show-panels-btn` - Button on moderator cards
- `.panel-section` - Full expandable section
- `.mini-panelist-card` - Small guest cards in schedule
- `.panel-expanded` - Body class when schedule is open

### Important Functions in `script.js`
- `showPanelSection(hostName)` - Opens schedule
- `closePanelSection()` - Closes schedule
- `createMiniPanelistCard(panelistName)` - Renders mini cards
- `hostHasPanels(hostName)` - Checks if host has panels
- `getHostPanels(hostName)` - Retrieves host's panel data

## Files Modified
- `schedule.js` (new file)
- `index.html`
- `guests.js`
- `script.js`
- `style.css`
- Image files renamed (jyro-xhan → jyro-la-villa)

## Remaining Panel Hosts

The following moderators still need their panel schedules added to `schedule.js`:
- Chris Brigandi
- Eddie Harbour
- Jeremy Alan Gould
- Joey Svendsen
- Leanor Ortega Till

## How to Add More Panel Data

1. Ask user for next host's panel details
2. Add panel data to appropriate day in `schedule.js`:
```javascript
{
    hostName: "Host Full Name",
    time: "HH:MMam/pm-HH:MMam/pm",
    panelName: "Panel Name",
    panelists: ["Panelist 1", "Panelist 2", ...]
}
```
3. Test the host's card to verify button appears and schedule displays correctly
4. Proceed to next host

This feature is ready for you to continue adding panel data for the remaining hosts!

