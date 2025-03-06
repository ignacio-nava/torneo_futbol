from django import template
from django.conf import settings
from django.templatetags.static import static
from django.utils.safestring import mark_safe


register = template.Library()

@register.simple_tag
def react_script():
    if settings.DEBUG:
        return mark_safe("""
        <script type="module" src="http://127.0.0.1:3000/@vite/client"></script>
        <script type="module">
          import RefreshRuntime from "http://127.0.0.1:3000/@react-refresh"
          RefreshRuntime.injectIntoGlobalHook(window)
          window.$RefreshReg$ = () => {}
          window.$RefreshSig$ = () => (type) => type
          window.__vite_plugin_react_preamble_installed__ = true
        </script>
        <script type="module" crossorigin src="http://127.0.0.1:3000/src/main.tsx"></script>
        """)
    else:
        static_url = static('js/main.js')
        return mark_safe(f'<script type="module" crossorigin src="{static_url}"></script>')