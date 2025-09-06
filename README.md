# GitHub Artifacts Multi-Service Builds

A simple repository with multiple Node.js services and a single GitHub workflow that automatically discovers, builds, and uploads all services to GitHub artifacts in parallel.

## Structure

```
├── service-1/          # Node.js service (port 3001)
│   ├── src/index.js
│   └── package.json
├── service-2/          # Node.js service (port 3002)
│   ├── src/index.js
│   └── package.json
├── service-3/          # Future service (will be auto-discovered)
│   ├── src/index.js
│   └── package.json
├── .github/workflows/
│   ├── build-and-upload.yml      # Single workflow (discovers & builds all services)
│   └── list-and-test-builds.yml  # List available builds
├── .gitignore                    # Root-level gitignore
└── README.md
```

## How It Works

1. **Auto-Discovery**: The workflow automatically finds all directories containing `package.json` files
2. **Parallel Builds**: Uses GitHub's matrix strategy to build services in parallel
3. **Configurable Concurrency**: Control how many services build simultaneously (default: 5)
4. **Zero Configuration**: Add any new service without modifying workflows

## Adding New Services

Simply create a new directory with a `package.json` file and the workflow will automatically discover and build it:

```bash
mkdir service-3
cd service-3
# Create package.json with build script
# Create src/index.js
# Push to trigger automatic discovery and build
```

**No workflow modifications needed!** The system is truly generic.

## Parallel Build Configuration

The workflow supports configurable parallel builds:

- **Default**: 5 services build simultaneously
- **Manual trigger**: Set `max_concurrent` input to control parallelism
- **Examples**:
  - `max_concurrent: 1` - Build one service at a time
  - `max_concurrent: 10` - Build up to 10 services simultaneously
  - `max_concurrent: 999` - Build all services at once

## Artifacts

When you push to `main` or `develop`, the workflow creates artifacts for all discovered services:

- `service-1-build-{run-number}-{commit}` - Contains service-1 build
- `service-2-build-{run-number}-{commit}` - Contains service-2 build
- `service-3-build-{run-number}-{commit}` - Contains service-3 build (when added)

Each artifact contains:
- `index.js` - The built service
- `build-id.txt` - Identifier for the build

## Finding and Running Builds

### Using the GitHub Workflow
Run the "List Available Builds" workflow manually to see all available artifacts and get GitHub CLI commands.

### Using GitHub CLI Commands

```bash
# List all build artifacts
gh run list --limit 20 --json artifacts,headBranch,headSha,conclusion,createdAt | \
  jq -r '.[] | select(.conclusion == "success") | "\(.headBranch) - \(.headSha) - \(.artifacts[].name)"' | \
  grep -E 'build-.*-$'

# Download a specific artifact
gh run download-artifact --name 'service-1-build-123-abc123' --path './downloaded'

# Run the downloaded service
cd downloaded && node index.js
```

## Local Development

```bash
# Service 1
cd service-1
npm install
npm run build

# Service 2  
cd service-2
npm install
npm run build
```

## Service Requirements

For a directory to be recognized as a service, it must contain:
- `package.json` file
- `npm run build` script
- `src/index.js` file (or whatever your build script expects)

## Key Benefits

- **Truly Generic**: No hardcoded service names anywhere
- **Parallel Builds**: Services build simultaneously for faster execution
- **Configurable Concurrency**: Control build parallelism based on your needs
- **Scalable**: Works with any number of services
- **Zero Maintenance**: Add services without touching workflows
- **Single Workflow**: Everything in one place, easy to understand
