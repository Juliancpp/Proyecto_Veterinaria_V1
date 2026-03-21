from django.contrib import admin

from apps.reports.models import Report


@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'location', 'status', 'created_at')
    list_filter = ('status',)
    search_fields = ('location', 'description')
