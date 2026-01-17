from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="Mood Journal API",
        default_version="v1",
        description="API สำหรับระบบ Mood Journal",
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path("admin/", admin.site.urls),

    # API docs
    path("api/docs/", schema_view.with_ui("swagger", cache_timeout=0)),
    path("api/docs/redoc/", schema_view.with_ui("redoc", cache_timeout=0)),
    path("api/docs/json/", schema_view.without_ui(cache_timeout=0)),

    # API only
    path("api/accounts/", include("accounts.urls")),
    path("api/journal/", include("journal.urls")),
]

# ✅ serve MEDIA เท่านั้น (เช่น upload รูป)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
