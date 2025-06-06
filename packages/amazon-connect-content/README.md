# Amazon Connect content stack

A TypeScript AWS CDK application for provisioning Amazon Connect resources.

This project uses the CDK Toolkit to synthesize and deploy a CloudFormation stack that:

- Configures business hours for your Connect instance  
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

## Context parameters

Set these in cdk.json or via CLI -c flags:

- `businessHoursTimeZone` (String)
  - Deault: `UTC`
  - Time zone for business hours schedules
- `createHierarchy` (Boolean)
  - Default: `false`
  - When `true`, deploys sample hierarchy groups

## Configuration Files

- `config/business_hours.json` – Define your Connect business hours
- `config/hierarchy.json` – (Optional) Define hierarchy group structure
