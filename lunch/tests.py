from django.test import TestCase
from django.utils.timezone import make_aware
from datetime import datetime

from .models import Address, CanteenUser, Company, Event

# Create your tests here.
class ModelsTestCase(TestCase):

    def setUp(self):
        u1 = CanteenUser.objects.create_user('test1', 'test1@test.com', 'test1234')
        u2 = CanteenUser.objects.create_user('test2', 'test2@test.com', 'test5678')
        address1 = Address(address1="888 Boylston St", city="Boston", state="MA", zipcode="02119")
        address1.save()
        company1 = Company(name="Test Company",address=address1)
        company1.save()
        e1 = Event(restaurantId = 'inAEY3i1hYR4BlJfPgKFPw', 
                    eventTime = make_aware(datetime(2018, 8, 12, 12, 30)),
                    creator = u1)
        e1.save()

    def test_valid_user(self):
        u1 = CanteenUser.objects.get(username='test1')
        self.assertEqual(u1.username, 'test1')
        self.assertEqual(u1.email, 'test1@test.com')

        u2 = CanteenUser.objects.get(username='test2')
        self.assertEqual(u2.username, 'test2')
        self.assertEqual(u2.email, 'test2@test.com')

    def test_valid_company(self):
        company1 = Company.objects.get(name='Test Company')
        self.assertEqual(company1.name, 'Test Company')
        self.assertEqual(f'{company1.address}', "888 Boylston St, Boston, MA 02119")

    def test_valid_event(self):
        u1 = CanteenUser.objects.get(username='test1')
        e1 = Event.objects.first()
        self.assertEqual(e1.restaurantId, 'inAEY3i1hYR4BlJfPgKFPw')
        self.assertEqual(e1.creator, u1)

    def test_add_company(self):
        u1 = CanteenUser.objects.get(username='test1')
        company1 = Company.objects.get(name='Test Company')

        u1.company = company1
        u1.save()
        self.assertEqual(u1.company.name, company1.name)

    def test_add_colleage(self):
        u1 = CanteenUser.objects.get(username='test1')
        u2 = CanteenUser.objects.get(username='test2')

        u1.colleagues.add(u2)
        self.assertIn(u2, u1.colleagues.all())
        self.assertIn(u1, u2.colleagues.all())

    def test_add_attendees(self):
        e1 = Event.objects.first()
        u2 = CanteenUser.objects.get(username='test2')
        e1.attendees.add(u2)
        self.assertIn(u2, e1.attendees.all())
