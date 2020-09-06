package com.coalery;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.HashMap;
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

public class UploadBarcode {

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
    	
    	final String sql = "select * from Food";
    	
        SQLiteConfig config = new SQLiteConfig();
        config.setReadOnly(true);
        Connection conn = DriverManager.getConnection("jdbc:sqlite:data.db", config.toProperties());
        
        Statement stmt = conn.createStatement();
        ResultSet rs = stmt.executeQuery(sql);
        
        init();

        try {
        	int cnt = 0;
            String tableName = "Barcode";

            // Describe our new table
            DescribeTableRequest describeTableRequest = new DescribeTableRequest().withTableName(tableName);
            TableDescription tableDescription = dynamoDB.describeTable(describeTableRequest).getTable();
            System.out.println("Table Description: " + tableDescription);

            // Add items
            while(rs.next()) {
            	String id = rs.getString("PRDLST_REPORT_NO");
            	String name = rs.getString("PRDLST_NM");
            	String shelf_life = rs.getString("POG_DAYCNT");
            	String food_type = rs.getString("PRDLST_DCNM");
            	String maker_name = rs.getString("BSSH_NM");
            	String barcode = rs.getString("BAR_CD");
            	
            	Map<String, AttributeValue> item = newItem(id, name, shelf_life, food_type, maker_name, barcode);
	            PutItemRequest putItemRequest = new PutItemRequest(tableName, item);
	            PutItemResult putItemResult = dynamoDB.putItem(putItemRequest);
	            
	            cnt++;
	            System.out.printf("Progress : %.3f%%\t\t", (cnt / 100417.0) * 100);
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
    
    private static Map<String, AttributeValue> newItem(String id, String name, String shelf_life, String food_type, String maker_name, String barcode) {
        Map<String, AttributeValue> item = new HashMap<String, AttributeValue>();
        item.put("id", new AttributeValue(id));;
        item.put("name", new AttributeValue(name));
        item.put("shelf_life", new AttributeValue(shelf_life));
        item.put("food_type", new AttributeValue(food_type));
        item.put("maker_name", new AttributeValue(maker_name));
        item.put("barcode", new AttributeValue(barcode));
        return item;
    }

}
