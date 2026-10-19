import JSZip from 'jszip';
import { Scene, RenderStyleConfig } from '../types/storyboard';
import { renderSceneToCanvas } from './canvasRenderer';
import { generatePythonScript } from './scriptGenerator';

export async function exportAllScenesZip(
  scenes: Scene[],
  config: RenderStyleConfig,
  onProgress?: (completed: number, total: number) => void
): Promise<void> {
  const zip = new JSZip();
  const total = scenes.length;

  // Offscreen canvas for rendering
  const offscreenCanvas = document.createElement('canvas');

  // Folder inside zip
  const scenesFolder = zip.folder('scenes');

  for (let i = 0; i < scenes.length; i++) {
    const scene = scenes[i];
    renderSceneToCanvas(offscreenCanvas, scene, config, 1.5); // High-res scale

    // Convert to PNG blob
    const blob = await new Promise<Blob | null>((resolve) => {
      offscreenCanvas.toBlob((b) => resolve(b), 'image/png');
    });

    if (blob && scenesFolder) {
      const fileName = `scene_${String(scene.sceneNumber).padStart(2, '0')}.png`;
      scenesFolder.file(fileName, blob);
    }

    if (onProgress) {
      onProgress(i + 1, total);
    }
  }

  // Include prompts text file
  const textContent = scenes
    .map((s) => `Scene ${String(s.sceneNumber).padStart(2, '0')}: ${s.title}\nPrompt: ${s.prompt}\nAction: ${s.actionType}\n`)
    .join('\n------------------------\n\n');
  zip.file('prompts.txt', textContent);

  // Include prompts JSON
  zip.file('prompts.json', JSON.stringify(scenes, null, 2));

  // Include ready-to-run Python script
  const pyScript = generatePythonScript(scenes, {
    modelName: 'imagen-3.0-generate-002',
    aspectRatio: config.aspectRatio,
    includeSleep: true,
    sleepSeconds: 1,
    outputDir: 'imagen_output',
    useEnvKey: false
  });
  zip.file('run_imagen.py', pyScript);

  // Include README
  const readme = `# StickScene Studio - 30 Scene Pack
Contains:
- /scenes/: ${scenes.length} rendered minimalist line-art 16:9 images
- prompts.txt: Raw list of all prompts
- prompts.json: Full structured metadata
- run_imagen.py: Python script to generate high-res Imagen versions with Google Generative AI

How to run the Python script locally:
1. pip install google-generativeai
2. Add your GEMINI_API_KEY in run_imagen.py
3. python run_imagen.py
`;
  zip.file('README.md', readme);

  // Generate zip file and download
  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = url;
  a.download = `stickman_storyboard_30_scenes.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadSingleScenePNG(
  scene: Scene,
  config: RenderStyleConfig
): void {
  const canvas = document.createElement('canvas');
  renderSceneToCanvas(canvas, scene, config, 1.5);

  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scene_${String(scene.sceneNumber).padStart(2, '0')}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 'image/png');
}
