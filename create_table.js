var AWS = require('aws-sdk');

AWS.config.update({
    region: "us-west-2",
    endpoint: "http://localhost:8000"
});

var dynamodb = new AWS.DynamoDB();

var barcode_params = {
    TableName : "Barcode",
    AttributeDefinitions: [
        { AttributeName : "id", AttributeType: "N" }, // 제품 아이디
        // { AttributeName : "name", AttributeType: "S" }, // 제품명
        // { AttributeName : "shelf_life", AttributeType: "S" }, // 유통기한
        // { AttributeName : "food_type", AttributeType: "S" }, // 식품 유형
        // { AttributeName : "maker_name", AttributeType: "S" }, // 제조사명
        // { AttributeName : "barcode", AttributeType: "S" } // 바코드
    ],
    KeySchema: [
        { AttributeName : "id", KeyType: "HASH" }
    ],
    ProvisionedThroughput: {       
        ReadCapacityUnits: 10, 
        WriteCapacityUnits: 10
    }
};

var recipe_params = {
    TableName : "Recipe",
    AttributeDefinitions: [
        { AttributeName : "id", AttributeType: "N" },
        // { AttributeName : "name", AttributeType: "S" }, // 메뉴명
        // { AttributeName : "way", AttributeType: "S" }, // 조리방법
        // { AttributeName : "type", AttributeType: "S" }, // 요리종류
        // { AttributeName : "wgt", AttributeType: "S" }, // 중량(1인분)
        // { AttributeName : "eng", AttributeType: "S" }, // 열량
        // { AttributeName : "car", AttributeType: "S" }, // 탄수화물
        // { AttributeName : "pro", AttributeType: "S" }, // 단백질
        // { AttributeName : "fat", AttributeType: "S" }, // 지방
        // { AttributeName : "nat", AttributeType: "S" }, // 나트륨
        // { AttributeName : "hash_tag", AttributeType: "S" }, // 해쉬태그
        // { AttributeName : "image_small", AttributeType: "S" }, // 이미지경로(소)
        // { AttributeName : "image_big", AttributeType: "S" }, // 이미지경로(대)
        // { AttributeName : "ingredients", AttributeType: "S" }, // 재료정보
        // { AttributeName : "MANUAL01", AttributeType: "S" }, // 만드는법_01
        // { AttributeName : "MANUAL_IMG01", AttributeType: "S" }, // 만드는법_이미지_01
        // { AttributeName : "MANUAL02", AttributeType: "S" }, // 만드는법_02
        // { AttributeName : "MANUAL_IMG02", AttributeType: "S" }, // 만드는법_이미지_02
        // { AttributeName : "MANUAL03", AttributeType: "S" }, // 만드는법_03
        // { AttributeName : "MANUAL_IMG03", AttributeType: "S" }, // 만드는법_이미지_03
        // { AttributeName : "MANUAL04", AttributeType: "S" }, // 만드는법_04
        // { AttributeName : "MANUAL_IMG04", AttributeType: "S" }, // 만드는법_이미지_04
        // { AttributeName : "MANUAL05", AttributeType: "S" }, // 만드는법_05
        // { AttributeName : "MANUAL_IMG05", AttributeType: "S" }, // 만드는법_이미지_05
        // { AttributeName : "MANUAL06", AttributeType: "S" }, // 만드는법_06
        // { AttributeName : "MANUAL_IMG06", AttributeType: "S" }, // 만드는법_이미지_06
        // { AttributeName : "MANUAL07", AttributeType: "S" }, // 만드는법_07
        // { AttributeName : "MANUAL_IMG07", AttributeType: "S" }, // 만드는법_이미지_07
        // { AttributeName : "MANUAL08", AttributeType: "S" }, // 만드는법_08
        // { AttributeName : "MANUAL_IMG08", AttributeType: "S" }, // 만드는법_이미지_08
        // { AttributeName : "MANUAL09", AttributeType: "S" }, // 만드는법_09
        // { AttributeName : "MANUAL_IMG09", AttributeType: "S" }, // 만드는법_이미지_09
        // { AttributeName : "MANUAL10", AttributeType: "S" }, // 만드는법_10
        // { AttributeName : "MANUAL_IMG10", AttributeType: "S" }, // 만드는법_이미지_10
        // { AttributeName : "MANUAL11", AttributeType: "S" }, // 만드는법_11
        // { AttributeName : "MANUAL_IMG11", AttributeType: "S" }, // 만드는법_이미지_11
        // { AttributeName : "MANUAL12", AttributeType: "S" }, // 만드는법_12
        // { AttributeName : "MANUAL_IMG12", AttributeType: "S" }, // 만드는법_이미지_12
        // { AttributeName : "MANUAL13", AttributeType: "S" }, // 만드는법_13
        // { AttributeName : "MANUAL_IMG13", AttributeType: "S" }, // 만드는법_이미지_13
        // { AttributeName : "MANUAL14", AttributeType: "S" }, // 만드는법_14
        // { AttributeName : "MANUAL_IMG14", AttributeType: "S" }, // 만드는법_이미지_14
        // { AttributeName : "MANUAL15", AttributeType: "S" }, // 만드는법_15
        // { AttributeName : "MANUAL_IMG15", AttributeType: "S" }, // 만드는법_이미지_15
        // { AttributeName : "MANUAL16", AttributeType: "S" }, // 만드는법_16
        // { AttributeName : "MANUAL_IMG16", AttributeType: "S" }, // 만드는법_이미지_16
        // { AttributeName : "MANUAL17", AttributeType: "S" }, // 만드는법_17
        // { AttributeName : "MANUAL_IMG17", AttributeType: "S" }, // 만드는법_이미지_17
        // { AttributeName : "MANUAL18", AttributeType: "S" }, // 만드는법_18
        // { AttributeName : "MANUAL_IMG18", AttributeType: "S" }, // 만드는법_이미지_18
        // { AttributeName : "MANUAL19", AttributeType: "S" }, // 만드는법_19
        // { AttributeName : "MANUAL_IMG19", AttributeType: "S" }, // 만드는법_이미지_19
        // { AttributeName : "MANUAL20", AttributeType: "S" }, // 만드는법_20
        // { AttributeName : "MANUAL_IMG20", AttributeType: "S" } // 만드는법_이미지_20
    ],
    KeySchema: [
        { AttributeName : "id", KeyType: "HASH" }
    ],
    ProvisionedThroughput: {       
        ReadCapacityUnits: 10, 
        WriteCapacityUnits: 10
    }
}

var user_params = {
    TableName : "User",
    AttributeDefinitions: [
        { AttributeName : "id", AttributeType : "N" }, // 유저 아이디
        // { AttributeName : "name", AttributeType : "S" }, // 유저 이름
        // { AttributeName : "gender", AttributeType : "S" }, // 유저 성별
        // { AttributeName : "age", AttributeType : "N" }, // 유저 나이
        // { AttributeName : "job", AttributeType : "S" } // 유저 직업
    ],
    KeySchema: [
        { AttributeName : "id", KeyType: "HASH" }
    ],
    ProvisionedThroughput: {       
        ReadCapacityUnits: 10, 
        WriteCapacityUnits: 10
    }
};

var food_params = {
    TableName : "Food",
    AttributeDefinitions: [
        { AttributeName : "id", AttributeType : "N" }, // 식품 등록 아이디
        // { AttributeName : "uid", AttributeType : "N" }, // 유저 아이디
        // { AttributeName : "bid", AttributeType : "N" }, // 바코드 아이디
        // { AttributeName : "registerDateTime", AttributeType : "S" } // 등록일자 및 시간
    ],
    KeySchema: [
        { AttributeName : "id", KeyType: "HASH" }
    ],
    ProvisionedThroughput: {       
        ReadCapacityUnits: 10, 
        WriteCapacityUnits: 10
    }
};

dynamodb.createTable(barcode_params, (err, data) => {
    if(err) {
        console.error("Unable to create table. Error JSON: ", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON: ", JSON.stringify(data, null, 2));
    }
});

dynamodb.createTable(recipe_params, (err, data) => {
    if(err) {
        console.error("Unable to create table. Error JSON: ", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON: ", JSON.stringify(data, null, 2));
    }
});

dynamodb.createTable(user_params, (err, data) => {
    if(err) {
        console.error("Unable to create table. Error JSON: ", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON: ", JSON.stringify(data, null, 2));
    }
});

dynamodb.createTable(food_params, (err, data) => {
    if(err) {
        console.error("Unable to create table. Error JSON: ", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON: ", JSON.stringify(data, null, 2));
    }
});