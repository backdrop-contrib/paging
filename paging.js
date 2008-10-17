// $Id$

var names = new Array();

Drupal.behaviors.paging = function(context) {
  $('textarea.teaser:not(.teaser-processed)', context).each(function() {
    var include = $('#' + this.id.substring(0, this.id.length - 2) + 'include');
    var widget = Drupal.settings.paging.widget;
    
    if (widget == 1) {
      var path = Drupal.settings.basePath + Drupal.settings.paging.module_path;
      var string = Drupal.t('Insert page separator');
      // Add paging separator string image.
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
  $('#node-form .body-field-wrapper').append('<div id="paging-names-wrapper"></div>');
  $('textarea#edit-body').each(paging_handle_names).bind('click keyup blur', paging_handle_names);
  $('#node-form').submit(function() {
    $('textarea#edit-body').each(function() {
      $(this).val('<!--pagenames:' + paging_return_names().join('||') + "-->" + this.value);
    });
  });
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
  var separator = Drupal.settings.paging.separator;
  var str = $(this).val();
  if (str.indexOf(separator) != -1) {
    pages = str.split(separator);
  }
  var match = str.match(/<!--pagenames:(.*?)-->/);
  
  // TODO: names doesn't store updated names.
  names = names.length ? names : match[1].split('||');
  console.debug(names);
  $(this).val(str.replace(/<!--pagenames:(.*?)-->/, ''));
  var output = '';
  var title = $('#edit-title').val();
  for (var x = 0; x < pages.length; x++) {
    output += '<label for="edit-title[' + x + ']">' + Drupal.t("Name of !number page: ", {'!number': (x + 1).ordinal()}) + '</label>' + "\t" + '<input type="text" class="form-text" value="' + (names[x] || Drupal.t('!title - Page !number', {'!title': title, '!number': (x + 1)})) + '" size="60" name="title[' + x + ']" maxlength="255"/>' + "\n";
  }
  // @TODO Handle names when fields are updated.
  $('#paging-names-wrapper').html('<fieldset class="" id="paging-page-names"><legend class="">' + Drupal.t("Page names") + '</legend>' + output + '</fieldset>');//.find('input').bind('click keyup blur', paging_handle_names);
}

function paging_return_names() {
  var names = new Array();
  var i = 0;
  $('#paging-page-names').find('input[@type=text]').each(function() {
      names[i] = $(this).val();
      i++;
    }).remove();

  return names;
}

Number.prototype.ordinal = function () {
  return this + (
    (this % 10 == 1 && this % 100 != 11) ? '<sup>st</sup>' :
    (this % 10 == 2 && this % 100 != 12) ? '<sup>nd</sup>' :
    (this % 10 == 3 && this % 100 != 13) ? '<sup>rd</sup>' : '<sup>th</sup>'
  );
}
