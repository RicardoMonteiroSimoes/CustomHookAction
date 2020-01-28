# CustomHookAction

This action is a way of providing custom hooks for your CI builds. Instead of relying on the hugely verbose github webhooks, you use this action to provide small hooks to be read by simple shell scripts.
The hook submits a simple JSON-load to your endpoint.

## how does it work?

The action offers 5 simple parameters for you to set.

### repourl

This parameter is supposed to be the url of your repository. To allow freedom of choice, you can set it to anything. This is not required anymore, as reponame should be enough to identify where it's coming from. You can, ofcourse, still use it.

### reponame

This one allows you to define the name of the repository. You can use this name to filter out your actions on your CI script, so you can have multiple actions for different repos, but still listen on the same port.

### targetip

Here you tell the action the target IP of your CI endpoint.

### targetport

This would be the port to target.

### message

This is the only optional point. If empty, it will be completely emitted from the payload. This is for you to supply any information you want, for example logging information.
