<?php
/**
 * @file
 * Administrative pages for paging module.
 */

/**
 * Menu callback; display module settings form.
 */
function paging_settings() {
  // Warn if paging filter is not yet enabled for any input format.
  $paging_filter = FALSE;
  // Retrieve all input filters.
  foreach (filter_formats() as $format) {
    // Further retrieve all input formats.
    foreach (filter_list_format($format->format) as $filter) {
      // Check if any of the input formats have paging filter enabled.
      if ($filter->module == 'paging') {
        $paging_filter = TRUE;
        break;
      }
    }
  }
  if (!$paging_filter) {
    backdrop_set_message(t('Paging filter has not been enabled for any text formats. !link.',
      array('!link' => l(t('Enable it now'), 'admin/config/content/formats'))), 'warning paging-warning');
  }

  $form = array();

  // Geerate a list of paging settings for all node types.
  $node_types = node_type_get_types();
  asort($node_types);
  $rows = array();
  foreach ($node_types as $type => $node_type) {
    $enabled = variable_get('paging_enabled_' . $type, FALSE);
    $status = t('Disabled');
    $ops = l(t('Enable'), 'admin/structure/types/manage/' . $type);
    $auto = '';
    $len = '';

    if ($enabled) {
      $status = t('Enabled');
      $method = variable_get('paging_automatic_method_' . $type, 'disabled');
      if ($method == 'chars') {
        $auto = t('Break every') . ' ';
        $auto .= variable_get('paging_automatic_chars_' . $type, 4000);
        $auto .= ' ' . t('characters');
      }
      else if ($method == 'words') {
        $auto = t('Break every') . ' ';
        $auto .= variable_get('paging_automatic_words_' . $type, 1000);
        $auto .= ' ' . t('words');
      }
      else {
        $auto = t('Disabled');
      }
      $ops = l(t('Configure'), 'admin/structure/types/manage/' . $type);
    }

    $row = array(
      'type' => t($node_type->name),
      'status' => $status,
      'auto' => $auto,
      'ops' => $ops,
    );
    $rows[] = $row;
  }

  $header = array(t('Content type'), t('Pagination'), t('Automatc'), t('Operations'));
  $form['node_types'] = array(
    '#type' => 'markup',
    '#markup' => theme('table', array('header' => $header, 'rows' => $rows)),
  );

  // Set the id of the top-level form tag.
  $form['#id'] = 'paging';

  // General paging settings, not specific to node type.
  $form['paging_general'] = array(
    '#type' => 'fieldset',
    '#title' => t('Pagination settings'),
    '#collapsible' => FALSE,
  );

  // Paging separator string.
  // @TODO will need an upgrade path.
  $form['paging_general']['paging_separator'] = array(
    '#type' => 'textfield',
    '#title' => t('Page separator string'),
    '#size' => 20,
    '#maxlength' => 255,
    '#required' => TRUE,
    '#default_value' => variable_get('paging_separator', '<!--pagebreak-->'),
    '#description' => t('Use an HTML tag that will render reasonably when paging is not enabled, such as %pagebreak or %hr.', array('%pagebreak' => variable_get('paging_separator', '<!--pagebreak-->'), '%hr' => '<hr />')),
  );

  // Set the browser's title to current page's name.
  $form['paging_general']['paging_name_title'] = array(
    '#type' => 'checkbox',
    '#title' => t('Change both the page title and the browser window title to match the current page.'),
    '#default_value' => variable_get('paging_name_title', TRUE),
  );

  // Change "Read more" path when first page is greater than or equal to the teaser.
  $form['paging_general']['paging_read_more_enabled'] = array(
    '#type' => 'checkbox',
    '#title' => t('Link "Read more" to second page'),
    '#description' => t('Makes the "Read more" link for teasers link to the second page of the content when the teaser is the same or longer than the first page.'),
    '#default_value' => variable_get('paging_read_more_enabled', 0),
  );

  // Number of pagers on a page.
  $form['paging_general']['paging_pager_count'] = array(
    '#type' => 'radios',
    '#title' => t('Number of Pagers on each page'),
    '#options' => array(
      'one' => t('One'),
      'two' => t('Two'),
    ),
    '#required' => TRUE,
    '#description' => t('Pagers can be positioned for each <a href="@url">content type</a> under <em>Manage display</em>.',
      array('%none' => t('None'), '@paging' => '$node->paging', '@url' => url('admin/structure/types'))),
    '#default_value' => variable_get('paging_pager_count', 'one'),
  );

  return system_settings_form($form);
}
