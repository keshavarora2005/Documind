from django.db import models
from django.contrib.auth.models import User
import uuid

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    prompt_count = models.IntegerField(default=0)
    max_prompts = models.IntegerField(default=3)

    @property
    def prompts_remaining(self):
        return max(0, self.max_prompts - self.prompt_count)

    @property
    def can_prompt(self):
        return self.prompt_count < self.max_prompts

    def __str__(self):
        return f"{self.user.email} — {self.prompt_count}/{self.max_prompts}"

class UserSession(models.Model):
    USER_TYPES = [
        ("student", "Student"),
        ("business", "Business Owner"),
        ("lawyer", "Lawyer"),
        ("doctor", "Doctor"),
        ("researcher", "Researcher"),
        ("hr", "HR Professional"),
        ("finance", "Finance"),
        ("other", "Other"),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_type = models.CharField(max_length=20, choices=USER_TYPES)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user_type} — {self.id}"


class Document(models.Model):
    session = models.ForeignKey(UserSession, on_delete=models.CASCADE, related_name="documents")
    filename = models.CharField(max_length=255)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.filename


class ChatMessage(models.Model):
    ROLES = [("user", "User"), ("assistant", "Assistant")]
    session = models.ForeignKey(UserSession, on_delete=models.CASCADE, related_name="messages")
    role = models.CharField(max_length=10, choices=ROLES)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"{self.role}: {self.content[:50]}"