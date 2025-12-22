import { StackMachine } from "stackmachine";
import { readFileSync } from "fs";

const STACKMACHINE_TOKEN = process.env.STACKMACHINE_TOKEN;

const client = await StackMachine.init({
    token: STACKMACHINE_TOKEN || "wap_sm_demo"
});

console.log("Uploading file...");

const appName = "zip-upload-test6";
const build = await client.deployApp({
    appName: appName,
    owner: "stackmachine",
    uploadUrl: "https://www.example.com/test.zip"
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
