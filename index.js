import { exec } from "@actions/exec";
import * as core from "@actions/core";

async function run() {
  try {
    const token = core.getInput("token", { required: true });
    const commands = core.getInput("commands", { required: false });
    const workdir = core.getInput("workdir") || ".";

    core.info("📦 Installing shard-cloud-cli...");
    await exec("npm", ["install", "-g", "shard-cloud-cli"]);
    core.info("✓ Installation complete");

    core.info("🔐 Logging in to ShardCloud...");
    await exec("shardcloud", ["login", `--token=${token}`], {
      cwd: workdir,
    });
    core.info("✓ Login successful");

    if (commands && commands.trim()) {
      core.info("🚀 Executing commands...");
      
      const commandArray = commands
        .split("\n")
        .map((cmd) => cmd.trim())
        .filter((cmd) => cmd.length > 0);

      for (let i = 0; i < commandArray.length; i++) {
        const command = commandArray[i];
        core.info(`Executing command ${i + 1}/${commandArray.length}: ${command}`);
        
        const [cmd, ...args] = command.split(/\s+/);
        
        await exec(`shardcloud ${cmd}`, args, {
          cwd: workdir,
        });
        
        core.info(`✓ Command ${i + 1} completed`);
      }
      
      core.info("✓ All commands executed successfully");
    } else {
      core.info("ℹ️ No commands specified, skipping execution");
    }

    core.setOutput("success", "true");
  } catch (error) {
    core.setFailed(`Action failed: ${error.message}`);
    process.exit(1);
  }
}

run();