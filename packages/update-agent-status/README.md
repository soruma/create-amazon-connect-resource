# Update agent status

A CLI tool to modify the default Amazon Connect agent statuses ("Available"/"Offline") for a given Connect instance.

## Prerequisites

- Node.js ≥ 16
- AWS credentials configured (e.g. via `~/.aws/credentials` or environment variables)
- An existing Amazon Connect instance

## Installation

```bash
cd packages/update-agent-status
pnpm install
```

## Build

```shell
pnpm build
```

This compiles TypeScript source into dist/.

## CLI Usage

```shell
node dist/main.js [options]
```

### Options

`--instance-id <INSTANCE_ID>`
The Connect instance’s ID (e.g. abcd1234-5678-90ab-cdef-EXAMPLE11111).

`--instance-alias <INSTANCE_ALIAS>`
The Connect instance’s alias (used if you don’t know the ID).

`--routable-name <NAME>`
(Optional) New name for the “Routable” status.

`--routable-description <DESC>`
(Optional) Description for the “Routable” status.

`--offline-name <NAME>`
(Optional) New name for the “Offline” status.

`--offline-description <DESC>`
(Optional) Description for the “Offline” status.

`--region <REGION>`
(Optional) The AWS region for the Amazon Connect instance.

`--profile <PROFILE>`
(Optional) The AWS profile to use for the AWS CLI.

`-h`, `--help`
Show help information.

**Notes**

- You must provide **either** `--instance-id` **or** `--instance-alias`.
- You must provide **at least one** of `--routable-name` or `--offline-name`.
- If you omit one of the names, only the other status will be updated.
