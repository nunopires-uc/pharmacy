from django.db import models
from django.contrib.postgres.fields import ArrayField

#class React(models.Model):
#    employee = models.CharField(max_length=30)
#    department = models.CharField(max_length=200)
# Create your models here.

class Todo(models.Model):
    title = models.CharField(max_length=150)
    description = models.CharField(max_length=500)
    completed = models.BooleanField(default=False)

    def __str__(self):
        return self.title
    
class Medicamentos(models.Model):
    id = models.IntegerField(primary_key=True)
    Nome = models.CharField(max_length=150)

class Medicamento(models.Model):
    id = models.IntegerField(primary_key=True)
    nome = models.CharField(max_length=150)
    nomeGenerico = models.CharField(max_length=150)
    imagem = models.CharField(max_length=150)
    dosagens = ArrayField(models.IntegerField(), default=list)
    formato = models.CharField(max_length=150)
    administracao = models.CharField(max_length=150)
    marca = models.CharField(max_length=150)
    preco = models.FloatField()
    
class Receita(models.Model):
    idReceita = models.IntegerField()
    userName = models.CharField(max_length=100)
    userID = models.IntegerField()
    medList = models.TextField()

class Historico(models.Model):
    idReceita = models.IntegerField()
    userName = models.CharField(max_length=100)
    userID = models.IntegerField()
    prescTotal = models.CharField(max_length=6)
    medList = models.TextField()
    pago = models.BooleanField()

class EstadoPago(models.Model):
    status = models.BooleanField()
    idReceita = models.IntegerField()
