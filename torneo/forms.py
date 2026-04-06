from django import forms
from django.core.exceptions import ValidationError

from .models import PlayerPenalty

UNION = ", "

class PlayerPenaltyForm(forms.ModelForm):
    class Meta:
        model = PlayerPenalty
        fields = "__all__"

    def clean(self):
        cleaned = super().clean()
        penalty = cleaned.get("penalty")
        players = cleaned.get("players")
        game = cleaned.get("game")

        # Evitar que se aplique más una misma penalización al juego
        if not self.instance.pk: # Se está creando una nueva
            for old_penalty in game.player_penalties.all():
                if old_penalty.penalty == penalty:
                    raise ValidationError({
                            "game": "Ya existe una penalización de este estila para este partido"
                        })
        else: # Se está editando una existente
            if self.instance.penalty != penalty:
                raise ValidationError({
                        "game": "Ya existe una penalización de este estila para este partido"
                    })
                
        # Evitar que se penalice jugadores que no corresponda al partido
        if players and players.exists():
            if penalty.in_game:
                invalid = players.exclude(teams__game=game)
                if invalid.exists():
                    names = normalice_conjunction(UNION.join([player.nickname for player in invalid]))
                    raise ValidationError({
                        "players": f"Los siguientes jugadores no jugaron: {names}"
                    })
            else:
                invalid = players.filter(teams__game=game)
                if invalid.exists():
                    names = normalice_conjunction(UNION.join([player.nickname for player in invalid]))
                    raise ValidationError({
                        "players": f"Los siguientes jugadores jugaron: {names}"
                    })

        
def normalice_conjunction(str):
    parts = str.split(UNION)
    if len(parts) > 1:
        return UNION.join(parts[:-1]) + " y " + parts[-1]
    return parts[0]