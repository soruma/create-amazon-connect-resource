# create-amazon-connect-resource

A monorepo containing tools and infrastructure code for provisioning and managing Amazon Connect resources.

## Packages

1. **amazon-connect**
   A TypeScript AWS CDK application that provisions and configures an Amazon Connect instance, including:
   - Business hours schedules
   - Optional agent hierarchy groups
   - Optional S3 bucket for call/chat recordings

2. **update-agent-status**  
   A CLI utility that updates the default Amazon Connect agent statuses (“Routable” / “Offline”) for a specified Connect instance.

## Prerequisites

- Node.js ≥ 16
- pnpm
- AWS credentials configured (via `~/.aws/credentials` or environment variables)  
- (For CDK) AWS CDK CLI installed globally (`npm install -g aws-cdk`)

## Setup

Clone the repository and install dependencies:

```shell
git clone <repository-url>
cd create-amazon-connect-resource
pnpm install
```

## Development & Build

Run from the repo root or within each package:

```shell
# Build all packages
pnpm run build

# Watch for changes in a package
cd packages/amazon-connect   # or update-agent-status
pnpm run watch
```

## Deployment

### amazon-connect

```shell
cd packages/amazon-connect

# Synthesize CloudFormation template
npx cdk synth

# Deploy to AWS (example context flags)
npx cdk deploy \
  --context connectInstanceAlias=your-alias \
  --context businessHoursTimeZone=UTC \
  --context createHierarchy=false \
  --context createDataStorageBucket=true
```

### update-agent-status

```shell
cd packages/update-agent-status

# Build CLI
pnpm run build

# Run the CLI
node dist/main.js \
  --instance-id <CONNECT_INSTANCE_ID> \
  --routable-name "Available" \
  --routable-description "Ready to take calls" \
  --offline-name "Offline" \
  --offline-description "Not available"
```

## Testing

All packages use Vitest for unit tests:

```shell
# Run tests in all packages
pnpm run test
```
