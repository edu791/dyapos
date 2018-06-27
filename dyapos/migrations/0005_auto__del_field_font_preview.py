# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Deleting field 'Font.preview'
        db.delete_column(u'dyapos_font', 'preview')


    def backwards(self, orm):
        # Adding field 'Font.preview'
        db.add_column(u'dyapos_font', 'preview',
                      self.gf('django.db.models.fields.files.ImageField')(default=datetime.datetime(2014, 7, 4, 0, 0), max_length=100),
                      keep_default=False)


    models = {
        u'auth.group': {
            'Meta': {'object_name': 'Group'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '80'}),
            'permissions': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['auth.Permission']", 'symmetrical': 'False', 'blank': 'True'})
        },
        u'auth.permission': {
            'Meta': {'ordering': "(u'content_type__app_label', u'content_type__model', u'codename')", 'unique_together': "((u'content_type', u'codename'),)", 'object_name': 'Permission'},
            'codename': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'content_type': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['contenttypes.ContentType']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        },
        u'contenttypes.contenttype': {
            'Meta': {'ordering': "('name',)", 'unique_together': "(('app_label', 'model'),)", 'object_name': 'ContentType', 'db_table': "'django_content_type'"},
            'app_label': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'model': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        },
        'dyapos.font': {
            'Meta': {'object_name': 'Font'},
            'filename': ('django.db.models.fields.files.FileField', [], {'max_length': '100'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        },
        'dyapos.presentation': {
            'Meta': {'object_name': 'Presentation'},
            'created_date': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'max_length': '500', 'null': 'True', 'blank': 'True'}),
            'edit_key': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True'}),
            'has_progressbar': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_private': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'key': ('django.db.models.fields.CharField', [], {'max_length': '30'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'num_likes': ('django.db.models.fields.IntegerField', [], {'default': '0'}),
            'num_views': ('django.db.models.fields.IntegerField', [], {'default': '0'}),
            'slides_timeout': ('django.db.models.fields.IntegerField', [], {'default': '0'}),
            'theme': ('django.db.models.fields.related.ForeignKey', [], {'default': '1', 'to': "orm['dyapos.Theme']"})
        },
        'dyapos.theme': {
            'Meta': {'object_name': 'Theme'},
            'background_color': ('django.db.models.fields.CharField', [], {'default': "'#d7d7d7'", 'max_length': '15'}),
            'body_color': ('django.db.models.fields.CharField', [], {'default': "'#000000'", 'max_length': '15'}),
            'body_font': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'body_set'", 'null': 'True', 'to': "orm['dyapos.Font']"}),
            'custom_logo': ('django.db.models.fields.files.ImageField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'extra_css_code': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'image_preview': ('django.db.models.fields.files.ImageField', [], {'max_length': '100'}),
            'is_custom': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '45'}),
            'subtitle_color': ('django.db.models.fields.CharField', [], {'default': "'#000000'", 'max_length': '15'}),
            'subtitle_font': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'subtitle_set'", 'null': 'True', 'to': "orm['dyapos.Font']"}),
            'title_color': ('django.db.models.fields.CharField', [], {'default': "'#000000'", 'max_length': '15'}),
            'title_font': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'title_set'", 'null': 'True', 'to': "orm['dyapos.Font']"}),
            'user': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['dyapos.User']", 'null': 'True', 'blank': 'True'})
        },
        'dyapos.user': {
            'Meta': {'object_name': 'User'},
            'date_joined': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'email': ('django.db.models.fields.EmailField', [], {'max_length': '75', 'blank': 'True'}),
            'first_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'groups': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'related_name': "u'user_set'", 'blank': 'True', 'to': u"orm['auth.Group']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'info': ('django.db.models.fields.TextField', [], {'max_length': '250', 'null': 'True', 'blank': 'True'}),
            'is_active': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'is_staff': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'is_superuser': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'last_login': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'last_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'password': ('django.db.models.fields.CharField', [], {'max_length': '128'}),
            'reset_password_key': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True'}),
            'user_permissions': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'related_name': "u'user_set'", 'blank': 'True', 'to': u"orm['auth.Permission']"}),
            'username': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '30'})
        },
        'dyapos.userpresentation': {
            'Meta': {'object_name': 'UserPresentation'},
            'can_edit': ('django.db.models.fields.BooleanField', [], {}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_owner': ('django.db.models.fields.BooleanField', [], {}),
            'presentation': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['dyapos.Presentation']"}),
            'user': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['dyapos.User']"})
        }
    }

    complete_apps = ['dyapos']