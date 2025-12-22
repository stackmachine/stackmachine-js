import { StackMachine } from "../../dist/index.js";

const STACKMACHINE_TOKEN = process.env.STACKMACHINE_TOKEN;

const client = await StackMachine.init({
    token: STACKMACHINE_TOKEN || "wap_sm_demo"
});

console.log("Creating build...");

const build = await client.deployApp({
    appName: "wp-app-xas1",
    repoUrl: "https://github.com/wordpress/wordpress",
    branch: "6.8.3",
    enableDatabase: true,
    extraData: {
        wordpress: {
            "adminEmail": "admin@admin.com",
            "adminPassword": "%L7:D3Sd{![r",
            "adminUsername": "admin",
            "language": "en_US",
            "siteName": "Gallant Goldberg"
        }
    },
    // "region": "fr-pari1"
    // env: {
    //     "WP_ADMIN_USERNAME": "myadmin",
    // }
});

console.log("Deploying app...");
build.subscribeToProgress(({kind, message, datetime, stream}) => {
    console.log(datetime, stream, kind, message);
});
let startTime = new Date();
console.log("Waiting for the app to be built...");
const app = await build.finish();
console.log("App built!", app);
console.log(app.kind);
console.log("Time taken:", new Date().getTime() - startTime.getTime(), "ms");
