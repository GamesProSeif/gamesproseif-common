import { promisify } from 'util';
const wait = promisify(setTimeout);

type PromFunc = (...args: any) => Promise<any>;
type ErrorHandler = void | ((error: Error) => any);

export interface QueueOptions {
	errorHandler?: ErrorHandler;
	timeGap?: number;
}

export class Queue {
	private readonly _errorHandler: ErrorHandler;
	private readonly _timeGap: number;

	private _queue: PromFunc[] = [];
	private _processing = false;
	private _ranCount = 0;
	private readonly _startTime = Date.now();

	public constructor({
		errorHandler = console.error,
		timeGap = 0
	}: QueueOptions = {}) {
		this._errorHandler = errorHandler;
		this._timeGap = timeGap;
	}

	public get length() {
		return this._queue.length;
	}

	public get ranCount() {
		return this._ranCount;
	}

	public get timeTaken() {
		return Date.now() - this._startTime;
	}

	public clear() {
		this._queue = [];
	}

	public async add(...functions: PromFunc[]) {
		for (const func of functions) {
			this._queue.push(func);
		}
		if (!this._processing) await this._process();
	}

	private async _process() {
		this._processing = true;
		const func = this._queue.shift();

		if (func) {
			try {
				await func();
			} catch (error) {
				this._error(error);
			} finally {
				this._ranCount++;
				if (this._timeGap && this.length) await wait(this._timeGap);
				this._process();
			}
		} else {
			this._processing = false;
		}
	}

	private _error(error: Error) {
		if (this._errorHandler) this._errorHandler(error);
		else throw error;
	}
}
