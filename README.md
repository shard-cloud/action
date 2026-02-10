# ShardCloud CI/CD Action

Deploy your application to ShardCloud directly from your GitHub workflows.

## Table of Contents

- [Description](#description)
- [Inputs](#inputs)
- [Usage](#usage)
  - [Basic Deployment](#basic-deployment)
  - [Deploy and Restart](#deploy-and-restart)
  - [Backup Before Deploy](#backup-before-deploy)
  - [Custom Working Directory](#custom-working-directory)
  - [Multi-Environment Deployment](#multi-environment-deployment)
- [Setup](#setup)
- [Available Commands](#available-commands)
- [Tips](#tips)
- [Support](#support)

## Description

This GitHub Action installs the ShardCloud CLI and allows you to execute ShardCloud commands as part of your CI/CD pipeline. Automate deployments, backups, restarts, and more with simple workflow configurations.

To get started, you'll need an API key from the [ShardCloud Dashboard](https://shardcloud.app/dash) → **Config** → **Integrations**. You can use this API key to authenticate with the ShardCloud CLI.

## Inputs

| Input | Required | Default | Description |
|-------|----------|---------|-------------|
| `token` | **Yes** | - | ShardCloud API Key (store in secrets) |
| `commands` | No | - | ShardCloud CLI commands to execute |
| `workdir` | No | `.` | Working directory for command execution |

## Usage

### Basic Deployment

Deploy your application to ShardCloud on every push to the main branch:

```yaml
name: Deploy to Shard Cloud
on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Deploy to Shard Cloud
        uses: shard-cloud/action@main
        with:
          token: ${{ secrets.SHARD_CLOUD_API_KEY }}
          commands: commit <app_id>
```

### Deploy and Restart

Commit your changes and restart the application in one workflow:

```yaml
name: Deploy and Restart
on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Deploy and Restart Application
        uses: shard-cloud/action@main
        with:
          token: ${{ secrets.SHARD_CLOUD_API_KEY }}
          commands: |
            commit <app_id>
            restart <app_id>
```

### Backup Before Deploy

Create a backup before deploying new changes:

```yaml
name: Backup and Deploy
on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Backup and Deploy
        uses: shard-cloud/action@main
        with:
          token: ${{ secrets.SHARD_CLOUD_API_KEY }}
          commands: |
            backup <app_id>
            commit <app_id>
```

### Custom Working Directory

Execute commands from a specific directory:

```yaml
name: Deploy from Subdirectory
on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Deploy Application
        uses: shard-cloud/action@main
        with:
          token: ${{ secrets.SHARD_CLOUD_API_KEY }}
          workdir: ./my-app
          commands: commit <app_id>
```

### Multi-Environment Deployment

Deploy to different environments based on the branch:

```yaml
name: Multi-Environment Deploy
on:
  push:
    branches:
      - main
      - staging

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Deploy to Production
        if: github.ref == 'refs/heads/main'
        uses: shard-cloud/action@main
        with:
          token: ${{ secrets.SHARD_CLOUD_API_KEY }}
          commands: |
            backup <prod_app_id>
            commit <prod_app_id>
            restart <prod_app_id>
      
      - name: Deploy to Staging
        if: github.ref == 'refs/heads/staging'
        uses: shard-cloud/action@main
        with:
          token: ${{ secrets.SHARD_CLOUD_API_KEY }}
          commands: commit <staging_app_id>
```

## Setup

### 1. Get Your ShardCloud API Key

1. Go to the [ShardCloud Dashboard](https://shardcloud.app/dash)
2. Navigate to **Config** → **Integrations**
3. Generate or copy your API key

### 2. Add Secret to GitHub

1. Go to your repository settings
2. Navigate to **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `SHARD_CLOUD_API_KEY`
5. Value: Your ShardCloud API key
6. Click **Add secret**

### 3. Create Workflow

Add a `.github/workflows/deploy.yml` file to your repository with your desired configuration (see examples above).

## Available Commands

The action supports all ShardCloud CLI commands. Common commands include:

- `commit <app_id>` - Deploy changes to your application
- `restart <app_id>` - Restart your application
- `backup <app_id>` - Create a backup of your application
- And more - refer to the [ShardCloud CLI documentation](https://docs.shardcloud.app/cli/cli) for a complete list

## Tips

- **Always store your API key in GitHub Secrets** - never hardcode it in your workflow files
- **Create backups before major deployments** to ensure you can rollback if needed
- **Use specific branches for production deployments** to prevent accidental deployments
- **Combine multiple commands** to create complex deployment workflows

## Support

For issues or questions:
- Visit the [ShardCloud Documentation](https://docs.shardcloud.app)
- Open an issue in this repository
- Contact ShardCloud support

