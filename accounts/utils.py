import uuid
from django.core.mail import send_mail
from django.contrib.auth import get_user_model
from django.conf import settings
from django.utils import timezone
import random

def generate_code():
    """Generate a new 6-digit numeric code."""
    return str(random.randint(100000, 999999))

User = get_user_model()

def generate_reset_token():
    """Generate a UUID4 token for password reset."""
    return str(uuid.uuid4())

def send_reset_code_email(user, code):
    """Send verification code to user's email."""
    send_mail(
        subject="Password Reset Verification Code",
        message=f"Your verification code is: {code}",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
    )

def get_user_by_email(email):
    try:
        return User.objects.get(email=email)
    except User.DoesNotExist:
        return None

def get_user_by_reset_code(code):
    try:
        return User.objects.get(reset_code=code)
    except User.DoesNotExist:
        return None

def get_user_by_reset_token(token):
    try:
        return User.objects.get(reset_token=token)
    except User.DoesNotExist:
        return None

def is_reset_code_expired(user):
    """Return True if the user's reset code has expired."""
    if not user.reset_code_created_at:
        return True
    expiry_time = user.reset_code_created_at + timezone.timedelta(
        minutes=settings.RESET_CODE_EXPIRY_MINUTES
    )
    return timezone.now() > expiry_time
