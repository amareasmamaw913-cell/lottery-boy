import { Scene, RenderStyleConfig } from '../types/storyboard';

export function renderSceneToCanvas(
  canvas: HTMLCanvasElement,
  scene: Scene,
  config: RenderStyleConfig,
  customScale: number = 1
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Determine dimensions based on aspect ratio
  let width = 1280;
  let height = 720; // 16:9

  if (config.aspectRatio === '1:1') {
    width = 1000;
    height = 1000;
  } else if (config.aspectRatio === '9:16') {
    width = 720;
    height = 1280;
  } else if (config.aspectRatio === '4:3') {
    width = 1024;
    height = 768;
  }

  // Set internal resolution scaled
  canvas.width = width * customScale;
  canvas.height = height * customScale;

  ctx.save();
  ctx.scale(customScale, customScale);

  // Background
  ctx.fillStyle = config.bgColor;
  ctx.fillRect(0, 0, width, height);

  // Chalkboard subtle texture if selected
  if (config.theme === 'chalkboard') {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
    for (let i = 0; i < 40; i++) {
      ctx.fillRect(
        Math.random() * width,
        Math.random() * height,
        Math.random() * 80 + 20,
        Math.random() * 2 + 1
      );
    }
  }

  // Blueprint grid if selected
  if (config.theme === 'blueprint') {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    const step = 40;
    for (let x = 0; x < width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }

  // Setup stroke styles
  ctx.strokeStyle = config.strokeColor;
  ctx.fillStyle = config.strokeColor;
  ctx.lineWidth = config.lineWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const groundY = height * 0.72;
  const centerX = width * 0.5;

  // 1. Draw Ground Line
  ctx.beginPath();
  ctx.moveTo(width * 0.08, groundY);
  ctx.lineTo(width * 0.92, groundY);
  ctx.stroke();

  // Subtle ground hatch marks
  ctx.lineWidth = Math.max(1, config.lineWidth * 0.6);
  for (let gx = width * 0.12; gx < width * 0.88; gx += 36) {
    ctx.beginPath();
    ctx.moveTo(gx, groundY);
    ctx.lineTo(gx - 10, groundY + 12);
    ctx.stroke();
  }
  ctx.lineWidth = config.lineWidth;

  // 2. Action Pose Logic
  const action = scene.actionType;
  const expression = scene.customDetails?.expression || 'neutral';
  const hasSpeedLines = scene.customDetails?.hasSpeedLines ?? true;
  const prop = scene.customDetails?.prop || 'none';

  // Draw Props First if behind stickman
  if (prop === 'rock' || action === 'tripping') {
    drawRock(ctx, centerX + 60, groundY);
  }
  if (prop === 'banana') {
    drawBanana(ctx, centerX + 40, groundY);
  }
  if (prop === 'clock' || action === 'looking_clock') {
    drawClock(ctx, centerX + 180, groundY - 180, 55);
  }
  if (action === 'bus_chase') {
    drawBusReceding(ctx, width * 0.82, groundY);
  }
  if (action === 'rain_umbrella') {
    drawRainCloud(ctx, centerX, height * 0.22);
  }

  // Draw Character Pose
  ctx.lineWidth = config.lineWidth;
  switch (action) {
    case 'running_late':
      drawRunningPose(ctx, centerX, groundY, expression, hasSpeedLines);
      break;
    case 'tripping':
      drawTrippingPose(ctx, centerX, groundY, expression);
      break;
    case 'falling':
      drawFallingPose(ctx, centerX, groundY, expression);
      break;
    case 'looking_clock':
      drawLookingClockPose(ctx, centerX, groundY, expression);
      break;
    case 'coffee_spill':
      drawCoffeeSpillPose(ctx, centerX, groundY, expression);
      break;
    case 'briefcase_flying':
      drawBriefcaseFlyingPose(ctx, centerX, groundY, expression);
      break;
    case 'bicycle_ride':
      drawBicyclePose(ctx, centerX, groundY, expression);
      break;
    case 'bus_chase':
      drawBusChasePose(ctx, centerX - 120, groundY, expression);
      break;
    case 'rain_umbrella':
      drawUmbrellaPose(ctx, centerX, groundY, expression);
      break;
    case 'sliding':
      drawSlidingPose(ctx, centerX, groundY, expression);
      break;
    case 'jumping':
      drawJumpingPose(ctx, centerX, groundY, expression);
      break;
    case 'superhero_fly':
      drawSuperheroFlyPose(ctx, centerX, groundY, expression);
      break;
    case 'desk_typing':
      drawDeskPose(ctx, centerX, groundY, expression);
      break;
    case 'celebrating':
      drawCelebratingPose(ctx, centerX, groundY, expression);
      break;
    case 'thinking':
      drawThinkingPose(ctx, centerX, groundY, expression);
      break;
    case 'sleeping':
      drawSleepingPose(ctx, centerX, groundY, expression);
      break;
    default:
      drawDefaultPose(ctx, centerX, groundY, expression);
      break;
  }

  // Draw Speech or Thought bubble if present
  if (scene.customDetails?.speechBubble) {
    drawSpeechBubble(ctx, centerX + 90, groundY - 260, scene.customDetails.speechBubble, config);
  }

  // 3. Scene Info / Watermark in corner if enabled
  if (config.showSceneWatermark) {
    ctx.fillStyle = config.strokeColor;
    ctx.font = '600 16px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`SCENE ${String(scene.sceneNumber).padStart(2, '0')}`, 40, 48);

    ctx.font = '500 14px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = config.theme === 'chalkboard' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)';
    if (config.theme === 'darkline') ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.fillText(scene.title, 40, 72);
  }

  // 4. Border if enabled
  if (config.showBorder) {
    ctx.strokeStyle = config.strokeColor;
    ctx.lineWidth = Math.max(1, config.lineWidth * 0.7);
    ctx.strokeRect(20, 20, width - 40, height - 40);
  }

  ctx.restore();
}

// ----------------- POSE DRAWING FUNCTIONS -----------------

function drawHead(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  expression: string
) {
  // Head circle
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();

  // Face features
  const eyeR = 2.5;
  const eyeOffset = radius * 0.35;
  const eyeY = y - radius * 0.1;

  if (expression === 'dizzy') {
    // Spiral / X eyes
    drawX(ctx, x - eyeOffset, eyeY, 4);
    drawX(ctx, x + eyeOffset, eyeY, 4);
    // Wavy mouth
    ctx.beginPath();
    ctx.moveTo(x - 8, y + radius * 0.4);
    ctx.quadraticCurveTo(x - 4, y + radius * 0.2, x, y + radius * 0.4);
    ctx.quadraticCurveTo(x + 4, y + radius * 0.6, x + 8, y + radius * 0.4);
    ctx.stroke();
  } else if (expression === 'panic' || expression === 'shock') {
    // Wide open eyes
    ctx.beginPath();
    ctx.arc(x - eyeOffset, eyeY, eyeR + 1, 0, Math.PI * 2);
    ctx.arc(x + eyeOffset, eyeY, eyeR + 1, 0, Math.PI * 2);
    ctx.stroke();

    // Open mouth
    ctx.beginPath();
    ctx.ellipse(x, y + radius * 0.4, 6, 8, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Sweat drop
    ctx.beginPath();
    ctx.moveTo(x + radius + 4, y - radius * 0.3);
    ctx.quadraticCurveTo(x + radius + 10, y - radius * 0.1, x + radius + 6, y + 2);
    ctx.quadraticCurveTo(x + radius + 2, y, x + radius + 4, y - radius * 0.3);
    ctx.stroke();
  } else if (expression === 'happy') {
    // Happy squint eyes ^ ^
    ctx.beginPath();
    ctx.moveTo(x - eyeOffset - 4, eyeY + 2);
    ctx.lineTo(x - eyeOffset, eyeY - 3);
    ctx.lineTo(x - eyeOffset + 4, eyeY + 2);

    ctx.moveTo(x + eyeOffset - 4, eyeY + 2);
    ctx.lineTo(x + eyeOffset, eyeY - 3);
    ctx.lineTo(x + eyeOffset + 4, eyeY + 2);
    ctx.stroke();

    // Smile
    ctx.beginPath();
    ctx.arc(x, y + radius * 0.2, 10, 0.1 * Math.PI, 0.9 * Math.PI);
    ctx.stroke();
  } else if (expression === 'determined') {
    // Slanted eyebrows
    ctx.beginPath();
    ctx.moveTo(x - eyeOffset - 5, eyeY - 4);
    ctx.lineTo(x - 2, eyeY - 1);
    ctx.moveTo(x + 2, eyeY - 1);
    ctx.lineTo(x + eyeOffset + 5, eyeY - 4);
    ctx.stroke();

    // Dot eyes
    ctx.beginPath();
    ctx.arc(x - eyeOffset, eyeY, eyeR, 0, Math.PI * 2);
    ctx.arc(x + eyeOffset, eyeY, eyeR, 0, Math.PI * 2);
    ctx.fill();

    // Firm line mouth
    ctx.beginPath();
    ctx.moveTo(x - 6, y + radius * 0.4);
    ctx.lineTo(x + 6, y + radius * 0.4);
    ctx.stroke();
  } else {
    // Neutral
    ctx.beginPath();
    ctx.arc(x - eyeOffset, eyeY, eyeR, 0, Math.PI * 2);
    ctx.arc(x + eyeOffset, eyeY, eyeR, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x - 6, y + radius * 0.35);
    ctx.lineTo(x + 6, y + radius * 0.35);
    ctx.stroke();
  }
}

function drawX(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) {
  ctx.beginPath();
  ctx.moveTo(cx - size, cy - size);
  ctx.lineTo(cx + size, cy + size);
  ctx.moveTo(cx + size, cy - size);
  ctx.lineTo(cx - size, cy + size);
  ctx.stroke();
}

function drawRunningPose(
  ctx: CanvasRenderingContext2D,
  cx: number,
  gy: number,
  expression: string,
  speedLines: boolean
) {
  const headR = 24;
  const headX = cx + 30;
  const headY = gy - 190;
  drawHead(ctx, headX, headY, headR, expression);

  // Torso leaning forward
  const neckX = headX - 6;
  const neckY = headY + headR;
  const hipX = cx - 25;
  const hipY = gy - 95;

  ctx.beginPath();
  ctx.moveTo(neckX, neckY);
  ctx.lineTo(hipX, hipY);
  ctx.stroke();

  // Arms: Back arm pumped back, Front arm pumped forward with briefcase
  const shoulderX = neckX - 4;
  const shoulderY = neckY + 14;

  // Front arm
  ctx.beginPath();
  ctx.moveTo(shoulderX, shoulderY);
  ctx.lineTo(shoulderX + 45, shoulderY - 15);
  ctx.lineTo(shoulderX + 65, shoulderY + 20);
  ctx.stroke();

  // Draw briefcase in hand
  drawBriefcase(ctx, shoulderX + 65, shoulderY + 25, -15);

  // Back arm
  ctx.beginPath();
  ctx.moveTo(shoulderX, shoulderY);
  ctx.lineTo(shoulderX - 40, shoulderY + 10);
  ctx.lineTo(shoulderX - 65, shoulderY - 20);
  ctx.stroke();

  // Legs: front extended forward, back extended backward
  // Front leg (bent forward stride)
  ctx.beginPath();
  ctx.moveTo(hipX, hipY);
  ctx.lineTo(hipX + 50, hipY + 45);
  ctx.lineTo(hipX + 75, gy);
  ctx.stroke();

  // Back leg (kicking high back)
  ctx.beginPath();
  ctx.moveTo(hipX, hipY);
  ctx.lineTo(hipX - 45, hipY + 30);
  ctx.lineTo(hipX - 85, hipY + 10);
  ctx.stroke();

  if (speedLines) {
    drawSpeedLines(ctx, cx - 110, gy - 140, 80, 4);
    // Dust cloud puff at back foot
    drawDustPuff(ctx, hipX - 90, gy - 10);
  }
}

function drawTrippingPose(
  ctx: CanvasRenderingContext2D,
  cx: number,
  gy: number,
  expression: string
) {
  const headR = 24;
  // Head pitched forward and down
  const headX = cx + 80;
  const headY = gy - 120;
  drawHead(ctx, headX, headY, headR, expression);

  // Torso almost horizontal (pitching down)
  const neckX = headX - 16;
  const neckY = headY + 16;
  const hipX = cx - 10;
  const hipY = gy - 70;

  ctx.beginPath();
  ctx.moveTo(neckX, neckY);
  ctx.lineTo(hipX, hipY);
  ctx.stroke();

  // Flailing arms
  const shoulderX = neckX - 10;
  const shoulderY = neckY + 8;

  // Arm 1 flailing up
  ctx.beginPath();
  ctx.moveTo(shoulderX, shoulderY);
  ctx.lineTo(shoulderX + 10, shoulderY - 55);
  ctx.lineTo(shoulderX + 35, shoulderY - 80);
  ctx.stroke();

  // Arm 2 flailing back
  ctx.beginPath();
  ctx.moveTo(shoulderX, shoulderY);
  ctx.lineTo(shoulderX - 35, shoulderY - 30);
  ctx.lineTo(shoulderX - 65, shoulderY - 50);
  ctx.stroke();

  // Flying briefcase
  drawBriefcase(ctx, shoulderX + 60, shoulderY - 95, 45);

  // Tripping leg (caught on rock)
  ctx.beginPath();
  ctx.moveTo(hipX, hipY);
  ctx.lineTo(cx + 45, gy - 25);
  ctx.lineTo(cx + 60, gy);
  ctx.stroke();

  // Trailing leg kicked high in panic
  ctx.beginPath();
  ctx.moveTo(hipX, hipY);
  ctx.lineTo(hipX - 40, hipY - 20);
  ctx.lineTo(hipX - 70, hipY - 60);
  ctx.stroke();

  // Impact star at the foot/rock contact
  drawImpactStar(ctx, cx + 60, gy - 10, 14);

  // Action / shock marks above head
  drawActionExclamation(ctx, headX + 10, headY - 45);
}

function drawFallingPose(
  ctx: CanvasRenderingContext2D,
  cx: number,
  gy: number,
  expression: string
) {
  const headR = 24;
  const headX = cx + 70;
  const headY = gy - 60;
  drawHead(ctx, headX, headY, headR, expression);

  // Body horizontal in air or hitting floor
  const hipX = cx - 50;
  const hipY = gy - 55;

  ctx.beginPath();
  ctx.moveTo(headX - headR, headY + 4);
  ctx.lineTo(hipX, hipY);
  ctx.stroke();

  // Both arms flailing wildly
  const shoulderX = headX - 40;
  const shoulderY = headY;

  ctx.beginPath();
  ctx.moveTo(shoulderX, shoulderY);
  ctx.lineTo(shoulderX + 10, shoulderY - 60);
  ctx.lineTo(shoulderX + 35, shoulderY - 75);

  ctx.moveTo(shoulderX, shoulderY);
  ctx.lineTo(shoulderX - 25, shoulderY - 55);
  ctx.lineTo(shoulderX - 50, shoulderY - 70);
  ctx.stroke();

  // Both legs flailing back
  ctx.beginPath();
  ctx.moveTo(hipX, hipY);
  ctx.lineTo(hipX - 45, hipY - 35);
  ctx.lineTo(hipX - 70, hipY - 60);

  ctx.moveTo(hipX, hipY);
  ctx.lineTo(hipX - 50, hipY + 15);
  ctx.lineTo(hipX - 85, hipY + 5);
  ctx.stroke();

  // Motion blur swoosh
  drawSwooshArc(ctx, cx - 110, gy - 120, cx + 50, gy - 20);
}

function drawLookingClockPose(
  ctx: CanvasRenderingContext2D,
  cx: number,
  gy: number,
  expression: string
) {
  const headR = 24;
  const headX = cx;
  const headY = gy - 180;
  drawHead(ctx, headX, headY, headR, expression);

  // Standing straight
  const hipX = cx;
  const hipY = gy - 95;

  ctx.beginPath();
  ctx.moveTo(headX, headY + headR);
  ctx.lineTo(hipX, hipY);
  ctx.stroke();

  // Arm 1 pointing in panic at clock
  ctx.beginPath();
  ctx.moveTo(cx, gy - 150);
  ctx.lineTo(cx + 60, gy - 160);
  ctx.lineTo(cx + 120, gy - 170);
  ctx.stroke();

  // Arm 2 grabbing head in distress
  ctx.beginPath();
  ctx.moveTo(cx, gy - 150);
  ctx.lineTo(cx - 30, gy - 175);
  ctx.lineTo(cx - 10, gy - 195);
  ctx.stroke();

  // Legs trembling
  ctx.beginPath();
  ctx.moveTo(hipX, hipY);
  ctx.lineTo(hipX - 20, gy);

  ctx.moveTo(hipX, hipY);
  ctx.lineTo(hipX + 20, gy);
  ctx.stroke();

  // Tremble lines
  drawVibrationMarks(ctx, cx - 40, gy - 100);
  drawVibrationMarks(ctx, cx + 40, gy - 100);
}

function drawCoffeeSpillPose(
  ctx: CanvasRenderingContext2D,
  cx: number,
  gy: number,
  expression: string
) {
  const headR = 24;
  const headX = cx - 20;
  const headY = gy - 170;
  drawHead(ctx, headX, headY, headR, expression);

  const hipX = cx - 35;
  const hipY = gy - 90;

  ctx.beginPath();
  ctx.moveTo(headX, headY + headR);
  ctx.lineTo(hipX, hipY);
  ctx.stroke();

  // Arm dropping/tossing cup
  ctx.beginPath();
  ctx.moveTo(cx - 24, gy - 145);
  ctx.lineTo(cx + 40, gy - 155);
  ctx.lineTo(cx + 70, gy - 140);
  ctx.stroke();

  // The cup tipping over
  drawCoffeeCup(ctx, cx + 85, gy - 135, 45);

  // Splash arcs & droplets
  ctx.beginPath();
  ctx.arc(cx + 120, gy - 145, 25, 0, Math.PI * 1.5);
  ctx.stroke();
  for (let d = 0; d < 8; d++) {
    const dx = cx + 110 + Math.random() * 60;
    const dy = gy - 170 + Math.random() * 50;
    ctx.beginPath();
    ctx.arc(dx, dy, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Other arm recoil
  ctx.beginPath();
  ctx.moveTo(cx - 24, gy - 145);
  ctx.lineTo(cx - 55, gy - 165);
  ctx.stroke();

  // Stumbling legs
  ctx.beginPath();
  ctx.moveTo(hipX, hipY);
  ctx.lineTo(hipX + 25, gy);

  ctx.moveTo(hipX, hipY);
  ctx.lineTo(hipX - 45, gy);
  ctx.stroke();
}

function drawBriefcaseFlyingPose(
  ctx: CanvasRenderingContext2D,
  cx: number,
  gy: number,
  expression: string
) {
  drawTrippingPose(ctx, cx - 80, gy, expression);

  // Central bursting briefcase
  drawBriefcase(ctx, cx + 60, gy - 160, 25, true);

  // Flying document pages
  for (let i = 0; i < 7; i++) {
    const px = cx + 80 + i * 35 + (i % 2 === 0 ? 10 : -15);
    const py = gy - 240 + i * 25 + Math.sin(i) * 30;
    const rot = (i - 3) * 0.3;
    drawPaperSheet(ctx, px, py, rot);
  }
}

function drawBicyclePose(
  ctx: CanvasRenderingContext2D,
  cx: number,
  gy: number,
  expression: string
) {
  const wheelR = 36;
  const wheel1X = cx - 75;
  const wheel2X = cx + 75;
  const wheelY = gy - wheelR;

  // Bicycle wheels
  ctx.beginPath();
  ctx.arc(wheel1X, wheelY, wheelR, 0, Math.PI * 2);
  ctx.arc(wheel2X, wheelY, wheelR, 0, Math.PI * 2);
  ctx.stroke();

  // Spokes
  ctx.beginPath();
  ctx.moveTo(wheel1X - wheelR, wheelY);
  ctx.lineTo(wheel1X + wheelR, wheelY);
  ctx.moveTo(wheel1X, wheelY - wheelR);
  ctx.lineTo(wheel1X, wheelY + wheelR);

  ctx.moveTo(wheel2X - wheelR, wheelY);
  ctx.lineTo(wheel2X + wheelR, wheelY);
  ctx.moveTo(wheel2X, wheelY - wheelR);
  ctx.lineTo(wheel2X, wheelY + wheelR);
  ctx.stroke();

  // Bicycle frame
  const bbX = cx - 5;
  const bbY = wheelY + 10;
  const seatPostX = cx - 25;
  const seatPostY = wheelY - 45;
  const handleX = cx + 60;
  const handleY = wheelY - 55;

  ctx.beginPath();
  ctx.moveTo(wheel1X, wheelY);
  ctx.lineTo(bbX, bbY);
  ctx.lineTo(wheel2X, wheelY);
  ctx.lineTo(handleX, handleY);
  ctx.lineTo(bbX, bbY);
  ctx.lineTo(seatPostX, seatPostY);
  ctx.lineTo(wheel1X, wheelY);
  ctx.stroke();

  // Handlebars & Seat
  ctx.beginPath();
  ctx.moveTo(handleX - 10, handleY);
  ctx.lineTo(handleX + 15, handleY - 10);
  ctx.moveTo(seatPostX - 18, seatPostY);
  ctx.lineTo(seatPostX + 12, seatPostY);
  ctx.stroke();

  // Stickman rider
  const headR = 24;
  const headX = cx + 15;
  const headY = gy - 195;
  drawHead(ctx, headX, headY, headR, expression);

  // Torso
  const hipX = seatPostX;
  const hipY = seatPostY - 5;
  ctx.beginPath();
  ctx.moveTo(headX, headY + headR);
  ctx.lineTo(hipX, hipY);
  ctx.stroke();

  // Arms to handlebars
  ctx.beginPath();
  ctx.moveTo(headX - 5, headY + headR + 20);
  ctx.lineTo(handleX + 5, handleY - 5);
  ctx.stroke();

  // Legs to pedals
  ctx.beginPath();
  ctx.moveTo(hipX, hipY);
  ctx.lineTo(bbX - 15, bbY - 20);
  ctx.lineTo(bbX, bbY);
  ctx.stroke();

  drawSpeedLines(ctx, cx - 140, gy - 80, 50, 3);
}

function drawBusChasePose(
  ctx: CanvasRenderingContext2D,
  cx: number,
  gy: number,
  expression: string
) {
  drawRunningPose(ctx, cx, gy, expression, true);

  // Hand stretching far ahead
  ctx.beginPath();
  ctx.moveTo(cx + 90, gy - 170);
  ctx.lineTo(cx + 170, gy - 165);
  ctx.stroke();

  // Action sweat drops
  ctx.beginPath();
  ctx.arc(cx + 130, gy - 190, 3, 0, Math.PI * 2);
  ctx.arc(cx + 150, gy - 180, 2.5, 0, Math.PI * 2);
  ctx.fill();
}

function drawUmbrellaPose(
  ctx: CanvasRenderingContext2D,
  cx: number,
  gy: number,
  expression: string
) {
  const headR = 24;
  const headX = cx;
  const headY = gy - 180;
  drawHead(ctx, headX, headY, headR, expression);

  const hipX = cx;
  const hipY = gy - 95;

  ctx.beginPath();
  ctx.moveTo(headX, headY + headR);
  ctx.lineTo(hipX, hipY);
  ctx.stroke();

  // Arm holding umbrella handle up
  ctx.beginPath();
  ctx.moveTo(cx, gy - 150);
  ctx.lineTo(cx + 40, gy - 170);
  ctx.lineTo(cx + 40, gy - 230);
  ctx.stroke();

  // Umbrella blown inside-out (spider cone)
  const umbTopX = cx + 40;
  const umbTopY = gy - 230;

  ctx.beginPath();
  ctx.moveTo(umbTopX - 60, umbTopY - 50);
  ctx.quadraticCurveTo(umbTopX - 25, umbTopY + 10, umbTopX, umbTopY);
  ctx.quadraticCurveTo(umbTopX + 25, umbTopY + 10, umbTopX + 60, umbTopY - 50);
  ctx.stroke();

  // Umbrella ribs pointing up
  ctx.beginPath();
  ctx.moveTo(umbTopX, umbTopY);
  ctx.lineTo(umbTopX - 60, umbTopY - 50);
  ctx.moveTo(umbTopX, umbTopY);
  ctx.lineTo(umbTopX - 25, umbTopY - 60);
  ctx.moveTo(umbTopX, umbTopY);
  ctx.lineTo(umbTopX + 25, umbTopY - 60);
  ctx.moveTo(umbTopX, umbTopY);
  ctx.lineTo(umbTopX + 60, umbTopY - 50);
  ctx.stroke();

  // Legs
  ctx.beginPath();
  ctx.moveTo(hipX, hipY);
  ctx.lineTo(hipX - 25, gy);
  ctx.moveTo(hipX, hipY);
  ctx.lineTo(hipX + 25, gy);
  ctx.stroke();

  // Rain lines
  drawRainStreaks(ctx, cx - 120, gy - 270, 240, 260);
}

function drawSlidingPose(
  ctx: CanvasRenderingContext2D,
  cx: number,
  gy: number,
  expression: string
) {
  // Diagonal handrail
  ctx.beginPath();
  ctx.moveTo(cx - 160, gy - 180);
  ctx.lineTo(cx + 160, gy - 20);
  ctx.stroke();

  // Stickman sliding on buttocks
  const headR = 24;
  const headX = cx - 20;
  const headY = gy - 180;
  drawHead(ctx, headX, headY, headR, expression);

  const hipX = cx + 10;
  const hipY = gy - 100;

  ctx.beginPath();
  ctx.moveTo(headX, headY + headR);
  ctx.lineTo(hipX, hipY);
  ctx.stroke();

  // Arms out for balance
  ctx.beginPath();
  ctx.moveTo(cx - 10, gy - 150);
  ctx.lineTo(cx - 65, gy - 140);
  ctx.moveTo(cx - 10, gy - 150);
  ctx.lineTo(cx + 45, gy - 160);
  ctx.stroke();

  // Legs kicking out in slide
  ctx.beginPath();
  ctx.moveTo(hipX, hipY);
  ctx.lineTo(cx + 65, gy - 95);
  ctx.lineTo(cx + 110, gy - 75);
  ctx.stroke();

  // Spark marks at contact point
  drawImpactStar(ctx, hipX, hipY + 5, 10);
  drawSpeedLines(ctx, cx - 110, gy - 150, 60, 3);
}

function drawJumpingPose(
  ctx: CanvasRenderingContext2D,
  cx: number,
  gy: number,
  expression: string
) {
  const headR = 24;
  const headX = cx;
  const headY = gy - 220;
  drawHead(ctx, headX, headY, headR, expression);

  const hipX = cx;
  const hipY = gy - 140;

  ctx.beginPath();
  ctx.moveTo(headX, headY + headR);
  ctx.lineTo(hipX, hipY);
  ctx.stroke();

  // Both arms raised high
  ctx.beginPath();
  ctx.moveTo(cx, gy - 190);
  ctx.lineTo(cx - 45, gy - 250);
  ctx.moveTo(cx, gy - 190);
  ctx.lineTo(cx + 45, gy - 250);
  ctx.stroke();

  // Knees bent up
  ctx.beginPath();
  ctx.moveTo(hipX, hipY);
  ctx.lineTo(hipX - 35, hipY + 30);
  ctx.lineTo(hipX - 15, hipY + 60);

  ctx.moveTo(hipX, hipY);
  ctx.lineTo(hipX + 35, hipY + 30);
  ctx.lineTo(hipX + 15, hipY + 60);
  ctx.stroke();

  // Motion upward lines from ground
  drawUpwardLines(ctx, cx, gy, 60);
}

function drawSuperheroFlyPose(
  ctx: CanvasRenderingContext2D,
  cx: number,
  gy: number,
  expression: string
) {
  const headR = 24;
  const headX = cx + 90;
  const headY = gy - 140;
  drawHead(ctx, headX, headY, headR, expression);

  // Horizontal torso
  const hipX = cx - 40;
  const hipY = gy - 135;

  ctx.beginPath();
  ctx.moveTo(headX - headR, headY + 5);
  ctx.lineTo(hipX, hipY);
  ctx.stroke();

  // Superman fist forward
  ctx.beginPath();
  ctx.moveTo(headX - 30, headY + 10);
  ctx.lineTo(headX + 55, headY + 5);
  ctx.stroke();
  // Fist circle
  ctx.beginPath();
  ctx.arc(headX + 60, headY + 5, 6, 0, Math.PI * 2);
  ctx.fill();

  // Billowing cape
  ctx.beginPath();
  ctx.moveTo(headX - 30, headY + 10);
  ctx.quadraticCurveTo(cx - 20, gy - 200, cx - 110, gy - 190);
  ctx.quadraticCurveTo(cx - 70, gy - 150, cx - 120, gy - 130);
  ctx.quadraticCurveTo(cx - 50, gy - 135, hipX, hipY);
  ctx.stroke();

  // Legs together stretched straight back
  ctx.beginPath();
  ctx.moveTo(hipX, hipY);
  ctx.lineTo(hipX - 70, hipY + 5);
  ctx.lineTo(hipX - 120, hipY + 10);
  ctx.stroke();

  drawSpeedLines(ctx, cx - 140, gy - 135, 90, 4);
}

function drawDeskPose(
  ctx: CanvasRenderingContext2D,
  cx: number,
  gy: number,
  expression: string
) {
  // Desk
  const deskX = cx + 20;
  const deskY = gy - 70;
  ctx.beginPath();
  ctx.moveTo(deskX - 80, deskY);
  ctx.lineTo(deskX + 80, deskY);
  ctx.moveTo(deskX - 70, deskY);
  ctx.lineTo(deskX - 70, gy);
  ctx.moveTo(deskX + 70, deskY);
  ctx.lineTo(deskX + 70, gy);
  ctx.stroke();

  // Computer monitor
  ctx.strokeRect(deskX + 15, deskY - 60, 45, 35);
  ctx.beginPath();
  ctx.moveTo(deskX + 37, deskY - 25);
  ctx.lineTo(deskX + 37, deskY);
  ctx.moveTo(deskX + 25, deskY);
  ctx.lineTo(deskX + 50, deskY);
  ctx.stroke();

  // Chair
  ctx.beginPath();
  ctx.moveTo(cx - 60, gy);
  ctx.lineTo(cx - 60, gy - 55);
  ctx.lineTo(cx - 30, gy - 55);
  ctx.stroke();

  // Stickman seated
  const headR = 24;
  const headX = cx - 35;
  const headY = gy - 150;
  drawHead(ctx, headX, headY, headR, expression);

  ctx.beginPath();
  ctx.moveTo(headX, headY + headR);
  ctx.lineTo(cx - 40, gy - 55);
  ctx.stroke();

  // Arms typing
  ctx.beginPath();
  ctx.moveTo(cx - 35, gy - 110);
  ctx.lineTo(cx - 10, gy - 75);
  ctx.lineTo(deskX - 15, deskY - 5);
  ctx.stroke();

  // Legs bent at chair
  ctx.beginPath();
  ctx.moveTo(cx - 40, gy - 55);
  ctx.lineTo(cx - 15, gy - 55);
  ctx.lineTo(cx - 15, gy);
  ctx.stroke();
}

function drawCelebratingPose(
  ctx: CanvasRenderingContext2D,
  cx: number,
  gy: number,
  expression: string
) {
  const headR = 24;
  const headX = cx;
  const headY = gy - 190;
  drawHead(ctx, headX, headY, headR, expression);

  const hipX = cx;
  const hipY = gy - 100;

  ctx.beginPath();
  ctx.moveTo(headX, headY + headR);
  ctx.lineTo(hipX, hipY);
  ctx.stroke();

  // Both arms raised high in 'V' for victory
  ctx.beginPath();
  ctx.moveTo(cx, gy - 160);
  ctx.lineTo(cx - 50, gy - 230);
  ctx.moveTo(cx, gy - 160);
  ctx.lineTo(cx + 50, gy - 230);
  ctx.stroke();

  // Legs wide stance
  ctx.beginPath();
  ctx.moveTo(hipX, hipY);
  ctx.lineTo(hipX - 35, gy);
  ctx.moveTo(hipX, hipY);
  ctx.lineTo(hipX + 35, gy);
  ctx.stroke();

  // Confetti particles
  for (let c = 0; c < 12; c++) {
    const rx = cx - 120 + Math.random() * 240;
    const ry = gy - 280 + Math.random() * 120;
    ctx.beginPath();
    ctx.arc(rx, ry, 2.5, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function drawThinkingPose(
  ctx: CanvasRenderingContext2D,
  cx: number,
  gy: number,
  expression: string
) {
  const headR = 24;
  const headX = cx;
  const headY = gy - 180;
  drawHead(ctx, headX, headY, headR, expression);

  const hipX = cx;
  const hipY = gy - 95;

  ctx.beginPath();
  ctx.moveTo(headX, headY + headR);
  ctx.lineTo(hipX, hipY);
  ctx.stroke();

  // Hand on chin
  ctx.beginPath();
  ctx.moveTo(cx, gy - 150);
  ctx.lineTo(cx + 25, gy - 155);
  ctx.lineTo(cx + 10, headY + headR);
  ctx.stroke();

  // Other arm crossed
  ctx.beginPath();
  ctx.moveTo(cx, gy - 150);
  ctx.lineTo(cx - 25, gy - 145);
  ctx.lineTo(cx + 10, gy - 145);
  ctx.stroke();

  // Legs
  ctx.beginPath();
  ctx.moveTo(hipX, hipY);
  ctx.lineTo(hipX - 20, gy);
  ctx.moveTo(hipX, hipY);
  ctx.lineTo(hipX + 20, gy);
  ctx.stroke();

  // Question mark above head
  ctx.font = 'bold 36px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('?', cx + 45, headY - 15);
}

function drawSleepingPose(
  ctx: CanvasRenderingContext2D,
  cx: number,
  gy: number,
  expression: string
) {
  // Horizontal stickman on floor
  const headR = 24;
  const headX = cx - 80;
  const headY = gy - 25;
  drawHead(ctx, headX, headY, headR, 'neutral');

  // Pillow
  ctx.strokeRect(headX - 30, gy - 20, 60, 20);

  // Body horizontal
  ctx.beginPath();
  ctx.moveTo(headX + headR, gy - 12);
  ctx.lineTo(cx + 80, gy - 12);
  ctx.stroke();

  // Arm resting on belly
  ctx.beginPath();
  ctx.moveTo(cx - 20, gy - 12);
  ctx.lineTo(cx, gy - 26);
  ctx.lineTo(cx + 20, gy - 12);
  ctx.stroke();

  // Floating Z z z
  ctx.font = 'bold 20px "JetBrains Mono", monospace';
  ctx.fillText('z', cx - 20, gy - 50);
  ctx.font = 'bold 26px "JetBrains Mono", monospace';
  ctx.fillText('Z', cx, gy - 80);
  ctx.font = 'bold 32px "JetBrains Mono", monospace';
  ctx.fillText('Z', cx + 25, gy - 115);
}

function drawDefaultPose(
  ctx: CanvasRenderingContext2D,
  cx: number,
  gy: number,
  expression: string
) {
  const headR = 24;
  const headX = cx;
  const headY = gy - 180;
  drawHead(ctx, headX, headY, headR, expression);

  const hipX = cx;
  const hipY = gy - 95;

  ctx.beginPath();
  ctx.moveTo(headX, headY + headR);
  ctx.lineTo(hipX, hipY);
  ctx.stroke();

  // Arms relaxed at sides
  ctx.beginPath();
  ctx.moveTo(cx, gy - 150);
  ctx.lineTo(cx - 30, gy - 100);
  ctx.moveTo(cx, gy - 150);
  ctx.lineTo(cx + 30, gy - 100);
  ctx.stroke();

  // Legs standing straight
  ctx.beginPath();
  ctx.moveTo(hipX, hipY);
  ctx.lineTo(hipX - 25, gy);
  ctx.moveTo(hipX, hipY);
  ctx.lineTo(hipX + 25, gy);
  ctx.stroke();
}

// ----------------- PROP DRAWING FUNCTIONS -----------------

function drawRock(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.beginPath();
  ctx.moveTo(x - 25, y);
  ctx.lineTo(x - 15, y - 28);
  ctx.lineTo(x + 5, y - 34);
  ctx.lineTo(x + 22, y - 18);
  ctx.lineTo(x + 28, y);
  ctx.closePath();
  ctx.stroke();

  // Cracks on rock
  ctx.beginPath();
  ctx.moveTo(x - 5, y - 28);
  ctx.lineTo(x, y - 15);
  ctx.lineTo(x + 12, y - 10);
  ctx.stroke();
}

function drawBanana(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.beginPath();
  ctx.moveTo(x - 20, y);
  ctx.quadraticCurveTo(x, y - 25, x + 20, y);
  ctx.moveTo(x - 5, y - 18);
  ctx.lineTo(x - 12, y - 5);
  ctx.moveTo(x + 5, y - 18);
  ctx.lineTo(x + 12, y - 5);
  ctx.stroke();
}

function drawClock(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  // Clock body
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();

  // Hour and minute hands pointing to 8:59
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x - r * 0.5, y - r * 0.1); // hour hand towards 9
  ctx.moveTo(x, y);
  ctx.lineTo(x - r * 0.1, y - r * 0.75); // minute hand towards 12
  ctx.stroke();

  // Ticking bells on top of alarm clock
  ctx.beginPath();
  ctx.arc(x - r * 0.7, y - r * 0.7, 14, 0, Math.PI * 2);
  ctx.arc(x + r * 0.7, y - r * 0.7, 14, 0, Math.PI * 2);
  ctx.stroke();

  // Legs of clock
  ctx.beginPath();
  ctx.moveTo(x - r * 0.6, y + r * 0.7);
  ctx.lineTo(x - r * 0.8, y + r);
  ctx.moveTo(x + r * 0.6, y + r * 0.7);
  ctx.lineTo(x + r * 0.8, y + r);
  ctx.stroke();

  // Alarm ringing vibrate marks
  drawVibrationMarks(ctx, x - r - 15, y - r * 0.5);
  drawVibrationMarks(ctx, x + r + 15, y - r * 0.5);
}

function drawBriefcase(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angleDeg: number,
  isOpen: boolean = false
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((angleDeg * Math.PI) / 180);

  if (isOpen) {
    // Open halves
    ctx.strokeRect(-25, -20, 50, 18);
    ctx.strokeRect(-25, 2, 50, 18);
  } else {
    ctx.strokeRect(-25, -15, 50, 30);
    // Handle
    ctx.beginPath();
    ctx.arc(0, -15, 8, Math.PI, 0);
    ctx.stroke();
    // Latches
    ctx.strokeRect(-16, -6, 6, 8);
    ctx.strokeRect(10, -6, 6, 8);
  }

  ctx.restore();
}

function drawCoffeeCup(ctx: CanvasRenderingContext2D, x: number, y: number, angleDeg: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((angleDeg * Math.PI) / 180);

  ctx.beginPath();
  ctx.moveTo(-12, -18);
  ctx.lineTo(12, -18);
  ctx.lineTo(8, 18);
  ctx.lineTo(-8, 18);
  ctx.closePath();
  ctx.stroke();

  // Lid rim
  ctx.strokeRect(-15, -22, 30, 4);

  ctx.restore();
}

function drawPaperSheet(ctx: CanvasRenderingContext2D, x: number, y: number, angleRad: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angleRad);
  ctx.strokeRect(-12, -16, 24, 32);
  // Text lines on paper
  ctx.beginPath();
  ctx.moveTo(-8, -8);
  ctx.lineTo(8, -8);
  ctx.moveTo(-8, 0);
  ctx.lineTo(8, 0);
  ctx.moveTo(-8, 8);
  ctx.lineTo(4, 8);
  ctx.stroke();
  ctx.restore();
}

function drawBusReceding(ctx: CanvasRenderingContext2D, x: number, gy: number) {
  const busW = 110;
  const busH = 140;
  const busY = gy - busH;

  // Rear rectangular box of bus
  ctx.strokeRect(x, busY, busW, busH);

  // Rear window
  ctx.strokeRect(x + 12, busY + 15, busW - 24, 45);

  // Tail lights
  ctx.strokeRect(x + 10, busY + busH - 40, 18, 12);
  ctx.strokeRect(x + busW - 28, busY + busH - 40, 18, 12);

  // License plate
  ctx.strokeRect(x + busW * 0.35, busY + busH - 30, 34, 14);

  // Wheels underneath
  ctx.strokeRect(x + 12, gy - 10, 20, 10);
  ctx.strokeRect(x + busW - 32, gy - 10, 20, 10);

  // Exhaust puff
  ctx.beginPath();
  ctx.arc(x - 15, gy - 15, 8, 0, Math.PI * 2);
  ctx.arc(x - 28, gy - 20, 12, 0, Math.PI * 2);
  ctx.arc(x - 45, gy - 18, 15, 0, Math.PI * 2);
  ctx.stroke();
}

function drawRainCloud(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  ctx.beginPath();
  ctx.arc(cx - 40, cy, 30, Math.PI * 0.7, Math.PI * 1.8);
  ctx.arc(cx - 10, cy - 25, 35, Math.PI * 1.0, Math.PI * 1.9);
  ctx.arc(cx + 25, cy - 15, 32, Math.PI * 1.2, Math.PI * 2.1);
  ctx.arc(cx + 45, cy + 5, 25, Math.PI * 1.5, Math.PI * 0.4);
  ctx.lineTo(cx - 40, cy + 25);
  ctx.closePath();
  ctx.stroke();
}

function drawRainStreaks(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
) {
  for (let i = 0; i < 24; i++) {
    const rx = x + Math.random() * w;
    const ry = y + Math.random() * h;
    ctx.beginPath();
    ctx.moveTo(rx, ry);
    ctx.lineTo(rx - 8, ry + 22);
    ctx.stroke();
  }
}

function drawSpeechBubble(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  text: string,
  config: RenderStyleConfig
) {
  ctx.save();
  ctx.font = '600 15px "Plus Jakarta Sans", sans-serif';
  const textMetrics = ctx.measureText(text);
  const paddingX = 16;
  const paddingY = 10;
  const bubbleW = textMetrics.width + paddingX * 2;
  const bubbleH = 34;

  ctx.fillStyle = config.bgColor;
  ctx.strokeStyle = config.strokeColor;
  ctx.lineWidth = Math.max(1, config.lineWidth * 0.8);

  ctx.beginPath();
  ctx.roundRect(x, y - bubbleH, bubbleW, bubbleH, 8);
  ctx.fill();
  ctx.stroke();

  // Pointer
  ctx.beginPath();
  ctx.moveTo(x + 15, y);
  ctx.lineTo(x + 8, y + 12);
  ctx.lineTo(x + 24, y);
  ctx.fill();
  ctx.stroke();

  // Text
  ctx.fillStyle = config.strokeColor;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x + paddingX, y - bubbleH / 2);
  ctx.restore();
}

function drawSpeedLines(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  len: number,
  count: number
) {
  for (let i = 0; i < count; i++) {
    const ly = y + (i - count / 2) * 16;
    ctx.beginPath();
    ctx.moveTo(x, ly);
    ctx.lineTo(x - len - (i % 2) * 20, ly);
    ctx.stroke();
  }
}

function drawDustPuff(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.beginPath();
  ctx.arc(x - 10, y - 5, 8, 0, Math.PI * 2);
  ctx.arc(x - 22, y - 8, 6, 0, Math.PI * 2);
  ctx.arc(x - 8, y - 16, 5, 0, Math.PI * 2);
  ctx.stroke();
}

function drawImpactStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI) / 4;
    const rad = i % 2 === 0 ? r : r * 0.4;
    const px = cx + Math.cos(angle) * rad;
    const py = cy + Math.sin(angle) * rad;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.stroke();
}

function drawActionExclamation(ctx: CanvasRenderingContext2D, x: number, y: number) {
  for (let i = -1; i <= 1; i++) {
    const angle = i * 0.3 - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(angle) * 10, y + Math.sin(angle) * 10);
    ctx.lineTo(x + Math.cos(angle) * 28, y + Math.sin(angle) * 28);
    ctx.stroke();
  }
}

function drawVibrationMarks(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.beginPath();
  ctx.arc(x, y, 14, -Math.PI * 0.3, Math.PI * 0.3);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x, y, 22, -Math.PI * 0.3, Math.PI * 0.3);
  ctx.stroke();
}

function drawSwooshArc(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number
) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.quadraticCurveTo((x1 + x2) / 2, y1 - 40, x2, y2);
  ctx.stroke();
}

function drawUpwardLines(ctx: CanvasRenderingContext2D, cx: number, gy: number, height: number) {
  for (let i = -2; i <= 2; i++) {
    const lx = cx + i * 22;
    ctx.beginPath();
    ctx.moveTo(lx, gy);
    ctx.lineTo(lx, gy - height - Math.abs(i) * 10);
    ctx.stroke();
  }
}
