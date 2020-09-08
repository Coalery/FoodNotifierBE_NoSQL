const AWS = require('aws-sdk');
const express = require('express');
const bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded({extended : false}));

AWS.config.update({
  region: 'ap-northeast-2',
  endpoint: 'https://dynamodb.ap-northeast-2.amazonaws.com'
});

const RecipeTable = 'Recipe';
const BarcodeTable = 'Barcode';
const UserTable = 'User';
const FoodTable = 'Food';

var docClient = new AWS.DynamoDB.DocumentClient();

app.get('/', (request, response) => {
    response.send('Hmmm');
})

// ----------------------------------
//               GET
// ----------------------------------

// ----------------------------------
//                POST
// ----------------------------------

// ----------------------------------
//           ERROR PROCESS
// ----------------------------------

// ----------------------------------
//            SERVER START
// ----------------------------------

app.listen(3000, () => console.log('Server On Successfully.'));

// var table = "Recipe";

// var id = "102";

// var params = {
//     TableName: table,
//     Key:{
//         "id": id
//     }
// };

// docClient.get(params, function(err, data) {
//     if (err) {
//         console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
//     } else {
//         console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
//     }
// });