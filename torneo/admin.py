from django.contrib import admin
from django.forms import BaseInlineFormSet, ValidationError
from django.utils.translation import gettext_lazy as _

from .models import Tournament, Player, Team, Game

admin.site.site_header = "Administración de los Torneos"

class TeamInline(admin.TabularInline):
    model = Team
    extra = 0  # Para "Local" y "Visitor"
    # min_num = 2
    max_num = 2
    show_change_link = True
    fields = ['role', 'players']  # Campos visibles en el formulario
    verbose_name = "Team"
    verbose_name_plural = "Teams"
    filter_horizontal = ['players']  # Para seleccionar múltiples jugadores fácilmente

@admin.register(Game)
class GameAdmin(admin.ModelAdmin):
    fieldsets = [
        (
            _("tournament").upper(),
            {
                "fields": [
                    "tournament",
                ]
            }
        ),
        (
            _("date").upper(),
            {
                "fields": [
                    "date"
                ]
            }
        ),
        (
            _("result").upper(),
            {
                "fields": [
                    "result",
                    "bonus"
                ]
            }
        )
    ]

    inlines = [TeamInline]

    list_display = [
        "game",
        # "result",
        # "bonus"
    ]

    list_filter = ["tournament", "date", "result"]
    search_fields = ["tournament__name", "date"]
    ordering = ["-tournament__id", "-date"]


@admin.register(Tournament)
class TournamentAdmin(admin.ModelAdmin):
    list_display = ["name", "start_date", "end_date", "created_at", "updated_at"]
    search_fields = ["name"]


@admin.register(Player)
class PlayerAdmin(admin.ModelAdmin):
    list_display = ["nickname", "first_name", "last_name", "created_at", "updated_at"]
    search_fields = ["nickname", "first_name", "last_name"]
