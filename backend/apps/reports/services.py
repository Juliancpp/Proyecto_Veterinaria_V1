from apps.reports.models import Report


class ReportService:
    """Business logic for reports."""

    @staticmethod
    def update_status(report: Report, new_status: str) -> Report:
        """Approve or reject a report."""
        report.status = new_status
        report.full_clean()
        report.save(update_fields=['status', 'updated_at'])
        return report
