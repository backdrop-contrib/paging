// $Id$

var names = new Array();

Drupal.behaviors.paging = function(context) {
  $('textarea.teaser').each(function() {
    var include = $('#' + this.id.substring(0, this.id.length - 2) + 'include');
    var widget = Drupal.settings.paging.widget;

    if (widget == 1) {
    // Add paging separator string image.
      var path = Drupal.settings.basePath + Drupal.settings.paging.module_path;
      var string = Drupal.t('Insert page separator');
      var image = $('<div class="paging-button-wrapper"><img alt="" src="' + path + '/paging-separator.png" class="paging-separator-image" /></div>');
      $(include).parent().parent().before(image);
      $('img', image).attr('alt', string).attr('title', string).bind('click', paging_insert_separator);
    }
    else if (widget == 2) {
      // Add paging separator string button.
      var button = $('<div class="paging-button-wrapper"><input type="button" class="paging-separator-button" /></div>');
      $(include).parent().parent().before(button);
      $('input', button).val(Drupal.t('Insert page separator')).bind('click', paging_insert_separator);
    }
  });

  var page_names = Drupal.settings.paging.page_names;
  if (page_names == 1) {
    $('#edit-body-wrapper').after('<div id="paging-names-wrapper"><fieldset class="collapsible form-item" id="paging-page-names" style="overflow: hidden;"><legend class="">' + Drupal.t("Page names") + '</legend><div id="paging-names-inner" class="form-item"></div></fieldset></div>');
    $('textarea#edit-body').each(paging_handle_names).bind('click keyup blur', paging_handle_names);
    $('#node-form').submit(function() {
      $('textarea#edit-body').each(function() {
        $(this).val('<!--pagenames:' + paging_return_names().join('||') + "-->" + this.value);
      });
    });
  }
}

function paging_insert_separator() {
  var separator = Drupal.settings.paging.separator;
  $('textarea#edit-body').each(function() {
    if (document.selection) {
      this.focus();
      document.selection.createRange().text = separator;
    }
    else if (this.selectionStart || this.selectionStart == '0') {
      var cursorPos = this.selectionEnd + separator.length;
      this.value = this.value.substring(0, this.selectionEnd) + separator + this.value.substring(this.selectionEnd);
      this.selectionStart = this.selectionEnd = cursorPos;
    }
    else {
      this.value = this.value + separator;
    }
    this.focus();
  }).trigger('click');

  return false;
}

function paging_handle_names(event) {
  var output = '';
  var separator = Drupal.settings.paging.separator;
  var str = $(this).val();

  var pages = str.indexOf(separator) != -1 ? str.split(separator) : 0;

  var match = str.match(/<!--pagenames:(.*?)-->/) || [];
  $(this).val(str.replace(/<!--pagenames:(.*?)-->/, ''));

  // TODO: names var doesn't store updated names.
  names = names || (match[1] ? match[1].split('||') : []);

  if (pages.length > 0) {
    for (var x = 0; x < pages.length; x++) {
      var title = $('#edit-title').val();
      names[x] = (names[x] || Drupal.t('!title - Page !number', {'!title': title, '!number': (x + 1)}));
      output += '<label for="edit-paging-title[' + x + ']">' + Drupal.t("Name of !number page: ", {'!number': (x + 1).ordinal()}) + '</label>' + "\t" + '<input type="text" class="form-text" value="' + names[x] + '" size="20" name="edit-paging-title[' + x + ']" maxlength="255"/>' + "\n";
    }
    $('#paging-names-wrapper').show();
    $('#paging-names-wrapper #paging-names-inner').html(output);
  }
  else {
    $('#paging-names-wrapper').hide();
  }
}

function paging_return_names() {
  var names = new Array();
  var i = 0;
  $('#paging-page-names').find('input[@type=text]').each(function() {
      names[i] = $(this).val();
      i++;
    }).parents('fieldset').remove();

  return names;
}

Number.prototype.ordinal = function () {
  return this + (
    (this % 10 == 1 && this % 100 != 11) ? '<sup>st</sup>' :
    (this % 10 == 2 && this % 100 != 12) ? '<sup>nd</sup>' :
    (this % 10 == 3 && this % 100 != 13) ? '<sup>rd</sup>' : '<sup>th</sup>'
  );
}
