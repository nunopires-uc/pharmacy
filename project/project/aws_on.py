import boto3
dynamodb = boto3.resource('dynamodb')
print(list(dynamodb.tables.all()))

'''
This is working
table = dynamodb.create_table(
    TableName = 'medicamentos',
    KeySchema = [
        {
            'AttributeName': 'id',
            'KeyType': 'HASH'
        },
        {
            'AttributeName': 'Nome',
            'KeyType': 'RANGE'
        },
    ],
    AttributeDefinitions = [
        {
            'AttributeName': 'id',
            'AttributeType': 'N'
        },
        {
            'AttributeName': 'Nome',
            'AttributeType': 'S'
        }
    ],
    ProvisionedThroughput = {
        'ReadCapacityUnits': 1,
        'WriteCapacityUnits': 1
    }

);
'''
'''
A funcionar
table = dynamodb.Table('medicamentos')
table.put_item(
    Item = {
        'id': 1,
        'Nome': 'Dipirona',
    }
)
'''
table = dynamodb.Table('medicamentos')
resp = table.scan()
print(resp['Items'])

print("------------------")
from boto3.dynamodb.conditions import Key
tq = table.query(
    KeyConditionExpression=Key('id').eq(1)
)
print(tq['Items'])