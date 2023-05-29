import os
import django
import sys
import json


sys.path.append('N:/Universidade/ES/react-django/project')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project.settings')
django.setup()
from django.apps import apps

React = apps.get_model('app', 'React')


# Load JSON data (replace with your actual JSON data)
react_data = [
    {
        "employee": "Nuno Pires",
        "department": "Software Engineering",
    },
    # ... other data
]

# Insert data into React model
for data in react_data:
    React.objects.create(**data)

print('Successfully inserted JSON data')
