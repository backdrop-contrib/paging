Paging
==========

Break long pages into smaller ones automatically by words/characters limit, or
by means of a customizable pagination tag. For example:

    First page here.
    <!--pagebreak-->
    Second page here.
    <!--pagebreak-->
    More pages here.


Installation
----------
1. Install the pagigng moduile as usual, and enable at admin/build/modules.
   (See http://drupal.org/documentation/install/modules-themes.)

2. Enable paging for the content types you want to use it on, in the paging
   configuration at admin/config/content/paging.

3. Enable the paging filter for the relevant text format (usually Filtered HTML),
   in Text Formats configuration at admin/config/content/formats path.


Support
----------
* If you experience a problem with paging module, file a request or issue in
  the paging queue at http://drupal.org/project/issues/paging.


Credits
----------
* Original module written by Marco Scutari.
* Rewritten and considerably shortened and by Earl Miles.
* Rewritten, extended and maintained by Gurpartap Singh.
* Drupal 7 upgrade (modified version) by Jen Lampton.
