const core = require('@actions/core');
const github = require('@actions/github');

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

    fetch(targetip + ":" + targetport, {
        method: "POST",
        body: JSON.stringify(body)
    });

    console.log("Done! :)")

} catch (error) {
    core.setFailed(error.message);
}