// This file should FAIL the no-import-meta-url rule
const currentUrl = import.meta.url;
const workerUrl = new URL("./worker.js", import.meta.url);
