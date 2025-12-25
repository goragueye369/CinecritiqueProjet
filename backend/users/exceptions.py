from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
import logging

logger = logging.getLogger(__name__)

def custom_exception_handler(exc, context):
    """
    Gestionnaire d'exceptions personnalisé pour forcer les réponses JSON
    """
    # Response par défaut pour les exceptions DRF
    response = exception_handler(exc, context)
    
    # Si la réponse n'est pas déjà au format JSON, la convertir
    if hasattr(response, 'data'):
        # Si c'est déjà une Response DRF, vérifier le content-type
        if not getattr(response, 'content_type', '').startswith('application/json'):
            logger.error(f"Exception non-JSON détectée: {exc}")
            response['Content-Type'] = 'application/json'
    
    return response
