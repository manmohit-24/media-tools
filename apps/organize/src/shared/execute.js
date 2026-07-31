import { execFile } from "node:child_process";

export function execute(command, args = []) {
  return new Promise((resolve, reject) => {
    execFile(command, args, (error, stdout, stderr) => {
      if (error) return reject(error);
      resolve({ stdout, stderr });
    });
  });
}
