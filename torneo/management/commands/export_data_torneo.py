import csv
from datetime import datetime
from pathlib import Path

from django.core.management.base import BaseCommand
from django.conf import settings

from torneo.models import Tournament, Team, Player, Game


class Command(BaseCommand):
    help = "Export database backup to CSV files"

    def handle(self, *args, **kwargs):

        date = datetime.now().strftime("%Y_%m_%d_%H_%M")
        backup_dir = Path(settings.BACKUP_DIR) / f"backup_{date}"
        backup_dir.mkdir(parents=True, exist_ok=True)

        self.stdout.write(f"Creating backup in {backup_dir}")

        self.export_queryset(Tournament.objects.all(), backup_dir / "tournaments.csv")
        self.export_queryset(Player.objects.all(), backup_dir / "players.csv")
        self.export_queryset(Team.objects.all(), backup_dir / "teams.csv")
        self.export_queryset(Game.objects.all(), backup_dir / "games.csv")

        self.export_team_players(backup_dir / "team_players.csv")

        self.stdout.write(self.style.SUCCESS("Backup completed"))

    def export_queryset(self, queryset, filepath):

        model = queryset.model
        fields = [field.attname for field in model._meta.fields]

        with open(filepath, "w", newline="") as f:
            writer = csv.writer(f)
            writer.writerow(fields) # Header

            for obj in queryset: # Rows
                data = [getattr(obj, field) for field in fields]
                writer.writerow(data)

    def export_team_players(self, filepath):

        with open(filepath, "w", newline="") as f:
            writer = csv.writer(f)
            writer.writerow(["team_id", "player_id"])

            for team in Team.objects.all():
                for player in team.players.all():
                    writer.writerow([team.id, player.id])