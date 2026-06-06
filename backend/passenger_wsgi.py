import os
import sys

# Activer le virtualenv manuellement
venv_path = '/home/goragueye/venv'
activate_this = os.path.join(venv_path, 'bin', 'activate_this.py')
if os.path.exists(activate_this):
    exec(open(activate_this).read(), {'__file__': activate_this})
else:
    # Ajouter manuellement le site-packages du venv au path
    import glob
    site_packages = glob.glob(os.path.join(venv_path, 'lib', 'python*', 'site-packages'))
    for sp in site_packages:
        if sp not in sys.path:
            sys.path.insert(0, sp)

# Ajouter le dossier backend au path Python
sys.path.insert(0, '/home/goragueye/backend')

# Charger les variables d'environnement
from dotenv import load_dotenv
load_dotenv('/home/goragueye/backend/.env')

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
