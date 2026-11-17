// 404 Octopus Game — GDD v1.0
// Horizontal endless side-scroller. Monochrome world, coloured octopus.

(function () {
  "use strict";

  // ============================================================
  // CONSTANTS
  // ============================================================

  const FLOOR_Y_RATIO = 0.78;
  const GRAVITY = 0.32;
  const JET_FORCE = -6.5;
  const CRAWL_SPEED = 3;
  const SPRINT_SPEED = 5.5;
  const SWIM_SPEED = 4.5;
  const SPRINT_DRAIN = 0.4;
  const SPRINT_RECOVER = 0.5;
  const CAMO_DRAIN = 1.0;
  const CAMO_RECOVER = 0.4;
  const MAX_STAMINA = 100;

  const OCTO_COLOR = { r: 200, g: 80, b: 50 };
  const OCTO_LIGHT = { r: 230, g: 130, b: 90 };
  const ACCENT = { r: 0, g: 170, b: 255 };
  const DANGER = { r: 255, g: 31, b: 61 };
  const PEARL_COLOR = { r: 245, g: 240, b: 220 };

  const ZONE_THRESHOLDS = [0, 200, 500, 1000];
  const ZONE_NAMES = [
    "the shallows",
    "the twilight zone",
    "the midnight zone",
    "the abyss",
  ];

  const DEATH_MESSAGES = [
    "Ink.",
    "That stung.",
    "Ouch.",
    "Nope.",
    "Not that way.",
    "Bad idea.",
    "Try left next time.",
    "The ocean wins.",
    "Splat.",
    "You had one arm. Wait, eight.",
    "Should have camouflaged.",
    "The shell would have helped.",
    "Clutch.",
  ];

  // ============================================================
  // UTILITY
  // ============================================================

  function gray(v, a) {
    if (a !== undefined) return `rgba(${v},${v},${v},${a})`;
    return `rgb(${v},${v},${v})`;
  }

  function rgb(c, a) {
    if (a !== undefined) return `rgba(${c.r},${c.g},${c.b},${a})`;
    return `rgb(${c.r},${c.g},${c.b})`;
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function lerpColor(c1, c2, t) {
    return {
      r: Math.round(lerp(c1.r, c2.r, t)),
      g: Math.round(lerp(c1.g, c2.g, t)),
      b: Math.round(lerp(c1.b, c2.b, t)),
    };
  }

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function randInt(min, max) {
    return Math.floor(rand(min, max + 1));
  }

  // ============================================================
  // CANVAS & STATE
  // ============================================================

  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");

  let W, H, floorY;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    floorY = H * FLOOR_Y_RATIO;
    initScenery();
  }

  window.addEventListener("resize", resize);

  let state = "start";
  let score = 0;
  let distance = 0;
  let gameSpeed = CRAWL_SPEED;
  let frameCount = 0;
  let deathFlash = 0;
  let currentZone = 0;

  // Chest (hidden rubber duck at 1500m)
  var chest = null;
  var chestFound = false;
  var wonTimer = 0;

  // Tutorial hints (comic speech bubbles, shown once each)
  var hints = {
    food: {
      shown: false,
      active: false,
      timer: 0,
      x: 0,
      y: 0,
      text: "Swim into creatures to eat them!",
    },
    pearl: {
      shown: false,
      active: false,
      timer: 0,
      x: 0,
      y: 0,
      text: "Press E near a pearl to clutch it!",
    },
    throw: {
      shown: false,
      active: false,
      timer: 0,
      x: 0,
      y: 0,
      text: "Press E to throw the pearl!",
    },
    shell: {
      shown: false,
      active: false,
      timer: 0,
      x: 0,
      y: 0,
      text: "Swim over a shell for armour!",
    },
    ink: {
      shown: false,
      active: false,
      timer: 0,
      x: 0,
      y: 0,
      text: "Press Q to spray ink! (costs 5)",
    },
    camo: {
      shown: false,
      active: false,
      timer: 0,
      x: 0,
      y: 0,
      text: "Press C to camouflage!",
    },
  };
  var HINT_DURATION = 150;
  var HINT_PAUSE_FRAMES = 120;
  var hintPause = 0;

  function triggerHint(name) {
    var h = hints[name];
    if (!h || h.shown) return;
    h.shown = true;
    h.active = true;
    h.timer = HINT_DURATION;
    hintPause = HINT_PAUSE_FRAMES;
  }

  function updateHints() {
    if (hintPause > 0) hintPause--;
    for (var key in hints) {
      var h = hints[key];
      if (h.active) {
        h.timer--;
        if (h.timer <= 0) h.active = false;
      }
    }
  }

  function drawSpeechBubble(text, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.font = "bold 17px 'Courier New', monospace";
    var tw = ctx.measureText(text).width;
    var padX = 16;
    var bw = tw + padX * 2;
    var bh = 36;
    var bx = Math.min(Math.max(octo.x - bw * 0.5, 12), W - bw - 12);
    var by = octo.y - 65;
    if (by < 14) by = octo.y + 30;
    var tailDir = by < octo.y ? 1 : -1;

    // Shadow
    ctx.fillStyle = "rgba(0,0,0,0.15)";
    var r = 10;
    ctx.beginPath();
    ctx.moveTo(bx + r + 2, by + 3);
    ctx.lineTo(bx + bw - r + 2, by + 3);
    ctx.quadraticCurveTo(bx + bw + 2, by + 3, bx + bw + 2, by + r + 3);
    ctx.lineTo(bx + bw + 2, by + bh - r + 3);
    ctx.quadraticCurveTo(
      bx + bw + 2,
      by + bh + 3,
      bx + bw - r + 2,
      by + bh + 3,
    );
    ctx.lineTo(bx + r + 2, by + bh + 3);
    ctx.quadraticCurveTo(bx + 2, by + bh + 3, bx + 2, by + bh - r + 3);
    ctx.lineTo(bx + 2, by + r + 3);
    ctx.quadraticCurveTo(bx + 2, by + 3, bx + r + 2, by + 3);
    ctx.closePath();
    ctx.fill();

    // Bubble body
    ctx.fillStyle = "rgba(245,245,235,0.95)";
    ctx.strokeStyle = "rgba(50,50,50,0.8)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(bx + r, by);
    ctx.lineTo(bx + bw - r, by);
    ctx.quadraticCurveTo(bx + bw, by, bx + bw, by + r);
    ctx.lineTo(bx + bw, by + bh - r);
    ctx.quadraticCurveTo(bx + bw, by + bh, bx + bw - r, by + bh);
    ctx.lineTo(bx + r, by + bh);
    ctx.quadraticCurveTo(bx, by + bh, bx, by + bh - r);
    ctx.lineTo(bx, by + r);
    ctx.quadraticCurveTo(bx, by, bx + r, by);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Tail pointing to octopus
    var tailX = Math.min(Math.max(octo.x, bx + 16), bx + bw - 16);
    ctx.fillStyle = "rgba(245,245,235,0.95)";
    ctx.beginPath();
    if (tailDir > 0) {
      ctx.moveTo(tailX - 7, by + bh - 1);
      ctx.lineTo(tailX, by + bh + 14);
      ctx.lineTo(tailX + 7, by + bh - 1);
    } else {
      ctx.moveTo(tailX - 7, by + 1);
      ctx.lineTo(tailX, by - 14);
      ctx.lineTo(tailX + 7, by + 1);
    }
    ctx.fill();
    ctx.beginPath();
    if (tailDir > 0) {
      ctx.moveTo(tailX - 7, by + bh);
      ctx.lineTo(tailX, by + bh + 14);
      ctx.lineTo(tailX + 7, by + bh);
    } else {
      ctx.moveTo(tailX - 7, by);
      ctx.lineTo(tailX, by - 14);
      ctx.lineTo(tailX + 7, by);
    }
    ctx.strokeStyle = "rgba(50,50,50,0.8)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Text
    ctx.fillStyle = "rgba(20,20,20,0.95)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, bx + bw * 0.5, by + bh * 0.5 + 1);

    ctx.restore();
  }

  function drawHints() {
    for (var key in hints) {
      var h = hints[key];
      if (!h.active) continue;
      var fadeIn = Math.min(1, (HINT_DURATION - h.timer) / 12);
      var fadeOut = Math.min(1, h.timer / 25);
      var alpha = Math.min(fadeIn, fadeOut);
      drawSpeechBubble(h.text, alpha);
    }
  }

  // ============================================================
  // OCTOPUS
  // ============================================================

  let octo = {};

  function resetOcto() {
    octo = {
      x: W * 0.15,
      y: floorY - 22,
      vy: 0,
      w: 38,
      h: 30,
      crawling: true,
      sprinting: false,
      swimming: false,
      camouflaged: false,
      camoAmount: 0,
      stamina: MAX_STAMINA,
      jetTimer: 0,
      armPhase: 0,
      squish: 1,
      alive: true,
      hasPearl: false,
      pearlThrowTimer: 0,
      hasShell: false,
      shellCrackTimer: 0,
      ink: 0,
      eyeTargetX: 2,
      eyeTargetY: 0,
    };
  }

  function updateOcto() {
    const onFloor = octo.y >= floorY - 22;

    // Gravity
    octo.vy += GRAVITY;
    octo.y += octo.vy;

    // Floor collision
    if (octo.y >= floorY - 22) {
      octo.y = floorY - 22;
      octo.vy = 0;
      octo.crawling = true;
      octo.swimming = false;
    } else {
      octo.crawling = false;
      octo.swimming = true;
    }

    // Ceiling
    if (octo.y < 30) {
      octo.y = 30;
      octo.vy = 0;
    }

    // Sprint
    if (keys.sprint && octo.crawling && octo.stamina > 0 && !octo.camouflaged) {
      octo.sprinting = true;
      octo.stamina = Math.max(0, octo.stamina - SPRINT_DRAIN);
      if (octo.stamina <= 0) octo.sprinting = false;
    } else {
      octo.sprinting = false;
    }

    // Camouflage
    if (keys.camo && octo.stamina > 0 && !octo.sprinting) {
      octo.camouflaged = true;
      octo.camoAmount = Math.min(1, octo.camoAmount + 0.08);
      octo.stamina = Math.max(0, octo.stamina - CAMO_DRAIN);
      if (octo.stamina <= 0) octo.camouflaged = false;
    } else {
      octo.camouflaged = false;
      octo.camoAmount = Math.max(0, octo.camoAmount - 0.06);
    }

    // Stamina recovery when not sprinting or camouflaging
    if (!octo.sprinting && !octo.camouflaged) {
      octo.stamina = Math.min(MAX_STAMINA, octo.stamina + SPRINT_RECOVER);
    }

    // Game speed
    const baseSpeed = CRAWL_SPEED + Math.min(distance / 3000, 3);
    if (octo.sprinting) {
      gameSpeed =
        Math.max(baseSpeed, SPRINT_SPEED) + Math.min(distance / 3000, 2);
    } else if (octo.swimming) {
      gameSpeed = Math.max(baseSpeed, SWIM_SPEED);
    } else {
      gameSpeed = baseSpeed;
    }

    // Shell slows swimming
    if (octo.hasShell && octo.swimming) {
      gameSpeed *= 0.8;
    }
    // Pearl slows slightly
    if (octo.hasPearl) {
      gameSpeed *= 0.95;
    }

    // Squish recovery
    octo.squish += (1 - octo.squish) * 0.1;

    // Arm animation
    const armSpeed = octo.sprinting ? 0.3 : octo.crawling ? 0.12 : 0.06;
    octo.armPhase += armSpeed;

    // Jet timer
    if (octo.jetTimer > 0) octo.jetTimer -= 0.5;

    // Shell crack timer
    if (octo.shellCrackTimer > 0) octo.shellCrackTimer--;

    // Pearl throw timer
    if (octo.pearlThrowTimer > 0) octo.pearlThrowTimer--;

    // Swimming bubbles
    if (octo.swimming && frameCount % 4 === 0) {
      addParticle(
        octo.x - rand(5, 15),
        octo.y + rand(5, 15),
        -rand(0.5, 2),
        -rand(0.8, 2.5),
        rand(2, 4.5),
        rand(25, 40),
        false,
      );
    }

    // Sprinting bubbles (exertion!)
    if (octo.sprinting && frameCount % 5 === 0) {
      addParticle(
        octo.x + rand(-10, 10),
        octo.y - rand(5, 15),
        -rand(0.3, 1.5),
        -rand(0.5, 2),
        rand(1.5, 3),
        rand(20, 30),
        false,
      );
    }

    // Crawling: occasional small bubble
    if (octo.crawling && !octo.sprinting && frameCount % 25 === 0) {
      addParticle(
        octo.x + rand(-8, 8),
        octo.y - rand(10, 18),
        -rand(0.1, 0.5),
        -rand(0.3, 1),
        rand(1, 2),
        rand(15, 25),
        false,
      );
    }

    // Eye tracking: look toward nearest threat
    let nearestThreat = null;
    let nearestDist = 200;
    for (const o of obstacles) {
      const d = Math.hypot(o.x - octo.x, o.y - octo.y);
      if (d < nearestDist) {
        nearestDist = d;
        nearestThreat = o;
      }
    }
    if (nearestThreat) {
      const dx = nearestThreat.x - octo.x;
      const dy = nearestThreat.y - octo.y;
      octo.eyeTargetX = Math.sign(dx) * Math.min(3, Math.abs(dx) / 30);
      octo.eyeTargetY = Math.sign(dy) * Math.min(2, Math.abs(dy) / 30);
    } else {
      octo.eyeTargetX = octo.swimming ? 3 : 2;
      octo.eyeTargetY = 0;
    }
  }

  function drawOcto() {
    ctx.save();
    ctx.translate(octo.x, octo.y);

    const sq = octo.squish;
    ctx.scale(1 / sq, sq);

    // Determine body colour based on camouflage
    const camoGray = { r: 50, g: 50, b: 50 };
    const bodyColor = lerpColor(OCTO_COLOR, camoGray, octo.camoAmount);
    const lightColor = lerpColor(
      OCTO_LIGHT,
      { r: 70, g: 70, b: 70 },
      octo.camoAmount,
    );

    // Shell (drawn behind octopus body)
    if (octo.hasShell) {
      drawShellOnOcto(bodyColor);
    }

    // Body
    ctx.fillStyle = rgb(bodyColor);
    ctx.beginPath();
    ctx.ellipse(0, -6, 17, 13, 0, 0, Math.PI * 2);
    ctx.fill();

    // Lighter underside
    ctx.fillStyle = rgb(lightColor, 0.5);
    ctx.beginPath();
    ctx.ellipse(0, 0, 12, 7, 0, 0, Math.PI);
    ctx.fill();

    // Mantle
    ctx.fillStyle = rgb(bodyColor);
    ctx.beginPath();
    ctx.ellipse(0, -13, 13, 9, 0, Math.PI, Math.PI * 2);
    ctx.fill();

    // Mantle spots/texture
    ctx.fillStyle = rgb(
      lerpColor(bodyColor, { r: 150, g: 50, b: 30 }, 0.3),
      0.3,
    );
    for (let i = 0; i < 4; i++) {
      const sx = -6 + i * 4;
      const sy = -14 + (i % 2) * 3;
      ctx.beginPath();
      ctx.arc(sx, sy, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Eyes
    const ex = octo.eyeTargetX;
    const ey = octo.eyeTargetY;
    const eyeBrightness = octo.camouflaged ? 0.7 : 1;

    ctx.fillStyle = gray(240, eyeBrightness);
    ctx.beginPath();
    ctx.ellipse(-7, -8, 5.5, 5.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(7, -8, 5.5, 5.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Pupils (widen near threats)
    const pupilSize = nearestThreatClose() ? 3 : 2.5;
    ctx.fillStyle = gray(10);
    ctx.beginPath();
    ctx.ellipse(-7 + ex, -8 + ey, pupilSize, pupilSize, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(7 + ex, -8 + ey, pupilSize, pupilSize, 0, 0, Math.PI * 2);
    ctx.fill();

    // Pupil highlights
    ctx.fillStyle = gray(220);
    ctx.beginPath();
    ctx.arc(-6 + ex, -9 + ey, 1, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(8 + ex, -9 + ey, 1, 0, Math.PI * 2);
    ctx.fill();

    // Arms
    drawArms(bodyColor);

    // Carried pearl
    if (octo.hasPearl && octo.pearlThrowTimer <= 0) {
      drawCarriedPearl();
    }

    // Jet effect
    if (octo.jetTimer > 0) {
      ctx.fillStyle = gray(200, 0.15);
      const jetSize = octo.jetTimer * 2.5;
      ctx.beginPath();
      ctx.ellipse(0, 12, jetSize * 0.5, jetSize, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Sprint dust
    if (octo.sprinting && frameCount % 3 === 0) {
      addParticle(
        octo.x - 15 + rand(-5, 5),
        floorY - rand(0, 4),
        -rand(0.5, 2),
        -rand(0.2, 0.8),
        rand(1, 3),
        20,
        false,
      );
    }

    ctx.restore();
  }

  function drawArms(bodyColor) {
    ctx.strokeStyle = rgb(bodyColor, 0.9);
    ctx.lineWidth = 2.8;
    ctx.lineCap = "round";

    const phase = octo.armPhase;
    const armCount = 8;

    if (octo.crawling) {
      // Walking arms: alternating reach-and-pull gait
      for (let i = 0; i < armCount; i++) {
        const side = i < armCount / 2 ? -1 : 1;
        const idx = i % (armCount / 2);
        const spread = (idx / (armCount / 2 - 1)) * 0.6 + 0.2;
        const baseX = side * spread * 14;
        const baseY = 4;

        // Skip arm 0 on right side if carrying pearl (that arm holds it)
        if (octo.hasPearl && i === armCount - 1 && octo.pearlThrowTimer <= 0)
          continue;

        // Sprint panic arms: two front arms fling up wildly
        if (octo.sprinting && (i === 0 || i === armCount / 2)) {
          var flapPhase = phase * 2.5 + (i === 0 ? 0 : Math.PI * 0.4);
          var flapX = baseX + side * 4 + Math.sin(flapPhase * 1.3) * 5;
          var flapY = -18 + Math.sin(flapPhase) * 10;
          var tipX = flapX + side * 6 + Math.sin(flapPhase + 1) * 4;
          var tipY = flapY - 8 + Math.cos(flapPhase * 0.8) * 6;

          ctx.beginPath();
          ctx.moveTo(baseX, baseY - 4);
          ctx.quadraticCurveTo(flapX, flapY, tipX, tipY);
          ctx.stroke();
          continue;
        }

        // Alternating gait: even arms reach forward while odd arms push back
        const gaitOffset = i % 2 === 0 ? 0 : Math.PI;
        const gaitPhase = phase + gaitOffset;
        const reach = Math.sin(gaitPhase) * (octo.sprinting ? 14 : 8);
        const lift =
          Math.max(0, Math.sin(gaitPhase)) * (octo.sprinting ? 7 : 3);

        const groundY = floorY - octo.y + 2;

        ctx.beginPath();
        ctx.moveTo(baseX, baseY);

        // Mid-point: arm lifts off ground during reach
        const midX = baseX + side * 6 + reach;
        const midY = baseY + (groundY - baseY) * 0.5 - lift;

        // End point: on the ground
        const endX = baseX + side * 4 + reach * 1.3;
        const endY = groundY;

        ctx.quadraticCurveTo(midX, midY, endX, endY);

        // Arm tip curls slightly
        const tipCurl = Math.sin(gaitPhase + 0.5) * 2;
        ctx.quadraticCurveTo(
          endX + side * 2,
          endY + 1,
          endX + side * 3 + tipCurl,
          endY - 1,
        );

        ctx.stroke();
      }
    } else {
      // Swimming: arms trail behind in a bundle
      for (let i = 0; i < armCount; i++) {
        const spread = (i / (armCount - 1) - 0.5) * 1.6;
        const baseX = spread * 10;
        const baseY = 5;
        const trail = Math.sin(phase + i * 0.7) * 4;
        const trailY = Math.sin(phase * 0.8 + i * 0.5) * 3;

        ctx.beginPath();
        ctx.moveTo(baseX, baseY);
        ctx.quadraticCurveTo(
          baseX - 10,
          baseY + 8 + trailY,
          baseX - 22,
          baseY + 6 + trail,
        );
        ctx.stroke();
      }
    }
  }

  function drawShellOnOcto(bodyColor) {
    ctx.save();
    // Shell sits on top/around the octopus
    const shellColor = gray(90);
    const shellHighlight = gray(120);

    // Shell body (conch-like)
    ctx.fillStyle = shellColor;
    ctx.beginPath();
    ctx.ellipse(0, -8, 20, 16, -0.1, Math.PI * 0.8, Math.PI * 2.2);
    ctx.fill();

    // Shell spiral detail
    ctx.strokeStyle = shellHighlight;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(2, -10, 8, Math.PI * 0.5, Math.PI * 1.8);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(3, -11, 5, Math.PI * 0.5, Math.PI * 1.6);
    ctx.stroke();

    // Shell opening (where the octopus peeks out)
    ctx.fillStyle = gray(30);
    ctx.beginPath();
    ctx.ellipse(10, -4, 8, 10, 0.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  function drawCarriedPearl() {
    // Pearl held by the rightmost arm
    const px = 14;
    const py = 2;
    const shimmer = Math.sin(frameCount * 0.08) * 0.15 + 0.85;

    // Glow
    ctx.fillStyle = rgb(PEARL_COLOR, 0.1 * shimmer);
    ctx.beginPath();
    ctx.arc(px, py, 10, 0, Math.PI * 2);
    ctx.fill();

    // Pearl body
    ctx.fillStyle = rgb(PEARL_COLOR, shimmer);
    ctx.beginPath();
    ctx.arc(px, py, 5, 0, Math.PI * 2);
    ctx.fill();

    // Highlight
    ctx.fillStyle = `rgba(255,255,255,${shimmer * 0.6})`;
    ctx.beginPath();
    ctx.arc(px - 1.5, py - 1.5, 1.8, 0, Math.PI * 2);
    ctx.fill();

    // Arm curled around it
    ctx.strokeStyle = rgb(
      lerpColor(OCTO_COLOR, { r: 50, g: 50, b: 50 }, octo.camoAmount),
      0.9,
    );
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(px, py, 7, Math.PI * 0.3, Math.PI * 1.7);
    ctx.stroke();
  }

  function nearestThreatClose() {
    for (const o of obstacles) {
      if (Math.hypot(o.x - octo.x, o.y - octo.y) < 100) return true;
    }
    return false;
  }

  // ============================================================
  // SCENERY
  // ============================================================

  let sceneryLayers = [];

  function initScenery() {
    sceneryLayers = [];

    // Layer 0: far ridges
    const ridges = [];
    for (let i = 0; i < 10; i++) {
      ridges.push({
        x: i * W * 0.35,
        w: rand(80, 250),
        h: rand(30, 90),
      });
    }
    sceneryLayers.push({ items: ridges, speed: 0.08, type: "ridge" });

    // Layer 1: kelp forest
    const kelps = [];
    for (let i = 0; i < 30; i++) {
      kelps.push({
        x: rand(0, W * 3),
        segments: randInt(4, 9),
        segH: rand(10, 16),
        sway: rand(0, Math.PI * 2),
        swaySpeed: rand(0.008, 0.025),
        swayAmt: rand(2, 6),
        w: rand(1.5, 3.5),
      });
    }
    sceneryLayers.push({ items: kelps, speed: 0.2, type: "kelp" });

    // Layer 2: rocks and coral
    const rocks = [];
    for (let i = 0; i < 20; i++) {
      rocks.push({
        x: rand(0, W * 2.5),
        w: rand(12, 60),
        h: rand(6, 35),
        shape: Math.random() > 0.5 ? "round" : "jagged",
      });
    }
    sceneryLayers.push({ items: rocks, speed: 0.35, type: "rock" });

    // Layer 3: seagrass
    const grass = [];
    for (let i = 0; i < 50; i++) {
      grass.push({
        x: rand(0, W * 2),
        h: rand(5, 22),
        w: rand(1, 2),
        sway: rand(0, Math.PI * 2),
      });
    }
    sceneryLayers.push({ items: grass, speed: 0.55, type: "grass" });

    // Floor decorations (anemones, starfish, shells, bottles)
    floorDecor = [];
    for (let i = 0; i < 15; i++) {
      floorDecor.push({
        type: "anemone",
        x: rand(0, W * 3),
        h: rand(10, 25),
        w: rand(8, 16),
        tentacles: randInt(5, 9),
        sway: rand(0, Math.PI * 2),
        shade: rand(20, 40),
      });
    }
    for (let i = 0; i < 10; i++) {
      floorDecor.push({
        type: "starfish",
        x: rand(0, W * 3),
        r: rand(5, 10),
        rot: rand(0, Math.PI * 2),
        shade: rand(25, 45),
      });
    }
    for (let i = 0; i < 6; i++) {
      floorDecor.push({
        type: "bottle",
        x: rand(0, W * 3.5),
        shade: rand(20, 35),
      });
    }
    for (let i = 0; i < 8; i++) {
      floorDecor.push({
        type: "smallshell",
        x: rand(0, W * 3),
        r: rand(4, 8),
        rot: rand(0, Math.PI),
        shade: rand(30, 50),
      });
    }

    // Background fish (distant silhouettes, different depth)
    bgFish = [];
    for (let i = 0; i < 12; i++) {
      bgFish.push({
        x: rand(0, W * 2),
        y: rand(H * 0.08, floorY - 40),
        size: rand(4, 12),
        speed: rand(0.03, 0.12),
        shade: rand(14, 28),
        tailPhase: rand(0, Math.PI * 2),
        dir: Math.random() > 0.3 ? -1 : 1,
      });
    }

    // Above-water elements (shallows only)
    initAboveWater();
  }

  var floorDecor = [];
  var bgFish = [];

  // Above-water intrusions
  let aboveWaterItems = [];

  function initAboveWater() {
    aboveWaterItems = [];
    // Boat hulls
    for (let i = 0; i < 3; i++) {
      aboveWaterItems.push({
        type: "boat",
        x: rand(W * 0.5, W * 4),
        w: rand(80, 150),
        h: rand(15, 25),
      });
    }
    // Wellington boots
    aboveWaterItems.push({
      type: "wellie",
      x: rand(W * 1, W * 3),
      phase: rand(0, Math.PI * 2),
    });
    // Oar
    aboveWaterItems.push({
      type: "oar",
      x: rand(W * 2, W * 5),
      phase: rand(0, Math.PI * 2),
    });
  }

  function wrapX(baseX, speed, wrapW) {
    return (
      ((((baseX - distance * speed) % wrapW) + wrapW) % wrapW) - wrapW * 0.1
    );
  }

  function getZoneShade(base) {
    // Scenery gets darker in deeper zones
    const zoneDarken = currentZone * 6;
    return Math.max(8, base - zoneDarken);
  }

  function drawScenery() {
    // Ridges
    const ridgeLayer = sceneryLayers[0];
    if (ridgeLayer) {
      const shade = getZoneShade(38);
      ctx.fillStyle = gray(shade);
      for (const r of ridgeLayer.items) {
        const sx = wrapX(r.x, ridgeLayer.speed, W * 3.5);
        ctx.beginPath();
        ctx.moveTo(sx, floorY);
        ctx.quadraticCurveTo(sx + r.w * 0.5, floorY - r.h, sx + r.w, floorY);
        ctx.fill();
      }
    }

    // Kelp
    const kelpLayer = sceneryLayers[1];
    if (kelpLayer) {
      const shade = getZoneShade(50);
      for (const k of kelpLayer.items) {
        const sx = wrapX(k.x, kelpLayer.speed, W * 3);
        if (sx < -50 || sx > W + 50) continue;

        ctx.strokeStyle = gray(shade, 0.6);
        ctx.lineWidth = k.w;
        ctx.lineCap = "round";

        let px = sx;
        let py = floorY;
        ctx.beginPath();
        ctx.moveTo(px, py);
        for (let s = 0; s < k.segments; s++) {
          const sway =
            Math.sin(frameCount * k.swaySpeed + k.sway + s * 0.5) * k.swayAmt;
          px += sway;
          py -= k.segH;
          ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Leaf blob at tip
        if (k.segments > 5) {
          ctx.fillStyle = gray(shade + 4, 0.4);
          ctx.beginPath();
          ctx.ellipse(px, py, 3, 6, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Rocks
    const rockLayer = sceneryLayers[2];
    if (rockLayer) {
      const shade = getZoneShade(55);
      ctx.fillStyle = gray(shade);
      for (const r of rockLayer.items) {
        const sx = wrapX(r.x, rockLayer.speed, W * 2.5);
        if (r.shape === "round") {
          ctx.beginPath();
          ctx.ellipse(
            sx,
            floorY,
            r.w * 0.5,
            r.h * 0.5,
            0,
            Math.PI,
            Math.PI * 2,
          );
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.moveTo(sx, floorY);
          ctx.lineTo(sx + r.w * 0.3, floorY - r.h);
          ctx.lineTo(sx + r.w * 0.6, floorY - r.h * 0.6);
          ctx.lineTo(sx + r.w, floorY);
          ctx.fill();
        }
      }
    }

    // Seagrass
    const grassLayer = sceneryLayers[3];
    if (grassLayer) {
      const shade = getZoneShade(60);
      for (const g of grassLayer.items) {
        const sx = wrapX(g.x, grassLayer.speed, W * 2);
        if (sx < -10 || sx > W + 10) continue;
        const sway = Math.sin(frameCount * 0.03 + g.sway) * 3;
        ctx.strokeStyle = gray(shade, 0.5);
        ctx.lineWidth = g.w;
        ctx.beginPath();
        ctx.moveTo(sx, floorY);
        ctx.quadraticCurveTo(
          sx + sway,
          floorY - g.h * 0.6,
          sx + sway * 1.5,
          floorY - g.h,
        );
        ctx.stroke();
      }
    }

    // Background fish silhouettes
    drawBgFish();

    // Floor decorations (anemones, starfish, bottles, shells)
    drawFloorDecor();

    // Above-water intrusions (shallows only)
    if (currentZone === 0) {
      drawAboveWater();
    }
  }

  function drawBgFish() {
    for (var i = 0; i < bgFish.length; i++) {
      var f = bgFish[i];
      var sx = wrapX(f.x, f.speed, W * 2);
      if (sx < -20 || sx > W + 20) continue;
      var tail = Math.sin(frameCount * 0.06 + f.tailPhase) * 3;
      var shade = getZoneShade(f.shade);
      ctx.fillStyle = gray(shade, 0.5);
      ctx.save();
      ctx.translate(sx, f.y);
      ctx.scale(f.dir, 1);
      // Body
      ctx.beginPath();
      ctx.ellipse(0, 0, f.size, f.size * 0.4, 0, 0, Math.PI * 2);
      ctx.fill();
      // Tail
      ctx.beginPath();
      ctx.moveTo(f.size * 0.7, 0);
      ctx.lineTo(f.size * 1.3, -f.size * 0.4 + tail);
      ctx.lineTo(f.size * 1.3, f.size * 0.4 + tail);
      ctx.closePath();
      ctx.fill();
      // Eye
      ctx.fillStyle = gray(shade + 15, 0.6);
      ctx.beginPath();
      ctx.arc(-f.size * 0.4, -f.size * 0.1, f.size * 0.12, 0, Math.PI * 2);
      ctx.fill();
      // Fin hint
      ctx.strokeStyle = gray(shade + 5, 0.3);
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(-f.size * 0.1, f.size * 0.3);
      ctx.lineTo(f.size * 0.1, f.size * 0.6);
      ctx.stroke();
      ctx.restore();
    }
  }

  function drawFloorDecor() {
    for (var i = 0; i < floorDecor.length; i++) {
      var d = floorDecor[i];
      var sx = wrapX(d.x, 0.4, W * 3);
      if (sx < -30 || sx > W + 30) continue;
      var shade = getZoneShade(d.shade);

      if (d.type === "anemone") {
        // Base
        ctx.fillStyle = gray(shade + 5, 0.6);
        ctx.beginPath();
        ctx.ellipse(sx, floorY, d.w * 0.4, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        // Tentacles swaying
        for (var t = 0; t < d.tentacles; t++) {
          var angle = (t / d.tentacles - 0.5) * 1.4;
          var sway = Math.sin(frameCount * 0.025 + d.sway + t * 0.6) * 4;
          ctx.strokeStyle = gray(shade + 8, 0.5);
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(sx + angle * d.w * 0.3, floorY);
          ctx.quadraticCurveTo(
            sx + angle * d.w * 0.5 + sway,
            floorY - d.h * 0.6,
            sx + angle * d.w * 0.3 + sway * 1.5,
            floorY - d.h,
          );
          ctx.stroke();
          // Tip blob
          ctx.fillStyle = gray(shade + 12, 0.4);
          ctx.beginPath();
          ctx.arc(
            sx + angle * d.w * 0.3 + sway * 1.5,
            floorY - d.h,
            1.5,
            0,
            Math.PI * 2,
          );
          ctx.fill();
        }
      } else if (d.type === "starfish") {
        ctx.save();
        ctx.translate(sx, floorY - 2);
        ctx.rotate(d.rot);
        ctx.fillStyle = gray(shade, 0.5);
        ctx.strokeStyle = gray(shade + 10, 0.3);
        ctx.lineWidth = 0.8;
        for (var a = 0; a < 5; a++) {
          var ang = (a / 5) * Math.PI * 2 - Math.PI / 2;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(ang) * d.r, Math.sin(ang) * d.r);
          ctx.lineTo(
            Math.cos(ang + 0.3) * d.r * 0.4,
            Math.sin(ang + 0.3) * d.r * 0.4,
          );
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }
        ctx.restore();
      } else if (d.type === "bottle") {
        ctx.fillStyle = gray(shade, 0.35);
        ctx.strokeStyle = gray(shade + 8, 0.3);
        ctx.lineWidth = 0.8;
        // Body
        ctx.beginPath();
        ctx.ellipse(sx, floorY - 4, 3, 5, 0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // Neck
        ctx.beginPath();
        ctx.moveTo(sx + 2, floorY - 7);
        ctx.lineTo(sx + 2, floorY - 11);
        ctx.lineTo(sx + 3, floorY - 11);
        ctx.lineTo(sx + 3, floorY - 7);
        ctx.stroke();
      } else if (d.type === "smallshell") {
        ctx.save();
        ctx.translate(sx, floorY - 1);
        ctx.rotate(d.rot);
        ctx.fillStyle = gray(shade, 0.4);
        ctx.strokeStyle = gray(shade + 10, 0.3);
        ctx.lineWidth = 0.6;
        // Spiral shell
        ctx.beginPath();
        ctx.arc(0, 0, d.r, Math.PI, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // Ridges
        for (var ri = 0; ri < 3; ri++) {
          ctx.beginPath();
          ctx.arc(0, 0, d.r * (0.4 + ri * 0.2), Math.PI * 1.1, Math.PI * 1.9);
          ctx.stroke();
        }
        ctx.restore();
      }
    }
  }

  function drawAboveWater() {
    for (const item of aboveWaterItems) {
      const sx = wrapX(item.x, 0.15, W * 5);
      if (sx < -200 || sx > W + 200) continue;

      if (item.type === "boat") {
        // Dark hull silhouette from below
        ctx.fillStyle = gray(8);
        ctx.beginPath();
        ctx.moveTo(sx, 0);
        ctx.lineTo(sx + item.w, 0);
        ctx.lineTo(sx + item.w * 0.9, item.h);
        ctx.lineTo(sx + item.w * 0.1, item.h);
        ctx.fill();
        // Keel line
        ctx.strokeStyle = gray(15);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(sx + item.w * 0.5, item.h);
        ctx.lineTo(sx + item.w * 0.5, item.h + 8);
        ctx.stroke();
      }

      if (item.type === "wellie") {
        const bob = Math.sin(frameCount * 0.02 + item.phase) * 6;
        const wy = 10 + bob;
        // Boot silhouette from below (foot + leg)
        ctx.fillStyle = gray(10);
        ctx.beginPath();
        ctx.moveTo(sx, wy);
        ctx.lineTo(sx + 14, wy);
        ctx.lineTo(sx + 14, wy + 20);
        ctx.lineTo(sx + 20, wy + 20);
        ctx.lineTo(sx + 20, wy + 25);
        ctx.lineTo(sx - 4, wy + 25);
        ctx.lineTo(sx - 4, wy + 5);
        ctx.lineTo(sx, wy + 5);
        ctx.closePath();
        ctx.fill();
      }

      if (item.type === "oar") {
        const dip = Math.sin(frameCount * 0.015 + item.phase);
        const angle = dip * 0.3;
        const oy = 5;
        ctx.save();
        ctx.translate(sx, oy);
        ctx.rotate(angle);
        ctx.strokeStyle = gray(12);
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, 50);
        ctx.stroke();
        // Blade
        ctx.fillStyle = gray(10);
        ctx.beginPath();
        ctx.ellipse(0, 55, 6, 12, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
  }

  // ============================================================
  // AMBIENT PARTICLES & LIGHT
  // ============================================================

  let ambientParticles = [];

  function initAmbient() {
    ambientParticles = [];
    for (let i = 0; i < 55; i++) {
      ambientParticles.push({
        x: rand(0, W),
        y: rand(0, floorY),
        vx: -rand(0.1, 0.4),
        vy: rand(-0.1, 0.1),
        r: rand(0.5, 2.5),
        alpha: rand(0.05, 0.18),
      });
    }
  }

  function drawAmbient() {
    for (const p of ambientParticles) {
      p.x += p.vx - gameSpeed * 0.08;
      p.y += p.vy;
      if (p.x < -5) p.x = W + 5;
      if (p.y < 0 || p.y > floorY) p.vy *= -1;
      ctx.fillStyle = gray(100, p.alpha * 1.5);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawLightRays() {
    // Fade out in deeper zones
    const rayAlpha = Math.max(0.1 - currentZone * 0.025, 0);
    if (rayAlpha <= 0) return;

    for (let i = 0; i < 5; i++) {
      const baseX =
        (((i * W * 0.28 - distance * 0.04) % (W * 1.5)) + W * 1.5) % (W * 1.5);
      const w = 20 + i * 20;
      const grad = ctx.createLinearGradient(0, 0, 0, H * 0.7);
      grad.addColorStop(0, `rgba(210,210,200,${rayAlpha})`);
      grad.addColorStop(0.5, `rgba(200,200,190,${rayAlpha * 0.4})`);
      grad.addColorStop(1, "rgba(200,200,190,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(baseX, 0);
      ctx.lineTo(baseX + w * 2, H * 0.7);
      ctx.lineTo(baseX - w, H * 0.7);
      ctx.fill();
    }
  }

  // ============================================================
  // FLOOR
  // ============================================================

  function drawFloor() {
    const shade = getZoneShade(32);
    const grad = ctx.createLinearGradient(0, floorY, 0, H);
    grad.addColorStop(0, gray(shade));
    grad.addColorStop(0.3, gray(Math.max(4, shade - 5)));
    grad.addColorStop(1, gray(Math.max(2, shade - 10)));
    ctx.fillStyle = grad;
    ctx.fillRect(0, floorY, W, H - floorY);

    // Floor edge
    ctx.strokeStyle = gray(shade + 12);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, floorY);
    ctx.lineTo(W, floorY);
    ctx.stroke();

    // Sand texture
    ctx.fillStyle = gray(shade + 6, 0.3);
    for (let i = 0; i < 80; i++) {
      const sx = (i * 37 + distance * 0.5) % W;
      const sy = floorY + 2 + ((i * 13) % 20);
      ctx.fillRect(sx, sy, 1, 1);
    }
  }

  // ============================================================
  // OBSTACLES
  // ============================================================

  let obstacles = [];
  let spawnTimer = 0;

  function spawnObstacle() {
    // Build zone-appropriate enemy pool
    var pool = ["urchin", "bag"]; // available everywhere
    if (currentZone === 0) {
      pool.push("net", "hook", "propeller");
    } else if (currentZone === 1) {
      pool.push("hook", "moray");
    } else if (currentZone === 2) {
      pool.push("pufferfish", "moray");
    } else if (currentZone === 3) {
      pool.push("pufferfish", "moray");
    }

    var pick = pool[Math.floor(Math.random() * pool.length)];

    if (pick === "urchin") {
      var size = rand(22, 36);
      obstacles.push({
        type: "urchin",
        x: W + 50,
        y: floorY - size * 0.4,
        w: size,
        h: size,
        speed: gameSpeed,
      });
    } else if (pick === "bag") {
      var size = rand(28, 42);
      obstacles.push({
        type: "bag",
        x: W + 50,
        y: rand(H * 0.1, floorY - 80),
        w: size,
        h: size * 1.2,
        speed: gameSpeed * rand(0.5, 0.8),
        wobblePhase: rand(0, Math.PI * 2),
      });
    } else if (pick === "net") {
      obstacles.push({
        type: "net",
        x: W + 50,
        y: 0,
        w: rand(30, 50),
        h: floorY * rand(0.5, 0.8),
        speed: gameSpeed * 0.5,
      });
    } else if (pick === "hook") {
      obstacles.push({
        type: "hook",
        x: W + 50,
        y: rand(H * 0.1, floorY - 60),
        w: 18,
        h: 30,
        speed: gameSpeed,
        swayPhase: rand(0, Math.PI * 2),
      });
    } else if (pick === "propeller") {
      obstacles.push({
        type: "propeller",
        x: W + 50,
        y: rand(20, H * 0.25),
        w: 44,
        h: 44,
        speed: gameSpeed * 2,
      });
    } else if (pick === "pufferfish") {
      obstacles.push({
        type: "pufferfish",
        x: W + 50,
        y: rand(H * 0.15, floorY - 50),
        w: 20,
        h: 20,
        baseW: 20,
        baseH: 20,
        speed: gameSpeed * rand(0.6, 0.9),
        inflateAmount: 0,
      });
    } else if (pick === "moray") {
      obstacles.push({
        type: "moray",
        x: W + 50,
        y: floorY,
        w: 30,
        h: 22,
        speed: gameSpeed,
        state: "hiding",
        lungeTimer: 0,
        lungeProgress: 0,
      });
    }
  }

  function drawObstacle(o) {
    ctx.save();
    ctx.translate(o.x, o.y);

    if (o.type === "urchin") {
      // Outline glow for visibility
      ctx.strokeStyle = gray(70, 0.4);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, o.w * 0.38, 0, Math.PI * 2);
      ctx.stroke();

      // Body
      ctx.fillStyle = gray(25);
      ctx.beginPath();
      ctx.arc(0, 0, o.w * 0.35, 0, Math.PI * 2);
      ctx.fill();

      // Spines with lighter tips
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const len = o.w * 0.5 + Math.sin(frameCount * 0.08 + i) * 2;
        const grad = ctx.createLinearGradient(
          Math.cos(angle) * o.w * 0.3,
          Math.sin(angle) * o.w * 0.3,
          Math.cos(angle) * len,
          Math.sin(angle) * len,
        );
        grad.addColorStop(0, gray(30));
        grad.addColorStop(1, gray(80));
        ctx.strokeStyle = grad;
        ctx.beginPath();
        ctx.moveTo(Math.cos(angle) * o.w * 0.3, Math.sin(angle) * o.w * 0.3);
        ctx.lineTo(Math.cos(angle) * len, Math.sin(angle) * len);
        ctx.stroke();
      }
    }

    if (o.type === "bag") {
      const wobble = Math.sin(frameCount * 0.03 + o.wobblePhase) * 6;
      const drift = Math.sin(frameCount * 0.015 + o.wobblePhase * 2) * 3;
      ctx.translate(drift, wobble);
      ctx.rotate(Math.sin(frameCount * 0.02 + o.wobblePhase) * 0.15);

      // Crinkled bag shape
      ctx.fillStyle = gray(70, 0.45);
      ctx.strokeStyle = gray(120, 0.6);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-o.w * 0.4, -o.h * 0.5);
      ctx.lineTo(-o.w * 0.5, -o.h * 0.1);
      ctx.quadraticCurveTo(-o.w * 0.45, o.h * 0.2, -o.w * 0.3, o.h * 0.4);
      ctx.lineTo(o.w * 0.3, o.h * 0.4);
      ctx.quadraticCurveTo(o.w * 0.45, o.h * 0.2, o.w * 0.5, -o.h * 0.1);
      ctx.lineTo(o.w * 0.4, -o.h * 0.5);
      ctx.quadraticCurveTo(o.w * 0.1, -o.h * 0.55, -o.w * 0.1, -o.h * 0.5);
      ctx.quadraticCurveTo(-o.w * 0.3, -o.h * 0.45, -o.w * 0.4, -o.h * 0.5);
      ctx.fill();
      ctx.stroke();

      // Handle loops at top
      ctx.strokeStyle = gray(110, 0.5);
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.ellipse(
        -o.w * 0.15,
        -o.h * 0.55,
        o.w * 0.12,
        o.h * 0.1,
        -0.2,
        Math.PI,
        Math.PI * 2,
      );
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(
        o.w * 0.15,
        -o.h * 0.55,
        o.w * 0.12,
        o.h * 0.1,
        0.2,
        Math.PI,
        Math.PI * 2,
      );
      ctx.stroke();

      // Crinkle lines
      ctx.strokeStyle = gray(100, 0.3);
      ctx.lineWidth = 0.5;
      for (var ci = 0; ci < 3; ci++) {
        var cx = (ci - 1) * o.w * 0.2;
        var cwave = Math.sin(frameCount * 0.04 + ci * 2) * 2;
        ctx.beginPath();
        ctx.moveTo(cx, -o.h * 0.3);
        ctx.quadraticCurveTo(cx + cwave, 0, cx - cwave, o.h * 0.3);
        ctx.stroke();
      }

      // Shimmer on edges (the tell)
      var bagShimmer = Math.sin(frameCount * 0.08 + o.wobblePhase) * 0.2 + 0.35;
      ctx.strokeStyle = gray(150, bagShimmer);
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.moveTo(-o.w * 0.5, -o.h * 0.1);
      ctx.quadraticCurveTo(-o.w * 0.45, o.h * 0.2, -o.w * 0.3, o.h * 0.4);
      ctx.stroke();
    }

    if (o.type === "net") {
      // Mesh pattern
      ctx.strokeStyle = gray(55, 0.5);
      ctx.lineWidth = 1;
      const meshSize = 15;
      for (let ny = 0; ny < o.h; ny += meshSize) {
        const sway = Math.sin(frameCount * 0.02 + ny * 0.1) * 3;
        ctx.beginPath();
        ctx.moveTo(-o.w / 2 + sway, ny);
        ctx.lineTo(o.w / 2 + sway, ny);
        ctx.stroke();
      }
      for (let nx = -o.w / 2; nx <= o.w / 2; nx += meshSize) {
        ctx.beginPath();
        ctx.moveTo(nx, 0);
        for (let ny = 0; ny < o.h; ny += meshSize) {
          const sway = Math.sin(frameCount * 0.02 + ny * 0.1) * 3;
          ctx.lineTo(nx + sway, ny);
        }
        ctx.stroke();
      }
      // Rope at top
      ctx.strokeStyle = gray(65, 0.7);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-o.w / 2, 0);
      ctx.lineTo(o.w / 2, 0);
      ctx.stroke();
    }

    if (o.type === "hook") {
      // Fishing line going up to top of screen
      var lineTopY = -o.y; // from translated origin to y=0
      ctx.strokeStyle = gray(60, 0.4);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, -o.h * 0.3);
      ctx.lineTo(0, lineTopY);
      ctx.stroke();

      // Sway offset (applied to hook body, line stays taut to anchor)
      var sway = Math.sin(frameCount * 0.03 + o.swayPhase) * 8;
      ctx.translate(sway, 0);

      // Outline for visibility
      ctx.strokeStyle = gray(100, 0.5);
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.beginPath();
      // Shank (straight part)
      ctx.moveTo(0, -o.h * 0.5);
      ctx.lineTo(0, o.h * 0.1);
      // Bend (curved J)
      ctx.quadraticCurveTo(0, o.h * 0.5, -5, o.h * 0.4);
      // Point curves back up
      ctx.quadraticCurveTo(-7, o.h * 0.2, -3, o.h * 0.05);
      ctx.stroke();

      // Hook body (metallic gray)
      ctx.strokeStyle = gray(85);
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(0, -o.h * 0.5);
      ctx.lineTo(0, o.h * 0.1);
      ctx.quadraticCurveTo(0, o.h * 0.5, -5, o.h * 0.4);
      ctx.quadraticCurveTo(-7, o.h * 0.2, -3, o.h * 0.05);
      ctx.stroke();

      // Barb
      ctx.strokeStyle = gray(100);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-3, o.h * 0.05);
      ctx.lineTo(-1, o.h * 0.15);
      ctx.stroke();

      // Eye (loop at top)
      ctx.strokeStyle = gray(90);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, -o.h * 0.5, 2.5, 0, Math.PI * 2);
      ctx.stroke();
    }

    if (o.type === "propeller") {
      // Motion blur trail
      for (var ti = 3; ti > 0; ti--) {
        ctx.fillStyle = gray(50, 0.06 * ti);
        ctx.beginPath();
        ctx.arc(ti * 6, 0, o.w * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Hub
      ctx.fillStyle = gray(70);
      ctx.strokeStyle = gray(100, 0.6);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // 3 rotating blades
      var rotAngle = frameCount * 0.35;
      for (var bi = 0; bi < 3; bi++) {
        var bAngle = rotAngle + (bi / 3) * Math.PI * 2;
        var bx = Math.cos(bAngle) * o.w * 0.45;
        var by = Math.sin(bAngle) * o.h * 0.45;

        // Blade outline for visibility
        ctx.strokeStyle = gray(100, 0.4);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(bx, by);
        ctx.stroke();

        // Blade body
        ctx.strokeStyle = gray(80);
        ctx.lineWidth = 4;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(Math.cos(bAngle) * 4, Math.sin(bAngle) * 4);
        ctx.lineTo(bx, by);
        ctx.stroke();

        // Blade tip highlight
        ctx.fillStyle = gray(110);
        ctx.beginPath();
        ctx.arc(bx, by, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Centre bolt
      ctx.fillStyle = gray(90);
      ctx.beginPath();
      ctx.arc(0, 0, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    if (o.type === "pufferfish") {
      var inf = o.inflateAmount;
      var bodyR = lerp(o.baseW * 0.5, 22, inf);

      // Outer glow when inflated
      if (inf > 0.3) {
        ctx.fillStyle = gray(80, inf * 0.08);
        ctx.beginPath();
        ctx.arc(0, 0, bodyR + 8, 0, Math.PI * 2);
        ctx.fill();
      }

      // Body outline for visibility
      ctx.strokeStyle = gray(100, 0.5);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, bodyR, 0, Math.PI * 2);
      ctx.stroke();

      // Body
      ctx.fillStyle = gray(75);
      ctx.beginPath();
      ctx.arc(0, 0, bodyR, 0, Math.PI * 2);
      ctx.fill();

      // Belly (lighter)
      ctx.fillStyle = gray(95, 0.5);
      ctx.beginPath();
      ctx.ellipse(0, bodyR * 0.2, bodyR * 0.6, bodyR * 0.4, 0, 0, Math.PI);
      ctx.fill();

      // Spines (extend with inflation)
      if (inf > 0.1) {
        var spineCount = 10;
        var spineLen = inf * 8;
        ctx.strokeStyle = gray(100, inf * 0.8);
        ctx.lineWidth = 1;
        for (var si = 0; si < spineCount; si++) {
          var sAngle = (si / spineCount) * Math.PI * 2;
          var sx1 = Math.cos(sAngle) * bodyR;
          var sy1 = Math.sin(sAngle) * bodyR;
          var sx2 = Math.cos(sAngle) * (bodyR + spineLen);
          var sy2 = Math.sin(sAngle) * (bodyR + spineLen);
          ctx.beginPath();
          ctx.moveTo(sx1, sy1);
          ctx.lineTo(sx2, sy2);
          ctx.stroke();
        }
      }

      // Eyes
      var eyeSpread = lerp(3, 5, inf);
      var eyeR = lerp(2, 3, inf); // eyes go wider when inflated
      // Eye whites
      ctx.fillStyle = gray(220);
      ctx.beginPath();
      ctx.arc(-eyeSpread, -bodyR * 0.3, eyeR, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(eyeSpread, -bodyR * 0.3, eyeR, 0, Math.PI * 2);
      ctx.fill();
      // Pupils (shrink when inflated for surprised look)
      var pupilR = lerp(1.2, 0.8, inf);
      ctx.fillStyle = gray(15);
      ctx.beginPath();
      ctx.arc(-eyeSpread + 0.5, -bodyR * 0.3, pupilR, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(eyeSpread + 0.5, -bodyR * 0.3, pupilR, 0, Math.PI * 2);
      ctx.fill();

      // Mouth (small, cute)
      ctx.strokeStyle = gray(50);
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.arc(0, bodyR * 0.05, 1.5, 0, Math.PI);
      ctx.stroke();

      // Tail fin
      ctx.fillStyle = gray(65);
      ctx.beginPath();
      ctx.moveTo(-bodyR, 0);
      ctx.lineTo(-bodyR - 4, -3);
      ctx.lineTo(-bodyR - 4, 3);
      ctx.closePath();
      ctx.fill();
    }

    if (o.type === "moray") {
      if (o.state === "hiding") {
        // Dark crevice shape
        ctx.fillStyle = gray(15);
        ctx.beginPath();
        ctx.moveTo(-o.w * 0.5, 0);
        ctx.quadraticCurveTo(-o.w * 0.5, -o.h, 0, -o.h);
        ctx.quadraticCurveTo(o.w * 0.5, -o.h, o.w * 0.5, 0);
        ctx.fill();

        // Crevice outline for visibility
        ctx.strokeStyle = gray(30, 0.6);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-o.w * 0.5, 0);
        ctx.quadraticCurveTo(-o.w * 0.5, -o.h, 0, -o.h);
        ctx.quadraticCurveTo(o.w * 0.5, -o.h, o.w * 0.5, 0);
        ctx.stroke();

        // Two small eyes peering out
        ctx.fillStyle = gray(90);
        ctx.beginPath();
        ctx.arc(-3, -o.h * 0.5, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(3, -o.h * 0.5, 1.5, 0, Math.PI * 2);
        ctx.fill();
        // Pupil dots
        ctx.fillStyle = gray(20);
        ctx.beginPath();
        ctx.arc(-2.5, -o.h * 0.5, 0.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(3.5, -o.h * 0.5, 0.8, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Lunging or retracting: draw crevice base
        ctx.fillStyle = gray(15);
        ctx.beginPath();
        ctx.moveTo(-o.w * 0.5, 0);
        ctx.quadraticCurveTo(-o.w * 0.5, -15, 0, -15);
        ctx.quadraticCurveTo(o.w * 0.5, -15, o.w * 0.5, 0);
        ctx.fill();

        // Eel body extending upward
        var lungeH = o.lungeProgress * 40;
        var neckSway = Math.sin(frameCount * 0.1) * 3 * o.lungeProgress;

        // Sinuous neck
        ctx.strokeStyle = gray(60);
        ctx.lineWidth = 6;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(0, -10);
        ctx.quadraticCurveTo(
          neckSway + 4,
          -10 - lungeH * 0.5,
          neckSway,
          -10 - lungeH,
        );
        ctx.stroke();

        // Neck outline for visibility
        ctx.strokeStyle = gray(85, 0.4);
        ctx.lineWidth = 7.5;
        ctx.beginPath();
        ctx.moveTo(0, -10);
        ctx.quadraticCurveTo(
          neckSway + 4,
          -10 - lungeH * 0.5,
          neckSway,
          -10 - lungeH,
        );
        ctx.stroke();

        // Redraw body on top of outline
        ctx.strokeStyle = gray(60);
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(0, -10);
        ctx.quadraticCurveTo(
          neckSway + 4,
          -10 - lungeH * 0.5,
          neckSway,
          -10 - lungeH,
        );
        ctx.stroke();

        // Pattern on body
        ctx.strokeStyle = gray(75, 0.4);
        ctx.lineWidth = 1;
        for (var mi = 0; mi < 4; mi++) {
          var my = -12 - mi * lungeH * 0.2;
          if (my < -10 - lungeH) break;
          var mx = neckSway * ((-10 - lungeH - my) / (-lungeH || 1));
          ctx.beginPath();
          ctx.arc(mx, my, 2, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Head
        var headX = neckSway;
        var headY = -10 - lungeH;
        ctx.fillStyle = gray(65);
        ctx.beginPath();
        ctx.ellipse(headX, headY, 5, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Head outline
        ctx.strokeStyle = gray(90, 0.4);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(headX, headY, 5, 4, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Eyes on head
        ctx.fillStyle = gray(180);
        ctx.beginPath();
        ctx.arc(headX - 2, headY - 1.5, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(headX + 2, headY - 1.5, 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Open mouth
        ctx.strokeStyle = gray(100);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(headX + 5, headY - 1);
        ctx.lineTo(headX + 8, headY - 2);
        ctx.moveTo(headX + 5, headY + 1);
        ctx.lineTo(headX + 8, headY + 2);
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  // ============================================================
  // COLLECTIBLES
  // ============================================================

  let collectibles = [];
  let collectTimer = 0;

  function spawnCollectible() {
    const r = Math.random();

    if (r < 0.4) {
      collectibles.push({
        type: "plankton",
        x: W + 20,
        y: rand(H * 0.15, floorY - 30),
        r: 7,
        points: 5,
        pulse: rand(0, Math.PI * 2),
      });
    } else if (r < 0.6) {
      collectibles.push({
        type: "crab",
        x: W + 20,
        y: floorY - 6,
        w: 16,
        h: 11,
        points: 15,
        walkPhase: rand(0, Math.PI * 2),
      });
    } else if (r < 0.8) {
      collectibles.push({
        type: "shrimp",
        x: W + 20,
        y: rand(H * 0.25, floorY - 50),
        w: 18,
        h: 8,
        points: 25,
        glowPhase: rand(0, Math.PI * 2),
      });
    } else {
      var jellySize = rand(22, 32);
      collectibles.push({
        type: "jelly",
        x: W + 20,
        y: rand(H * 0.15, floorY - 60),
        w: jellySize,
        h: jellySize * 1.2,
        points: 20,
        wobblePhase: rand(0, Math.PI * 2),
      });
    }
  }

  function drawCollectible(c) {
    ctx.save();
    ctx.translate(c.x, c.y);

    if (c.type === "plankton") {
      // Tiny translucent organism with trailing filaments
      var pulse = Math.sin(frameCount * 0.08 + c.pulse) * 0.3 + 0.7;
      // Soft glow
      ctx.fillStyle = rgb(ACCENT, pulse * 0.1);
      ctx.beginPath();
      ctx.arc(0, 0, c.r * 2.5, 0, Math.PI * 2);
      ctx.fill();
      // Bell-shaped body
      ctx.fillStyle = rgb(ACCENT, pulse * 0.7);
      ctx.beginPath();
      ctx.ellipse(0, -1, c.r * 0.8, c.r, 0, Math.PI, Math.PI * 2);
      ctx.fill();
      // Lower body
      ctx.fillStyle = rgb(ACCENT, pulse * 0.5);
      ctx.beginPath();
      ctx.ellipse(0, 1, c.r * 0.6, c.r * 0.7, 0, 0, Math.PI);
      ctx.fill();
      // Trailing filaments
      ctx.strokeStyle = rgb(ACCENT, pulse * 0.4);
      ctx.lineWidth = 0.5;
      for (var fi = 0; fi < 3; fi++) {
        var fx = (fi - 1) * c.r * 0.5;
        var fwave = Math.sin(frameCount * 0.06 + c.pulse + fi) * 2;
        ctx.beginPath();
        ctx.moveTo(fx, c.r * 0.5);
        ctx.quadraticCurveTo(
          fx + fwave,
          c.r * 1.5,
          fx + fwave * 1.5,
          c.r * 2.5,
        );
        ctx.stroke();
      }
    }

    if (c.type === "crab") {
      var walk = Math.sin(frameCount * 0.15 + c.walkPhase) * 2;
      // Glow
      ctx.fillStyle = rgb(ACCENT, 0.08);
      ctx.beginPath();
      ctx.arc(0, 0, c.w, 0, Math.PI * 2);
      ctx.fill();
      // Body (wider, flatter)
      ctx.fillStyle = rgb(ACCENT, 0.7);
      ctx.beginPath();
      ctx.ellipse(0, 0, c.w * 0.5, c.h * 0.35, 0, 0, Math.PI * 2);
      ctx.fill();
      // Eyes on stalks
      ctx.fillStyle = rgb(ACCENT, 0.9);
      ctx.beginPath();
      ctx.arc(-c.w * 0.3, -c.h * 0.35, 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(c.w * 0.3, -c.h * 0.35, 1.5, 0, Math.PI * 2);
      ctx.fill();
      // Eye stalks
      ctx.strokeStyle = rgb(ACCENT, 0.5);
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(-c.w * 0.2, -c.h * 0.15);
      ctx.lineTo(-c.w * 0.3, -c.h * 0.35);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(c.w * 0.2, -c.h * 0.15);
      ctx.lineTo(c.w * 0.3, -c.h * 0.35);
      ctx.stroke();
      // Legs (3 per side, walking)
      ctx.strokeStyle = rgb(ACCENT, 0.5);
      ctx.lineWidth = 1;
      for (var li = 0; li < 3; li++) {
        var lx = (li - 1) * c.w * 0.25;
        var lphase = walk * (li % 2 === 0 ? 1 : -1);
        ctx.beginPath();
        ctx.moveTo(lx, c.h * 0.15);
        ctx.lineTo(lx + c.w * 0.4 + lphase, c.h * 0.5);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-lx, c.h * 0.15);
        ctx.lineTo(-lx - c.w * 0.4 - lphase, c.h * 0.5);
        ctx.stroke();
      }
      // Claws
      ctx.fillStyle = rgb(ACCENT, 0.6);
      ctx.beginPath();
      ctx.ellipse(-c.w * 0.55, -c.h * 0.1, 2.5, 1.8, -0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(c.w * 0.55, -c.h * 0.1, 2.5, 1.8, 0.3, 0, Math.PI * 2);
      ctx.fill();
    }

    if (c.type === "shrimp") {
      var sglow = Math.sin(frameCount * 0.06 + c.glowPhase) * 0.3 + 0.7;
      // Soft glow
      ctx.fillStyle = rgb(ACCENT, sglow * 0.08);
      ctx.beginPath();
      ctx.arc(0, 0, 14, 0, Math.PI * 2);
      ctx.fill();
      // Curved segmented body
      ctx.strokeStyle = rgb(ACCENT, sglow * 0.8);
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(-c.w * 0.5, 0);
      ctx.quadraticCurveTo(0, -c.h * 0.6, c.w * 0.3, -c.h * 0.3);
      ctx.stroke();
      // Tail fan
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-c.w * 0.5, 0);
      ctx.lineTo(-c.w * 0.65, c.h * 0.3);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-c.w * 0.5, 0);
      ctx.lineTo(-c.w * 0.7, -c.h * 0.2);
      ctx.stroke();
      // Head
      ctx.fillStyle = rgb(ACCENT, sglow * 0.7);
      ctx.beginPath();
      ctx.arc(c.w * 0.3, -c.h * 0.3, 2, 0, Math.PI * 2);
      ctx.fill();
      // Antennae
      ctx.strokeStyle = rgb(ACCENT, sglow * 0.4);
      ctx.lineWidth = 0.5;
      var awave = Math.sin(frameCount * 0.1 + c.glowPhase) * 2;
      ctx.beginPath();
      ctx.moveTo(c.w * 0.3, -c.h * 0.3);
      ctx.quadraticCurveTo(
        c.w * 0.5,
        -c.h * 0.6 + awave,
        c.w * 0.7,
        -c.h * 0.5,
      );
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(c.w * 0.3, -c.h * 0.3);
      ctx.quadraticCurveTo(
        c.w * 0.5,
        -c.h * 0.8 + awave,
        c.w * 0.65,
        -c.h * 0.7,
      );
      ctx.stroke();
      // Leg tufts
      ctx.strokeStyle = rgb(ACCENT, sglow * 0.3);
      ctx.lineWidth = 0.5;
      for (var si = 0; si < 4; si++) {
        var sx = -c.w * 0.3 + si * c.w * 0.18;
        var sy = -c.h * 0.1 - si * c.h * 0.08;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx, sy + c.h * 0.4);
        ctx.stroke();
      }
    }

    if (c.type === "jelly") {
      var jWobble = Math.sin(frameCount * 0.04 + c.wobblePhase) * 5;
      ctx.translate(0, jWobble);

      // Outer glow (accent)
      ctx.fillStyle = rgb(ACCENT, 0.08);
      ctx.beginPath();
      ctx.ellipse(0, 0, c.w * 0.8, c.w * 0.7, 0, 0, Math.PI * 2);
      ctx.fill();

      // Bell
      ctx.fillStyle = rgb(ACCENT, 0.5);
      ctx.strokeStyle = rgb(ACCENT, 0.7);
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(0, 0, c.w * 0.45, c.w * 0.35, 0, Math.PI, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Inner
      ctx.fillStyle = rgb(ACCENT, 0.2);
      ctx.beginPath();
      ctx.ellipse(0, -2, c.w * 0.25, c.w * 0.18, 0, Math.PI, Math.PI * 2);
      ctx.fill();

      // Tentacles
      ctx.strokeStyle = rgb(ACCENT, 0.35);
      ctx.lineWidth = 0.8;
      for (var jt = 0; jt < 4; jt++) {
        var jtx = (jt - 1.5) * (c.w * 0.18);
        var jwave = Math.sin(frameCount * 0.05 + jt * 1.5) * 4;
        ctx.beginPath();
        ctx.moveTo(jtx, 2);
        ctx.quadraticCurveTo(
          jtx + jwave,
          c.h * 0.35,
          jtx + jwave * 1.2,
          c.h * 0.55,
        );
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  // ============================================================
  // PEARLS (floor pickups)
  // ============================================================

  let pearls = [];
  let pearlSpawnTimer = 0;

  function spawnPearl() {
    pearls.push({
      x: W + 20,
      y: floorY - 5,
      r: 5,
      shimmer: rand(0, Math.PI * 2),
    });
  }

  function drawPearl(p) {
    const s = Math.sin(frameCount * 0.06 + p.shimmer) * 0.2 + 0.8;
    // Outer glow (large, warm)
    ctx.fillStyle = `rgba(255,230,180,${0.06 * s})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 22, 0, Math.PI * 2);
    ctx.fill();
    // Inner glow
    ctx.fillStyle = `rgba(255,240,200,${0.15 * s})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 12, 0, Math.PI * 2);
    ctx.fill();
    // Body
    ctx.fillStyle = rgb(PEARL_COLOR, s);
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
    // Highlight
    ctx.fillStyle = `rgba(255,255,255,${s * 0.6})`;
    ctx.beginPath();
    ctx.arc(p.x - 1.5, p.y - 1.5, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  // ============================================================
  // SHELLS (floor pickups, armour)
  // ============================================================

  let shells = [];
  let shellSpawnTimer = 0;

  function spawnShell() {
    shells.push({
      x: W + 20,
      y: floorY - 8,
      w: 16,
      h: 12,
    });
  }

  function drawShellPickup(s) {
    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.fillStyle = gray(80);
    ctx.beginPath();
    ctx.ellipse(0, 0, s.w * 0.5, s.h * 0.4, 0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = gray(100);
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.arc(1, -1, 4, 0.5, Math.PI * 1.5);
    ctx.stroke();
    ctx.restore();
  }

  // ============================================================
  // THROWN PEARLS (projectiles)
  // ============================================================

  let thrownPearls = [];
  var inkClouds = [];

  function spawnInkCloud() {
    if (octo.ink < 5) return;
    octo.ink -= 5;
    inkClouds.push({
      x: octo.x,
      y: octo.y,
      radius: 30,
      life: 90,
      maxLife: 90,
    });
  }

  function throwPearl() {
    if (!octo.hasPearl) return;
    octo.hasPearl = false;
    octo.pearlThrowTimer = 10;
    thrownPearls.push({
      x: octo.x + 20,
      y: octo.y - 4,
      vx: 8,
      vy: -2,
      life: 60,
    });
  }

  function drawThrownPearl(p) {
    const s = 0.8;
    ctx.fillStyle = rgb(PEARL_COLOR, s);
    ctx.beginPath();
    ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = `rgba(255,255,255,0.4)`;
    ctx.beginPath();
    ctx.arc(p.x - 1, p.y - 1, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // ============================================================
  // INK CLOUDS
  // ============================================================

  function drawInkClouds() {
    for (var i = 0; i < inkClouds.length; i++) {
      var cloud = inkClouds[i];
      var t = 1 - cloud.life / cloud.maxLife;
      var alpha = 0.6 * (cloud.life / cloud.maxLife);
      var r = 30 + (50 - 30) * t;

      // Main cloud body
      ctx.fillStyle = "rgba(30,10,40," + alpha + ")";
      ctx.beginPath();
      ctx.arc(cloud.x, cloud.y, r, 0, Math.PI * 2);
      ctx.fill();

      // Wispy tendrils
      ctx.strokeStyle = "rgba(30,10,40," + alpha * 0.5 + ")";
      ctx.lineWidth = 2;
      for (var j = 0; j < 4; j++) {
        var angle = (j / 4) * Math.PI * 2 + t * 0.5;
        var tendrilLen = r * 1.4;
        var cx1 = cloud.x + Math.cos(angle + 0.3) * r * 0.6;
        var cy1 = cloud.y + Math.sin(angle + 0.3) * r * 0.6;
        var ex = cloud.x + Math.cos(angle) * tendrilLen;
        var ey = cloud.y + Math.sin(angle) * tendrilLen;
        ctx.beginPath();
        ctx.moveTo(
          cloud.x + Math.cos(angle) * r * 0.3,
          cloud.y + Math.sin(angle) * r * 0.3,
        );
        ctx.quadraticCurveTo(cx1, cy1, ex, ey);
        ctx.stroke();
      }
    }
  }

  // ============================================================
  // PARTICLES
  // ============================================================

  let particles = [];

  function addParticle(x, y, vx, vy, r, life, colored) {
    particles.push({ x, y, vx, vy, r, life, maxLife: life, colored });
  }

  function addCollectEffect(x, y) {
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      addParticle(x, y, Math.cos(angle) * 2, Math.sin(angle) * 2, 2, 20, true);
    }
  }

  function drawParticles() {
    for (const p of particles) {
      const alpha = p.life / p.maxLife;
      if (p.colored) {
        ctx.fillStyle = rgb(ACCENT, alpha * 0.6);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Bubble: hollow circle with shine
        ctx.strokeStyle = gray(180, alpha * 0.6);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.stroke();
        // Highlight dot
        ctx.fillStyle = gray(240, alpha * 0.5);
        ctx.beginPath();
        ctx.arc(p.x - p.r * 0.3, p.y - p.r * 0.3, p.r * 0.35, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // ============================================================
  // HUD
  // ============================================================

  function drawHUD() {
    if (state !== "playing") return;

    ctx.fillStyle = gray(90);
    ctx.font = "16px 'Courier New', monospace";
    ctx.textAlign = "left";
    ctx.fillText(`DEPTH ${score}m`, 16, 30);

    ctx.fillStyle = gray(50);
    ctx.font = "13px 'Courier New', monospace";
    ctx.fillText(ZONE_NAMES[currentZone], 16, 48);

    // Stamina bar (only when not full)
    if (octo.stamina < MAX_STAMINA) {
      const barW = 60;
      const barH = 3;
      const bx = 16;
      const by = 52;
      ctx.fillStyle = gray(20);
      ctx.fillRect(bx, by, barW, barH);
      const fill = octo.stamina / MAX_STAMINA;
      ctx.fillStyle = octo.camouflaged ? gray(60) : gray(80);
      ctx.fillRect(bx, by, barW * fill, barH);
    }

    // Pearl indicator
    if (octo.hasPearl) {
      ctx.fillStyle = rgb(PEARL_COLOR, 0.6);
      ctx.font = "13px 'Courier New', monospace";
      ctx.textAlign = "left";
      ctx.fillText("PEARL [E to throw]", 16, 68);
    }

    // Score
    ctx.fillStyle = gray(80);
    ctx.font = "15px 'Courier New', monospace";
    ctx.textAlign = "left";
    ctx.fillText("SCORE " + score, 16, octo.hasPearl ? 88 : 72);

    // Ink meter
    if (typeof octo.ink !== "undefined") {
      var inkY = octo.hasPearl ? 98 : 82;
      var inkBarW = 60;
      var inkBarH = 4;
      ctx.fillStyle = gray(20);
      ctx.fillRect(16, inkY, inkBarW, inkBarH);
      ctx.fillStyle = "rgba(80,60,120,0.8)";
      ctx.fillRect(16, inkY, inkBarW * (octo.ink / 10), inkBarH);
      ctx.fillStyle = gray(70);
      ctx.font = "12px 'Courier New', monospace";
      ctx.fillText("INK", 82, inkY + inkBarH);
    }

    // Controls hint
    {
      ctx.fillStyle = gray(90, 0.8);
      ctx.font = "14px 'Courier New', monospace";
      ctx.textAlign = "right";
      var cx = W - 16;
      var cy = H - 64;
      ctx.fillText("SPACE swim  SHIFT sprint", cx, cy);
      ctx.fillText("C camo  E clutch/throw", cx, cy + 16);
      ctx.fillText("Q ink spray  DOWN dive", cx, cy + 32);
    }
  }

  // ============================================================
  // COLLISION
  // ============================================================

  function collides(ax, ay, aw, ah, bx, by, bw, bh) {
    const shrink = 5;
    return (
      ax - aw / 2 + shrink < bx + bw / 2 - shrink &&
      ax + aw / 2 - shrink > bx - bw / 2 + shrink &&
      ay - ah / 2 + shrink < by + bh / 2 - shrink &&
      ay + ah / 2 - shrink > by - bh / 2 + shrink
    );
  }

  // ============================================================
  // INPUT
  // ============================================================

  let keys = {
    sprint: false,
    camo: false,
    interact: false,
    ink: false,
  };

  window.addEventListener("keydown", function (e) {
    if (e.code === "Space") {
      e.preventDefault();
      if (state === "start" || state === "dead" || state === "won") {
        startGame();
      } else if (state === "playing") {
        octo.crawling = false;
        octo.swimming = true;
        octo.vy = JET_FORCE;
        octo.jetTimer = 8;
        octo.squish = 0.7;
        addParticle(
          octo.x - 10,
          octo.y + 10,
          -rand(1, 3),
          -rand(0.3, 1),
          rand(1.5, 3),
          25,
          false,
        );
      }
    }
    if (e.code === "ArrowDown" && state === "playing") {
      e.preventDefault();
      octo.vy += 3;
    }
    if (e.code === "ShiftLeft" || e.code === "ShiftRight") {
      keys.sprint = true;
    }
    if (e.code === "KeyC") {
      keys.camo = true;
    }
    if (e.code === "KeyQ") {
      keys.ink = true;
    }
    if (e.code === "KeyE" && state === "playing") {
      e.preventDefault();
      if (octo.hasPearl) {
        throwPearl();
      }
      keys.interact = true;
    }
  });

  window.addEventListener("keyup", function (e) {
    if (e.code === "ShiftLeft" || e.code === "ShiftRight") {
      keys.sprint = false;
    }
    if (e.code === "KeyC") {
      keys.camo = false;
    }
    if (e.code === "KeyQ") {
      keys.ink = false;
    }
    if (e.code === "KeyE") {
      keys.interact = false;
    }
  });

  // Click/tap to start
  document.addEventListener("click", function () {
    if (state === "start" || state === "dead" || state === "won") startGame();
  });

  // Touch: tap to swim
  canvas.addEventListener(
    "touchstart",
    function (e) {
      e.preventDefault();
      if (state === "start" || state === "dead" || state === "won") {
        startGame();
      } else if (state === "playing") {
        octo.crawling = false;
        octo.swimming = true;
        octo.vy = JET_FORCE;
        octo.jetTimer = 8;
        octo.squish = 0.7;
      }
    },
    { passive: false },
  );

  // ============================================================
  // GAME CONTROL
  // ============================================================

  function startGame() {
    state = "playing";
    score = 0;
    distance = 0;
    gameSpeed = CRAWL_SPEED;
    frameCount = 0;
    deathFlash = 0;
    currentZone = 0;
    obstacles = [];
    collectibles = [];
    pearls = [];
    shells = [];
    thrownPearls = [];
    inkClouds = [];
    particles = [];
    spawnTimer = 0;
    collectTimer = 0;
    pearlSpawnTimer = 0;
    shellSpawnTimer = 0;
    keys.sprint = false;
    keys.camo = false;
    keys.interact = false;
    keys.ink = false;
    chest = null;
    chestFound = false;
    wonTimer = 0;
    hintPause = 0;
    for (var hk in hints) {
      hints[hk].shown = false;
      hints[hk].active = false;
      hints[hk].timer = 0;
    }
    resetOcto();
    initScenery();
    initAmbient();

    document.getElementById("start-screen").classList.add("hidden");
    document.getElementById("death-screen").classList.add("hidden");
  }

  var DEATH_CAUSES = {
    urchin: "Death by sea urchin.",
    bag: "Death by plastic bag.",
    net: "Caught in a fishing net.",
    hook: "Hooked.",
    propeller: "Shredded by propeller.",
    pufferfish: "Puffed to death.",
    moray: "Ambushed by moray eel.",
    unknown: "Death by ocean.",
  };

  function die(killerType) {
    if (octo.hasShell) {
      octo.hasShell = false;
      octo.shellCrackTimer = 20;
      for (let i = 0; i < 6; i++) {
        addParticle(
          octo.x + rand(-10, 10),
          octo.y + rand(-10, 5),
          rand(-2, 2),
          rand(-2, 1),
          rand(1, 3),
          20,
          false,
        );
      }
      return;
    }

    state = "dead";
    octo.alive = false;
    deathFlash = 15;

    const msg =
      DEATH_MESSAGES[Math.floor(Math.random() * DEATH_MESSAGES.length)];
    document.getElementById("death-msg").textContent = msg;
    var causeEl = document.getElementById("death-cause");
    if (causeEl) {
      causeEl.textContent = DEATH_CAUSES[killerType] || DEATH_CAUSES.unknown;
    }
    document.getElementById("final-score").textContent = score + "m";
    document.getElementById("final-zone").textContent = ZONE_NAMES[currentZone];

    setTimeout(function () {
      document.getElementById("death-screen").classList.remove("hidden");
    }, 400);
  }

  // ============================================================
  // UPDATE
  // ============================================================

  function update() {
    if (state === "won") {
      frameCount++;
      return;
    }
    if (state !== "playing") return;

    frameCount++;

    updateOcto();

    // Pause scrolling during speech bubble (octo still animates)
    var preHintSpeed = gameSpeed;
    if (hintPause > 0) gameSpeed = 0;

    distance += gameSpeed;
    score = Math.floor(distance / 10);

    // Zone progression
    for (let z = ZONE_THRESHOLDS.length - 1; z >= 0; z--) {
      if (score >= ZONE_THRESHOLDS[z]) {
        currentZone = z;
        break;
      }
    }

    // Spawn intervals (get harder over time)
    const spawnInterval = Math.max(35, 85 - distance / 250);
    spawnTimer++;
    if (spawnTimer >= spawnInterval) {
      spawnObstacle();
      spawnTimer = 0;
    }

    collectTimer++;
    if (collectTimer >= 45 + rand(0, 30)) {
      spawnCollectible();
      collectTimer = 0;
    }

    pearlSpawnTimer++;
    if (pearlSpawnTimer >= 150 + rand(0, 100)) {
      spawnPearl();
      pearlSpawnTimer = 0;
    }

    shellSpawnTimer++;
    if (shellSpawnTimer >= 300 + rand(0, 200)) {
      spawnShell();
      shellSpawnTimer = 0;
    }

    // Update obstacles
    for (const o of obstacles) o.x -= o.speed || gameSpeed;
    obstacles = obstacles.filter(function (o) {
      return o.x > -80;
    });

    // Update collectibles
    for (const c of collectibles) c.x -= gameSpeed * 0.9;
    collectibles = collectibles.filter(function (c) {
      return c.x > -30;
    });

    // Update pearls
    for (const p of pearls) p.x -= gameSpeed;
    pearls = pearls.filter(function (p) {
      return p.x > -20;
    });

    // Tutorial hint triggers
    updateHints();
    if (!hints.food.shown && collectibles.length > 0) {
      for (var fi = 0; fi < collectibles.length; fi++) {
        if (Math.abs(octo.x - collectibles[fi].x) < 60) {
          triggerHint("food");
          break;
        }
      }
    }
    if (!hints.pearl.shown && !octo.hasPearl) {
      for (var pi = 0; pi < pearls.length; pi++) {
        if (Math.abs(octo.x - pearls[pi].x) < 50) {
          triggerHint("pearl");
          break;
        }
      }
    }
    if (!hints.throw.shown && octo.hasPearl && octo.pearlThrowTimer > 20) {
      triggerHint("throw");
    }
    if (!hints.shell.shown && shells.length > 0) {
      for (var si = 0; si < shells.length; si++) {
        if (Math.abs(octo.x - shells[si].x) < 60) {
          triggerHint("shell");
          break;
        }
      }
    }
    if (!hints.ink.shown && octo.ink >= 5) {
      triggerHint("ink");
    }
    if (!hints.camo.shown && score > 50 && obstacles.length > 0) {
      for (var oi = 0; oi < obstacles.length; oi++) {
        if (obstacles[oi].x > octo.x + 30 && obstacles[oi].x < octo.x + 100) {
          triggerHint("camo");
          break;
        }
      }
    }

    // Update shells
    for (const s of shells) s.x -= gameSpeed;
    shells = shells.filter(function (s) {
      return s.x > -20;
    });

    // Update thrown pearls
    for (const tp of thrownPearls) {
      tp.x += tp.vx;
      tp.y += tp.vy;
      tp.vy += 0.1;
      tp.life--;
    }
    thrownPearls = thrownPearls.filter(function (tp) {
      return tp.life > 0 && tp.x < W + 20;
    });

    // Ink cloud spawning (Q key)
    if (keys.ink && octo.ink >= 5 && octo.alive) {
      spawnInkCloud();
      keys.ink = false;
    }

    // Update ink clouds
    for (var ic = 0; ic < inkClouds.length; ic++) {
      inkClouds[ic].x -= gameSpeed;
      inkClouds[ic].life--;
    }
    inkClouds = inkClouds.filter(function (c) {
      return c.life > 0;
    });

    // Update particles
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
    }
    particles = particles.filter(function (p) {
      return p.life > 0;
    });

    // --- Update special enemy behaviours ---

    for (var ei = 0; ei < obstacles.length; ei++) {
      var ob = obstacles[ei];

      // Hook sway: update x position with sine wave
      if (ob.type === "hook") {
        ob.swayOffset = Math.sin(frameCount * 0.03 + ob.swayPhase) * 8;
      }

      // Pufferfish: inflate/deflate based on proximity to octopus
      if (ob.type === "pufferfish") {
        var pDist = Math.hypot(ob.x - octo.x, ob.y - octo.y);
        if (pDist < 80) {
          // Inflate gradually
          ob.inflateAmount = Math.min(1, ob.inflateAmount + 0.05);
        } else {
          // Deflate gradually
          ob.inflateAmount = Math.max(0, ob.inflateAmount - 0.03);
        }
        // Update hitbox based on inflation
        ob.w = lerp(ob.baseW, 44, ob.inflateAmount);
        ob.h = lerp(ob.baseH, 44, ob.inflateAmount);
      }

      // Moray eel: state machine (hiding -> lunging -> retracting)
      if (ob.type === "moray") {
        var mDist = Math.hypot(ob.x - octo.x, ob.y - octo.y);

        if (ob.state === "hiding") {
          // Trigger lunge when octopus is close AND crawling
          if (mDist < 100 && octo.crawling) {
            ob.state = "lunging";
            ob.lungeTimer = 0;
            ob.lungeProgress = 0;
          }
          // Hiding hitbox
          ob.w = 20;
          ob.h = 15;
        } else if (ob.state === "lunging") {
          ob.lungeTimer++;
          ob.lungeProgress = Math.min(1, ob.lungeProgress + 0.06);
          // Extended hitbox when lunging
          ob.w = 25;
          ob.h = 50;
          // After full lunge, start retracting
          if (ob.lungeTimer > 40) {
            ob.state = "retracting";
          }
        } else if (ob.state === "retracting") {
          ob.lungeProgress = Math.max(0, ob.lungeProgress - 0.04);
          // Hitbox shrinks back
          ob.w = lerp(20, 25, ob.lungeProgress);
          ob.h = lerp(15, 50, ob.lungeProgress);
          // Fully retracted
          if (ob.lungeProgress <= 0) {
            ob.state = "hiding";
            ob.lungeTimer = 0;
          }
        }
      }
    }

    // --- Collision checks ---

    // Obstacles vs octopus
    if (!octo.camouflaged) {
      for (const o of obstacles) {
        // Pufferfish only hurts when inflated (spines out)
        if (o.type === "pufferfish" && o.inflateAmount < 0.5) continue;
        // Moray only hurts when lunging
        if (o.type === "moray" && o.state === "hiding") continue;

        if (collides(octo.x, octo.y - 6, 28, 22, o.x, o.y, o.w, o.h)) {
          die(o.type);
          return;
        }
      }
    }

    // Ink clouds vs obstacles
    for (var ci = 0; ci < inkClouds.length; ci++) {
      var cloud = inkClouds[ci];
      var cloudT = 1 - cloud.life / cloud.maxLife;
      var cloudR = 30 + (50 - 30) * cloudT;
      for (var oi2 = obstacles.length - 1; oi2 >= 0; oi2--) {
        var ob = obstacles[oi2];
        if (Math.hypot(cloud.x - ob.x, cloud.y - ob.y) < cloudR + ob.w * 0.5) {
          addCollectEffect(ob.x, ob.y);
          obstacles.splice(oi2, 1);
          score += 10;
        }
      }
    }

    // Thrown pearls vs obstacles
    for (let ti = thrownPearls.length - 1; ti >= 0; ti--) {
      const tp = thrownPearls[ti];
      for (let oi = obstacles.length - 1; oi >= 0; oi--) {
        const o = obstacles[oi];
        if (collides(tp.x, tp.y, 8, 8, o.x, o.y, o.w, o.h)) {
          // Destroy both
          addCollectEffect(o.x, o.y);
          obstacles.splice(oi, 1);
          thrownPearls.splice(ti, 1);
          score += 10;
          break;
        }
      }
    }

    // Collectible pickup
    if (!octo.camouflaged) {
      for (let i = collectibles.length - 1; i >= 0; i--) {
        const c = collectibles[i];
        const d = Math.hypot(octo.x - c.x, octo.y - 6 - c.y);
        if (d < 22) {
          score += c.points;
          // Ink gain by creature type
          var inkGain = 0;
          if (c.type === "plankton") inkGain = 1;
          else if (c.type === "shrimp") inkGain = 2;
          else if (c.type === "crab") inkGain = 3;
          else if (c.type === "jelly") inkGain = 4;
          octo.ink = Math.min(10, octo.ink + inkGain);
          addCollectEffect(c.x, c.y);
          collectibles.splice(i, 1);
        }
      }
    }

    // Pearl pickup (requires E press)
    if (!octo.hasPearl && octo.crawling && !octo.camouflaged && keys.interact) {
      for (let i = pearls.length - 1; i >= 0; i--) {
        const p = pearls[i];
        if (Math.abs(octo.x - p.x) < 25 && Math.abs(octo.y - p.y) < 30) {
          octo.hasPearl = true;
          addCollectEffect(p.x, p.y);
          pearls.splice(i, 1);
          break;
        }
      }
    }

    // Shell pickup
    if (!octo.hasShell && octo.crawling && !octo.camouflaged) {
      for (let i = shells.length - 1; i >= 0; i--) {
        const s = shells[i];
        if (Math.abs(octo.x - s.x) < 20 && Math.abs(octo.y - s.y) < 25) {
          octo.hasShell = true;
          shells.splice(i, 1);
          break;
        }
      }
    }

    // Chest spawning
    if (score >= 5000 && chest === null && !chestFound) {
      chest = {
        x: W + 100,
        y: floorY - 12,
        opened: false,
        openTimer: 0,
        found: false,
      };
    }

    // Chest movement and collision
    if (chest && !chest.opened) {
      chest.x -= gameSpeed;

      // Scrolled off screen left - despawn but allow respawn
      if (chest.x < -50) {
        chest = null;
      } else {
        // Collision check (~30px distance)
        var chestDist = Math.hypot(octo.x - chest.x, octo.y - 6 - chest.y);
        if (chestDist < 30) {
          chest.opened = true;
          chest.found = true;
          chestFound = true;
        }
      }
    }

    // Chest opening animation
    if (chest && chest.opened) {
      chest.openTimer++;
      if (chest.openTimer >= 60) {
        state = "won";
        wonTimer = 0;
      }
    }

    // Restore gameSpeed after pause so next frame recalculates normally
    if (hintPause > 0) gameSpeed = preHintSpeed;
  }

  // ============================================================
  // CHEST & RUBBER DUCK
  // ============================================================

  function drawChest() {
    if (!chest) return;

    ctx.save();
    ctx.translate(chest.x, chest.y);

    // Pulsing golden glow
    var glowPulse = Math.sin(frameCount * 0.04) * 0.04 + 0.12;
    var glowGrad = ctx.createRadialGradient(0, -6, 4, 0, -6, 40);
    glowGrad.addColorStop(0, "rgba(255,220,140," + glowPulse + ")");
    glowGrad.addColorStop(1, "rgba(255,220,140,0)");
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(0, -6, 40, 0, Math.PI * 2);
    ctx.fill();

    if (!chest.opened) {
      // Closed chest
      // Body
      ctx.fillStyle = gray(45);
      ctx.fillRect(-12, -8, 24, 14);
      // Bottom shadow
      ctx.fillStyle = gray(30);
      ctx.fillRect(-12, 2, 24, 4);
      // Lid
      ctx.fillStyle = gray(65);
      ctx.fillRect(-13, -12, 26, 6);
      // Metal bands
      ctx.strokeStyle = gray(80);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-12, -4);
      ctx.lineTo(12, -4);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-12, 0);
      ctx.lineTo(12, 0);
      ctx.stroke();
      // Keyhole
      ctx.fillStyle = gray(20);
      ctx.beginPath();
      ctx.arc(0, -2, 1.5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Opening chest
      var openProgress = Math.min(chest.openTimer / 30, 1);

      // Body (stays)
      ctx.fillStyle = gray(45);
      ctx.fillRect(-12, -8, 24, 14);
      ctx.fillStyle = gray(30);
      ctx.fillRect(-12, 2, 24, 4);
      // Metal bands
      ctx.strokeStyle = gray(80);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-12, -4);
      ctx.lineTo(12, -4);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-12, 0);
      ctx.lineTo(12, 0);
      ctx.stroke();

      // Lid rotates open
      ctx.save();
      ctx.translate(-13, -8);
      ctx.rotate(-openProgress * Math.PI * 0.45);
      ctx.fillStyle = gray(65);
      ctx.fillRect(0, -4, 26, 6);
      ctx.restore();

      // Duck rises out after frame 30
      if (chest.openTimer >= 30) {
        drawRubberDuck(openProgress);
      }
    }

    ctx.restore();
  }

  function drawRubberDuck(openProgress) {
    var duckProgress = Math.min((chest.openTimer - 30) / 30, 1);
    var duckY = -8 - duckProgress * 20;
    var bob = Math.sin(frameCount * 0.06) * 2 * duckProgress;

    // Bright golden glow
    var duckGlowGrad = ctx.createRadialGradient(
      0,
      duckY + bob,
      3,
      0,
      duckY + bob,
      30,
    );
    duckGlowGrad.addColorStop(
      0,
      "rgba(255,210,50," + 0.25 * duckProgress + ")",
    );
    duckGlowGrad.addColorStop(1, "rgba(255,210,50,0)");
    ctx.fillStyle = duckGlowGrad;
    ctx.beginPath();
    ctx.arc(0, duckY + bob, 30, 0, Math.PI * 2);
    ctx.fill();

    // Duck body
    ctx.fillStyle = "rgba(255,210,50," + 0.9 * duckProgress + ")";
    ctx.beginPath();
    ctx.ellipse(0, duckY + bob + 2, 8, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Duck head
    ctx.beginPath();
    ctx.arc(5, duckY + bob - 4, 5, 0, Math.PI * 2);
    ctx.fill();

    // Beak (pointing right)
    ctx.fillStyle = "rgba(255,160,30," + 0.9 * duckProgress + ")";
    ctx.beginPath();
    ctx.moveTo(9, duckY + bob - 4);
    ctx.lineTo(14, duckY + bob - 3);
    ctx.lineTo(9, duckY + bob - 2);
    ctx.closePath();
    ctx.fill();

    // Eye
    ctx.fillStyle = "rgba(30,30,30," + 0.9 * duckProgress + ")";
    ctx.beginPath();
    ctx.arc(7, duckY + bob - 5, 1, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawWonOverlay() {
    if (state !== "won") return;

    var fadeProgress = Math.min(wonTimer / 30, 1);

    // Semi-transparent overlay
    ctx.fillStyle = "rgba(0,0,0," + 0.4 * fadeProgress + ")";
    ctx.fillRect(0, 0, W, H);

    // "Worth it."
    ctx.textAlign = "center";
    ctx.font = "24px 'Courier New', monospace";
    ctx.fillStyle = gray(200, fadeProgress);
    ctx.fillText("Worth it.", W / 2, H / 2 - 20);

    // "You found the rubber duck at 1500m."
    ctx.font = "14px 'Courier New', monospace";
    ctx.fillStyle = gray(100, fadeProgress);
    ctx.fillText("You found the rubber duck at 5000m.", W / 2, H / 2 + 10);

    // Blinking restart hint
    if (fadeProgress >= 1) {
      var blink = Math.sin(frameCount * 0.06) > 0 ? 1 : 0;
      ctx.font = "12px 'Courier New', monospace";
      ctx.fillStyle = gray(80, blink * 0.7);
      ctx.fillText("click or press space to restart", W / 2, H / 2 + 40);
    }
  }

  // ============================================================
  // RENDER
  // ============================================================

  function render() {
    // Background gradient (darkens with zone)
    const bgTop = Math.max(12 - currentZone * 3, 2);
    const bgBot = Math.max(5 - currentZone * 2, 1);
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, gray(bgTop));
    grad.addColorStop(1, gray(bgBot));
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    drawLightRays();
    drawAmbient();
    drawScenery();
    drawFloor();

    // Chest (drawn on floor, before octopus)
    drawChest();

    // Pearls on floor
    for (const p of pearls) drawPearl(p);

    // Shells on floor
    for (const s of shells) drawShellPickup(s);

    // Collectibles
    for (const c of collectibles) drawCollectible(c);

    // Obstacles
    for (const o of obstacles) drawObstacle(o);

    // Thrown pearls
    for (const tp of thrownPearls) drawThrownPearl(tp);

    // Particles
    drawParticles();

    // Ink clouds
    drawInkClouds();

    // Octopus
    if (octo.alive) drawOcto();

    // Death flash
    if (deathFlash > 0) {
      ctx.fillStyle = rgb(DANGER, (deathFlash / 15) * 0.3);
      ctx.fillRect(0, 0, W, H);
      deathFlash--;
    }

    drawHUD();
    if (state === "playing") drawHints();

    // Won overlay (fade in after duck reveal)
    if (state === "won") {
      wonTimer++;
      drawWonOverlay();
    }
  }

  // ============================================================
  // GAME LOOP
  // ============================================================

  function loop() {
    update();
    render();
    requestAnimationFrame(loop);
  }

  // ============================================================
  // INIT
  // ============================================================

  resize();
  resetOcto();
  initAmbient();
  loop();
})();
