from django.db.models.signals import m2m_changed, post_save
from django.dispatch import receiver

from .models import Team, Game
from .table_cache import set_points


@receiver(post_save, sender=Game)
def create_or_update_player_points(sender, instance, *args, **kwargs):
    if len(instance.teams.union()) == 2:
        set_points(instance)


@receiver(m2m_changed, sender=Team.players.through)
def team_players_changed(sender, instance, action, **kwargs):
    teams = instance.game.teams.all()
    if len(teams) == 2:
        if len(teams.last().players.all()) > 0:
            set_points(instance.game)