# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'UserPresentation'
        db.create_table(u'dyapos_userpresentation', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('user', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['dyapos.User'])),
            ('presentation', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['dyapos.Presentation'])),
            ('is_owner', self.gf('django.db.models.fields.BooleanField')()),
            ('can_edit', self.gf('django.db.models.fields.BooleanField')()),
        ))
        db.send_create_signal('dyapos', ['UserPresentation'])

        # Adding model 'Presentation'
        db.create_table(u'dyapos_presentation', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('theme', self.gf('django.db.models.fields.related.ForeignKey')(default=1, to=orm['dyapos.Theme'])),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=100)),
            ('description', self.gf('django.db.models.fields.TextField')(max_length=500, null=True, blank=True)),
            ('created_date', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, blank=True)),
            ('key', self.gf('django.db.models.fields.CharField')(max_length=30)),
            ('edit_key', self.gf('django.db.models.fields.CharField')(max_length=50, null=True)),
            ('is_private', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('has_progressbar', self.gf('django.db.models.fields.BooleanField')(default=True)),
            ('slides_timeout', self.gf('django.db.models.fields.IntegerField')(default=0)),
            ('num_views', self.gf('django.db.models.fields.IntegerField')(default=0)),
            ('num_likes', self.gf('django.db.models.fields.IntegerField')(default=0)),
        ))
        db.send_create_signal('dyapos', ['Presentation'])

        # Adding model 'Theme'
        db.create_table(u'dyapos_theme', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=45)),
            ('is_custom', self.gf('django.db.models.fields.BooleanField')(default=True)),
            ('user', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['dyapos.User'], null=True, blank=True)),
            ('image_preview', self.gf('django.db.models.fields.files.ImageField')(max_length=100)),
            ('custom_logo', self.gf('django.db.models.fields.files.ImageField')(max_length=100, null=True, blank=True)),
            ('background_color', self.gf('django.db.models.fields.CharField')(default='#d7d7d7', max_length=15)),
            ('background_image', self.gf('django.db.models.fields.files.ImageField')(max_length=100, null=True, blank=True)),
            ('title_font', self.gf('django.db.models.fields.CharField')(max_length=45)),
            ('title_color', self.gf('django.db.models.fields.CharField')(default='#000000', max_length=15)),
            ('subtitle_font', self.gf('django.db.models.fields.CharField')(max_length=45)),
            ('subtitle_color', self.gf('django.db.models.fields.CharField')(default='#000000', max_length=15)),
            ('body_font', self.gf('django.db.models.fields.CharField')(max_length=45)),
            ('body_color', self.gf('django.db.models.fields.CharField')(default='#000000', max_length=15)),
            ('extra_css_code', self.gf('django.db.models.fields.TextField')(null=True, blank=True)),
        ))
        db.send_create_signal('dyapos', ['Theme'])

        # Adding model 'User'
        db.create_table(u'dyapos_user', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('password', self.gf('django.db.models.fields.CharField')(max_length=128)),
            ('last_login', self.gf('django.db.models.fields.DateTimeField')(default=datetime.datetime.now)),
            ('is_superuser', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('username', self.gf('django.db.models.fields.CharField')(unique=True, max_length=30)),
            ('first_name', self.gf('django.db.models.fields.CharField')(max_length=30, blank=True)),
            ('last_name', self.gf('django.db.models.fields.CharField')(max_length=30, blank=True)),
            ('email', self.gf('django.db.models.fields.EmailField')(max_length=75, blank=True)),
            ('is_staff', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('is_active', self.gf('django.db.models.fields.BooleanField')(default=True)),
            ('date_joined', self.gf('django.db.models.fields.DateTimeField')(default=datetime.datetime.now)),
            ('info', self.gf('django.db.models.fields.TextField')(max_length=250, null=True, blank=True)),
            ('reset_password_key', self.gf('django.db.models.fields.CharField')(max_length=50, null=True)),
        ))
        db.send_create_signal('dyapos', ['User'])

        # Adding M2M table for field groups on 'User'
        m2m_table_name = db.shorten_name(u'dyapos_user_groups')
        db.create_table(m2m_table_name, (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('user', models.ForeignKey(orm['dyapos.user'], null=False)),
            ('group', models.ForeignKey(orm[u'auth.group'], null=False))
        ))
        db.create_unique(m2m_table_name, ['user_id', 'group_id'])

        # Adding M2M table for field user_permissions on 'User'
        m2m_table_name = db.shorten_name(u'dyapos_user_user_permissions')
        db.create_table(m2m_table_name, (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('user', models.ForeignKey(orm['dyapos.user'], null=False)),
            ('permission', models.ForeignKey(orm[u'auth.permission'], null=False))
        ))
        db.create_unique(m2m_table_name, ['user_id', 'permission_id'])


    def backwards(self, orm):
        # Deleting model 'UserPresentation'
        db.delete_table(u'dyapos_userpresentation')

        # Deleting model 'Presentation'
        db.delete_table(u'dyapos_presentation')

        # Deleting model 'Theme'
        db.delete_table(u'dyapos_theme')

        # Deleting model 'User'
        db.delete_table(u'dyapos_user')

        # Removing M2M table for field groups on 'User'
        db.delete_table(db.shorten_name(u'dyapos_user_groups'))

        # Removing M2M table for field user_permissions on 'User'
        db.delete_table(db.shorten_name(u'dyapos_user_user_permissions'))


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
            'background_image': ('django.db.models.fields.files.ImageField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'body_color': ('django.db.models.fields.CharField', [], {'default': "'#000000'", 'max_length': '15'}),
            'body_font': ('django.db.models.fields.CharField', [], {'max_length': '45'}),
            'custom_logo': ('django.db.models.fields.files.ImageField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'extra_css_code': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'image_preview': ('django.db.models.fields.files.ImageField', [], {'max_length': '100'}),
            'is_custom': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '45'}),
            'subtitle_color': ('django.db.models.fields.CharField', [], {'default': "'#000000'", 'max_length': '15'}),
            'subtitle_font': ('django.db.models.fields.CharField', [], {'max_length': '45'}),
            'title_color': ('django.db.models.fields.CharField', [], {'default': "'#000000'", 'max_length': '15'}),
            'title_font': ('django.db.models.fields.CharField', [], {'max_length': '45'}),
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