# Create Amazon Connect stack

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `pnpm build`   compile typescript to js
* `pnpm watch`   watch for changes and compile
* `pnpm test`    perform the jest unit tests
* `pnpm run cdk deploy --context connectInstanceAlias=<amazon-connect-instanch-name> --context createHierarchy=true`  deploy this stack to your default AWS account/region
* `pnpm run cdk diff`    compare deployed stack with current state
* `pnpm run cdk synth`   emits the synthesized CloudFormation template

## Context parameters

- `connectInstanceAlias` (String) **Required**
  - Amazon Connect instance alias
  - S3 Bucket name
- `inboundCalls` (Boolean) Default: `true`
  - Allow inbound Calls
- `outboundCalls` (Boolean) Default: `true`
  - Allow outbound Calls
- `contactflowLogs` (Boolean) Default: `true`
  - Outputs contact flow logs
- `autoResolveBestVoices` (Boolean) Default: `true`
  - Boolean flag which enables AUTO_RESOLVE_BEST_VOICES
- `identityManagementType` (String) Default: `CONNECT_MANAGED`
  - Identity management type(`SAML` | `CONNECT_MANAGED` | `EXISTING_DIRECTORY`)
- `directoryId` (String)
  - Required if `identityManagementType` is `EXISTING_DIRECTORY`, format: `d-0000000000`
- `createDataStorageBucket` (Boolean) Default: `true`
  - Whether to store call and chat records in storage
- `businessHoursTimeZone` (String) Deault: `UTC`
  - Business hours time zone
- `createHierarchy` (Boolean) Default: `false`
  - Create sample Amazon Connect organization hierarchies

## Create resources

- Amazon Connect
  - Instance name is `${connectInstanceAlias}`
  - Business hours
    - The business hours configuration file is `config/business_hours.json`
  - Hierarchy group (optional)
- S3 Bucket
  - Bucket name is `connect-${connectInstanceAlias}`
    - If `createDataStorageBucket` is `false`, it will not be create
