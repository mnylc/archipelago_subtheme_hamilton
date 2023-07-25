/**
 * @file
 * Global utilities.
 *
 */
(function($, Drupal) {

  'use strict';

  Drupal.behaviors.archipelago_subtheme_rpi = {
    attach: function (context, settings) {
      if ($(context).is('.view') || context == document) {
        /* Initialize Popovers */
        var popoverTriggerList = [].slice.call(context.querySelectorAll('[data-bs-toggle="popover"]'))
        var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
          return new bootstrap.Popover(popoverTriggerEl)
        })
        $("#main-breadcrumbs").find('.views-display-link').remove();
        $(context).once('view-header').find('.view-header .views-display-link').each(function () {
          $(this).detach().appendTo("#main-breadcrumbs");
        });
      }
    }
  }
})(jQuery, Drupal);
