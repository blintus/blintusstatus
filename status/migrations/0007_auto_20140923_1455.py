# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('status', '0006_subscriptions'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Subscriptions',
            new_name='Subscription',
        ),
    ]
