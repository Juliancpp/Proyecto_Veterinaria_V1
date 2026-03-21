from rest_framework import serializers

from apps.reports.models import Report


class ReportSerializer(serializers.ModelSerializer):
    """Full serializer for creating and listing reports."""

    user_name = serializers.CharField(source='user.name', read_only=True)
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Report
        fields = (
            'id', 'user', 'user_name', 'location', 'description',
            'image', 'image_url', 'status', 'created_at', 'updated_at',
        )
        read_only_fields = ('id', 'user', 'user_name', 'status', 'created_at', 'updated_at')

    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class ReportUpdateSerializer(serializers.ModelSerializer):
    """Serializer for staff/admin to approve or reject a report."""

    class Meta:
        model = Report
        fields = ('id', 'status')
        read_only_fields = ('id',)
