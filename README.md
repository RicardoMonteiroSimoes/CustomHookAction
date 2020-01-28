# CustomHookAction

This action is a way of providing custom hooks for your CI builds. Instead of relying on the hugely verbose github webhooks, you use this action to provide small hooks to be read by simple shell scripts.
The hook submits a simple JSON-load to your endpoint. The payload might look like this:

```JSON
{
    "repoName":"YourRepoName",
    "message":"ThisIsATestMessagePleaseIgnore",
    "repoUrl":"RepoUrl"
}
```

## How is it set up?

The script consists of 5 parameters that allow you to set up the payload as you like. only 3 of those are required.

   - repoName *(required)*
        - this variable is required as a minimum information for the target. You could use this to tell it, 
        where the message came from. This way you can use one single listening port to launch multiple scripts for different repositories
   - targetIp *(required)*
        - Should be self explainatory. The target IP that will receive the payload
   - targetPort *(required)*
        - The port on the target that is listening for our payload
   - repoUrl *(optional)*
        - The repoUrl can is optional. This might be usefull if you wan't to be able to change the url dynamically 
        and supply it trough the payload
   - message *(optional)*
        - Use the message to supply additional information to the target. Maybe you want to tell it which branch was updated, or additional parameters? It's up to you!

It also offers 2 output parameters you can use!

   - status
        - status is a verbose output if the script was successful or not. It will either be `successful` or `failed`
   - booleanStatus
        -  as the name suggests this is the same as `status`, except that it contains a boolean value `true` or `false`

## Example *.yml script

This is an example script. It offers 3 examples of usage of the script.
To the end of the script there are several conditional echo requests that showcase how you can use the feedback of 
the script to enact more actions.

```yml
on: 
  push:
    branches:
      - master
jobs:
  CustomHookAction:
    runs-on: ubuntu-latest
    name: Tells your CI Solution something happened!
    steps:
    - name: CustomHookAction with all parameters
      id: FullHook
      uses: ByRicardoSimoes/CustomHookAction@1.0.0
      with:
        repoUrl: 'repoUrl'
        repoName: 'repoName'
        targetIp: ${{ secrets.TARGET_IP }}
        targetPort: ${{ secrets.TARGET_PORT }}
        message: 'ThisIsATestMessagePleaseIgnore'      
    - name: Status of the Hook
      run: echo  "Status of the first Hook was ${{ steps.FullHook.outputs.status }}"
    - name: CustomHookAction with missing message parameter
      id: DenseHook
      uses: ByRicardoSimoes/CustomHookAction@1.0.0
      with:
        repoUrl: 'repoUrl'
        repoName: 'repoName'
        targetIp: ${{ secrets.TARGET_IP }}
        targetPort: ${{ secrets.TARGET_PORT }}
    - name: Status of the Hook
      run: echo  "Status of the second Hook was ${{ steps.DenseHook.outputs.status }}"
    - name: CustomHookAction with missing message and repourl parameter
      id: MinHook
      uses: ByRicardoSimoes/CustomHookAction@1.0.0
      with:
        repoName: 'repoName'
        targetIp: ${{ secrets.TARGET_IP }}
        targetPort: ${{ secrets.TARGET_PORT }}
    - name: Status of the Hook
      run: echo  "Status of the last Hook was ${{ steps.MinHook.outputs.status }}"
    - name: Conditional test
      if: steps.MinHook.outputs.booleanStatus
      run: echo "Status is okay!"
    - name: Negative conditional test
      if: steps.FullHook.outputs.booleanStatus == false
      run: echo "this shouldnt run!"
    - name: This only runs if something fails
      if: failure()
      run: echo "Submit a bug report over here https://github.com/ByRicardoSimoes/CustomHookAction/issues"
```

As you can see we are using `targetIp: ${{ secrets.TARGET_IP }}` and `targetPort: ${{ secrets.TARGET_PORT }}` to supply hidden env_vars to the script. You can set them for your repository under settings. Just replace `TARGET_IP`/`TARGET_PORT` with the name you gave it!

The script ***WILL FAIL*** if you don't submit all the required variables.
