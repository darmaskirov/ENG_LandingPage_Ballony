import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { dateRange } from "../src/booking.js";
test("complete demo flow, errors, editing, privacy and accessible dialogs", async ({
  page,
}) => {
  const errors = [];
  const outgoing = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("request", (r) => {
    if (r.method() === "POST") outgoing.push(r.url());
  });
  await page.goto("/");
  await page
    .getByRole("button", { name: "View The Valley Explorer details" })
    .click();
  await expect(page.getByRole("dialog")).toContainText("€240");
  let axe = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(axe.violations).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "View The Valley Explorer details" }),
  ).toBeFocused();
  await page
    .getByRole("button", { name: "View The Valley Explorer details" })
    .click();
  await page.getByRole("button", { name: "Choose this demo flight" }).click();
  await expect(page.locator("#tour")).toHaveValue("valleys");
  await expect(page.locator("#total")).toHaveText("€480");
  await page.getByRole("button", { name: "Review demo request" }).click();
  await expect(page.locator("#date")).toBeFocused();
  await expect(page.locator("#name-error")).toBeVisible();
  await page.locator("#date").fill(dateRange().min);
  await page.locator("#participants").selectOption("3");
  await expect(page.locator("#total")).toHaveText("€720");
  await page.locator("#name").fill("<img src=x onerror=alert(1)>");
  await page.locator("#email").fill("explorer@example.com");
  await page.locator("#consent").check();
  await page.getByRole("button", { name: "Review demo request" }).click();
  await expect(page.locator("#review-summary")).toContainText("€720");
  await expect(page.locator("#review-summary img")).toHaveCount(0);
  axe = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(axe.violations).toEqual([]);
  await page.getByRole("button", { name: "Edit details" }).click();
  await page.locator("#name").fill("Alex Explorer");
  await page.getByRole("button", { name: "Review demo request" }).click();
  await page.getByRole("button", { name: "Finish demo request" }).click();
  await expect(page.locator("#review-message")).toContainText(
    "No reservation was made",
  );
  await expect(page.locator("#name")).toHaveValue("");
  await expect(page.locator("#email")).toHaveValue("");
  await expect(page.locator("#review-summary")).toBeEmpty();
  expect(outgoing).toEqual([]);
  expect(
    await page.evaluate(() => ({
      local: localStorage.length,
      session: sessionStorage.length,
    })),
  ).toEqual({ local: 0, session: 0 });
  await page.getByRole("button", { name: "Explore again" }).click();
  expect(errors).toEqual([]);
});
test("responsive layout, photos, landmarks, navigation and screenshots", async ({
  page,
}) => {
  for (const width of [320, 375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.evaluate(async () => {
      for (const img of document.images) {
        img.loading = "eager";
      }
      await Promise.all([...document.images].map((img) => img.decode()));
    });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    expect(await page.locator("h1").count()).toBe(1);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
    if (width < 761) {
      await page.getByRole("button", { name: "Menu" }).click();
      await expect(page.locator("#navigation")).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(page.locator(".menu-toggle")).toBeFocused();
      await page.getByRole("button", { name: "Menu" }).click();
      await page.locator('#navigation a[href="#experiences"]').click();
      await expect(page.locator(".menu-toggle")).toHaveAttribute(
        "aria-expanded",
        "false",
      );
      await expect(page).toHaveURL(/#experiences/);
    }
    if ([375, 1440].includes(width)) {
      await page.goto("/");
      await page.screenshot({
        path: `qa/screenshots/balloon-${width}.png`,
        fullPage: true,
      });
    }
  }
  await page.goto("/credits.html");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Behind the concept.",
  );
  await expect(
    page.locator('a[href="https://www.pexels.com/license/"]'),
  ).toBeVisible();
});
test("keyboard, reduced motion and no JavaScript fallback", async ({
  page,
  browser,
}) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main/);
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe("auto");
  const context = await browser.newContext({ javaScriptEnabled: false });
  const basic = await context.newPage();
  await basic.goto("http://127.0.0.1:4173/");
  await expect(basic.locator("#js-fallback")).toContainText(
    "requires JavaScript",
  );
  await expect(basic.locator("#js-fallback")).toBeVisible();
  await expect(basic.locator("[type=submit]")).toBeDisabled();
  await context.close();
});
