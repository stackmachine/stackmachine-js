import { StackMachine, createZip } from 'stackmachine'

const client = await StackMachine.init({
  token: "wap_XYZ",
})

async function execWasmerDeploy(deployPath, subdomain) {
  try {
    const zip = await createZip(deployPath)

    const upload = await client.uploadFile(zip)

    const build = await client.deployApp({
      appName: subdomain,
      owner: 'syrusakbary',
      uploadUrl: upload,
      // THIS MAKE THINGS HALT
      // domains: [`${subdomain}-syrus.wasmer.app`]
    })
    console.log(upload);
    console.log(`Deploy: ${deployPath}`);
    console.debug(`App successfully deployed: ${subdomain}`);
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
  } catch (error) {
    console.log(`Error deploying app: ${error}`);
    throw new Error("Wasmer deploy error: " + error)
  }
}

execWasmerDeploy({ "index.php": "<html><body><h1>Hello World!</h1></body></html>" }, "test-my-app-syrus7");
