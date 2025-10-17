import { init, StackMachine } from "@wasmer/sdk-lite";
// import { init, StackMachine } from "../../dist/index.js";

const STACKMACHINE_TOKEN = process.env.STACKMACHINE_TOKEN;

await init({
    token: STACKMACHINE_TOKEN
});

const deleted = await StackMachine.deleteApp({
    id: "da_XYZ"
});

console.log("App deleted!", deleted);
