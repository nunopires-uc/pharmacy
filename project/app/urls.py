"""
URL configuration for project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from . import views
from app.views import DummyDataView, EstadoPagoView, InserirReceitaPagoView, MyGetFromHistoricoView, ReceitaView
from app.views import MedicamentoView
from rest_framework import routers
from rest_framework_simplejwt.views import (TokenRefreshView)

#router = routers.DefaultRouter()
#router.register(r'tasks', views.TodoView, 'task')

urlpatterns = [
    path('token/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', views.RegisterView.as_view(), name='auth_register'),
    path('test/', views.testEndPoint, name='test'),
    path('response/', views.ResponseView.as_view(), name='response'),
    path('dummy-data/', DummyDataView.as_view(), name='dummy-data'),
    path('medicamentos/', MedicamentoView.as_view(), name='my_step_function'),
    path('receita-qrcode/', ReceitaView.as_view(), name='recipe-create'),
    path('inserir-receita-pago/', InserirReceitaPagoView.as_view(), name='recipe-create-pago'),
    path('my_get_from_historico/', MyGetFromHistoricoView.as_view(), name='my_get_from_historico'),
    path('face-pagar/', EstadoPagoView.as_view(), name='face-pagar'),
    path('', views.getRoutes),
    

    #path('app/', views.serve_react),
    #path('api/', include(router.urls)),
]

'''
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', ReactView.as_view(), name="anything"),
]
'''
