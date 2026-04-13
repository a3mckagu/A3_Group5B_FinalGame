// END / FINISH SCREEN (duplicate of instructions.js)
// This file defines:
// 1) drawEnd()        → what the finish screen looks
// 2) endMousePressed() → input handling for finish
// 3) endKeyPressed()   → keyboard shortcuts for finish

const END_BASE_W = 1152;
const END_BASE_H = 648;

let _endBackBtn = { x: 0, y: 0, w: 0, h: 0 };

function drawEnd() {
  if (typeof startBg !== "undefined") {
    const sf = min(width / END_BASE_W, height / END_BASE_H);
    const ox = (width - END_BASE_W * sf) / 2;
    const oy = (height - END_BASE_H * sf) / 2;
    push();
    translate(ox, oy);
    scale(sf);
    image(startBg, 0, 0, END_BASE_W, END_BASE_H);
    pop();
  } else {
    background(0);
  }

  const scaleFactor = min(width / END_BASE_W, height / END_BASE_H);
  const offsetX = (width - END_BASE_W * scaleFactor) / 2;
  const offsetY = (height - END_BASE_H * scaleFactor) / 2;

  push();
  translate(offsetX, offsetY);
  scale(scaleFactor);

  _drawEndScroll();

  pop();

  const { x, y, w, h } = _endBackBtn;
  const bx = offsetX + x * scaleFactor;
  const by = offsetY + y * scaleFactor;
  const bw = w * scaleFactor;
  const bh = h * scaleFactor;
  const over =
    mouseX > bx - bw / 2 &&
    mouseX < bx + bw / 2 &&
    mouseY > by - bh / 2 &&
    mouseY < by + bh / 2;
  cursor(over ? HAND : ARROW);
}

function _drawEndScroll() {
  const cx = END_BASE_W / 2;
  const cy = END_BASE_H / 2;

  const SW = 660;
  const SH = 260; // further reduced height for a shorter scroll on the end screen
  const ROD_H = 18;
  const sx = cx - SW / 2;
  const topRodY = cy - SH / 2;
  const botRodY = cy + SH / 2;
  const bodyTop = topRodY;
  const bodyH = SH;

  const rodCol = color(42, 24, 8);
  const trimCol = color(200, 160, 48);
  const parchCol = color(242, 228, 196);
  const inkDark = color(45, 18, 5);
  const inkMid = color(96, 56, 19);
  const inkFaint = color(96, 56, 19, 80);

  push();
  noStroke();
  fill(parchCol);
  rectMode(CORNER);
  rect(sx, bodyTop, SW, bodyH);
  const vg = drawingContext;
  const grad = vg.createLinearGradient(sx, 0, sx + SW, 0);
  grad.addColorStop(0, "rgba(100,60,10,0.13)");
  grad.addColorStop(0.08, "rgba(100,60,10,0)");
  grad.addColorStop(0.92, "rgba(100,60,10,0)");
  grad.addColorStop(1, "rgba(100,60,10,0.13)");
  vg.fillStyle = grad;
  vg.fillRect(sx, bodyTop, SW, bodyH);
  pop();

  push();
  noStroke();
  fill(trimCol);
  rectMode(CORNER);
  rect(sx, bodyTop - 4, SW, 14);
  rect(sx, bodyTop + bodyH - 10, SW, 14);
  pop();

  function drawRod(ry) {
    push();
    noStroke();
    fill(rodCol);
    rectMode(CENTER);
    rect(cx, ry, SW + 40, ROD_H, ROD_H / 2);
    fill(80, 50, 20, 100);
    rect(cx, ry - 3, SW + 40, ROD_H / 2, ROD_H / 4);
    fill(rodCol);
    circle(sx - 20, ry, 28);
    fill(60, 38, 14, 160);
    circle(sx - 24, ry - 5, 10);
    fill(rodCol);
    circle(sx + SW + 20, ry, 28);
    fill(60, 38, 14, 160);
    circle(sx + SW + 16, ry - 5, 10);
    pop();
  }

  function drawLoops(ry) {
    push();
    noStroke();
    rectMode(CENTER);
    const loopPositions = [0.18, 0.32, 0.5, 0.68, 0.82];
    loopPositions.forEach((t) => {
      const lx = sx + SW * t;
      fill(red(trimCol) * 0.75, green(trimCol) * 0.75, blue(trimCol) * 0.75);
      rect(lx, ry, 18, 22, 4);
      fill(red(trimCol) * 0.5, green(trimCol) * 0.5, blue(trimCol) * 0.5);
      rect(lx, ry + 8, 18, 8, 2);
    });
    pop();
  }

  drawRod(topRodY);
  drawRod(botRodY);
  drawLoops(topRodY);
  drawLoops(botRodY);

  const PAD_X = 64;
  const contentL = sx + PAD_X;
  const contentR = sx + SW - PAD_X;
  const contentW = contentR - contentL;
  const contentCX = cx;

  let y = bodyTop + 32;

  push();
  noStroke();
  textFont(FONT_MANUFACTURING_CONSENT);
  textSize(30);
  textAlign(CENTER, TOP);
  fill(inkDark);
  text("The End", contentCX, y);
  pop();

  y += 40;
  _instrRule(cx, y, 260, trimCol, true);
  y += 20;

  // Nudge intro paragraph down slightly so it sits lower in the scroll
  y += 24;

  push();
  noStroke();
  textFont(FONT_IM_FELL_ENGLISH);
  textStyle(NORMAL);
  textSize(14);
  // Center the intro paragraph on the screen (wrapped to contentW)
  textAlign(CENTER, TOP);
  fill(red(inkDark), green(inkDark), blue(inkDark), 210);
  const intro =
    "From a hopeful lord to the highest courts, you\u2019ve mastered the art of potion brewing.\nYour journey at the shop is complete\u2026 for now.";
  text(intro, contentCX, y, contentW);
  pop();

  y += 72;

  const entries = [];

  const LABEL_COL_W = 160;
  const GAP = 20;
  const LABEL_END = contentL + LABEL_COL_W;
  const RULE_X = LABEL_END + GAP;
  const BODY_START = RULE_X + 2;
  const BODY_W = contentR - BODY_START - 4;
  const entryLineH = 48;

  push();
  noStroke();
  drawingContext.textBaseline = "middle";
  entries.forEach((e) => {
    const midY = y + entryLineH / 2;
    textFont(FONT_MANUFACTURING_CONSENT);
    textSize(13);
    textAlign(RIGHT, CENTER);
    fill(inkDark);
    text(e.label, LABEL_END, midY);
    stroke(red(inkMid), green(inkMid), blue(inkMid), 55);
    strokeWeight(1);
    line(RULE_X, y + 8, RULE_X, y + entryLineH - 8);
    noStroke();
    textFont(FONT_IM_FELL_ENGLISH);
    textSize(13.5);
    textAlign(LEFT, CENTER);
    fill(red(inkDark), green(inkDark), blue(inkDark), 215);
    text(e.body, BODY_START, midY, BODY_W);
    y += entryLineH + 4;
  });
  drawingContext.textBaseline = "alphabetic";
  pop();

  y += 64;

  // (removed warning text for the end screen)

  const btnW = 180;
  const btnH = 34;
  const btnX = cx;
  const btnY = botRodY - 50;

  _endBackBtn = { x: btnX, y: btnY, w: btnW, h: btnH };

  const sf = min(width / END_BASE_W, height / END_BASE_H);
  const ox = (width - END_BASE_W * sf) / 2;
  const oy = (height - END_BASE_H * sf) / 2;
  const mx = (mouseX - ox) / sf;
  const my_ = (mouseY - oy) / sf;
  const btnHover =
    mx > btnX - btnW / 2 &&
    mx < btnX + btnW / 2 &&
    my_ > btnY - btnH / 2 &&
    my_ < btnY + btnH / 2;

  push();
  rectMode(CENTER);
  noFill();
  stroke(
    btnHover
      ? color("#83c5be")
      : color(red(trimCol), green(trimCol), blue(trimCol), 140),
  );
  strokeWeight(1);
  rect(btnX, btnY, btnW, btnH, 2);
  noStroke();
  fill(btnHover ? color("#83c5be") : trimCol);
  textFont(FONT_MANUFACTURING_CONSENT);
  textSize(14);
  textAlign(CENTER, CENTER);
  drawingContext.textBaseline = "middle";
  text("Back to Map", btnX, btnY);
  drawingContext.textBaseline = "alphabetic";
  pop();
}

function endMousePressed() {
  const sf = min(width / END_BASE_W, height / END_BASE_H);
  const ox = (width - END_BASE_W * sf) / 2;
  const oy = (height - END_BASE_H * sf) / 2;
  const mx = (mouseX - ox) / sf;
  const my = (mouseY - oy) / sf;

  const { x, y, w, h } = _endBackBtn;
  if (mx > x - w / 2 && mx < x + w / 2 && my > y - h / 2 && my < y + h / 2) {
    // Unlock all levels (show map with Level 3 icons) and go to map
    currentLevelNumber = 3;
    currentScreen = "map";
    try {
      if (typeof restoreBgMusicVolume === "function") restoreBgMusicVolume();
    } catch (e) {}
  }
}

function endKeyPressed() {
  if (keyCode === ESCAPE) {
    currentScreen = "start";
  }
}
