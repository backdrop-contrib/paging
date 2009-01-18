About
_____

Break long pages into smaller ones automatically by words/characters limit, or by means of a customizable pagination tag. For example:

First page here.
<!--pagebreak-->
Second page here.
<!--pagebreak-->
More pages here.


Install
_____

1. Copy the paging-6.x-x.x.tar.gz contents to sites/SITENAME/modules directory (usually sites/all/modules) and enable the module at admin/build/modules path.

2. Enable paging for the content types you want to use it on, in the paging configuration at admin/settings/paging path.

3. Then enable the paging filter for the relevant input format(usually Filtered HTML), in Input Formats configuration at admin/settings/filters path.

4. Your module is now setup and ready to be used.


Limitations
-----

Paging only works with content types using the core "Body" field.


Support
-----

If you experience a problem with paging module, file a request or issue on the paging queue at http://drupal.org/project/issues/paging. DO NOT POST IN THE FORUMS. Posting in the issue queues is a direct line of communication with the module authors.


Credits
_____

Original module written by Marco Scutari.
Rewritten and considerably shortened and made more Drupal-friendly by Earl Miles.
Yet again rewritten, extended and currently maintained by Gurpartap Singh.