const recommendation = require('./run_recommendation_py.js');

recommendation.recommend(1, (data) => {
    console.log(data);
});
