const AWS = require('aws-sdk');
const sqlite3 = require('sqlite3').verbose();

let data = new sqlite3.Database('./db/data.db');
let recipe = new sqlite3.Database('./db/recipe.db');

let dataSql = `select * from Food`;
let recipeSql = `select * from Recipe`;

data.all(dataSql, [], (err, rows) => {
    if(err) {
        throw err;
    }
    rows.forEach((row) => {
        var id = row.PRDLST_REPORT_NO;
        var name = row.PRDLST_NM;
        var shelf_life = row.POG_DAYCNT;
        var food_type = row.PRDLST_DCNM;
        var maker_name = row.BSSH_NM;
        var barcode = row.BAR_CD;
    });
});

recipe.all(recipeSql, [], (err, rows) => {
    if(err) {
        throw err;
    }
    rows.forEach((row) => {
        var id = row.RCP_SEQ;
        var name = row.RCP_NM;
        var way = row.RCP_WAY2;
        var type = row.RCP_PAT2;
        var wgt = row.INFO_WGT;
        var eng = row.INFO_ENG;
        var car = row.INFO_CAR;
        var pro = row.INFO_PRO;
        var fat = row.INFO_FAT;
        var nat = row.INFO_NA;
        var hash_tag = row.HASH_TAG;
        var image_small = row.ATT_FILE_NO_MAIN;
        var image_big = row.ATT_MILE_NO_MK;
        var ingredients = row.RCP_PARTS_DTLS;
        var manual01 = row.MANUAL01;
        var manual_img01 = row.MANUAL_IMG01;
        var manual02 = row.MANUAL02;
        var manual_img02 = row.MANUAL_IMG02;
        var manual03 = row.MANUAL03;
        var manual_img03 = row.MANUAL_IMG03;
        var manual04 = row.MANUAL04;
        var manual_img04 = row.MANUAL_IMG04;
        var manual05 = row.MANUAL05;
        var manual_img05 = row.MANUAL_IMG05;
        var manual06 = row.MANUAL06;
        var manual_img06 = row.MANUAL_IMG06;
        var manual07 = row.MANUAL07;
        var manual_img07 = row.MANUAL_IMG07;
        var manual08 = row.MANUAL08;
        var manual_img08 = row.MANUAL_IMG08;
        var manual09 = row.MANUAL09;
        var manual_img09 = row.MANUAL_IMG09;
        var manual10 = row.MANUAL10;
        var manual_img10 = row.MANUAL_IMG10;
        var manual11 = row.MANUAL11;
        var manual_img11 = row.MANUAL_IMG11;
        var manual12 = row.MANUAL12;
        var manual_img12 = row.MANUAL_IMG12;
        var manual13 = row.MANUAL13;
        var manual_img13 = row.MANUAL_IMG13;
        var manual14 = row.MANUAL14;
        var manual_img14 = row.MANUAL_IMG14;
        var manual15 = row.MANUAL15;
        var manual_img15 = row.MANUAL_IMG15;
        var manual16 = row.MANUAL16;
        var manual_img16 = row.MANUAL_IMG16;
        var manual17 = row.MANUAL17;
        var manual_img17 = row.MANUAL_IMG17;
        var manual18 = row.MANUAL18;
        var manual_img18 = row.MANUAL_IMG18;
        var manual19 = row.MANUAL19;
        var manual_img19 = row.MANUAL_IMG19;
        var manual20 = row.MANUAL20;
        var manual_img20 = row.MANUAL_IMG20;
    });
});