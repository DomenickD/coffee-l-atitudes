# Media Drop-In Folder

Place James's production media assets here:

1. `brick-hero.mp4` — 10-second seamless looping background video of James pointing at the 5 brick-wall storefront targets:
   - `0.0s - 2.0s`: Order Here / Pick-Up Here
   - `2.0s - 4.0s`: Café Menu
   - `4.0s - 6.0s`: Bagged Coffee
   - `6.0s - 8.0s`: Merch
   - `8.0s - 10.0s`: Learn About Us

   Once added, visit `/?calibrate=1` to drag each hotspot button onto the exact brick-wall target and copy the resulting JSON into `src/lib/hotspots.ts`.

2. `ambient-cafe.mp3` — Optional looping café / cloud-forest sensory ambiance track.

If either file is absent, the storefront automatically renders the architectural brick-wall CSS/SVG stage and Web Audio API procedural ambiance fallback.
