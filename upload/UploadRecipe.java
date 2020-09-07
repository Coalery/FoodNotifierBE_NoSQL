package com.coalery;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import org.sqlite.SQLiteConfig;

import com.amazonaws.AmazonClientException;
import com.amazonaws.AmazonServiceException;
import com.amazonaws.auth.profile.ProfileCredentialsProvider;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import com.amazonaws.services.dynamodbv2.model.DescribeTableRequest;
import com.amazonaws.services.dynamodbv2.model.PutItemRequest;
import com.amazonaws.services.dynamodbv2.model.PutItemResult;
import com.amazonaws.services.dynamodbv2.model.TableDescription;

public class UploadRecipe {

    static AmazonDynamoDB dynamoDB;
    
    static {
    	try {
    		Class.forName("org.sqlite.JDBC");
    	} catch(Exception e) {e.printStackTrace();}
    }

    private static void init() throws Exception {
        ProfileCredentialsProvider credentialsProvider = new ProfileCredentialsProvider();
        try {
            credentialsProvider.getCredentials();
        } catch (Exception e) {
            throw new AmazonClientException("Cannot load the credentials from the credential profiles file.", e);
        }
        dynamoDB = AmazonDynamoDBClientBuilder.standard()
            .withCredentials(credentialsProvider)
            .withRegion("ap-northeast-2")
            .build();
    }

    public static void main(String[] args) throws Exception {
    	long start = System.currentTimeMillis();
    	
    	final String sql = "select * from Recipe";
    	
        SQLiteConfig config = new SQLiteConfig();
        config.setReadOnly(true);
        Connection conn = DriverManager.getConnection("jdbc:sqlite:recipe.db", config.toProperties());
        
        Statement stmt = conn.createStatement();
        ResultSet rs = stmt.executeQuery(sql);
        
        HashMap<String, String> keyMap = new HashMap<String, String>();
        keyMap.put("RCP_SEQ", "id");
        keyMap.put("RCP_NM", "name");
        keyMap.put("RCP_WAY2", "way");
        keyMap.put("RCP_PAT2", "type");
        keyMap.put("INFO_WGT", "wgt");
        keyMap.put("INFO_ENG", "eng");
        keyMap.put("INFO_CAR", "car");
        keyMap.put("INFO_PRO", "pro");
        keyMap.put("INFO_FAT", "fat");
        keyMap.put("INFO_NA", "nat");
        keyMap.put("HASH_TAG", "hash_tag");
        keyMap.put("ATT_FILE_NO_MAIN", "image_small");
        keyMap.put("ATT_MILE_NO_MK", "image_big");
        keyMap.put("RCP_PARTS_DTLS", "ingredients");
        keyMap.put("MANUAL01", "manual01");
        keyMap.put("MANUAL_IMG01", "manual_img01");
        keyMap.put("MANUAL02", "manual02");
        keyMap.put("MANUAL_IMG02", "manual_img02");
        keyMap.put("MANUAL03", "manual03");
        keyMap.put("MANUAL_IMG03", "manual_img03");
        keyMap.put("MANUAL04", "manual04");
        keyMap.put("MANUAL_IMG04", "manual_img04");
        keyMap.put("MANUAL05", "manual05");
        keyMap.put("MANUAL_IMG05", "manual_img05");
        keyMap.put("MANUAL06", "manual06");
        keyMap.put("MANUAL_IMG06", "manual_img06");
        keyMap.put("MANUAL07", "manual07");
        keyMap.put("MANUAL_IMG07", "manual_img07");
        keyMap.put("MANUAL08", "manual08");
        keyMap.put("MANUAL_IMG08", "manual_img08");
        keyMap.put("MANUAL09", "manual09");
        keyMap.put("MANUAL_IMG09", "manual_img09");
        keyMap.put("MANUAL10", "manual10");
        keyMap.put("MANUAL_IMG10", "manual_img10");
        keyMap.put("MANUAL11", "manual11");
        keyMap.put("MANUAL_IMG11", "manual_img11");
        keyMap.put("MANUAL12", "manual12");
        keyMap.put("MANUAL_IMG12", "manual_img12");
        keyMap.put("MANUAL13", "manual13");
        keyMap.put("MANUAL_IMG13", "manual_img13");
        keyMap.put("MANUAL14", "manual14");
        keyMap.put("MANUAL_IMG14", "manual_img14");
        keyMap.put("MANUAL15", "manual15");
        keyMap.put("MANUAL_IMG15", "manual_img15");
        keyMap.put("MANUAL16", "manual16");
        keyMap.put("MANUAL_IMG16", "manual_img16");
        keyMap.put("MANUAL17", "manual17");
        keyMap.put("MANUAL_IMG17", "manual_img17");
        keyMap.put("MANUAL18", "manual18");
        keyMap.put("MANUAL_IMG18", "manual_img18");
        keyMap.put("MANUAL19", "manual19");
        keyMap.put("MANUAL_IMG19", "manual_img19");
        keyMap.put("MANUAL20", "manual20");
        keyMap.put("MANUAL_IMG20", "manual_img20");
        
        init();

        try {
        	int cnt = 0;
            String tableName = "Recipe";

            // Describe our new table
            DescribeTableRequest describeTableRequest = new DescribeTableRequest().withTableName(tableName);
            TableDescription tableDescription = dynamoDB.describeTable(describeTableRequest).getTable();
            System.out.println("Table Description: " + tableDescription);

            // Add items
            while(rs.next()) {
            	HashMap<String, String> valueMap = new HashMap<String, String>();
            	Iterator<String> it = keyMap.keySet().iterator();
            	
            	while(it.hasNext()) {
            		String rawKey = it.next();
            		valueMap.put(rawKey, rs.getString(rawKey));
            	}
            	
            	Map<String, AttributeValue> item = newItem(keyMap, valueMap);
	            PutItemRequest putItemRequest = new PutItemRequest(tableName, item);
	            PutItemResult putItemResult = dynamoDB.putItem(putItemRequest);
	            
	            cnt++;
	            System.out.printf("Progress : %.3f%%\t\t", (cnt / 1237.0) * 100);
	            System.out.println("Result: " + putItemResult);
            }
            
        } catch (AmazonServiceException ase) {
            System.out.println("Caught an AmazonServiceException, which means your request made it "
                    + "to AWS, but was rejected with an error response for some reason.");
            System.out.println("Error Message:    " + ase.getMessage());
            System.out.println("HTTP Status Code: " + ase.getStatusCode());
            System.out.println("AWS Error Code:   " + ase.getErrorCode());
            System.out.println("Error Type:       " + ase.getErrorType());
            System.out.println("Request ID:       " + ase.getRequestId());
        } catch (AmazonClientException ace) {
            System.out.println("Caught an AmazonClientException, which means the client encountered "
                    + "a serious internal problem while trying to communicate with AWS, "
                    + "such as not being able to access the network.");
            System.out.println("Error Message: " + ace.getMessage());
        }
        
        rs.close();
        stmt.close();
        conn.close();
        
        long end = System.currentTimeMillis();
        
        System.out.println("Processing Time : " + ((end - start) / 1000.0) + "s");
    }
    
    private static Map<String, AttributeValue> newItem(HashMap<String, String> keyMap, HashMap<String, String> valueMap) {
        Map<String, AttributeValue> item = new HashMap<String, AttributeValue>();
        Iterator<String> it = keyMap.keySet().iterator();
        
        while(it.hasNext()) {
        	String rawKey = it.next();
        	String key = keyMap.get(rawKey);
        	String value = valueMap.get(rawKey);
        	item.put(key, new AttributeValue(value));
        }
        return item;
    }

}
