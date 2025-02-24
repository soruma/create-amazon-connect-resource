# Create Amazon Connect resource stack

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `pnpm build`   compile typescript to js
* `pnpm watch`   watch for changes and compile
* `pnpm test`    perform the jest unit tests
* `pnpm run cdk deploy --context connectInstanceAlias=<amazon-connect-instanch-name> --context isCreateHierarchy=true`  deploy this stack to your default AWS account/region
* `pnpm run cdk diff`    compare deployed stack with current state
* `pnpm run cdk synth`   emits the synthesized CloudFormation template
