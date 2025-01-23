from .models import Tournament, PlayerPoints

def create_objects(game):
    bonus = int(game.bonus) if game.is_finished else 0
    players = []

    if game.result == "T":
        players = [
            {
                "player": player, 
                "points": 1 + bonus, 
                "result": game.result
            }
            for team in game.teams.all()
            for player in team.players.all()
        ]
    else:
        for team in game.teams.all():
            for player in team.players.all():
                points = (3 if team.role == game.result else 0) + bonus

                result = None
                if game.result:
                    result = "W" if team.role == game.result else "L"

                players.append({
                    "player": player, 
                    "points": points,
                    "result": result
                })
 
    return players

def update_table(obj_array, tournament, game):
    current_players = {obj["player"].id for obj in obj_array}

    for obj in obj_array:
        player, _ = PlayerPoints.objects.get_or_create(
            player=obj["player"], 
            tournament=tournament,
            game=game
        )
        # print(player, _)
        player.bonus = game.bonus if game.result else 0
        player.points = obj["points"]
        player.result = obj["result"]
        player.save()

    PlayerPoints.objects.filter(game=game).exclude(player__id__in=current_players).delete()

def set_points(game):
    obj = create_objects(game)
    tournament = Tournament.objects.filter(games=game)[0]
    update_table(obj, tournament, game)
    return