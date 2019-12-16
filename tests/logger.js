const { generateLogger } = require('../dist');

const logger = generateLogger({
	label: 'TEST'
});

logger.info('Hello World', { topic: 'TEST' });
