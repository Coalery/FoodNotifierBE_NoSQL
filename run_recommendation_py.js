const child_process = require('child_process');

exports.recommend = function(user_id, callback) {
    child_process.exec(`python3 recommendation.py ${user_id}`, (err, stdout, stderr) => {
        callback(stdout);
    });
}
