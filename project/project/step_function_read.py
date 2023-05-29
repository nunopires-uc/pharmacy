import boto3

def lambda_handler(event: any, context: any):
    id = event['id']
    visit_count: str = ""
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('medicamentos')
    
    response = table.query(
        KeyConditionExpression=boto3.dynamodb.conditions.Key('id').eq(id)
    )
    
    if "Items" in response and len(response["Items"]) > 0:
        visit_count = response["Items"][0]["Nome"]
        if (visit_count[-1].isdigit()):
            count = int(visit_count[-1]) + 1
        else:
            visit_count += "0"

    message = "Hello" + str(id) + "! You have visited this page " + str(visit_count) + " times."
    return {
        "message": message
    }

if __name__ == '__main__':
    event = {"id": 1}
    print(lambda_handler(event, None))
