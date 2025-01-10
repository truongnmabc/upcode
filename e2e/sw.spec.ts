import { test, expect } from "@playwright/test";

test.describe("Service Worker Initialization", () => {
    test("should register and activate the Service Worker", async ({
        page,
        context,
    }) => {
        await page.goto("http://localhost:3000/");

        await expect(page).toHaveTitle(
            "Free ASVAB Practice Test 2025 | 1000+ ASVAB Questions"
        );

        const registrations = await context.serviceWorkers();
        if (!registrations) {
            console.log("🚀 ~ test.describe ~ registrations:", registrations);
        }
        const sw = registrations.find((worker) =>
            worker.url().includes("/sw.js")
        );
        if (!sw) {
            console.log("🚀 ~ test.describe ~ sw:", sw);
        }

        expect(sw).toBeDefined();

        const isActivated = await page.evaluate(() => {
            return new Promise((resolve) => {
                if (!navigator.serviceWorker) {
                    resolve("false");
                }

                navigator.serviceWorker
                    .getRegistration("/sw.js")
                    .then((reg) => {
                        if (reg && reg.active) {
                            resolve(true);
                        } else {
                            resolve(false);
                        }
                    });
            });
        });

        expect(isActivated).toBe(true);
    });
});
