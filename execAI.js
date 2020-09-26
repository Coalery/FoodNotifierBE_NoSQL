const child_process = require('child_process');

exports.exec = function() {
    child_process.exec('ls -al', (err, stdout, stderr) => {
        if(err) {
            console.error(err);
        } else {
            console.log(`stdout: ${stdout}`);
        }
    });
}
