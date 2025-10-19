/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { AnimationModifier, AnimationOptions } from "./types";

const PROMPT_MAP: Record<string, string> = {
  // Zoom Category
  'zoom-classic': `Animate a hypnotic 'endless zoom' or 'Droste effect'. The viewpoint should fly smoothly and rapidly into the exact center of the image. As it zooms, a smaller, perfect replica of the original image must emerge from the center point, expanding to seamlessly replace the frame. The transition must be flawless to create a hypnotic, infinite tunnel illusion.`,
  'zoom-rotate': `Animate a mesmerizing 'spiraling zoom'. While the viewpoint zooms into the image's center, the entire canvas must also rotate smoothly and continuously. This creates a vortex or tunnel effect. A new version of the image emerges from the expanding center. The rotation speed must be consistent to create a perfect, dizzying loop.`,
  'zoom-fractal': `Animate a complex 'fractal zoom'. Instead of a single central zoom, the viewpoint should dive into multiple, smaller, self-similar versions of the image that appear within the details of the main subject. This creates an intricate, branching, kaleidoscopic effect. The animation must resolve by seamlessly returning to the starting state for a perfect loop.`,
  'zoom-reverse': `Animate a powerful 'outward burst' or 'reverse zoom'. Start with a tiny version of the image at the center of a black frame, which then rapidly expands outwards. As it expands, it reveals a larger version of the same image behind it. The effect is of continuously emerging from nested versions of the image. The final frame should show the image filling the frame, ready to loop back to the tiny centered version.`,
  'zoom-morph': `Animate a surreal 'morphing zoom'. As the camera zooms into the image's center, the details, colors, and textures should subtly morph, swirl, and shift into new patterns before resolving back into a smaller, clear version of the original image, which then expands to fill the screen. This adds a dreamlike, fluid quality to the endless zoom.`,
  
  // Sketch Category
  'sketch-pencil': `Animate a 'sketch-to-reality' sequence. Start with a clean, textured paper background. The animation should show a monochrome pencil or ink line sketch of the subject being drawn by an unseen hand. Then, add basic colors, followed by detailed shading, highlights, and textures. The final frame must be identical to the original, fully rendered source image. The illusion should be of a master artist's time-lapse.`,
  'sketch-charcoal': `Animate a dramatic 'charcoal drawing'. Start with bold, rough charcoal outlines on a heavily textured paper background. The animation must build up the image using smudging, blending, and subtraction (erasing) techniques to create deep shadows and soft gradients. The final frame is a high-contrast, expressive charcoal version of the source image.`,
  'sketch-ink': `Animate an 'ink crosshatching' illustration. The image should be built entirely from fine ink pen lines on a paper texture. Start with the main outlines, then build tone, shadow, and form by layering intricate crosshatching patterns. Denser hatching creates darker areas. The final frame is a stylized, illustrative version of the source image.`,
  'sketch-color-pencil': `Animate a 'colored pencil drawing'. Begin with a light graphite sketch on a toothy paper texture. Then, build up the image by layering different colors of pencil strokes, showing the texture of the pencil. The colors should blend optically. The final frame is a soft, textured, vibrant colored pencil drawing of the source image.`,
  'sketch-storyboard': `Animate the refinement of a rough storyboard panel. Frame 1 is a very loose, gestural sketch with rough perspective lines. Subsequent frames clarify the sketch, clean up the lines, add structural detail, and finally introduce color and shading until it resolves perfectly into the final source image.`,
  
  // Pixel Category
  'pixel-classic': `Animate a 'pixel art resolve' sequence. Start with an extremely low-resolution, blocky, 8-bit pixelated version of the image. In distinct steps, increase the resolution, making the pixels smaller and revealing more detail, until the final frame is identical to the original, high-resolution source image. It should feel like a classic 90s game graphic loading.`,
  'pixel-gameboy': `Animate an '8-bit handheld console' effect. The image forms using a limited, 4-color palette (e.g., shades of olive green). Start with a few large sprites, which then break down into a more detailed pixel scene. In the final frames, smoothly transition from the 4-color palette to the full-color source image, as if upgrading from old hardware.`,
  'pixel-dither': `Animate a 'dithering fade-in'. The image should emerge from a plain background using classic dithering patterns. Dots and cross-hatch patterns should gradually form the shapes and tones. The density of the dithered pattern should increase until it resolves into the smooth, full-color source image.`,
  'pixel-sort': `Animate a 'pixel sorting' effect. Start with the image's pixels sorted into vertical or horizontal colored bands based on brightness or hue. The animation shows these pixels cascading or moving from the sorted bands into their correct positions, like falling sand, to assemble the final, coherent image.`,
  'pixel-upgrade': `Animate an '8-bit to 16-bit' evolution. The animation begins with a simple, blocky, 8-bit style representation. It then redraws itself with a more detailed, shaded, and colorful 16-bit sprite aesthetic. Finally, it smoothly transitions from the 16-bit sprite into the final, photorealistic source image.`,
  
  // Watercolor Category
  'watercolor-classic': `Animate a 'watercolor wash' painting. Start with a faint pencil outline on textured watercolor paper. Apply light, watery color washes that bleed and blend softly. Build up color saturation with more layers, adding details while retaining the characteristic soft edges. The final frame is a vibrant watercolor painting of the source image.`,
  'watercolor-bleed': `Animate a 'wet-on-wet bleed' effect. Emphasize the fluid, unpredictable nature of watercolor. Colors should be dropped onto a wet-looking surface and dramatically bloom and bleed into each other to form the image. The edges should be extremely soft and feathery. The result is a loose, expressive watercolor version of the source image.`,
  'watercolor-ink': `Animate an 'ink and wash' illustration. First, bold, expressive black ink lines should draw the subject with varying line weight. Once the linework is established, transparent watercolor washes are applied over the top, filling the image with color but letting the strong ink lines define the form. The final frame is a classic illustrative piece.`,
  'watercolor-salt': `Animate a 'salt texture' effect. As watercolor washes are laid down, show crystalline patterns blooming within the wet paint, simulating the effect of salt creating starburst textures. These textures should then resolve and integrate into the final details of the beautiful watercolor painting.`,
  'watercolor-mask': `Animate a 'masking fluid reveal'. Start with vibrant color washes being applied over the entire image. Then, areas of the image are 'rubbed away' or 'peeled' to reveal the stark white of the paper underneath, creating sharp highlights and details. This animates as if masking fluid is being removed to define the brightest parts.`,

  // Neon Category
  'neon-classic': `Animate a 'flickering neon sign'. On a black background, the main outlines of the subject flicker on as thin, glowing neon tubes. Additional details and colors then turn on, with the glow intensifying and casting colored light on a subtle background texture (like a brick wall). The final frame is a stable, brightly glowing neon sign.`,
  'neon-pulse': `Animate a 'rhythmic pulsing' neon sign. Once the full neon sign is illuminated, the different colored tubes should pulse with light in a slow, hypnotic, rhythmic pattern. The brightness should swell and fade, creating a calming, mesmerizing loop that feels alive.`,
  'neon-liquid': `Animate a 'liquid neon' effect. Instead of static tubes, the neon light appears as a viscous, glowing liquid that flows smoothly into place, filling the outlines of the subject like mercury. The animation should be fluid and seamless, settling into the final, stable neon sign representation.`,
  'neon-broken': `Animate a 'faulty neon sign'. The sign attempts to turn on but sputters and flickers erratically. Some parts might fail to light up, or flash the wrong color, before the sign finally stabilizes into the fully lit, correct image for a moment, then loops back into the glitchy flickering.`,
  'neon-chromatic': `Animate a 'chromatic glow' neon effect. The neon tubes should have a subtle chromatic aberration, where the edges of the light split into red, green, and blue hues. This effect should shimmer and shift slightly throughout the animation, giving it a retro, analog, and slightly imperfect feel.`,

  // Glitch Category
  'glitch-digital': `Animate a 'digital glitch' loop. Start with the clean image. Introduce minor glitches like scan lines and slight RGB channel separation. The effect should intensify with blocky artifacts and screen tearing, before resolving back to the clean image to create a perfect, jarring loop.`,
  'glitch-vhs': `Animate a 'VHS tracking' glitch. The image should distort with effects characteristic of an old VHS tape. Animate horizontal tracking lines, color bleed, and momentary static and warping. It should feel like someone is adjusting the tracking on a VCR, with the image clearing up for a moment before the loop resets.`,
  'glitch-datamosh': `Animate a 'datamosh' transition. The image should break apart into a beautiful, flowing mess of macroblocks and pixel data from one frame bleeding into the next. The effect should be chaotic but artistic, with pixels seeming to flow before reassembling into the original source image.`,
  'glitch-static': `Animate an 'analog TV static' reveal. The image forms out of a screen of noisy, black-and-white TV static. The silhouette of the subject should appear first, then the details and colors resolve from the noise, as if tuning into a weak broadcast signal that finally locks on.`,
  'glitch-corrupt': `Animate a 'corrupted file' load. The image attempts to load from top to bottom, but parts are replaced with solid gray or colored blocks, as if the data is corrupted. The animation shows the image retrying the load, with the corrupted blocks flickering and eventually resolving to show the complete, correct source image.`,
  
  // Origami Category
  'origami-classic': `Animate an 'origami assembly'. Start with a flat, square piece of textured paper. The animation shows the paper folding itself along crisp lines, becoming more intricate with each fold, until it forms a stylized, geometric, low-poly version of the source image. It should look like a stop-motion of paper folding.`,
  'origami-crumple': `Animate a 'crumple and unfold' loop. The animation starts with a tightly crumpled ball of paper. It then animates to uncrumple itself, smoothing out to reveal the source image, retaining some of the crease textures. It then quickly crumples back up into a ball to create a perfect loop.`,
  'origami-popup': `Animate a 'pop-up book' scene. Start with a flat, book-like page. The subject then animates by folding and rising up from the page, creating a 3D pop-up papercraft version of the image with multiple layers creating depth. The animation should loop by having the pop-up fold back down flat.`,
  'origami-collage': `Animate a 'torn paper collage'. The image is formed by multiple pieces of colored, torn paper flying in from off-screen and assembling themselves into a collage that represents the source image. The final image will have a textured, layered, handmade look.`,
  'origami-assembly': `Animate a 'modular origami' assembly. The subject is constructed from several different colored pieces of paper that fold independently and then fly together and interlock, like a complex modular origami project, to form the final, stylized paper model.`,

  // Cosmic Category
  'cosmic-nebula': `Animate a 'nebula formation'. Start with a dark space background. A faint, glowing nebula of colored gas and dust swirls and coalesces, elegantly forming the shape of the subject. Bright stars ignite within it, until it solidifies into a vibrant, celestial version of the source image.`,
  'cosmic-supernova': `Animate a 'supernova burst'. The animation starts with a bright point of light that explodes outwards into a beautiful, expanding shockwave of color and energy. This energy then collapses back inwards, coalescing to form the final, glowing image of the subject.`,
  'cosmic-constellation': `Animate a 'constellation being drawn'. Start with points of light (stars) appearing in a dark sky. Then, ethereal, faint lines connect these stars, drawing the outline of the subject like a celestial chart. Finally, the space within the lines fills with cosmic light and color to form the complete image.`,
  'cosmic-aurora': `Animate an 'aurora form'. The subject should be formed from shimmering, shifting curtains of light, like an aurora borealis. The colors should be ethereal greens, purples, and blues, and they should wave and flow gently and organically throughout the animation loop.`,
  'cosmic-blackhole': `Animate a 'gravitational lensing' effect. Particles, dust, and light should be shown swirling and spiraling into a central point, as if being pulled in by a black hole. As they reach the center, they are not consumed, but instead assemble into the final image, warped as if by immense gravity.`,

  // Claymation Category
  'claymation-build': `Animate a 'stop-motion build'. Start with a lump of colored clay on a simple surface. The lump is quickly molded, shaped, and refined by unseen hands, with visible fingerprint textures. Details are added until the final, charmingly imperfect clay model of the source image is complete.`,
  'claymation-smear': `Animate a 'clay smear painting'. The image is formed by animating thick, textured smears of colored clay across a flat surface. The effect is like finger painting with clay, resulting in a vibrant, tactile, and slightly abstract version of the source image.`,
  'claymation-morph': `Animate a 'clay shape morph'. Start with a simple clay shape (like a sphere or cube). This shape should then smoothly and fluidly animate and morph, transforming from one shape to another, before finally settling into the detailed clay representation of the source image.`,
  'claymation-cutout': `Animate a 'clay cutouts' scene. Flat, colored shapes of clay should slide in from the edges of the frame, layering on top of each other to build the image. This should look like a 2D, stop-motion animation using clay pieces with a distinct, tactile feel.`,
  'claymation-wheel': `Animate a 'potter's wheel' creation. The animation starts with a lump of clay spinning on a potter's wheel. Unseen hands then shape the spinning clay, pulling and pushing it into the final, symmetrical form of the subject.`,

  // Blueprint Category
  'blueprint-classic': `Animate a 'blueprint to 3D' render. Start with a classic blue blueprint with white schematic lines and dimensions. A 3D wireframe fades in over the top, then flat colors fill the model. It finishes as a fully rendered, photorealistic object, identical to the source image.`,
  'blueprint-davinci': `Animate a 'Da Vinci sketch'. The animation starts as a sepia-toned ink sketch on old parchment, complete with annotations in mirror script. The sketch then animates, with components moving into place and gaining color and texture to become the realistic final image.`,
  'blueprint-hologram': `Animate a 'holographic projection'. A glowing, transparent, 3D wireframe of the subject is projected in a dark space. The wireframe should flicker and rotate, then solidify as colors and textures fill it in, becoming the final, solid object.`,
  'blueprint-cad': `Animate a 'CAD assembly'. The subject is shown as an exploded view of its component parts in a 3D design program. The animation shows these parts flying together and assembling with satisfying clicks and alignments into the final, complete object.`,
  'blueprint-chalk': `Animate a 'chalkboard schematic'. Start with a dark, chalkboard-like surface. A simple, white chalk outline of the subject is quickly drawn. Then, colored chalks animate to scribble in the colors and details, resulting in a stylized, hand-drawn version of the image with a dusty texture.`,
  
  // Retro Category
  'retro-crt': `Animate a 'CRT monitor boot-up'. The image appears on a simulated, curved CRT screen. Start with a single horizontal line that expands vertically to fill the screen, revealing the image with visible scanlines and a slight flicker. The animation loops by the screen turning off and collapsing back to a single point of light.`,
  'retro-polaroid': `Animate a 'Polaroid photo development'. The animation starts with the image inside a classic Polaroid frame. The image is initially a flat, sepia or blue tone, and then the colors and details slowly fade in and sharpen, mimicking the chemical development process of an instant photo.`,
  'retro-film': `Animate an 'old film reel'. The image should have the look of vintage 8mm or 16mm film, complete with heavy grain, dust, scratches, and a subtle, gentle flicker. The animation loop should feature a 'projector jump' where the frame shifts slightly, enhancing the analog feel.`,
  'retro-dotmatrix': `Animate a 'dot-matrix printer' output. The image is rendered line by line from top to bottom, with the characteristic sound and look of a 9-pin dot-matrix printer. The colors should be simple and banded. The animation loops by the "print head" quickly returning to the top.`,
  'retro-vcr': `Animate a 'VCR play button' sequence. Start with a blue screen, then a burst of static. The image then appears, but is distorted by VHS tracking lines at the top or bottom. The tracking lines should animate and settle, leaving a clear, slightly soft-focus image before the loop resets.`,
  
  // Nature Category
  'nature-growth': `Animate a 'vine growth' reveal. The subject of the image is "drawn" onto the screen by rapidly growing vines, leaves, and flowers. The growth should be organic and energetic, starting from a single point and spreading to cover the form of the subject in a beautiful, time-lapse-like fashion.`,
  'nature-erosion': `Animate a 'wind erosion' reveal. The animation starts with a solid block of sand or soft rock. Wind animates blowing across the surface, carving away particles to slowly reveal the source image hidden within. The final frame is the clear image, with a few grains of sand blowing past to create a loop.`,
  'nature-ice': `Animate a 'frost and thaw' loop. The animation begins with the clear image, which then becomes covered in intricate, growing frost patterns. Once fully frozen, it immediately begins to thaw, with the frost melting away to reveal the original image again, ready for the loop.`,
  'nature-fire': `Animate a 'burn reveal'. The animation starts with a black, paper-like surface. Licks of flame begin to burn away this surface, revealing the source image underneath. The edges of the burned area should glow like embers. The fire consumes the black surface to reveal the full image.`,
  'nature-seasons': `Animate a 'passing seasons' loop. The image transitions through the four seasons. Spring: buds and flowers bloom on the subject. Summer: light becomes bright and colors vibrant. Autumn: colors shift to reds and oranges, leaves fall. Winter: the image is dusted with snow and frost. It then quickly melts back to spring to loop.`,
  
  // Sci-Fi Category
  'scifi-replicator': `Animate a 'matter replicator' sequence, like from Star Trek. The image forms from a shimmering column of light and energetic particles that coalesce and solidify into the subject. The effect should be a beautiful swirl of light that resolves into a solid object.`,
  'scifi-hud': `Animate a 'Heads-Up Display' build. The image is assembled as a futuristic UI element. Start with targeting brackets and data readouts, which then lock on and project the final, solid image within the frame. The surrounding UI elements should blink and update.`,
  'scifi-warp': `Animate a 'warp speed' arrival. The stars (or background) stretch into long streaks of light, as if entering hyperspace. The subject of the image then streaks into view from the center and solidifies as the ship "exits" warp drive, with the background returning to normal.`,
  'scifi-matrix': `Animate a 'Matrix digital rain' formation. The image is formed from falling green computer characters. Initially, the characters form a noisy background, but they begin to coalesce and take on the colors of the final image, resolving into the clear picture as the digital rain fades.`,
  'scifi-scanner': `Animate a 'sci-fi scanner' reveal. A horizontal beam of blue or red light scans down the screen from top to bottom. The image is revealed in the wake of the beam. The loop can be created by the beam scanning back up, "erasing" the image, or by fading out and starting again from the top.`,
  
  // Fantasy Category
  'fantasy-magic': `Animate a 'magical appearance'. The image forms in a swirl of shimmering, magical particles (e.g., gold, purple). Glowing runes and sigils could briefly flash as the subject coalesces from the magical energy into its final, solid form.`,
  'fantasy-potion': `Animate a 'bubbling potion' vision. The view is inside a cauldron or bottle. Different colored liquids and ingredients are added, which bubble and swirl violently. The chaotic mixture then settles, and the colors separate to form the clear image as if it were a vision in the potion.`,
  'fantasy-scroll': `Animate a 'magical scroll' unfurling. An ancient, rolled-up scroll animates, unfurling itself across the screen. As it unfurls, the image is magically drawn onto the parchment with glowing ink. Once fully revealed, the scroll rolls itself back up to create the loop.`,
  'fantasy-summon': `Animate a 'summoning circle' materialization. A glowing, intricate magic circle is drawn on the ground. Energy gathers in its center, and the subject of the image materializes in a flash of light, rising up from the circle.`,
  'fantasy-crystal': `Animate a 'crystal growth' reveal. The image is revealed from within a growing, multifaceted, glowing crystal. The animation shows the crystal forming from a small shard, with the final image visible and sharp inside its crystalline structure.`,
  
  // Artistic Category
  'artistic-impressionism': `Animate an 'Impressionist painting' being created. The image is built up from visible, short, thick brushstrokes of color. It should start as an abstract collection of colors and dabs, which gradually resolve into the coherent shapes and light of the final image, mimicking the style of Monet or Renoir.`,
  'artistic-cubism': `Animate a 'Cubist' deconstruction. The subject of the image should fracture into geometric planes and shapes. The animation should show these shapes rotating and reassembling from multiple, abstract viewpoints simultaneously, before resolving into a final, stylized Cubist representation.`,
  'artistic-popart': `Animate a 'Pop Art' transformation. The image animates with the characteristics of Pop Art. The outlines become bold and black, the colors shift to a vibrant, limited palette, and a Ben-Day dot pattern animates across the surfaces. The loop could involve the colors flashing through different schemes.`,
  'artistic-stain-glass': `Animate a 'stained glass window' assembly. The image is assembled from pieces of colored glass. First, a black leaded frame (came) animates into place, outlining the subject. Then, the individual, textured glass pieces fly in from off-screen and slot into the frame.`,
  'artistic-mosaic': `Animate a 'mosaic tile' creation. The image is formed by thousands of small, square tiles (tesserae) clicking into place. The tiles should animate in waves across the screen to assemble the final, textured mosaic image.`,
  
  // Textile Category
  'textile-stitch': `Animate an 'embroidery' being stitched. The image is "stitched" onto a fabric canvas. The animation should show a needle and thread rapidly creating different stitches (like satin stitch for fills and backstitch for outlines) to form the image.`,
  'textile-weave': `Animate a 'tapestry weaving' on a loom. The image is formed by horizontal threads (weft) being woven through vertical threads (warp). The image should be revealed from bottom to top as the weaving progresses, showing the texture of the fabric.`,
  'textile-knit': `Animate a 'knitting' project. The image is revealed row by row, as if being knitted by invisible needles. The characteristic texture of knit stitches should be visible. The animation reveals the image from the bottom up.`,
  'textile-patchwork': `Animate a 'quilt patchwork' assembly. The image is assembled from various fabric patches with different patterns (plaid, floral, etc.). These patches fly in and are "stitched" together at the seams to form the final picture.`,
  'textile-dye': `Animate a 'tie-dye' reveal. Start with a white fabric texture. Brightly colored dyes then bleed and spiderweb across the fabric in classic tie-dye patterns, which then resolve to form the colors and shapes of the source image.`,
  
  // Liquid Category
  'liquid-inkdrop': `Animate an 'ink in water' effect. A single drop of colored ink falls into clear water. The ink then billows and swirls outwards in beautiful, complex plumes, and these plumes resolve to form the subject of the image.`,
  'liquid-splash': `Animate a 'paint splash' creation. The image is formed from a high-speed, dynamic splash of multiple colors of liquid paint, which collide and mix in mid-air to create the final composition. The animation should freeze on the most coherent frame.`,
  'liquid-ripple': `Animate a 'water ripple' loop. The image starts as a still reflection on water. A single drop hits the center, creating ripples that expand outwards and distort the image. The ripples then fade, and the reflection settles back to its original state to form a perfect loop.`,
  'liquid-pour': `Animate a 'viscous pour' painting. The image is revealed as a thick, viscous liquid like acrylic paint or honey is poured onto the screen. The liquid slowly flows and spreads out to cover the canvas and form the final image.`,
  'liquid-bubbles': `Animate a 'bubble reveal'. The screen is filled with shimmering soap bubbles. As these bubbles float and pop, they reveal parts of the underlying image. The animation continues until enough bubbles have popped to show the complete picture.`,
  
  // Mechanical Category
  'mechanical-gears': `Animate a 'clockwork mechanism'. The image is revealed by a complex mechanism of turning gears, moving pistons, and sliding panels. The machine assembles itself and then its movements form the final image with intricate precision.`,
  'mechanical-steampunk': `Animate a 'steampunk' contraption. The image is assembled from brass and copper parts, with visible clockwork and steam-powered elements. The animation should feature puffs of steam and the warm glow of vacuum tubes as it comes to life.`,
  'mechanical-drafting': `Animate a 'robotic drafting' arm. The image is drawn by a mechanical drafting arm or plotter. The animation shows the arm moving precisely, drawing lines with a pen, and using other tools like compasses to construct the image with technical precision.`,
  'mechanical-flipbook': `Animate a 'mechanical flipbook' machine. The animation shows the pages of a mechanical flipbook machine being turned by a crank. The drawings on the pages animate, and the final frame of the flipbook animation is the source image.`,
  'mechanical-assembly': `Animate a 'factory assembly line'. Robotic arms and machinery work on a conveyor belt to assemble the subject of the image from its component parts. The pieces are welded, screwed, and fitted together until the final product is complete.`,
  
  // Food Category
  'food-icing': `Animate a 'cake icing' decoration. The image is drawn onto a cake's surface using piped icing. The animation should show the icing being squeezed from a piping bag to form the lines and colors of the subject with a delicious texture.`,
  'food-latte': `Animate a 'latte art' pour. The animation shows steamed milk being poured into espresso, and a barista's tool etching a design. The swirling milk and foam then resolve into the source image as a piece of beautiful latte art.`,
  'food-fry': `Animate a 'pan fry' reveal. The image appears in a hot pan. The animation should show the subject sizzling and browning, with oil bubbling around it, as it "cooks" into its final, colored form.`,
  'food-decorate': `Animate a 'sprinkles' decoration. The image is formed by colorful sprinkles and other decorations (like candies or nuts) falling onto a surface and arranging themselves into the final picture.`,
  'food-slice': `Animate a 'food slice' stop-motion. The image is assembled, stop-motion style, from slices of various foods (fruits, vegetables, meats, etc.). The different colored slices are arranged to create a mosaic that forms the final image.`,
  
  // Papercraft Category
  'papercraft-cutout': `Animate a 'layered paper cutout' diorama. The image is built up from multiple layers of flat, colored paper cutouts. The layers slide in one by one, creating a sense of depth and parallax, like a beautiful papercraft scene.`,
  'papercraft-quilling': `Animate a 'paper quilling' design. The image is formed from thin strips of colored paper that are rolled, shaped, and glued into place. The animation should show these paper coils spinning and arranging themselves to create the final, intricate design.`,
  'papercraft-mache': `Animate a 'papier-mâché' build. The image is built up by strips of wet paper being layered over a form. The texture of the paper-mâché should be visible as it dries and is painted to become the final object.`,
  'papercraft-lantern': `Animate a 'paper lantern' lighting up. The image appears as a design on a folded paper lantern. The animation shows the lantern expanding and a light turning on inside, causing the image to glow warmly from within.`,
  'papercraft-diorama': `Animate a '3D diorama' assembly. The animation shows a 3D scene being built inside a box using paper cutouts. Elements are placed in the foreground, midground, and background to create a complete, multi-layered scene that represents the source image.`
};

const MODIFIER_INSTRUCTIONS: Record<AnimationModifier, string> = {
  'none': '',
  'rotate': `GLOBAL MODIFIER: Apply a smooth, continuous 360-degree clockwise rotation to the entire canvas throughout the animation. This rotation is a secondary effect that must happen concurrently with the primary creative direction. The final frame should seamlessly loop back to the first frame's rotation angle.`,
  'zoomIn': `GLOBAL MODIFIER: Apply a subtle, continuous zoom-in effect to the entire scene. The viewpoint should steadily move closer to the subject's center while the primary animation effect is playing. This zoom is a secondary effect.`,
  'zoomOut': `GLOBAL MODIFIER: Apply a subtle, continuous zoom-out effect to the entire scene. The viewpoint should steadily pull away from the subject's center while the primary animation effect is playing. This zoom is a secondary effect.`,
  'pan': `GLOBAL MODIFIER: Apply a smooth, continuous horizontal panning motion from left to right. The scene should shift sideways during the animation. If looping, the final frame must seamlessly connect back to the first frame's position to create a perfect horizontal loop. This is a secondary effect.`
};

export const buildCreativeInstruction = (options: AnimationOptions): string => {
  const { variantId, frameCount, frameDuration, isLooping, effectIntensity, modifier } = options;
  
  const storyPrompt = PROMPT_MAP[variantId] || PROMPT_MAP['zoom-classic'];
  const modifierInstruction = MODIFIER_INSTRUCTIONS[modifier];
  
  const loopInstruction = isLooping 
    ? 'The final frame must loop perfectly and seamlessly back to the first.'
    : 'The animation should have a clear beginning and end. It should resolve to a final, stable state and NOT loop.';
  
  const intensityMap = {
    low: 'The animation effect should be subtle and gentle.',
    medium: 'The animation effect should be noticeable and distinct, representing a standard intensity.',
    high: 'The animation effect should be dramatic, exaggerated, and highly energetic.',
  };
  const intensityInstruction = intensityMap[effectIntensity];
  
  // The centering instruction is only applied when there's no global movement modifier.
  const centeringInstruction = `CRITICAL REQUIREMENT: The primary subject of the image MUST remain perfectly centered in every frame relative to the canvas. Do not allow the subject to drift or change its central position. The scale of the subject should also remain consistent.`;

  const styleConsistencyInstruction = `It is crucial that all frames are in the same, consistent artistic style. Maintain the subject's integrity and core shapes consistently across all frames.`;
  
  const frameInstruction = `You MUST generate exactly ${frameCount} frames, arranged in a ${frameCount === 9 ? '3x3' : '4x4'} grid.`;

  const creativeDirection = `
CREATIVE DIRECTION:
${modifierInstruction ? `${modifierInstruction}\n\nPRIMARY EFFECT:\n${storyPrompt}` : storyPrompt}
${intensityInstruction}
${loopInstruction}
${modifier === 'none' ? centeringInstruction : ''}
${styleConsistencyInstruction}`;
  
  return `
${creativeDirection}

TECHNICAL REQUIREMENTS:
${frameInstruction}

REQUIRED RESPONSE FORMAT:
Your response MUST contain two parts:
1. A valid JSON object containing two keys: "frameCount" (which must be ${frameCount}) and "frameDuration" (which should be close to ${frameDuration}). Do not wrap the JSON in markdown backticks.
2. The sprite sheet image containing the requested number of frames.

Example of the JSON part:
{"frameCount": ${frameCount}, "frameDuration": ${frameDuration}}
`;
};