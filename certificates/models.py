import hashlib
from django.db import models

class Certificate(models.Model):
    file = models.FileField(upload_to='certificates/')
    hash = models.CharField(max_length=64, blank=True, editable=False)

    def save(self, *args, **kwargs):
        if not self.hash:
            # Generate hash only if not already generated
            hasher = hashlib.sha256()
            for chunk in self.file.chunks():
                hasher.update(chunk)
            self.hash = hasher.hexdigest()

        super().save(*args, **kwargs)

    def __str__(self):
        return f"Certificate {self.id} - Hash: {self.hash[:10]}..."
