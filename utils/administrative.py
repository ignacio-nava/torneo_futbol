import os

from django.core.management.utils import get_random_secret_key

class Logger:
    """
    Utilidad para imprimir mensajes con formato y colores en la terminal.
    """

    @classmethod
    def title(self, str):
        """
        Imprime un título formateado con color cian.

        Args:
            str (str): Texto del título.
        """
        print(f'\033[1;36m{str}:\033[0m')

    @classmethod
    def body(self, str, end=False, success=True):
        """
        Imprime el cuerpo de un mensaje con formato dinámico.

        Args:
            str (str): Mensaje a imprimir.
            end (bool, optional): Si es True, el mensaje se imprime como final.
                                  Si es False, mantiene el cursor en la misma línea. 
                                  Por defecto es False.
            success (bool, optional): Indica si el mensaje final representa éxito (True)
                                       o fallo (False). Por defecto es True.
        """
        final = '...'
        if end:
            # Si es el final, limpia la línea anterior y agrega éxito o fallo.
            end = '\n'
            self.clean()
            if success:
                final += ' \033[1;32mOK\033[0m'  # Mensaje de éxito.
            else:
                final += ' \033[1;31mFAIL\033[0m'  # Mensaje de fallo.
        else:
            end = '\r'  # Mantiene el cursor en la misma línea.
        print(f'  {str} {final}', end=end)  # Imprime el mensaje formateado.

    @classmethod
    def clean(self):
        """
        Limpia la línea actual en la terminal.
        """
        print('', end='\r')


ENVIROMENT = {
    "SECRET_KEY": 'django-insecure-' + get_random_secret_key(),
    "DEBUG": True,
    "IS_SENDING_EMAIL": False,
    "EMAIL_HOST": "",
    "EMAIL_PORT": "",
    "EMAIL_HOST_USER": "",
    "DEFAULT_FROM_EMAIL": "",
    "EMAIL_HOST_PASSWORD": "",
    "EMAIL_USE_TLS": ""
}

def create_env_file():
    Logger.title("Administrative tasks")
    Logger.body("Creating environment variables")

    with open('core/env.py', 'w') as file:
        for key, value in ENVIROMENT.items():
            value = str(value) if isinstance(value, bool) else f"'{value}'"
            file.write(f"{key} = {value}\n")
        file.close()

    Logger.body("Creating environment variables", end=True)