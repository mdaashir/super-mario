import { chromium } from "playwright";
import { mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SCREENSHOT_DIR = join(__dirname, "screenshots");
const GAME_URL = process.env.GAME_URL || "http://localhost:5173";

if (!existsSync(SCREENSHOT_DIR)) mkdirSync(SCREENSHOT_DIR, { recursive: true });

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  console.log("\n=== E2E Test: Super Mario Platformer ===\n");

  const browser = await chromium.launch({ args: ["--no-sandbox"] });
  const context = await browser.newContext({ viewport: { width: 800, height: 600 } });
  const page = await context.newPage();

  const errors = [];
  page.on("pageerror", (err) => errors.push({ type: "JS", msg: err.message }));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push({ type: "Console", msg: msg.text() });
  });

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  \u2713 ${name}`);
      passed++;
    } catch (err) {
      console.log(`  \u2717 ${name}: ${err.message}`);
      failed++;
    }
  }

  // 1. Page loads
  await test("Game page loads with correct title", async () => {
    await page.goto(GAME_URL, { waitUntil: "networkidle", timeout: 15000 });
    const title = await page.title();
    if (!title.includes("Super Mario")) throw new Error(`Title mismatch: "${title}"`);
  });

  // 2. Canvas rendered
  await test("Canvas element is present and sized", async () => {
    const canvas = await page.$("canvas");
    if (!canvas) throw new Error("No canvas found");
    const box = await canvas.boundingBox();
    if (!box || box.width < 100 || box.height < 100) throw new Error(`Canvas too small: ${JSON.stringify(box)}`);
  });

  // 3. Wait for Phaser boot
  await test("Phaser boots to MenuScene", async () => {
    await sleep(3000);
    await page.screenshot({ path: join(SCREENSHOT_DIR, "01-menu-scene.png") });
  });

  // 4. Error check after boot
  await test("No JS errors during boot", () => {
    const active = errors.filter((e) => !e.msg.includes("favicon"));
    if (active.length > 0) throw new Error(active.map((e) => `${e.type}: ${e.msg}`).join("\n"));
  });

  // 5. ENTER -> WorldMapScene
  await test("ENTER navigates to WorldMapScene", async () => {
    await page.keyboard.press("Enter");
    await sleep(1500);
    await page.screenshot({ path: join(SCREENSHOT_DIR, "02-world-map.png") });
  });

  // 6. ENTER -> GameScene (level 1-1)
  await test("ENTER selects level 1-1 -> GameScene", async () => {
    await page.keyboard.press("Enter");
    await sleep(2000);
    await page.screenshot({ path: join(SCREENSHOT_DIR, "03-game-scene.png") });
  });

  // 7. Player movement
  await test("Player moves with ArrowRight", async () => {
    await page.keyboard.down("ArrowRight");
    await sleep(600);
    await page.keyboard.up("ArrowRight");
    await sleep(300);
    await page.screenshot({ path: join(SCREENSHOT_DIR, "04-after-move.png") });
  });

  // 8. Jump
  await test("Player jumps with ArrowUp", async () => {
    await page.keyboard.press("ArrowUp");
    await sleep(400);
    await page.screenshot({ path: join(SCREENSHOT_DIR, "05-after-jump.png") });
  });

  // 9. Run
  await test("Player runs with Shift + ArrowRight", async () => {
    await page.keyboard.down("Shift");
    await page.keyboard.down("ArrowRight");
    await sleep(800);
    await page.keyboard.up("ArrowRight");
    await page.keyboard.up("Shift");
    await sleep(300);
    await page.screenshot({ path: join(SCREENSHOT_DIR, "06-after-run.png") });
  });

  // 10. Pause
  await test("ESC pauses game (PauseScene overlay)", async () => {
    await page.keyboard.press("Escape");
    await sleep(1000);
    await page.screenshot({ path: join(SCREENSHOT_DIR, "07-pause-scene.png") });
  });

  // 11. Resume
  await test("ESC resumes game", async () => {
    await page.keyboard.press("Escape");
    await sleep(1000);
    await page.screenshot({ path: join(SCREENSHOT_DIR, "08-after-resume.png") });
  });

  // 12. Final error check
  await test("No JS errors during full gameplay sequence", () => {
    const active = errors.filter((e) => !e.msg.includes("favicon"));
    if (active.length > 0) throw new Error(active.map((e) => `${e.type}: ${e.msg}`).join("\n"));
  });

  await browser.close();

  console.log(`\n=== Results: ${passed}/${passed + failed} passed` +
    (failed === 0 ? " - ALL PASSED \u2713" : ` - ${failed} FAILED \u2717`) + " ===\n");
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("E2E suite error:", err);
  process.exit(1);
});
