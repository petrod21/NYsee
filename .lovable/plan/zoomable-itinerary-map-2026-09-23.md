# Zoomable itinerary map

## What will change
- Make each daily itinerary map support pinch-to-zoom on phones and wheel zoom on computers.
- Keep the point under the user’s fingers or cursor anchored while zooming.
- Allow dragging the enlarged map in any direction.
- Add accessible zoom in, zoom out, and reset controls over the map.
- Keep the existing route image, black route lines, red stop dots, loading behavior, and unavailable state.

## Technical details
- Use `react-zoom-pan-pinch` for reliable touch, trackpad, mouse-wheel, and drag behavior.
- Constrain zoom to a useful range and prevent map gestures from scrolling the page while actively interacting.
- Verify the interaction and layout at desktop and mobile sizes.
