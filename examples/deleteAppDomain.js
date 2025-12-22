import { StackMachine } from "stackmachine";

const STACKMACHINE_TOKEN = process.env.STACKMACHINE_TOKEN;

const client = await StackMachine.init({
    token: STACKMACHINE_TOKEN || "wap_sm_demo"
});

const app = await client.getApp({
    id: "da_XYZ"
});

const domain = app.domains.find((domain) => domain.url.includes("mydomainspecial.com"));
if (!domain) {
    throw new Error("Domain not found");
}
await domain.delete();

console.log("Domain deleted!");
