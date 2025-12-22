import { StackMachine } from "stackmachine";
import { readFileSync } from "fs";

const STACKMACHINE_TOKEN = process.env.STACKMACHINE_TOKEN;

const client = await StackMachine.init({
    token: STACKMACHINE_TOKEN || "wap_sm_demo"
});

const zip = new Blob([readFileSync("test.zip")]);
const uploadUrl = await client.uploadFile(zip, (progress) => {
    console.log("Uploading files... ", progress * 100, "%");
});

const appName = "zip-upload-test6";
const build = await client.deployApp({
    appName: appName,
    owner: "stackmachine",
    uploadUrl: uploadUrl,
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
