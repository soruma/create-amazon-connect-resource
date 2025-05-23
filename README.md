# Create Amazon Connect resource stack

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
- `createDataStorageBucket` (Boolean) Default: `true`
  - Whether to store call and chat records in storage
- `createBusinessHours` (Boolean) Default: `false`
  - Whether to create business hours
- `businessHoursTimeZone` (String) Deault: `UTC`
  - Business hours time zone
- `createHierarchy` (Boolean) Default: `false`
  - Create sample Amazon Connect organization hierarchies

## Create resources

- Amazon Connect
  - Instance name is `${connectInstanceAlias}`
  - Business hours (optional)
    - The business hours configuration file is `config/business_hours.json`
  - Hierarchy group (optional)
- S3 Bucket
  - Bucket name is `connect-${connectInstanceAlias}`
    - If `createDataStorageBucket` is `false`, it will not be create
