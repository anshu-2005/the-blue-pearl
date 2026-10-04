# 🚀 Stage 2 Roadmap: True 3D WebGL Configurator

The current `InteractiveConfigurator` component operates at **Stage 1: Photo-based Pseudo-3D**. It relies on high-resolution image sequences and CSS filtering to mimic a live selection environment. This provides a fast, beautifully polished user experience without requiring a massive initial investment in 3D modeling.

To ultimately migrate to **Stage 2: True WebGL 3D**, use the following technical roadmap.

## 🛠 Required Tech Stack
*   **Engine:** `three.js` wrapped in `@react-three/fiber`
*   **Helpers:** `@react-three/drei` (for `OrbitControls`, `Environment`, `ContactShadows`)
*   **Models:** `.glb` or `.gltf` required for each base piece of jewellery.

## 📦 Asset Generation (The 4-6 Week Blocker)
Before writing any code, you must commission a 3D Modeler to create **PBR (Physically Based Rendering) models** of the jewellery:
1.  **Topology:** Ensure models are low/mid-poly (under 50k triangles) for web performance.
2.  **UV Mapping:** Must be perfectly mapped to accept seamless metal textures.
3.  **Materials:** 
    *   **Metals:** Require roughness and metalness maps (`three.js` `MeshStandardMaterial`).
    *   **Gemstones:** Require transmission and index-of-refraction parameters to scatter light realistically (`MeshPhysicalMaterial`).

## 💻 Code Implementation Flow

1. **Lazy Load the Engine**
   Do *not* bundle Three.js into the main layout. Dynamically import the 3D Canvas component only when the user reaches the `/design` route.
   ```tsx
   const WebGLViewer = dynamic(() => import('./WebGLViewer'), { ssr: false, loading: () => <Spinner /> })
   ```

2. **Load & Swap Materials on the Fly**
   Build `Environment` lighting (using an HDR map of a jewellery studio to make the gold/silver reflect softly).
   Use React state (`const [metal, setMetal] = useState('gold')`) to pass the active material into the model mesh.
   ```tsx
   <mesh material={metal === 'gold' ? goldMaterial : silverMaterial} geometry={nodes.RingBase.geometry} />
   ```

3. **Interactivity via `drei`**
   Use `<OrbitControls enableZoom={true} enablePan={false} autoRotate={!isInteracting} />` to let the user drag to spin the ring anywhere, not just pan sequences.

## ⚠️ Important Note regarding SEO & Performance
A 3D configurator often takes 5+ MB to load. Keep the Stage 1 photo-based viewer active as a fallback for users on slow 3G networks or mobile devices where WebGL might crash the browser buffer.
