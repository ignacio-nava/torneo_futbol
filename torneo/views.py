from django.conf import settings
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_GET

from .utils import get_data_serialized


@require_GET
def torneo_view(request):
    template_name = "index.html"
    data = get_data_serialized()

    context = {
        "data": data,
    }

    if settings.DEBUG:
        context["debug"] = settings.DEBUG

    return render(request, template_name, context=context)

@require_GET
def torneo_json_view(request, id):
    data = get_data_serialized(id)
    return JsonResponse(data, safe=False)
