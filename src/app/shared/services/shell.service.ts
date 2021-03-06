import { Injectable, NgZone } from '@angular/core';
import { Observable, merge, of, Subscriber } from 'rxjs';

@Injectable()
export class ShellService {
  public pcs: Map<string, any> = new Map<string, any>(); // TODO: fix this, does nothing atm

  private execa;
  private path;
  private process;
  private uuid;
  private waitForLocalhost;

  private root;

  constructor(
    private ngZone: NgZone,
  ) {
    this.execa = window.require('execa');
    this.path = window.require('path');
    this.process = window.require('process');
    this.uuid = window.require('uuid/v4');
    this.waitForLocalhost = window.require('wait-for-localhost');

    this.root = this.path.join(window.require('os').homedir(), 'Projects');
  }

  public registerProcess(pid: string, pcs: any): void {
    this.pcs.set(pid, pcs);
  }

  public run<T = any>({ cmd, status, cwd }: { cmd: string; status: string; cwd?: string; }): { exec$: Observable<T>, pid: string; } {
    const { pid, exec$ } = this.exec(cmd, {
      cwd: cwd ? this.path.resolve(this.root, cwd) : this.root,
    });

    return {
      pid,
      exec$: merge(
        of(status),
        exec$,
      ),
    };
  }

  public exec(command: string, { cwd, log = true }: { cwd?: string; log?: boolean; } = {}): { exec$: Observable<any>, pid: string; } {
    const pid = this.uuid();

    return {
      pid,
      exec$: new Observable((subscriber: Subscriber<any>) => {
        const localBinPattern = new RegExp(this.path.join(this.process.cwd(), 'node_modules', '.bin'), 'g');
        const env = {
          ...this.process.env,
          INIT_CWD: cwd,
          PWD: cwd,
          PATH: this.process.env.PATH.replace(localBinPattern, ''),
        };

        const pcs = this.execa.command(command, { shell: true, cwd, env, extendEnv: false });

        this.pcs.set(pid, pcs);

        if (log) {
          pcs.stdout.on('data', (message) => {
            console.log(message.toString());
          });
        }

        pcs
          .then(({ stdout, stderr }) => {
            this.ngZone.run(() => {
              if (stderr) {
                subscriber.error(stderr);
              } else {
                subscriber.next(stdout);
              }

              subscriber.complete();

              this.pcs.delete(pid);
            });
          })
          .catch((err) => {
            this.ngZone.run(() => {
              subscriber.error(err);
              subscriber.complete();

              this.pcs.delete(pid);
            });
          });
      }),
    };
  }

  public wait({ port }: { port: number }): Observable<any> {
    return new Observable((subscriber) => {
      this.waitForLocalhost({ port, useGet: true })
        .then(() => {
          subscriber.next(true);
          subscriber.complete();
        })
        .catch((err) => {
          subscriber.error(err);
          subscriber.complete();
        });
    });
  }

  public kill(pid: string): Promise<void> {
    if (!this.pcs.has(pid)) {
      return Promise.resolve();
    }

    try {
      this.pcs.get(pid).kill();
      this.pcs.delete(pid);

      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  }

  public
}
