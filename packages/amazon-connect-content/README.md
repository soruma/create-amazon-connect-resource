# Amazon Connect content stack

A TypeScript AWS CDK application for provisioning Amazon Connect resources.

This project uses the CDK Toolkit to synthesize and deploy a CloudFormation stack that:

- Configures business hours for your Amazon Connect instance
- Optionally creates sample agent hierarchy groups

## Prerequisites

- Node.js ≥ 16
- AWS credentials configured (e.g. `~/.aws/credentials`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`)
- AWS CDK CLI installed (`pnpm install -g aws-cdk`)

## Setup

```shell
cd packages/amazon-connect
pnpm install
```

## Useful commands

- `pnpm run build` Compile TypeScript
- `pnpm run watch` Watch src/ and recompile on changes
- `pnpm run test` Run unit tests (Vitest)
- `npx cdk synth` Emit the synthesized CloudFormation template
- `npx cdk diff` Compare deployed stack with loca
- `npx cdk deploy` Deploy the stack to your AWS account

## Configuration Files

- `config/business-hours.json` – Define your Connect business hours
- `config/hierarchy.json` – (Optional) Define hierarchy group structure

## Context parameters

| Parameter Name        | Type    | Default      | Description                                  |
| --------------------- | ------- | ------------ | -------------------------------------------- |
| connectInstanceAlias  | String  | - (required) | Alias of an existing Amazon Connect instance |
| businessHoursTimeZone | String  | UTC          | Time zone for business hours                 |
| createHierarchy       | Boolean | `false`      | Whether to create user hierarchy groups      |

## Resources Deployed

This stack deploys the following AWS resources:

| Resource Type                        | Description                                                                                 |
|--------------------------------------|---------------------------------------------------------------------------------------------|
| AWS::Connect::HoursOfOperation       | Configures business hours for your Amazon Connect instance                                   |
| AWS::Connect::UserHierarchyGroup     | Creates user hierarchy groups (Division, Department, Team) if `createHierarchy` is enabled   |

## Example Deployment

To deploy this stack, run the following commands:

```shell
cd packages/amazon-connect-content
npx cdk deploy \
  --context connectInstanceAlias=my-connect \
  --context businessHoursTimeZone=Asia/Tokyo \
  --context createHierarchy=true
```
