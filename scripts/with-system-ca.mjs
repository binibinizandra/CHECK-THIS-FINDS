import { spawn } from "node:child_process";

// Some antivirus/network setups intercept HTTPS and swap in their own
// certificate, which Node rejects by default. This runs the real command
// with --use-system-ca so it also trusts the machine's own certificates —
// without every teammate having to set that by hand each session.
const [, , cmd, ...args] = process.argv;

function quote(arg) {
  return /[\s"]/.test(arg) ? `"${arg.replace(/"/g, '\\"')}"` : arg;
}

const commandLine = [cmd, ...args].map(quote).join(" ");

const child = spawn(commandLine, {
  stdio: "inherit",
  shell: true,
  env: {
    ...process.env,
    NODE_OPTIONS: [process.env.NODE_OPTIONS, "--use-system-ca"].filter(Boolean).join(" ").trim(),
  },
});

child.on("exit", (code) => process.exit(code ?? 0));
child.on("error", (err) => {
  console.error(err);
  process.exit(1);
});
