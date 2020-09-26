const child_process = require('child_process');

exports.recommend = function(callback) {
    child_process.exec('python3 recommendation.py', (err, stdout, stderr) => {
        callback(stdout);
    });
}
