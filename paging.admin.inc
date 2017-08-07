<?php
/**
 * @file
 * Administrative pages for paging module.
 */

/**
 * Menu callback; display module settings form.
 */
function paging_settings() {
  $config = config('paging.settings');
  $form = array('#config' => 'paging.settings');

  // Geerate a list of paging settings for all node types.
  $node_types = node_type_get_types();
  asort($node_types);

  $rows = array();
  foreach ($node_types as $type => $node_type) {
    $enabled = $config->get($type . '_enabled');
    $status = '';
    $link_options = array('query' => array('destination' => 'admin/config/content/paging'));
    $ops = l(t('Enable'), 'admin/structure/types/manage/' . $type, $link_options);
    $auto = '';
    $len = '';

    if ($enabled) {
      $status = t('Enabled');
      $method = $config->get($type . '_automatic_method');
      if ($method == 'chars') {
        $auto = t('Break every') . ' ';
        $auto .= $config->get($type . '_automatic_chars');
        $auto .= ' ' . t('characters');
      }
      else if ($method == 'words') {
        $auto = t('Break every') . ' ';
        $auto .= $config->get($type . '_automatic_words');
        $auto .= ' ' . t('words');
      }
      else {
        $auto = t('Disabled');
      }
      $ops = l(t('Configure'), 'admin/structure/types/manage/' . $type, $link_options);
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
  $form['paging_general']['separator'] = array(
    '#type' => 'textfield',
    '#title' => t('Page separator string'),
    '#size' => 20,
    '#maxlength' => 255,
    '#required' => TRUE,
    '#default_value' => $config->get('separator'),
    '#description' => t('Use an HTML tag that will render reasonably when paging is not enabled, such as %pagebreak or %hr.', array('%pagebreak' => $config->get('separator'), '%hr' => '<hr />')),
  );

  // Set the browser's title to current page's name.
  $form['paging_general']['name_title'] = array(
    '#type' => 'checkbox',
    '#title' => t('Change both the page title and the browser window title to match the current page.'),
    '#default_value' => $config->get('name_title'),
  );

  // Change "Read more" path when first page is greater than or equal to the teaser.
  $form['paging_general']['read_more_enabled'] = array(
    '#type' => 'checkbox',
    '#title' => t('Link "Read more" to second page'),
    '#description' => t('Makes the "Read more" link for teasers link to the second page of the content when the teaser is the same or longer than the first page.'),
    '#default_value' => $config->get('read_more_enabled'),
  );

  // Number of pagers on a page.
  $form['paging_general']['pager_count'] = array(
    '#type' => 'radios',
    '#title' => t('Number of Pagers on each page'),
    '#options' => array(
      'one' => t('One'),
      'two' => t('Two'),
    ),
    '#required' => TRUE,
    '#description' => t('Pagers can be positioned for each <a href="@url">content type</a> under <em>Manage displays</em>.',
      array('%none' => t('None'), '@paging' => '$node->paging', '@url' => url('admin/structure/types'))),
    '#default_value' => $config->get('pager_count'),
  );

  return system_settings_form($form);
}
