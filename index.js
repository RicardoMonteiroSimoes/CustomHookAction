const core = require('@actions/core');
const net = require('net');

try {
    // `who-to-greet` input defined in action metadata file
    const repourl = core.getInput('repourl');
    const reponame = core.getInput('reponame');
    const targetip = core.getInput('targetip');
    const targetport = core.getInput('targetport');
    const message = core.getInput('message');

    var body;

    console.log("Setting up the following payload:");
    body = {
        reponame: reponame,
    }
    if (message) {
        body = {
            ...body,
            message: message,
        }
    } 
    if (repourl) {
        body = {
            ...body,
            repourl: repourl,
        }
    }

    console.log(targetip + ":" + targetport);
    console.log(JSON.stringify(body));

    var client = new net.Socket();
    client.connect(targetport, targetip, function() {
        console.log('Connected');
        client.write(JSON.stringify(body));
        client.destroy();
        core.setOutput("status", "successful");
        core.setOutput("booleanStatus", true);
    });

    console.log("Done!") 

} catch (error) {
    core.setOutput("status", "failed " + err);
    core.setOutput("booleanStatus", false);
    core.setFailed(error.message);
}