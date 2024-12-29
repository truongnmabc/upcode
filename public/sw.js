self.importScripts("https://cdn.jsdelivr.net/npm/idb@8/build/umd.js");

let db;

async function initializeDB(appShortName) {
    if (!appShortName) {
        console.error("App short name is required to initialize DB.");
        return;
    }
    db = await idb.openDB(appShortName, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains("topics")) {
                db.createObjectStore("topics", { keyPath: "id" });
            }
            if (!db.objectStoreNames.contains("questions")) {
                db.createObjectStore("questions", { keyPath: "id" });
            }
            if (!db.objectStoreNames.contains("tests")) {
                db.createObjectStore("tests", { keyPath: "id" });
            }
            if (!db.objectStoreNames.contains("subTopicProgress")) {
                db.createObjectStore("subTopicProgress", { keyPath: "id" });
            }
        },
    });
    console.log(`IndexedDB "${appShortName}" initialized.`);
}

async function handleInitData(appShortName, apiPath) {
    if (!db) await initializeDB(appShortName);

    try {
        const response = await fetch(
            `${apiPath.GET_DATA_STUDY}/${appShortName}`
        );
        const data = await response.json();
        const { topic, tests } = data.data;

        const topicTx = db.transaction("topics", "readwrite");
        const testTx = db.transaction("tests", "readwrite");

        for (const t of topic) {
            await topicTx.store.put(t);
        }
        for (const test of tests.practiceTests) {
            await testTx.store.put(test);
        }
        await topicTx.done;
        await testTx.done;

        console.log("Data initialized into IndexedDB.");
    } catch (error) {
        console.error("Failed to fetch and initialize data:", error);
    }
}

self.addEventListener("install", (event) => {
    console.log("Service Worker installed.");
});

self.addEventListener("message", async (event) => {
    if (event.data.type === "INIT_DB") {
        const { appShortName, apiPath } = event.data.payload;

        await initializeDB(appShortName);
        await handleInitData(appShortName, apiPath);

        event.ports[0].postMessage({
            status: "success",
            message: "DB initialized and data fetched.",
        });
    }
});

self.addEventListener("activate", (event) => {
    console.log("Service Worker activated.");
});
