import boto3
import csv
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('my-DB')

digi_lst = []
with open('type-of-db.csv') as csvfile:
    readCSV = csv.reader(csvfile, delimiter=',')
    for row in readCSV:
        instance = row[0].lower()
        mem = row[1].lower()
        maxalloc = row[2].lower()
        mappervalue = row[3].lower()
        typeid = row[4].lower()
        typeofinstance = row[5].lower()
        snoid = row[6].lower()
        print('_____________________')
        table.put_item(Item={'id': str(snoid),'instance': str(instance), \
            'typeid': str(typeid), 'memory': str(mem), \
            'maxallocationinmb': str(maxalloc),'typeofinstance': str(typeofinstance), \
            'mappervalue': str(mappervalue)})