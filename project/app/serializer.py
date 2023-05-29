from decimal import Decimal
import json
from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from . models import *


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        return token

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'password2')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs
    
    def create(self, validated_data):
        user = User.objects.create(username=validated_data['username'], email=validated_data['username'])
        user.set_password(validated_data['password'])
        user.save()
        return user

class ResponseModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medicamentos
        fields = ('id', 'Nome')

class MedicamentoModelSerializer(serializers.ModelSerializer):
    dosagens = serializers.ListField(child=serializers.IntegerField())
    class Meta:
        model = Medicamento
        fields = ('id', 'nome', 'nomeGenerico', 'imagem', 'dosagens', 'formato', 'administracao', 'marca', 'preco')

class DummyDataSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    Nome = serializers.CharField(max_length=100)

class MedicationSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    quantidade = serializers.IntegerField()

class EstadoPagoSerializer(serializers.Serializer):
    status = serializers.BooleanField()
    idReceita = serializers.IntegerField()

class ReceitaSerializer(serializers.Serializer):
    idReceita = serializers.IntegerField()
    medList = MedicationSerializer(many=True)
    userName = serializers.CharField(max_length=100)
    userID = serializers.IntegerField()
    #generico = serializers.CharField(max_length=100)
    #genericoPreco = serializers.FloatField()

class ListMedSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    quantidade = serializers.IntegerField()
    preco = serializers.FloatField()
    nome = serializers.CharField(max_length=100)

class InserirReceitaPagoSerializer(serializers.Serializer):
    idReceita = serializers.IntegerField()
    userName = serializers.CharField(max_length=100)
    userID = serializers.IntegerField()
    prescTotal = serializers.FloatField()
    pago = serializers.BooleanField()
    medList = ListMedSerializer(many=True)

    def to_internal_value(self, data):
        decimal_data = data.copy()

        if 'prescTotal' in decimal_data:
            decimal_data['prescTotal'] = Decimal(str(decimal_data['prescTotal']))

        if 'medList' in decimal_data:
            decimal_data['medList'] = [
                {
                    'id': med['id'],
                    'nome': med['nome'],
                    'preco': Decimal(str(med['preco'])),
                    'quantidade': med['quantidade']
                }
                for med in decimal_data['medList']
            ]

        return super().to_internal_value(decimal_data)
    
    def to_representation(self, instance):
        # Convert Decimal fields back to float values
        instance['prescTotal'] = float(instance['prescTotal'])
        for med in instance['medList']:
            med['preco'] = float(med['preco'])

        # Return the serialized data directly from the instance
        return instance

    def create(self, validated_data):
        # Print the validated_data here
        print(validated_data)

        # Add your logic for creating a new instance here
        # For now, we'll return the validated_data as an instance
        return validated_data

    def to_representation(self, instance):
        # Return the serialized data directly from the instance
        return instance



    
        

#class ReactSerializer(serializers.ModelSerializer):
    #class Meta:
        #model = React
        #fields = ['employee', 'department']

'''
class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = ('id', 'title', 'description', 'completed')
'''

