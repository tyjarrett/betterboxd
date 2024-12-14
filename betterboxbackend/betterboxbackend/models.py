from django.db import models

class UserManager(models.Manager):
    def create_user(self, username):
        user = self.model(username = username)
        user.save()
        return user

class User(models.Model):
    username = models.CharField(max_length=20)
    objects = UserManager()

class SongManager(models.Manager):
    def create_song(self, name, genre, artist):
        song = self.model(name = name, genre = genre, artist = artist)
        song.save()
        return song

class Song(models.Model):
    name = models.CharField(max_length=50)
    genre = models.CharField(max_length=30)
    artist = models.CharField(max_length=30)
    objects = SongManager()

class RatingManager(models.Manager):
    def hello():
        print("hello")

class Rating(models.Model):
    stars = models.DecimalField(max_digits=2, decimal_places=1, default=-1)
    comment = models.CharField(max_length=200)
    songId = models.ForeignKey(Song, on_delete=models.CASCADE)
    userId = models.ForeignKey(User, on_delete=models.CASCADE)
    objects = RatingManager()

class SavedManager(models.Manager):
    def hello():
        print("hello")

class Saved(models.Model):
    songId = models.ForeignKey(Song, on_delete=models.CASCADE)
    userId = models.ForeignKey(User, on_delete=models.CASCADE)
    objects = SavedManager()
