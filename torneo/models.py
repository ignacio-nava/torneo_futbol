from datetime import datetime, timedelta
from django.utils.html import format_html
from django.utils.dateformat import format
from django.db import models
from django.utils.translation import gettext_lazy as _


class Tournament(models.Model):
    name = models.CharField(_("name") ,max_length=100)
    start_date = models.DateField(_("start date"), blank=True, null=True)
    end_date = models.DateField(_("end date"), blank=True, null=True)
    finished = models.BooleanField(_("finished"), blank=True, default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('tournament')
        verbose_name_plural = _('tournaments')

    def __str__(self):
        return self.name


class Player(models.Model):
    first_name = models.CharField(_("first name"), max_length=100, blank=True, null=True)
    last_name = models.CharField(_("last name"), max_length=100, blank=True, null=True)
    nickname = models.CharField(_("nickname"), max_length=100, unique=True)
    # profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('player')
        verbose_name_plural = _('players')

    def __str__(self):
        return self.nickname


class Team(models.Model):
    ROLE_CHOICES = [
        ('L', _("Light Team")),
        ('D', _("Dark Team")),
    ]

    game = models.ForeignKey('Game', on_delete=models.CASCADE, related_name="teams", null=True)
    players = models.ManyToManyField('Player', related_name="teams")
    role = models.CharField(max_length=1, choices=ROLE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('team')
        verbose_name_plural = _('teams')
    
    def __str__(self):
        return self.role
    

class PlayerPoints(models.Model):
    RESULT_CHOICES = [
        ('W', _('Win')),
        ('L', _('Loss')),
        ('T', _('Tie')),
    ]

    tournament = models.ForeignKey('Tournament', on_delete=models.CASCADE, related_name="player_points")
    game = models.ForeignKey('Game', on_delete=models.CASCADE, related_name="player_points")
    player = models.ForeignKey('Player', on_delete=models.CASCADE, related_name="player_points")
    points = models.IntegerField(default=0)
    result = models.CharField(max_length=1, choices=RESULT_CHOICES, blank=True, null=True, verbose_name=_("result"))
    bonus = models.BooleanField(default=False)


class Game(models.Model):
    RESULT_CHOICES = [
        ('L', _("Light Team Wins")),
        ('D', _("Dark Team Wins")),
        ('T', _("Tie")),
    ]

    tournament = models.ForeignKey('Tournament', on_delete=models.CASCADE, related_name="games", verbose_name=_('tournament'))
    date = models.DateTimeField( _("date and time"))
    result = models.CharField(_("result"), max_length=1, choices=RESULT_CHOICES, blank=True, null=True)
    is_finished = models.BooleanField(_("finished"), default=False)
    bonus = models.BooleanField(_("bonus"), default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('game')
        verbose_name_plural = _('games')

    def save(self, *args, **kwargs):
        self.is_finished = True if self.result else False
        super().save(*args, **kwargs)
        return self

    def game(self):
        color = "#87ff87" if self.tournament.id % 2 == 0 else "#ffff79"
        status = _("finished") if self.is_finished else "Progamado"
        # Formatear la fecha como una cadena
        date_str = format(self.date, "d-m-Y H:i")  # Formato "YYYY-MM-DD HH:mm"
        return format_html(
            '<div style="background-color:{}; color: #000; border-radius:8px; padding:2px 4px; display: flex; align-items: center; gap: 4px;">\
                <span style="color: #000; border-right: 1px solid; padding-right: 2px;">{}</span>\
                <span style="font-weight:bold; text-shadow: 1px 1px #a2a2a2;">{} </span>\
                <span style="font-weight:bold; padding-left: 2px; text-shadow: 1px 1px #a2a2a2; border-left: 1px solid">{}</span>\
            </div>',
            color,
            self.tournament.name,
            status.upper(),
            date_str,
        )
    game.short_description = _("game")

    def __str__(self):
        finished = _("finished").upper()
        status = finished if self.is_finished else f"[NOT {finished}]"
        date = self.date.strftime('%Y-%m-%d %H:%M')
        result = dict(self.RESULT_CHOICES).get(self.result, _("Pending"))
        return f"{date} | {status} | {result}"
