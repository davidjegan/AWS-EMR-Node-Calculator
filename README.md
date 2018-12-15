# AWS Elastic Map Reduce(EMR) Node Calculator - a Serverless way

### Context
In order to ensure parallelism, perfect number of nodes should be chosen in EMR Clusters. This involves a complex look up and referencing. Using this tool, that arduous process is simplified. This tool, returns the exact nodes required for your application to run seemlessly. 


### Cluster Node Calculation Formulae
1. Read the default Mapred-site.xml
2. Get mapreduce.map.memory.mb and yarn.scheduler.maximum-allocation-mb values
3. Number of mappers = maximum allocation memory/mapreduce.map.memory 

i.e., Total Mappers Required = Total Size of Input / Input Split Size 

Numerator = Total Mappers * Time to process Sample files 
Denominator = Instance Mapper Capacity * Desired Processing Time

Estimated number of nodes = Numerator / Denominator



### Pre-Requisite 
1. Get a test Work Load 
2. Number of Sample files should match the number of mappers 
3. RUN an EMR cluster with single core and process the sample file. 
4. The time taken to process is the Processing time


### Services and components
1. DynamoDB : NoSQL database offering of AWS
2. Lambda : A compute solution which can run without deploying servers
3. API Gateway: An Apification service of AWS to invoke the Lambda method 
4. Front-end components: HTML, CSS, JS, Jquery and AJAX 

### Process Flow
1. Get the details of all instances in AWS Compute and store it in a DB
2. Create a Lambda function that refers this DB and returns the contents
3. Create an API endpoint to invoke this lambda method
4. Embed this API in the Front-end code
5. Parse the response and render the contents of the webpage dynamically
6. (Optional) Lambda function can be created to listen to AWS SNS notification of service change, to update the DynamoDB contents on the fly


### Set-up
- DynamoDB => Contains the data of instances
  - Load the [following contents](https://github.com/davidjegan/AWS-EMR-Node-Calculator/blob/master/DynamoDB/type-of-db.csv) into the DynamoDB using the [following script](https://github.com/davidjegan/AWS-EMR-Node-Calculator/blob/master/DynamoDB/dynamodbupdate.py)
- Lambda => To retrieve DB contents
  - Create a [lambda function](https://github.com/davidjegan/AWS-EMR-Node-Calculator/blob/master/Lambda/get-data-from-dynamo.js) in the [AWS console](https://console.aws.amazon.com/lambda/home?region=us-east-1#/create?firstrun=true)
- API Gateway
  - Go to the [API Gateway](https://console.aws.amazon.com/apigateway/home?region=us-east-1#/apis/create)
  - provide a name
  - description 
  - endpoint type. 
  - Create a `GET` method
  - Choose `Lambda Function` as the `Integration type`
  - Turn on the ` Use Lambda Proxy Integration`
  - Provide the region and lambda name created in the previous step
  - Click `OK` when the popup asks you to provide access to Lambda function. 
  - Reference Image: ![API Image](https://github.com/davidjegan/AWS-EMR-Node-Calculator/blob/master/API/API-Gateway.JPG) 
  - Click on `Actions` and `Deploy API`
  - Provide a stage	name and description
  - `Deploy` the API
  - Note the `Invoke URL`, this will be used in the next step. 
- Front-End updation
  - Embed this endpoint in [the code at js file](https://github.com/davidjegan/AWS-EMR-Node-Calculator/blob/69c105ced3760d8ab414cedfadb59b7f337cdc33/Front-end/assets/js/script.js#L104)
  - Run the [html file](https://github.com/davidjegan/AWS-EMR-Node-Calculator/blob/master/Front-end/index.html). Provide the inputs and find the number of nodes at ease! 



### PS

- The number of mappers depends on the number of Hadoop splits 
- If your files are smaller than HDFS or Amazon S3 split size, the number of mappers is equal to the number of files
- If some or all of your files are larger than HDFS or Amazon S3 split size (fs.s3.block.size) the number of mappers is equal to the sum of each file divided by the HDFS/Amazon S3 block size.


# Appendix

### Cluster
_____
![Image of Architecture](https://github.com/davidjegan/AWS-EMR-Node-Calculator/blob/master/Front-end/assets/imgs/cluster.JPG)

### Instance types
_____
![Image of Instance types](https://github.com/davidjegan/AWS-EMR-Node-Calculator/blob/master/Front-end/assets/imgs/instancetypes.JPG)

### Reference

[AWS EMR Mapper Calculation](http://docs.aws.amazon.com/emr/latest/ReleaseGuide/emr-hadoop-task-config.html)