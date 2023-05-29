from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.views import APIView
#from . models import Todo
from rest_framework.response import Response
#from . serializer import TodoSerializer
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse
from app.serializer import MyTokenObtainPairSerializer, RegisterSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from .models import Historico, Medicamentos
from .models import Medicamento
from .serializer import EstadoPagoSerializer, InserirReceitaPagoSerializer, ReceitaSerializer, ResponseModelSerializer
from .serializer import DummyDataSerializer
from .serializer import MedicamentoModelSerializer
import json
from decimal import Decimal
import boto3

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/token/',
        '/api/register',
        '/api/token/refresh/',
    ]
    return Response(routes)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def testEndPoint(request):
    if request.method == 'GET':
        data = f"Congratulation {request.user}, your API just responded to GET request"
        return Response({'response': data}, status=status.HTTP_200_OK)
    elif request.method == 'POST':
        text = request.POST.get('text')
        data = f"Congratulation {request.user}, your API just responded to POST request with text: {text}"
        return Response({'response': data}, status=status.HTTP_200_OK)
    
    return Response({'response': 'Something went wrong'}, status.HTTP_400_BAD_REQUEST)

class DummyDataView(APIView):
    serializer_class = DummyDataSerializer

    def get(self, request, *args, **kwargs):
        dummy_data = {
            "id": 1,
            "Nome": "Dipirona"
        }
        serializer = self.serializer_class(dummy_data)
        return Response(serializer.data)

    
from rest_framework import generics
from rest_framework.response import Response

class ResponseView(generics.GenericAPIView):
    def get(self, request, *args, **kwargs):
        import boto3
        import json
        import time

        # Create a Step Functions client using the default session
        stepfunctions = boto3.client('stepfunctions', region_name='us-east-1')
        state_machine_arn = 'arn:aws:states:us-east-1:079680633834:stateMachine:MyStateMachineReadDynamodb'
        input_data = {"id": 1}

        response = stepfunctions.start_execution(
            stateMachineArn=state_machine_arn,
            input=json.dumps(input_data)
        )

        execution_arn = response['executionArn']

        def get_execution_result(execution_arn):
            response = stepfunctions.describe_execution(executionArn=execution_arn)
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
            time.sleep(2)

        # (Your existing code for executing the Step Function and retrieving the result remains unchanged)

        # Extract the 'Nome' value from the 'DynamoDB' key
        nome = result['DynamoDB']['Nome']

        # Deserialize the result into a Medicamentos instance
        medicamento = Medicamentos(id=result['id'], Nome=nome)

        # Serialize the Medicamentos instance using the ResponseModelSerializer
        serializer = ResponseModelSerializer(medicamento)

        # Return the serialized data as a response
        return Response(serializer.data)
    

class MedicamentoView(generics.GenericAPIView):
    queryset = Medicamento.objects.all()
    serializer_class = MedicamentoModelSerializer
    def get(self, request, *args, **kwargs):
        import boto3
        import json
        import time

        # Create a Step Functions client using the default session
        stepfunctions = boto3.client('stepfunctions', region_name='us-east-1')
        state_machine_arn = 'arn:aws:states:us-east-1:079680633834:stateMachine:myDataStateMachine'
        
        step_function_response = stepfunctions.start_execution(
            stateMachineArn=state_machine_arn
        )

        # Wait for the execution to complete
        execution_arn = step_function_response['executionArn']
        execution_result = stepfunctions.describe_execution(
            executionArn=execution_arn
        )

        while execution_result['status'] == 'RUNNING':
            time.sleep(1)
            execution_result = stepfunctions.describe_execution(
                executionArn=execution_arn
            )

        combined_results = json.loads(execution_result['output'])

        # Add 'image' key to each result and filter by URL object key
        filtered_results = []
        for result in combined_results['MyDBRet']['entries']:
            result['image'] = f"{result['id']}.png"
            urls_data = json.loads(combined_results['MyRetrieveFunction']['body'])
            for url in urls_data['urls']:

                if url['key'].rstrip('.png') == str(result['id']):
                    result['imagem'] = url['url']
                    filtered_results.append(result)
                    break

        # Serialize the filtered results using MedicamentoModelSerializer
        serializer = MedicamentoModelSerializer(filtered_results, many=True)

        print(serializer.data)

        # Return the serialized results as a JSON response
        return Response(serializer.data)
    

from django.http import JsonResponse
import boto3
import json
import time

class ReceitaView(generics.GenericAPIView):
    serializer_class = ReceitaSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return JsonResponse(serializer.errors, status=400)

        validated_data = serializer.validated_data
        payload_json = json.dumps(validated_data)

        stepfunctions = boto3.client('stepfunctions', region_name='us-east-1')
        state_machine_arn = 'arn:aws:states:us-east-1:079680633834:stateMachine:myDataStateMachine'

        step_function_response = stepfunctions.start_execution(
            stateMachineArn=state_machine_arn,
            input=payload_json
        )

        execution_arn = step_function_response['executionArn']

        while True:
            execution_result = stepfunctions.describe_execution(
                executionArn=execution_arn
            )
            status = execution_result['status']
            
            if status == 'RUNNING':
                time.sleep(1)
            elif status == 'SUCCEEDED':
                output = execution_result['output']
                lambda_result = json.loads(output)
                print(lambda_result)
                return JsonResponse({'result': lambda_result})
            else:
                return JsonResponse({'error': f"Step Functions execution failed with status: {status}"}, status=500)


'''
import json
import boto3

class ReceitaView(generics.GenericAPIView):
    serializer_class = ReceitaSerializer
    

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print(serializer.errors)
        print("ola")
        if serializer.is_valid():
            # Access the deserialized data
            print("ola1")
            validated_data = serializer.validated_data
            print("ola2")

            # Convert the validated data to a JSON string
            payload_json = json.dumps(validated_data)

            print("ola3")

            # Invoke the Lambda function
            lambda_client = boto3.client('lambda')
            lambda_response = lambda_client.invoke(
                FunctionName='arn:aws:lambda:us-east-1:079680633834:function:myGetFromPrescription',
                Payload=payload_json
            )

            print("ola4")

            # Retrieve the result from the Lambda function
            lambda_result = lambda_response['Payload'].read().decode('utf-8')
            lambda_result = json.loads(lambda_result)

            print("ola5")

            # Process the lambda_result if needed
            # ...
            print(lambda_result)

            # Return the result as a JSON response
            return JsonResponse({'result': lambda_result})
        else:
            # Return an error response if the data is invalid
            return JsonResponse(serializer.errors, status=400)
'''
'''
import json
import boto3
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

class MyGetFromHistoricoView(generics.GenericAPIView):
    serializer_class = InserirReceitaPagoSerializer
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        if serializer.is_valid():
            # Access the deserialized data
            validated_data = serializer.validated_data

            # Invoke the Lambda function
            lambda_client = boto3.client('lambda')
            lambda_response = lambda_client.invoke(
                FunctionName='arn:aws:lambda:us-east-1:079680633834:function:myGetFromHistorico',
                Payload=json.dumps(validated_data)
            )

            # Retrieve the result from the Lambda function
            lambda_result = json.loads(lambda_response['Payload'].read().decode('utf-8'))
            print(lambda_result)

            # Process the lambda_result if needed
            # ...
            return Response(lambda_result)
        else:
            # Return an error response if the data is invalid
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
'''
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

class MyGetFromHistoricoView(APIView):
    def get(self, request, *args, **kwargs):
        # Invoke the Lambda function
        lambda_client = boto3.client('lambda')
        lambda_response = lambda_client.invoke(
            FunctionName='arn:aws:lambda:us-east-1:079680633834:function:myGetFromHistorico',
            Payload=json.dumps({})
        )

        # Retrieve the result from the Lambda function
        lambda_result = json.loads(lambda_response['Payload'].read().decode('utf-8'))
        print(lambda_result)

        # Process the lambda_result if needed
        # ...
        return Response(lambda_result)
'''
class ReceitaView(generics.GenericAPIView):
    serializer_class = ReceitaSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            # Access the deserialized data
            validated_data = serializer.validated_data
            id_receita = validated_data['idReceita']
            med_list = validated_data['medList']
            user_name = validated_data['userName']
            user_id = validated_data['userID']
            
            # Perform desired operations with the data
            print(validated_data)
            
            # Return a response if needed
            return Response({"message": "Data received successfully."})
        else:
            # Return an error response if the data is invalid
            return Response(serializer.errors, status=400)
'''
'''
from django.http import JsonResponse
import json
import boto3

class ReceitaView(generics.GenericAPIView):
    serializer_class = ReceitaSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            # Access the deserialized data
            validated_data = serializer.validated_data
            id_receita = validated_data['idReceita']
            med_list = validated_data['medList']
            user_name = validated_data['userName']
            user_id = validated_data['userID']

            # Construct the data to send to the Lambda function
            lambda_payload = {
                'idReceita': id_receita,
                'medList': med_list,
                'userName': user_name,
                'userID': user_id
            }

            # Invoke the Lambda function
            lambda_client = boto3.client('lambda')
            lambda_response = lambda_client.invoke(
                FunctionName='arn:aws:lambda:us-east-1:079680633834:function:myGetFromPrescription',
                Payload=json.dumps(lambda_payload)
            )

            # Retrieve the result from the Lambda function
            lambda_result = lambda_response['Payload'].read().decode('utf-8')
            lambda_result = json.loads(lambda_result)

            # Process the lambda_result if needed
            # ...

            # Return the result as a JSON response
            return JsonResponse({'result': lambda_result})
        else:
            # Return an error response if the data is invalid
            return JsonResponse(serializer.errors, status=400)
'''

'''
        def get_execution_result(execution_arn):
            response = stepfunctions.describe_execution(executionArn=execution_arn)
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
            time.sleep(2)

        # (Your existing code for executing the Step Function and retrieving the result remains unchanged)

        # Extract the 'Nome' value from the 'DynamoDB' key
        nome = result['DynamoDB']['Nome']

        # Deserialize the result into a Medicamentos instance
        medicamento = Medicamentos(id=result['id'], Nome=nome)

        # Serialize the Medicamentos instance using the ResponseModelSerializer
        serializer = ResponseModelSerializer(medicamento)

        # Return the serialized data as a response
        return Response(serializer.data)
    
        '''
    




'''
def serve_react(request):
    return render(request, 'static/index.html')
'''

# Create your views here.
'''
class TodoView(viewsets.ModelViewSet):
    serializer_class = TodoSerializer
    queryset = Todo.objects.all()
'''

'''
class ReactView(APIView):
    def get(self, request):
        output = [{"employee": output.employee, "department": output.department} 
                  for output in React.objects.all()]
        return Response(output)
    
    def post(self, request):
        serializer = ReactSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)
            '''
import json
from decimal import Decimal
from collections import OrderedDict

class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return str(obj)
        elif isinstance(obj, float):
            return str(obj)
        return super(DecimalEncoder, self).default(obj)



def ordered_dict_to_dict(obj):
    if isinstance(obj, OrderedDict):
        return {k: ordered_dict_to_dict(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [ordered_dict_to_dict(v) for v in obj]
    elif isinstance(obj, float):
        return Decimal(obj)
    elif isinstance(obj, dict):
        return {k: ordered_dict_to_dict(v) for k, v in obj.items()}
    else:
        return obj

def convert_values_to_strings(obj):
    if isinstance(obj, dict):
        for key, value in obj.items():
            obj[key] = convert_values_to_strings(value)
    elif isinstance(obj, list):
        for idx, value in enumerate(obj):
            obj[idx] = convert_values_to_strings(value)
    elif isinstance(obj, (int, float, bool)):
        return str(obj)

    return obj




class InserirReceitaPagoView(generics.GenericAPIView):
    serializer_class = InserirReceitaPagoSerializer

    print("ola1")
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print(serializer.errors)
            return JsonResponse(serializer.errors, status=400)

        validated_data = serializer.validated_data
        validated_data['prescTotal'] = str(validated_data['prescTotal'])
        
        validated_data = convert_values_to_strings(validated_data)
        validated_data['idReceita'] = int(validated_data['idReceita'])
        print(validated_data)
        


        print("ola2")
        regular_dict = ordered_dict_to_dict(validated_data)
        #validated_data.replace("'", '"')
        #print(validated_data)
        #payload_json = json.dumps(regular_dict, cls=DecimalEncoder)
        payload_json = json.dumps(validated_data, cls=DecimalEncoder)
        print(payload_json)


        stepfunctions = boto3.client('stepfunctions', region_name='us-east-1')
        state_machine_arn = 'arn:aws:states:us-east-1:079680633834:stateMachine:mFRobotSuc'

        print("ola3")
        step_function_response = stepfunctions.start_execution(
            stateMachineArn=state_machine_arn,
            input=payload_json
        )

        print("ola4")
        execution_arn = step_function_response['executionArn']

        print("ola5")

        while True:
            execution_result = stepfunctions.describe_execution(
                executionArn=execution_arn
            )
            status = execution_result['status']
            
            if status == 'RUNNING':
                time.sleep(1)
            elif status == 'SUCCEEDED':
                print("ola6")
                output = execution_result['output']
                lambda_result = json.loads(output)
                print(lambda_result)
                print("ola7")
                historico = Historico(
                    idReceita=validated_data['idReceita'],
                    userName=validated_data['userName'],
                    userID=validated_data['userID'],
                    prescTotal=validated_data['prescTotal'],
                    medList=validated_data['medList'],
                    pago=validated_data['pago']
                )
                historico.save()
                return JsonResponse({'result': 'Success'}, status=201)
            else:
                return JsonResponse({'error': f"Step Functions execution failed with status: {status}"}, status=500)


class EstadoPagoView(APIView):
    def post(self, request):
        serializer = EstadoPagoSerializer(data=request.data)
        print(request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)