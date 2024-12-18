# Generated by Django 5.1.4 on 2024-12-09 06:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('betterboxbackend', '0004_rating_songid_rating_userid'),
    ]

    operations = [
        migrations.CreateModel(
            name='Saved',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('songId', models.IntegerField()),
                ('userId', models.IntegerField()),
            ],
        ),
        migrations.AlterField(
            model_name='rating',
            name='stars',
            field=models.DecimalField(decimal_places=1, default=-1, max_digits=2),
        ),
    ]
