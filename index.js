const core = require('@actions/core');
const net = require('net');

try {
    // `who-to-greet` input defined in action metadata file
    const repoUrl = core.getInput('repoUrl');
    const repoName = core.getInput('repoName');
    const targetIp = core.getInput('targetIp');
    const targetPort = core.getInput('targetPort');
    const message = core.getInput('message');

    var body;

    if(!targetIp || !targetPort || !repoName){
        throw ("Not all required parameters were supplied!");
    }

    console.log("Setting up the following payload:");
    body = {
        repoName: repoName,
    }
    if (message) {
        body = {
            ...body,
            message: message,
        }
    } 
    if (repoUrl) {
        body = {
            ...body,
            repoUrl: repoUrl,
        }
    }

    console.log(JSON.stringify(body));

    var client = new net.Socket();
    client.connect(targetPort, targetIp, function() {
        console.log('Connected');
        client.write(JSON.stringify(body));
        client.destroy();
        core.setOutput("status", "successful");
        core.setOutput("booleanStatus", "true");
    });

    console.log("Done!") 

} catch (error) {
    core.setOutput("status", "failed " + error);
    core.setOutput("booleanStatus", "false");
    core.setFailed(error.message);
}