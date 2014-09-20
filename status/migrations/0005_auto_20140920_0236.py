# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('status', '0004_auto_20140920_0234'),
    ]

    operations = [
        migrations.AlterField(
            model_name='status',
            name='title',
            field=models.CharField(max_length=255),
        ),
    ]
