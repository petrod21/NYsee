# Add custom attraction search

## What will change
- Add the requested message directly below the Attractions heading.
- Add an autocomplete field for NYC attraction names or street addresses.
- Let a traveler select a suggestion and add it to the attraction list for this trip.
- Show custom places as selected items with a sensible default visit time and clear remove option.
- Carry custom places into itinerary grouping, maps, and directions alongside the existing top 50.

## Technical details
- Reuse the existing debounced NYC place search and place-details service.
- Extend saved trips to store custom attraction details so they persist in the browser and remain compatible with older saved trips.
- Treat custom places as open daily unless live opening hours are available; do not invent venue hours.
- Verify autocomplete, selection, itinerary creation, and the current build.
