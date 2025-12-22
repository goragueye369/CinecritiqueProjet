from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

@api_view(['GET'])
@permission_classes([AllowAny])
def api_home(request):
    return Response({
        'message': 'Bienvenue sur l\'API de CineCritique',
        'endpoints': {
            'login': '/api/login/',
            'register': '/api/register/',
            'profile': '/api/profile/',
            'users': '/api/users/',
            'admin': '/admin/'
        },
        'documentation': 'Pour plus d\'informations, consultez la documentation de l\'API.'
    })
