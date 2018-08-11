from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError

import logging

logger = logging.getLogger(__name__)

class Address(models.Model):
    address1 = models.CharField(max_length=20)
    address2 = models.CharField(max_length=20, blank=True)
    address3 = models.CharField(max_length=20, blank=True)
    city = models.CharField(max_length=20)
    state = models.CharField(max_length=2)
    zipcode = models.CharField(max_length=5)

    def __str__(self):
        return f'{self.address1}, {self.city}, {self.state} {self.zipcode}'

class Company(models.Model):
    name = models.CharField(max_length=32)
    address = models.OneToOneField(
        Address,
        on_delete = models.CASCADE,
        related_name = 'company'
    )

    def __str__(self):
        return f'{self.name} - {self.address}'


class CanteenUser(AbstractUser):

    colleagues = models.ManyToManyField(
        'self',
        models.SET_NULL,
        blank = True,
    )
    company = models.ForeignKey(
        Company,
        models.SET_NULL,
        blank = True,
        null = True,
        related_name = 'employees',
    )

    def __str__(self):
        return f'{self.first_name} {self.last_name} - {self.email}'

class Event(models.Model):

    restaurantId = models.CharField(max_length=22)
    restaurantName = models.CharField(max_length=32)
    attendees = models.ManyToManyField(
        CanteenUser
    )

    eventTime = models.DateTimeField()

    creator = models.ForeignKey(
        CanteenUser,
        on_delete = models.CASCADE,
        related_name = 'myEvents'
    )

    NEW = 'NW'
    IN_PROGRESS = 'IP'
    DONE = 'DN'
    STATUS_CHOICES = (
        (NEW, 'New'),
        (IN_PROGRESS, 'In Progress'),
        (DONE, 'Done')
    )
    status = models.CharField(
        max_length = 2,
        choices = STATUS_CHOICES,
        default = NEW
    )

    def __str__(self):
        return f'{self.restaurantName} - {self.eventTime}'