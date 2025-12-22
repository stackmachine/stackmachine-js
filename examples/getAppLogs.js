import { StackMachine } from "stackmachine";

const STACKMACHINE_TOKEN = process.env.STACKMACHINE_TOKEN;

const client = await StackMachine.init({
    token: STACKMACHINE_TOKEN || "wap_sm_demo"
});

const app = await client.getApp({
    id: "da_XYZ"
});

const last30Minutes = new Date(Date.now() - 30 * 60 * 1000);

const logs = await app.activeVersion?.fetchLogs(last30Minutes);
console.log(logs);
