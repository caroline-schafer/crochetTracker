from rest_framework import serializers
from .models import Streak

class StreakSerializer(serializers.ModelSerializer):
    length = serializers.ReadOnlyField()

    class Meta:
        model = Streak
        fields = ['id', 'user', 'start_date', 'end_date', 'length']
        read_only_fields = ['user', 'length']
