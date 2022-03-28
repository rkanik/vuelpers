const fs = require('fs-extra');
const childProcess = require('child_process');

try {
	fs.removeSync('./lib/');
	childProcess.exec('tsc --build tsconfig.prod.json', (error) => {
		if (error) { console.log(error) }
	});
} catch (err) {
	console.log(err);
}
