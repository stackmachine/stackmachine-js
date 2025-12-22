import { init, StackMachine } from "@wasmer/sdk-lite";
// import { init, StackMachine } from "../../dist/index.js";

const STACKMACHINE_TOKEN = process.env.STACKMACHINE_TOKEN;

const client = await StackMachine.init({
    token: STACKMACHINE_TOKEN
});

const app = await client.getApp({
    owner: "theowner",
    name: "appname"
});

console.log("App", app);
