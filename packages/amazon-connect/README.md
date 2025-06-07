# Amazon Connect stack

A TypeScript AWS CDK application for provisioning Amazon Connect resources and related infrastructure.

## Prerequisites

- Node.js ≥ 16
- AWS CDK CLI (`npm install -g aws-cdk`)
- AWS credentials configured (e.g. `~/.aws/credentials`, or `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` environment variables)

## Setup

```bash
cd packages/amazon-connect
pnpm install
```

## Useful commands

- `pnpm run build` Compile TypeScript sources to dist/
- `pnpm run watch` Watch files and recompile on change
- `pnpm run test` Run unit tests (Vitest)
- `npx cdk synth` Emit the CloudFormation template
- `npx cdk diff` Compare deployed stack with your local changes
- `npx cdk deploy` Deploy the stack to AWS
- `npx cdk destroy` Tear down the deployed stack

## CDK Context Parameters

| Parameter Name          | Type    | Default         | Description                                                                    |
| ----------------------- | ------- | --------------- | ------------------------------------------------------------------------------ |
| connectInstanceAlias    | String  | — (required)    | Alias of an existing Amazon Connect instance                                   |
| inboundCalls            | Boolean | true            | Enable inbound calling                                                         |
| outboundCalls           | Boolean | true            | Enable outbound calling                                                        |
| contactflowLogs         | Boolean | true            | Enable contact flow logging                                                    |
| autoResolveBestVoices   | Boolean | true            | Auto–resolve best TTS voices                                                   |
| identityManagementType  | String  | CONNECT_MANAGED | One of `CONNECT_MANAGED` / `SAML` / `EXISTING_DIRECTORY`                       |
| directoryId             | String  | —               | If `identityManagementType` is `EXISTING_DIRECTORY`, specify your Directory ID |
| createDataStorageBucket | Boolean | true            | Create an S3 bucket for call/chat recordings                                   |

## Resources Deployed

| Resource Type            | Description                                                                   |
| ------------------------ | ----------------------------------------------------------------------------- |
| `AWS::Connect::Instance` | The Amazon Connect instance itself                                            |
| `AWS::S3::Bucket`        | S3 bucket for call and chat recordings (if `createDataStorageBucket` is true) |
| `AWS::IAM::Role`         | IAM roles for Amazon Connect integrations and permissions                     |

## Example Deployment

To deploy this stack, run the following commands:

```shell
cd packages/amazon-connect
npx cdk deploy \
  --context connectInstanceAlias=my-connect-alias \
  --context inboundCalls=true \
  --context outboundCalls=true \
  --context contactflowLogs=true \
  --context autoResolveBestVoices=true \
  --context identityManagementType=CONNECT_MANAGED \
  --context createDataStorageBucket=true
```
