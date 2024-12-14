import json
from django.shortcuts import get_object_or_404
from . import models
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

class UserView(APIView):
    def post(self, request):
        user = models.User.objects.create_user(
                username = request.data["username"]
            )
        response = {"userId": user.pk, "username": user.username}
        return Response(response, status=status.HTTP_201_CREATED)
    
class UserIdView(APIView):
    def post(self, request):
        user = get_object_or_404(models.User, username=request.data["username"])
        response = {"userId": user.pk}
        return Response(response, status=status.HTTP_200_OK)
    
class OtherUsersView(APIView):
    def post(self, request):
        users = models.User.objects.all().exclude(pk=request.data["userId"])
        response = {}
        for user in users:
            res = {
                "userId": user.pk
            }
            response[user.pk] = res
        return Response(response, status=status.HTTP_200_OK)
    
class UsernameView(APIView):
    def post(self, request):
        user = get_object_or_404(models.User, pk=request.data["userId"])
        response = {"username": user.username}
        return Response(response, status=status.HTTP_200_OK)
    
class SongView(APIView):
    def get(self, request):
        data = list(models.Song.objects.all())
        response = {}
        for dat in data:
            res = {"name": dat.name, "artist": dat.artist, "genre": dat.genre, "userid": dat.pk}
            response[dat.pk] = res
        return Response(response, status=status.HTTP_200_OK)
    
    def post(self, request):
        song = models.Song.objects.create_song(
                name = request.data["name"],
                genre = request.data["genre"],
                artist = request.data["artist"],
            )
        response = {"songId": song.pk,}
        return Response(response, status=status.HTTP_201_CREATED)
    
class SongName(APIView):
    def post(self, request):
        song = get_object_or_404(models.Song, pk = request.data["songId"])
        return Response(song.name, status=status.HTTP_200_OK)
    
class SongInfo(APIView):
    def post(self, request):
        songs = models.Song.objects.filter(pk = request.data["songId"])
        response = {}
        for song in songs: 
            response = {"artist": song.artist, "genre": song.genre, "name": song.name}
        return Response(response, status=status.HTTP_200_OK)
    
class AllRatings(APIView):
    def post(self, request):
        ratings = models.Rating.objects.filter(userId = request.data["userId"])
        response = {}
        for rate in ratings:
            res = {
                "songId": rate.songId.id,
                "comment": rate.comment,
                "stars": rate.stars,
                "userId": rate.userId.id
            }
            response[rate.pk] = res
        return Response(response, status=status.HTTP_200_OK)
    
class OtherRatings(APIView):
    def post(self, request):
        user = get_object_or_404(models.User, pk=request.data["userId"])
        ratings = models.Rating.objects.all().exclude(userId=user)
        response = {}
        for rate in ratings:
            res = {
                "songId": rate.songId.id,
                "userId": rate.userId.id,
                "stars": rate.stars
            }
            response[rate.pk] = res
        return Response(response, status=status.HTTP_200_OK)
    
class SongRatings(APIView):
    def post(self, request):
        song = get_object_or_404(models.Song, pk=request.data["songId"])
        ratings = models.Rating.objects.filter(songId = song)
        response = {}
        for rate in ratings:
            res = {
                "comment": rate.comment,
                "stars": rate.stars,
                "userId": rate.userId.id
            }
            response[rate.pk] = res
        return Response(response, status=status.HTTP_200_OK)

    
class Rating(APIView):
    def post(self, request):
        rating = get_object_or_404(models.Rating, songId=request.data["songId"], userId = request.data["userId"])
        res = {
            "stars": rating.stars,
            "comment": rating.comment,
        }
        return Response(res, status=status.HTTP_200_OK)
    
    def delete(self, request):
        rating = get_object_or_404(models.Rating, songId=request.data["songId"], userId = request.data["userId"])
        rating.delete()
        return Response("deleted", status=status.HTTP_200_OK)
    
class UpdateRating(APIView):
    def post(self, request):
        song = get_object_or_404(models.Song, pk=request.data["songId"])
        user = get_object_or_404(models.User, pk=request.data["userId"])
        rating, created = models.Rating.objects.update_or_create(songId = song, userId = user)
        rating.stars = request.data["stars"]
        rating.comment = request.data["comment"]
        rating.save()
        return Response(rating.pk, status=status.HTTP_200_OK)
    
class Saved(APIView):
    def post(self, request):
        saves = models.Saved.objects.filter(userId = request.data["userId"])
        response = {}
        for save in saves:
            res = {"songId": save.songId.id}
            response[save.pk] = res
        return Response(response, status=status.HTTP_200_OK)
    
class SaveSong(APIView):
    def post(self, request):
        song = get_object_or_404(models.Song, pk=request.data["songId"])
        user = get_object_or_404(models.User, pk=request.data["userId"])
        saved, created = models.Saved.objects.get_or_create(songId = song, userId = user)
        # saved, created= models.Saved.objects.get_or_create(defaults={"songId": song.id, "userId": user.id})
        # saved.save()
        return Response(saved.pk, status=status.HTTP_200_OK)
    
    def delete(self, request):
        rating = get_object_or_404(models.Saved, songId=request.data["songId"], userId = request.data["userId"])
        rating.delete()
        return Response("deleted", status=status.HTTP_200_OK)
    
class SongRec1(APIView):
    def post(self, request):
        response = {}
        songs = models.Song.objects.filter(genre=request.data["genre"]).exclude(name=request.data["name"])
        for song in songs:
            res = {"name": song.name, "genre": song.genre, "artist": song.artist}
            response[song.pk] = res
        return Response(response, status=status.HTTP_200_OK)
    
class SongRec2(APIView):
    def post(self, request):
        response = {}
        songs = models.Song.objects.filter(artist=request.data["artist"]).exclude(name=request.data["name"])
        for song in songs:
            res = {"name": song.name, "genre": song.genre, "artist": song.artist}
            response[song.pk] = res
        return Response(response, status=status.HTTP_200_OK)