const fs = require('fs');
const AWS = require('aws-sdk');
const express = require('express');
const bodyParser = require('body-parser');

var app = express();

var nextUID = -1;
var nextFID = -1;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

AWS.config.update({
  region: 'ap-northeast-2',
  endpoint: 'https://dynamodb.ap-northeast-2.amazonaws.com'
});

fs.readFile('ids', 'utf8', (err, data) => {
    var obj = JSON.parse(data);
    nextUID = obj.uid;
    nextFID = obj.fid;
});

const RecipeTable = 'Recipe';
const BarcodeTable = 'Barcode';
const UserTable = 'User';
const FoodTable = 'Food';

var docClient = new AWS.DynamoDB.DocumentClient();

app.get('/', (request, response) => {
    response.send('Hmmm');
})

function saveIDJson() {
    var obj = {uid: nextUID, fid: nextFID};
    var json = JSON.stringify(obj);
    console.log(obj, json);
    fs.writeFile('ids', json, 'utf8', (err) => {});
}

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

    docClient.scan(params, onScan);
    var found = false;

    function onScan(err, data) {
        if(found) return;
        if(!err) {
            data.Items.forEach((itemdata) => {
                response.send(JSON.stringify(itemdata)); // Just One Item
                found = true;
                return;
            });
            if(typeof data.LastEvaluatedKey != "undefined") {
                params.ExclusiveStartKey = data.LastEvaluatedKey;
                docClient.scan(params, onScan);
            } else {
                if(found) return;
                response.send(result);
            }
        }
    }
})

app.get('/barcodeid/:bid', (request, response) => {
    var params = {
        TableName: BarcodeTable,
        FilterExpression: "#bid = :bid",
        ExpressionAttributeNames:{
              "#bid": "id"
        },
        ExpressionAttributeValues: {
              ":bid": request.params.bid
        }
    };

    result = [];
    docClient.scan(params, onScan);

    function onScan(err, data) {
        if (!err) {
            data.Items.forEach((itemdata) => {
                result.push(itemdata);
            });

            if(typeof data.LastEvaluatedKey != "undefined") {
                params.ExclusiveStartKey = data.LastEvaluatedKey;
                docClient.scan(params, onScan);
            } else { // End Scan
                if(result.length == 0) {
                    response.send('{}');
                } else {
                    response.send(JSON.stringify(result[0]));
                }
            }
        }
    }
})

app.get('/recipe/:recipe', (request, response) => {
    var params = {
        TableName: RecipeTable,
        FilterExpression: "contains(#recipe, :recipe)",
        ExpressionAttributeNames:{
              "#recipe": "ingredients"
        },
        ExpressionAttributeValues: {
              ":recipe": request.params.recipe
        }
    };

    result = [];
    docClient.scan(params, onScan);

    function onScan(err, data) {
        if (!err) {
            data.Items.forEach((itemdata) => {
                result.push(itemdata);
            });

            if(typeof data.LastEvaluatedKey != "undefined") {
                params.ExclusiveStartKey = data.LastEvaluatedKey;
                docClient.scan(params, onScan);
            } else {
                response.send(JSON.stringify({"result" : result}));
            }
        }
    }
})

app.get('/user/:uid', (request, response) => {
    console.log('Get user request:', request.params.uid);

    var params = {
        TableName: UserTable,
        Key: {
            "id": request.params.uid
        }
    };

    docClient.get(params, (err, data) => {
        var message = '';
        if(err) {
            message = JSON.stringify({"status" : "error", "info" : err});
        } else {
            message = JSON.stringify({"status" : "success", "info" : data.Item});
        }
        console.log(message);
        response.send(message);
    });
})

app.get('/userinfo', (request, response) => {
    var params = {
        TableName: UserTable,
        FilterExpression: "#name = :name and #age = :age and #gender = :gender and #job = :job",
        ExpressionAttributeNames:{
            "#name": "name",
            "#age": "age",
            "#gender": "gender",
            "#job": "job"
        },
        ExpressionAttributeValues: {
            ":name": request.query.name,
            ":age": Number(request.query.age),
            ":gender": request.query.gender,
            ":job": request.query.job
        }
    };

    docClient.scan(params, onScan);
    var found = false;

    function onScan(err, data) {
        if(found) return;
        if(!err) {
            data.Items.forEach((itemdata) => {
                response.send(JSON.stringify({"status" : true, "info" : itemdata})); // Just One Item
                found = true;
                return;
            });
            if(typeof data.LastEvaluatedKey != "undefined") {
                params.ExclusiveStartKey = data.LastEvaluatedKey;
                docClient.scan(params, onScan);
            } else {
                if(found) return;
                response.send(JSON.stringify({"status" : false}));
            }
        }
    }
})

app.get('/outofdatefoods/:uid', (request, response) => {
    var params = {
        TableName: FoodTable,
        FilterExpression: "#uid = :uid",
        ExpressionAttributeNames:{
            "#uid": "uid",
        },
        ExpressionAttributeValues: {
            ":uid": request.params.uid,
        }
    };

    result = [];
    docClient.scan(params, onScan);

    function onScan(err, data) {
        if (!err) {
            data.Items.forEach((itemdata) => {
                result.push(itemdata);
            });

            if(typeof data.LastEvaluatedKey != "undefined") {
                params.ExclusiveStartKey = data.LastEvaluatedKey;
                docClient.scan(params, onScan);
            } else {
                response.send(JSON.stringify({"result" : result}));
            }
        }
    }
})

// ----------------------------------
//                POST
// ----------------------------------

app.post('/adduser', (request, response) => {
    var params = {
        TableName: UserTable,
        Item: {
            id: String(nextUID),
            name: request.body.name,
            age: Number(request.body.age),
            gender: request.body.gender,
            job: request.body.job
        }
    };
    docClient.put(params, (err, data) => {
        var message = '';
        if(err) {
            message = JSON.stringify({"status" : "error", "info" : err});
        } else {
            message = JSON.stringify({"status" : "success", "uid" : String(nextUID),  "info" : data});
            nextUID = nextUID + 1;
            saveIDJson();
        }
        console.log(message);
        response.send(message);
    });
})

app.post('/addfood', (request, response) => {
    var params = {
        TableName: FoodTable,
        Item: {
            id: String(nextFID),
            uid: request.body.uid,
            bid: request.body.fid,
            registerDateTime: request.body.registerDateTime
        }
    }
    docClient.put(params, (err, data) => {
        var message = '';
        if(err) {
            message = JSON.stringify({"status" : "error", "info" : err});
        } else {
            message = JSON.stringify({"status" : "success", "fid" : String(nextFID),  "info" : data}); // TODO
            nextFID = nextFID + 1;
            saveIDJson();
        }
        console.log(message);
        response.send(message);
    });
})

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
