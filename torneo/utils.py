from django.db.models import Sum, Count, Q
from django.shortcuts import get_object_or_404
from django.utils.translation import gettext_lazy as _

from .models import Tournament, PlayerPoints, Player, Game, PlayerPenalty


def get_tournament_obj(tournament):
    return {
        "id": tournament.id,
        "name": tournament.name,
        "start_date": tournament.start_date,
        "end_date": tournament.end_date,
        "finished": tournament.finished
    }

def get_players(game, role):
    penalties_in_game = game.player_penalties.all()
    players = []
    for team in game.teams.filter(role=role):
        for player in team.players.all():
            players.append({
                "nickname": player.nickname,
                "penalties": search_penalty(penalties_in_game, player)
            })
    return players

def search_penalty(penalties_in_game, player):
    penalties = []
    for penalty in penalties_in_game:
        if penalty.players.filter(id=player.id).exists():
            penalties.append(penalty.penalty.code)
    return penalties


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
                    "players": get_players(game, role="L")
                }, 
                {
                    "name": _("dark team"),
                    "role": "D",
                    "players": get_players(game, role="D")
                }
            ]
        }

        data["selected"]["games"].append(obj_games)
    return data

def get_player_points(data, tournament):
    # -------------------------------- #
    #        Sección jugadores         #
    # -------------------------------- #
    player_points = (
        PlayerPoints.objects
        .filter(tournament=tournament)
        .values('player').annotate(
            total_points=Sum('points', distinct=False),
            games_played=Count('player', filter=Q(result__in=['W', 'L', 'T'])),
            games_won=Count('result', filter=Q(result='W')),
            games_lost=Count('result', filter=Q(result='L')),
            games_tied=Count('result', filter=Q(result='T')),
            games_with_bonus=Count('bonus', filter=Q(bonus=True))
        ).order_by("-total_points", "-games_with_bonus")
    )

    last_games = Game.objects.filter(tournament=tournament).order_by("-date")[:4]
        
    players_list = []
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

        players_list.append({
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

    # -------------------------------- #
    #        Sección penalidades       #
    # -------------------------------- #
    penalties_qs = (
        PlayerPenalty.objects
        .filter(game__tournament=tournament)
        .values("players__id", "players__nickname", "penalty__name")
        .annotate(total_points=Sum("penalty__points"))
    )

    penalties_by_player = {}
    for entry in penalties_qs:
        player_nickname = entry["players__nickname"]
        if player_nickname not in penalties_by_player:
            penalties_by_player[player_nickname] = {
                "playerNickname": player_nickname,
                "playerPenalties": []
            }

        penalties_by_player[player_nickname]["playerPenalties"].append({
            "penaltyName": entry["penalty__name"],
            "penaltyPoints": entry["total_points"],
        })

    # -------------------------------- #
    #     Guardar en el dict final     #
    # -------------------------------- #
    data["selected"]["table"] = {
        "players": players_list,
        "penalties": list(penalties_by_player.values())
    }


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