from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
import logging
import json

logger = logging.getLogger(__name__)

def custom_exception_handler(exc, context):
    """
    Gestionnaire d'exceptions personnalisé pour forcer les réponses JSON
    """
    # Response par défaut pour les exceptions DRF
    response = exception_handler(exc, context)
    
    # Si aucune réponse n'est générée, en créer une
    if response is None:
        logger.error(f"Aucune réponse générée pour l'exception: {exc}")
        return Response({
            'error': 'Erreur interne du serveur',
            'detail': str(exc)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    # Forcer le content-type en JSON
    if hasattr(response, 'content_type'):
        response['Content-Type'] = 'application/json'
    
    # S'assurer que les données sont sérialisables en JSON
    if hasattr(response, 'data'):
        try:
            # Tester si les données sont déjà JSON-serialisables
            json.dumps(response.data)
        except (TypeError, ValueError) as e:
            logger.error(f"Données non-JSON-serialisables: {response.data}, erreur: {e}")
            response.data = {
                'error': 'Erreur de format de réponse',
                'detail': 'Les données ne peuvent pas être sérialisées en JSON'
            }
    
    return response
