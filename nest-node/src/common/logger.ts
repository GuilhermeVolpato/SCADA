import * as fs from 'node:fs';
import * as path from 'node:path';

const logFilePath = path.join(process.cwd(), 'logs', 'app.log');

export function appendLog(message: string) {
  const line = `[${new Date().toISOString()}] ${message}\n`;
  fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
  fs.appendFileSync(logFilePath, line, 'utf8');
  console.log(message);
}
