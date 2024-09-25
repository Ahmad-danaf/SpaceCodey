from django.contrib import admin
from .models import NASAEvent

# Register your models here.

@admin.register(NASAEvent)
class NASAEventAdmin(admin.ModelAdmin):
    list_display = ('event_id', 'title', 'link', 'categories')  
    search_fields = ('title', 'categories') 