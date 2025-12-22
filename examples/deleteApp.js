import { StackMachine } from "stackmachine";

const STACKMACHINE_TOKEN = process.env.STACKMACHINE_TOKEN;

const client = await StackMachine.init({
    token: STACKMACHINE_TOKEN || "wap_sm_demo"
});

const deleted = await client.deleteApp({
    id: "da_XYZ"
});

console.log("App deleted!", deleted);
