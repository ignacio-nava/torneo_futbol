from django.db.models import Sum, Count, Q
from django.shortcuts import get_object_or_404
from django.utils.translation import gettext_lazy as _

from .models import Tournament, PlayerPoints, Player, Game


def get_tournament_obj(tournament):
    return {
        "id": tournament.id,
        "name": tournament.name,
        "start_date": tournament.start_date,
        "end_date": tournament.end_date,
        "finished": tournament.finished
    }

def get_games(data, tournament):
    for game in tournament.games.all():
        obj_games = {
            "datetime": game.date,
            "result": game.result,
            "is_finished": game.is_finished,
            "bonus": game.bonus,
            "teams": [
                {
                    "name": _("light team"),
                    "role": "L",
                    "players": [
                        player.nickname
                        for team in game.teams.filter(role="L")
                        for player in team.players.all()
                    ]
                }, 
                {
                    "name": _("dark team"),
                    "role": "D",
                    "players": [
                        player.nickname
                        for team in game.teams.filter(role="D")
                        for player in team.players.all()
                    ]
                }
            ]
        }

        data["selected"]["games"].append(obj_games)
    return data

def get_player_points(data, tournament):
    player_points = PlayerPoints.objects.filter(tournament=tournament).values('player').annotate(
        total_points=Sum('points', distinct=False),
        games_played=Count('player', filter=Q(result__in=['W', 'L', 'T'])),
        games_won=Count('result', filter=Q(result='W')),
        games_lost=Count('result', filter=Q(result='L')),
        games_tied=Count('result', filter=Q(result='T')),
        games_with_bonus=Count('bonus', filter=Q(bonus=True))
    ).order_by("-total_points", "-games_with_bonus")

    last_games = Game.objects.filter(tournament=tournament).order_by("-date")[:4]
        
    for entry in player_points:
        player = Player.objects.get(id=entry["player"])

        last_matches = []
        for game in last_games:
            if game.result:
                try:
                    pp = PlayerPoints.objects.get(player=player, game=game)
                    last_matches.append(pp.result if pp.result else "_")
                except PlayerPoints.DoesNotExist:
                    last_matches.append("_")

        data["selected"]["table"].append({
            "player": {
                "id": player.id,
                "first_name": player.first_name,
                "last_name": player.last_name,
                "nickname": player.nickname,
            },
            "total_points": entry["total_points"],
            "games_played": entry["games_played"],
            "games_won": entry["games_won"],
            "games_lost": entry["games_lost"],
            "games_tied": entry["games_tied"],
            "games_with_bonus": entry["games_with_bonus"],
            "last_matches": last_matches
        })
    return data

def get_data_serialized(tournamet_id=None):
    data = {}
    if tournamet_id is None:
        tournaments = Tournament.objects.all().order_by("-created_at")
        data["tournaments"] = []
        for tournament in tournaments:
             data["tournaments"].append(get_tournament_obj(tournament))
        tournament = tournaments.first()
    else:
        tournament = get_object_or_404(Tournament, id=tournamet_id)
    data["selected"] = {
        "tournament": get_tournament_obj(tournament),
        "games": [],
        "table": []
    } 
    data = get_games(data, tournament)
    data = get_player_points(data, tournament)
    return data