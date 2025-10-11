import * as pty from '@lydell/node-pty';
import os from 'os';
import { Socket } from 'socket.io';
import { IPty } from '@lydell/node-pty';


export class PTYService {
    private socket: Socket;
    private shell: string;
    private terminal: IPty | null = null;

    constructor(socket: Socket) {
        this.socket = socket;
        this.shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';
        this.createPTY();
    }

    private createPTY() {
        this.terminal = pty.spawn(this.shell, [], {
            cols: 100,
            rows: 30,
            name: 'xterm-256color',
            cwd: "/workspace",
            env: process.env as Record<string, string>,
        });

        this.terminal.onData((data: string) => {
            this.socket.emit('terminal-result', { result: data });
        });
    }

    public getTerminal(): IPty | null {
        return this.terminal;
    }

    public writeTerminal(data: string) {
        const command = os.platform() === 'win32' ? data.replace(/\n/g, '\r') : data;
        this.terminal?.write(command);
    }

}
