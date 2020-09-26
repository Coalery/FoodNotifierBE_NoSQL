const recommendation = require('./run_recommendation_py.js');

recommendation.recommend((data) => {
    console.log(data);
});
