import { Injectable } from '@angular/core';

import { BrowserType, BrowserOptions, RunningProcess } from '../types/os';
import { Observable, Subscriber } from 'rxjs';
import { ShellService } from './shell.service';

@Injectable({
  providedIn: 'root',
})
export class RunnerService {
  private cl;
  private uuid;

  constructor(
    private shell: ShellService,
  ) {
    this.cl = window.require('chrome-launcher');
    this.uuid = window.require('uuid');
  }

  public launchBrowser({
    type,
    url,
  }: BrowserOptions): { pid: string; exec$: Observable<RunningProcess> } {
    switch (type) {
      case BrowserType.CHROME:
        return this.launchChrome(url);
    }
  }

  public launchChrome(url: string): { pid: string; exec$: Observable<RunningProcess> } {
    const pid = this.uuid();

    return {
      pid,
      exec$: new Observable<RunningProcess>((subscriber: Subscriber<RunningProcess>) => {
        this.cl.launch({
          startingUrl: url,
        })
          .then(({ port, kill, pid: innerPid, process: pcs }) => {
            subscriber.next({
              port,
              pid: innerPid,
              pcs,
            });

            this.shell.registerProcess(pid, { kill });

            pcs.on('exit', (code) => {
              if (code > 0) {
                subscriber.error(`Process exited with code (${code})`);
              } else {
                subscriber.complete();
              }
            });
          })
          .catch((err) => {
            subscriber.error(err);
            subscriber.complete();
          });
      }),
    };
  }
}
