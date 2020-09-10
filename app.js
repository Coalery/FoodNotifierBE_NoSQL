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

app.get('/barcode/:barcode', (request, response) => {
    var params = {
        TableName: BarcodeTable,
        FilterExpression: "#barcode = :barcode",
        ExpressionAttributeNames:{
            "#barcode": "barcode",
        },
        ExpressionAttributeValues: {
            ":barcode": request.params.barcode,
        }
    };

    result = '';
    docClient.scan(params, onScan);

    function onScan(err, data) {
        if (!err) {
            data.Items.forEach((itemdata) => {
                result = JSON.stringify(itemdata); // Just One Item
            });
            
            if(typeof data.LastEvaluatedKey != "undefined") {
                params.ExclusiveStartKey = data.LastEvaluatedKey;
                docClient.scan(params, onScan);
            } else {
                response.send(result);
            }
        }
    }
})

// https://stackoverflow.com/questions/44589967/how-to-fetch-scan-all-items-from-aws-dynamodb-using-node-js

// ----------------------------------
//                POST
// ----------------------------------

// ----------------------------------
//           ERROR PROCESS
// ----------------------------------

app.use((request, response, next) => {
    response.status(404).send('Not Found');
});

// app.use((err, request, response, next) => {
//    response.status(500).send('Error occurred.');
// });

// ----------------------------------
//            SERVER START
// ----------------------------------

app.listen(3000, () => console.log('Server On Successfully!'));

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
