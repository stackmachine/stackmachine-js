import { init, StackMachine } from "@wasmer/sdk-lite";
// import { init, StackMachine } from "../../dist/index.js";

const STACKMACHINE_TOKEN = process.env.STACKMACHINE_TOKEN;

await init({
    token: STACKMACHINE_TOKEN
});

// const app = await StackMachine.getApp({
//     owner: "theowner",
//     name: "appname"
// });

const app = await StackMachine.getApp({
    id: "da_XYZ"
});

console.log("App", app);
