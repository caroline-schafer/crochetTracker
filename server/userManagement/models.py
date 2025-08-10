from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models

class CustomUserManager(BaseUserManager):
    def create_user(self, username, email, preferences=None, password=None):
        if not email:
            raise ValueError("Users must have an email address")
        if not username:
            raise ValueError("Users must have a username")

        email = self.normalize_email(email)
        user = self.model(
            username=username,
            email=email,
            preferences=preferences or {},
        )
        user.set_password(password)
        user.save(using=self._db)
        return user
    

    def create_superuser(self, username, email, preferences=None, password=None):
        user = self.create_user(username, email, preferences, password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class CustomUser(AbstractBaseUser, PermissionsMixin):
    id = models.BigAutoField(primary_key=True)  # Django adds id by default; this is explicit
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    preferences = models.JSONField(default=dict, blank=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    def __str__(self):
        return self.username
