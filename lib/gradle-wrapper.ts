import 'source-map-support/register';
import { execute } from './sub-process';
import * as path from 'path';
import { ClassPathGenerationError } from './errors';
import { EOL } from 'os';

export function getGradleCommandArgs(targetPath: string): string[] {
  const gradleArgs = [
    'printClasspath',
    '-I',
    path.join(__dirname, ...'../bin/init.gradle'.split('/')),
    '-q',
  ];
  if (targetPath) {
    gradleArgs.push('-p', targetPath);
  }

  return gradleArgs;
}

export async function getClassPathFromGradle(
  targetPath: string,
  gradlePath: string,
): Promise<string> {
  const args = getGradleCommandArgs(targetPath);
  try {
    const output = await execute(gradlePath, args, { cwd: targetPath });
    const lines = output.trim().split(EOL);
    const lastLine = lines[lines.length - 1];

    return lastLine.trim();
  } catch (e) {
    console.log(e);
    throw new ClassPathGenerationError(e);
  }
}
