import csv
from collections import defaultdict
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from torneo.models import Tournament, Player, Team, Game, Event, PlayerEvent


class Command(BaseCommand):
    # Descripción que aparece en `python manage.py help`
    help = "Import tournament data from a backup folder"

    def add_arguments(self, parser):
        """
        Argumento obligatorio del comando.

        Permite ejecutar algo como:
        python manage.py load_data_torneo ./backups/backup_2026_03_11

        Se usa path completo para aprovechar autocompletado del shell (TAB).
        """
        parser.add_argument(
            "backup_path",
            type=str,
            help="Path to backup folder"
        )

    def handle(self, *args, **options):

        # Normaliza el path recibido:
        # - expanduser() permite usar ~
        # - resolve() convierte a path absoluto
        backup_dir = Path(options["backup_path"]).expanduser().resolve()

        # Verificación básica
        if not backup_dir.exists():
            self.stdout.write(self.style.ERROR(f"Backup folder not found: {backup_dir}"))
            return

        self.stdout.write(f"Loading backup from {backup_dir}")

        # Se usa una transacción para asegurar consistencia.
        # Si algo falla durante el import, se hace rollback
        # y la base queda exactamente igual que antes.
        with transaction.atomic():

            # Se limpian las tablas antes de importar.
            # Orden importante para evitar problemas de FK.
            PlayerEvent.objects.all().delete()
            Event.objects.all().delete()
            Game.objects.all().delete()
            Team.objects.all().delete()
            Player.objects.all().delete()
            Tournament.objects.all().delete()

            # Diccionario que define los archivos necesarios
            # para reconstruir los juegos.
            #
            # Game depende de:
            #   Team
            #   TeamPlayers (M2M)
            #
            # Por eso se manejan juntos.
            game_dict = {
                "games": {"model": Game, "filepath": backup_dir / "games.csv"},
                "teams": {"model": Team, "filepath": backup_dir / "teams.csv"},
                "team_players": {"filepath": backup_dir / "team_players.csv"}
            }

            event_dict = {
                "player_events": {"filepath": backup_dir / "player_events.csv"},
                "player_event_players": {"filepath": backup_dir / "player_event_players.csv"}
            }

            # Import simple (sin FK complejas)
            self.import_model(Tournament, backup_dir / "tournaments.csv")
            self.import_model(Player, backup_dir / "players.csv")
            self.import_model(Event, backup_dir / "events.csv", required=False)

            # Import complejo que reconstruye Game → Team → Players
            self.import_game(game_dict)

            # Import complejo que reconstruye PlayerEvent → Players
            self.import_player_events(event_dict)

        self.stdout.write(self.style.SUCCESS("Backup import completed"))

    def file_exists(self, filepath):
        """
        Verifica que el archivo exista.
        """
        if not filepath.exists():
            raise CommandError(f"Missing file: {filepath}")

    def read_csv(self, filepath):
        """
        Lee un CSV validando primero que exista.
        """
        self.file_exists(filepath)

        with open(filepath, newline="") as f:
            return list(csv.DictReader(f))

    def read_optional_csv(self, filepath):
        """
        Lee un CSV opcional.

        Se usa para mantener compatibilidad con backups viejos que
        todavía no tenían archivos relacionados a eventos.
        """
        if not filepath.exists():
            self.stdout.write(self.style.WARNING(f"Optional file not found, skipping: {filepath}"))
            return []

        return self.read_csv(filepath)

    def import_model(self, model, filepath, required=True):
        '''
        Import simple para modelos que no tienen relaciones
        complejas o que se pueden resolver directamente con ids.

        Ejemplo:
        Tournament
        Player
        '''

        if required:
            self.file_exists(filepath)
        elif not filepath.exists():
            self.stdout.write(self.style.WARNING(f"Optional file not found, skipping: {filepath}"))
            return

        # Cada fila del CSV se convierte en un dict
        # que coincide con los campos del modelo.
        for row in self.read_csv(filepath):
            model.objects.create(**row)

    def import_game(self, data):
        """
        Reconstrucción completa de la estructura:

        Game
          ├─ Team
          │   └─ Players (ManyToMany)
          └─ Team

        Para evitar búsquedas costosas se cargan todos los CSV
        en memoria y se crean índices usando defaultdict.
        """

        # Cargar todos los CSV en memoria
        data_items = {
            key: self.read_csv(data[key]["filepath"])
            for key in data.keys()
        }
        
        # ------------------------------------------------
        # Índice: game_id → lista de teams
        #
        # defaultdict(list) crea automáticamente una lista
        # cuando se accede a una clave inexistente.
        #
        # Resultado:
        #
        # {
        #   "10": [team1, team2],
        #   "11": [team3, team4]
        # }
        #
        # Esto permite acceder rápidamente a los equipos
        # de cada game sin recorrer toda la lista.
        # ------------------------------------------------
        teams_by_game = defaultdict(list)

        for team in data_items["teams"]:
            teams_by_game[team["game_id"]].append(team)

        # ------------------------------------------------
        # Índice: team_id → lista de player_id
        #
        # Ejemplo:
        #
        # {
        #   "5": ["1","2","3"],
        #   "6": ["4","7","8"]
        # }
        #
        # Permite reconstruir la relación M2M rápidamente.
        # ------------------------------------------------
        players_by_team = defaultdict(list)
        for tp in data_items["team_players"]:
            players_by_team[tp["team_id"]].append(tp["player_id"])

        # ------------------------------------------------
        # Reconstrucción de los partidos
        #
        # Primero se crea el Game incompleto (is_finished=False)
        # para poder agregar los equipos y jugadores.
        # ------------------------------------------------
        for game_row in data_items["games"]:
            tournament = Tournament.objects.get(id=game_row["tournament_id"])

            game = Game.objects.create(
                id=game_row["id"],  # se preserva el id del backup
                tournament=tournament,
                date=game_row["date"],
                created_at=game_row["created_at"],
                is_finished=False
            )

            # Crear equipos del partido
            for team_row in teams_by_game[game_row["id"]]:
                team = Team.objects.create(
                    id=team_row["id"],  # mantener ids para preservar relaciones
                    game=game,
                    role=team_row["role"],
                    created_at=team_row["created_at"],
                )

                # Asignar jugadores al equipo
                for player_id in players_by_team[team_row["id"]]:
                    player = Player.objects.get(id=player_id)
                    team.players.add(player)

            # Una vez que todo está armado se restauran
            # los datos finales del partido
            game.result = game_row["result"]
            game.is_finished = game_row["is_finished"] == "True"
            game.save()

    def import_player_events(self, data):
        """
        Reconstrucción completa de los eventos asignados:

        PlayerEvent
          ├─ Event
          ├─ Game
          └─ Players (ManyToMany)
        """

        data_items = {
            key: self.read_optional_csv(data[key]["filepath"])
            for key in data.keys()
        }

        players_by_player_event = defaultdict(list)
        for player_event_player in data_items["player_event_players"]:
            players_by_player_event[player_event_player["player_event_id"]].append(
                player_event_player["player_id"]
            )

        for player_event_row in data_items["player_events"]:
            event = Event.objects.get(id=player_event_row["event_id"])
            game = Game.objects.get(id=player_event_row["game_id"])

            player_event = PlayerEvent.objects.create(
                id=player_event_row["id"],
                event=event,
                game=game,
                created_at=player_event_row["created_at"],
            )

            for player_id in players_by_player_event[player_event_row["id"]]:
                player = Player.objects.get(id=player_id)
                player_event.players.add(player)
