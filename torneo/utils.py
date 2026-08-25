from django.db.models import Sum, Count, Q
from django.shortcuts import get_object_or_404
from django.utils.translation import gettext_lazy as _

from .models import Tournament, PlayerPoints, Player, Game, PlayerEvent


def get_tournament_obj(tournament):
    return {
        "id": tournament.id,
        "name": tournament.name,
        "start_date": tournament.start_date,
        "end_date": tournament.end_date,
        "finished": tournament.finished
    }

def get_players(game, role):
    # penalties_in_game = game.player_penalties.all()
    players = []
    for team in game.teams.filter(role=role):
        for player in team.players.all():
            players.append({
                "id": player.id,
                "nickname": player.nickname
            })
    return players

def get_games(data, tournament):
    for game in tournament.games.all():
        obj_games = {
            "id": game.id,
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
    # [1] Se obtienen la tabla sin ordenar aún
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
        )
    )
    # [2] Se obtienen los eventos del torneo y se mapean
    event_points = (
        PlayerEvent.objects
        .filter(game__tournament=tournament)
        .values(
            "players", 
            "event__id", 
            "event__code", 
            "event__name", 
            "players__nickname"
        )
        .annotate(
            total_event_points=Sum("event__points"),
            event_count=Count("event__id")
        )
        .order_by("players__nickname")
    )

    event_points_map = {}
    for entry in event_points:
        player_id = entry["players"]
        old_points = event_points_map.get(player_id, 0)
        event_points_map[entry["players"]] = old_points + entry.get("total_event_points", 0)

    # [3] Se obtienen los ultimos 4 partidos
    last_games = Game.objects.filter(tournament=tournament).order_by("-date")[:4]

    players_list = []
    for entry in player_points:
        player = Player.objects.get(id=entry["player"])
        
        extra_points = event_points_map.get(player.id, 0) # De los eventos posibles
        entry["total_points"] = entry["total_points"] + extra_points # Se suman a los puntos totales

        last_matches = []
        for game in reversed(last_games):
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
            "has_extra_points": bool(extra_points),
            "last_matches": last_matches
        })

        players_list.sort(
            key=lambda p: (
                p["total_points"],
                p["games_with_bonus"]
            ),
            reverse=True
        )

    # Se agrupan los eventos del torneo por jugadores
    events_by_player = {}
    for entry in event_points:
        player_id = entry["players"]

        if player_id not in events_by_player:
            events_by_player[player_id] = {
                "player_id": player_id,
                "player_nickname": entry["players__nickname"],
                "points_to_table": event_points_map.get(player_id, 0),
                "events": []
            }

        events_by_player[player_id]["events"].append({
            "event_id": entry["event__id"],
            "event_name": entry["event__name"],
            "event_code": entry["event__code"],
            "event_count": entry["event_count"],
            "total_event_points": entry["total_event_points"],
        })

    # -------------------------------- #
    #     Guardar en el dict final     #
    # -------------------------------- #
    data["selected"]["table"] = {
        "players": players_list,
        "events_by_player": list(events_by_player.values())
    }

    return data

def get_events(data, tournament):
    events = (
        PlayerEvent.objects
        .filter(game__tournament=tournament)
        .values(
            "game__id",
            "players__id",
            "players__nickname",
            "event__id",
            "event__name",
            "event__code",
            "event__points",
            "event__in_game",
        )
    )
    data["selected"]["events"] = list(events)
    return

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
        "table": [],
        "events": []
    } 
    data = get_games(data, tournament)
    data = get_player_points(data, tournament)
    get_events(data, tournament)

    return data