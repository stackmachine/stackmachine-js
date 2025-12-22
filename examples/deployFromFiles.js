import { StackMachine, createZip } from "stackmachine";

const STACKMACHINE_TOKEN = process.env.STACKMACHINE_TOKEN;

const client = await StackMachine.init({
    token: STACKMACHINE_TOKEN || "wap_sm_demo"
});

console.log("Uploading file...");
const appName = "file-upload-test8";

const zip = await createZip({
    "index.php": "<html><body><h1>Hello World!</h1></body></html>",
});
const uploadUrl = await client.uploadFile(zip, (progress) => {
    console.log("Uploading files... ", progress * 100, "%");
});

const build = await client.deployApp({
    appName: appName,
    owner: "stackmachine",
    // domains: [`${appName}.sm.run`],
    uploadUrl: uploadUrl
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
