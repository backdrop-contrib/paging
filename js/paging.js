/**
 * @file
 * Attaches comment behaviors to the node form.
 */

(function ($) {
  Backdrop.behaviors.pagingFieldsetSummaries = {

    // Provide the vertical tab summaries.
    attach: function (context) {
      var $context = $(context);

      // Provide the summary for the node type form.
      $context.find('fieldset#edit-paging').backdropSetSummary(function() {
        var vals = [];

        // Pagination enabled.
        if ($context.find('input[name="paging[paging_enabled]"]:checked').length) {
          vals.push(Backdrop.t('Enabled'));
        }
        else {
          vals.push(Backdrop.t('Disabled'));
        }

        // Automatic vs manual setting.
        var automaticType = $context.find('input[name="paging[paging_automatic_method]"]:checked').val();
        if (automaticType == 'disabled') {
          vals.push(Backdrop.t('Manual by separator'));
        }
        else if (automaticType == 'chars') {
          vals.push(Backdrop.t('Automatic by characters'));
        }
        else if (automaticType == 'words') {
          vals.push(Backdrop.t('Automatic by words'));
        }

        return vals.join(', ');
      });

    }

  };
})(jQuery);
