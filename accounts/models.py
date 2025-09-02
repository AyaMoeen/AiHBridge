from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils import timezone
from django.conf import settings
import uuid
    
def generate_username():
        return f"user_{uuid.uuid4().hex[:settings.USERNAME_SUFFIX_LENGTH]}"
    
class UserManager(BaseUserManager["User"]):

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        extra_fields.setdefault("username", generate_username())
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user


    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    username: models.CharField = models.CharField(max_length=settings.USERNAME_MAX_LENGTH, unique=True, null=True, blank=True)
    name: models.CharField = models.CharField(max_length=settings.NAME_MAX_LENGTH)
    email: models.EmailField = models.EmailField(unique=True)
    reset_code: models.CharField = models.CharField(max_length=settings.RESET_CODE_LENGTH, blank=True, null=True)
    reset_token: models.CharField = models.CharField(max_length=settings.RESET_TOKEN_LENGTH, blank=True, null=True)
    reset_code_created_at: models.DateTimeField = models.DateTimeField(null=True, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'name']

    objects = UserManager()
    
    def is_reset_code_expired(self, expiry_minutes=settings.RESET_CODE_EXPIRY_MINUTES):
        """Check if the reset code has expired"""
        if not self.reset_code_created_at:
            return True
        return timezone.now() > self.reset_code_created_at + timezone.timedelta(minutes=expiry_minutes)

    def __str__(self):
        return self.email  