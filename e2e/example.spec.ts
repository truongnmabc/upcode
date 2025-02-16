import { test, expect } from "@playwright/test";

test("get metadata page", async ({ page }) => {
    await page.goto("http://localhost:3000/");

    await expect(page).toHaveTitle(
        "Free ASVAB Practice Test 2025 | 1000+ ASVAB Questions"
    );
});

// test("get started link", async ({ page }) => {
// await page.goto("http://localhost:3000/");
// await page.getByTestId("logoHeader").click();
// await expect(
//     page.getByRole("heading", {
//         name: "ASVAB Practice Test",
//     })
// ).toBeVisible();
// });
