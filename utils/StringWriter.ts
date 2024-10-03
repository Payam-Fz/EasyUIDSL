import { Writable } from 'stream';

export class StringWriter extends Writable {
    private buffer: string;

    constructor(startingString: string = "") {
        super();
        this.buffer = startingString;
    }

    _write(chunk: any, encoding: string, callback: (error?: Error | null) => void): void {
        this.buffer += chunk.toString();
        callback();
    }

    toString(): string {
        return this.buffer;
    }
}