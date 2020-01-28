const core = require('@actions/core');
const JsonSocket = require('json-socket');

try {
    // `who-to-greet` input defined in action metadata file
    const repourl = core.getInput('repourl');
    const reponame = core.getInput('reponame');
    const targetip = core.getInput('targetip');
    const targetport = core.getInput('targetport');
    const message = core.getInput('message');

    var body;

    console.log("Setting up the following payload:");
    if (message) {
        body = {
            reponame: reponame,
            repourl: repourl,
            message: message,
        }
    } else {
        body = {
            reponame: reponame,
            repourl: repourl,
        }
    }

    console.log(targetip + ":" + targetport);
    console.log(JSON.stringify(body));

    JsonSocket.sendSingleMessage(targetport, targetip, JSON.stringify(body), function(err) {
        if (err) {
            core.setOutput("status", "There was an error! " + err);
            throw err;
        } else {
            core.setOutput("status", "delivered the packet succesfully!");
        }
    });

    console.log("Done!")

    

} catch (error) {
    core.setFailed(error.message);
}