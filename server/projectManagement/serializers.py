# projectManagement/serializers.py
from rest_framework import serializers
from .models import Project, Log
from datetime import date


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'  # or list fields explicitly if you want
        read_only_fields = ['id', 'user']  # user usually comes from request, so don't allow setting directly


class LogSerializer(serializers.ModelSerializer):
    date = serializers.DateField(required=False)  # Make optional in serializer

    class Meta:
        model = Log
        fields = ['id', 'user', 'project', 'date']
        read_only_fields = ['id', 'user']

    def validate(self, data):
        user = self.context['request'].user
        log_date = data.get('date') or date.today()  # default to today if none

        if Log.objects.filter(user=user, date=log_date).exists():
            raise serializers.ValidationError("You can only log once per day.")

        # Replace date in data so perform_create uses the right value
        data['date'] = log_date
        return data
