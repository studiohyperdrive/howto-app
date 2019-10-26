import { Logger } from './logger.service';
// import { ChildProcess } from 'child_process';
import { Subject } from 'rxjs';

export class Cmd {
  public cp: any;
  public options: any;
  public pid: string;

  public pid$: Subject<string> = new Subject<string>();

  private process;
  private logger: Logger;

  constructor(
    public cmd: string,
    options: any = {},
  ) {

    this.process = window.require('child_process');
    this.logger = new Logger();
    this.options = {
      // stdio: 'inherit',
      shell: true,
      ...options,
    };
  }

  public exec(): { cmd: Cmd; cp: Promise<string> } {
    const cp = new Promise<string>((resolve, reject) => {
      this.cp = this.process.exec(this.cmd, this.options, (err, stdout, stderr) => {
        if (stdout) {
          this.logger.info(stdout);
        }

        if (err || stderr) {
          this.logger.error(err || stderr);
        }

        this.pid$.complete();

        if (err || stderr) {
          reject();
        } else {
          resolve();
        }
      });

      this.cp.on('close', (code: number) => {
        if (code === null || code === 0) {
          this.logger.info(`Child process exited with code ${code}.`);
        } else {
          this.logger.error(`Child process exited with code ${code}`);
        }

        this.pid$.complete();
        resolve(code.toString());
      });

      this.pid = this.cp.pid.toString();
      this.pid$.next(this.pid);
    });

    return {
      cmd: this,
      cp,
    };
  }

  public kill(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        this.cp.kill();

        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }
}
