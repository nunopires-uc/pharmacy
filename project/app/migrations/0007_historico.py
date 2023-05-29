# Generated by Django 4.2.1 on 2023-05-27 22:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0006_alter_receita_medlist'),
    ]

    operations = [
        migrations.CreateModel(
            name='Historico',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('idReceita', models.IntegerField()),
                ('userName', models.CharField(max_length=100)),
                ('userID', models.IntegerField()),
                ('prescTotal', models.FloatField()),
                ('medList', models.TextField()),
                ('pago', models.BooleanField()),
            ],
        ),
    ]