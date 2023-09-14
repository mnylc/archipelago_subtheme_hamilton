/**
 * @file
 * Global utilities.
 *
 */
(function($, Drupal) {

  'use strict';

  Drupal.behaviors.archipelago_subtheme_hamilton = {
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

      $('#page-wrapper').once('attache_observer')
        .each(function (index, value) {
            var observer = new IntersectionObserver(function (entries) {
              const ratio = entries[0].intersectionRatio;
              if (ratio < 0.4) {
                let $topbar = document.querySelector('#navbar-top');
                if (!$topbar.classList.contains('intersected')) {
                  $topbar.classList.add('intersected');
                }
              }
              else if (ratio > 0.6) {
                let $topbar = document.querySelector('#navbar-top');
                if ($topbar.classList.contains('intersected')) {
                  $topbar.classList.remove('intersected');
                }
              }
            },{
              root: null,
              rootMargin: '0px 0px',
              threshold: [...Array(20).keys()].map(x => x / 20)
            });
            let $observedElement = document.querySelector("#navbar-main");
            if ($observedElement) {
              observer.observe($observedElement)
            }
          }
        );
    }
  }
})(jQuery, Drupal);
