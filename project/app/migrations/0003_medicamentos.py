# Generated by Django 4.2.1 on 2023-05-12 17:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0002_todo_delete_react'),
    ]

    operations = [
        migrations.CreateModel(
            name='Medicamentos',
            fields=[
                ('id', models.IntegerField(primary_key=True, serialize=False)),
                ('Nome', models.CharField(max_length=150)),
            ],
        ),
    ]
