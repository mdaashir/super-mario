import { chromium, type Browser, type Page } from "playwright";

const GAME_URL = process.env.GAME_URL || "http://localhost:5173";
const SCREENSHOT_DIR = "./e2e/screenshots";

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function takeScreenshot(page: Page, name: string) {
  await page.screenshot({ path: `${SCREENSHOT_DIR}/${name}.png`, fullPage: true });
  console.log(`  Screenshot: ${name}.png`);
}

async function run() {
  const fs = await import("fs");
  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }

  console.log("\n=== E2E Test: Super Mario Platformer ===\n");
  console.log(`Target: ${GAME_URL}\n`);

  const browser: Browser = await chromium.launch({
    args: ["--no-sandbox", "--disable-gpu"],
  });
  const context = await browser.newContext({
    viewport: { width: 800, height: 600 },
  });
  const page: Page = await context.newPage();

  const errors: string[] = [];
  page.on("pageerror", (err) => {
    errors.push(`  JS Error: ${err.message}`);
  });
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      errors.push(`  Console Error: ${msg.text()}`);
    }
  });

  let allPassed = true;

  async function test(name: string, fn: () => Promise<void>) {
    try {
      await fn();
      console.log(`  ✓ ${name}`);
    } catch (err) {
      console.log(`  ✗ ${name}: ${err}`);
      allPassed = false;
    }
  }

  // 1. Page loads
  await test("Game page loads", async () => {
    await page.goto(GAME_URL, { waitUntil: "networkidle", timeout: 15000 });
    const title = await page.title();
    if (!title.includes("Super Mario")) {
      throw new Error(`Expected title "Super Mario", got "${title}"`);
    }
  });

  // 2. Canvas exists
  await test("Canvas element is present", async () => {
    const canvas = await page.$("canvas");
    if (!canvas) throw new Error("No canvas element found");
    const box = await canvas.boundingBox();
    if (!box || box.width === 0 || box.height === 0) {
      throw new Error("Canvas has zero dimensions");
    }
    console.log(`  Canvas: ${box.width}x${box.height}`);
  });

  // 3. Wait for Phaser boot + menu
  await test("Game boots to MenuScene", async () => {
    await sleep(3000);
    await takeScreenshot(page, "01-menu-scene");
    const hasGameContainer = await page.$("#game-container canvas");
    if (!hasGameContainer) throw new Error("Game canvas not rendered after boot");
  });

  // 4. Check no JS errors so far
  await test("No JavaScript errors during boot", async () => {
    if (errors.length > 0) {
      const errs = errors.join("\n");
      errors.length = 0;
      throw new Error(`Errors found:\n${errs}`);
    }
  });

  // 5. Press ENTER to go to WorldMapScene
  await test("Press ENTER navigates to WorldMapScene", async () => {
    await page.keyboard.press("Enter");
    await sleep(1500);
    await takeScreenshot(page, "02-world-map");
  });

  // 6. Press ENTER to select level 1-1 → GameScene
  await test("Press ENTER selects level 1-1 → GameScene", async () => {
    await page.keyboard.press("Enter");
    await sleep(2000);
    await takeScreenshot(page, "03-game-scene");
  });

  // 7. Test player movement (arrow keys)
  await test("Player moves with arrow keys", async () => {
    await page.keyboard.down("ArrowRight");
    await sleep(500);
    await page.keyboard.up("ArrowRight");
    await sleep(500);
    await takeScreenshot(page, "04-after-move");
  });

  // 8. Test jump
  await test("Player jumps with ArrowUp", async () => {
    await page.keyboard.press("ArrowUp");
    await sleep(300);
    await takeScreenshot(page, "05-after-jump");
  });

  // 9. Test running with Shift
  await test("Player runs with Shift + ArrowRight", async () => {
    await page.keyboard.down("Shift");
    await page.keyboard.down("ArrowRight");
    await sleep(800);
    await page.keyboard.up("ArrowRight");
    await page.keyboard.up("Shift");
    await sleep(500);
    await takeScreenshot(page, "06-after-run");
  });

  // 10. Test pause with ESC
  await test("ESC key pauses the game", async () => {
    await page.keyboard.press("Escape");
    await sleep(1000);
    await takeScreenshot(page, "07-pause-scene");
  });

  // 11. Resume with ESC
  await test("ESC resumes the game", async () => {
    await page.keyboard.press("Escape");
    await sleep(1000);
    await takeScreenshot(page, "08-after-resume");
  });

  // 12. Final error check
  await test("No JavaScript errors during gameplay", async () => {
    if (errors.length > 0) {
      const errs = errors.join("\n");
      errors.length = 0;
      throw new Error(`Errors found:\n${errs}`);
    }
  });

  await browser.close();

  console.log(`\n=== Results: ${allPassed ? "ALL PASSED" : "SOME FAILED"} ===\n`);
  process.exit(allPassed ? 0 : 1);
}

run().catch((err) => {
  console.error("E2E test suite error:", err);
  process.exit(1);
});
