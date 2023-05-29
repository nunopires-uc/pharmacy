import boto3
import json

# Create a Step Functions client using the default session
stepfunctions = boto3.client('stepfunctions', region_name='us-east-1')
state_machine_arn = 'arn:aws:states:us-east-1:079680633834:stateMachine:MyStateMachineReadDynamodb'
input_data = {
    "id": 1,
}

response = stepfunctions.start_execution(
    stateMachineArn=state_machine_arn,
    input=json.dumps(input_data)
)

execution_arn = response['executionArn']

def get_execution_result(execution_arn):
    response = stepfunctions.describe_execution(
        executionArn=execution_arn
    )

    status = response['status']
    if status == 'SUCCEEDED':
        return json.loads(response['output'])
    elif status == 'FAILED' or status == 'TIMED_OUT' or status == 'ABORTED':
        raise Exception(f"State machine execution failed with status: {status}")
    else:
        return None

result = None
while result is None:
    result = get_execution_result(execution_arn)

print(result)