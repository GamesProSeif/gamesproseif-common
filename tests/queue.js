const { Queue } = require('../dist');

const queue = new Queue({ timeGap: 0 });

let i = 0;

const func = () => {
	return new Promise((res, rej) => {
		setTimeout(() => {
			i++;
			if (i === 2) return rej('error');
			console.log('works', i);
			console.log(queue.timeTaken);
			res();
		}, 3000);
	});
}

queue.add(func, func, func);

// setTimeout(() => queue.clear(), 5e3);
