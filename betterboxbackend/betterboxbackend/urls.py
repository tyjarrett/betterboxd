"""
URL configuration for betterboxbackend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path("createuser/", views.UserView.as_view()),
    path("getuser/", views.UserIdView.as_view()),
    path("getotherusers/", views.OtherUsersView.as_view()),
    path("getusername/", views.UsernameView.as_view()),
    path("getsongs/", views.SongView.as_view()),
    path("addsong/", views.SongView.as_view()),
    path("getratings/", views.AllRatings.as_view()),
    path("getotherratings/", views.OtherRatings.as_view()),
    path("getrating/", views.Rating.as_view()),
    path("sendrating/", views.UpdateRating.as_view()),
    path("songrec1/", views.SongRec1.as_view()),
    path("songrec2/", views.SongRec2.as_view()),
    path("getsongname/", views.SongName.as_view()),
    path("getsonginfo/", views.SongInfo.as_view()),
    path("deleterating/", views.Rating.as_view()),
    path("savedsongs/", views.Saved.as_view()),
    path("savesong/", views.SaveSong.as_view()),
    path("deletesave/", views.SaveSong.as_view()),
    path("viewsong/", views.SongRatings.as_view()),
]
