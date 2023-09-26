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

        // Observe accordions that have Leaflet inside. If so, on show trigger a global resize event
        // Depends on Leaflet 1.9.4

        // document.getElementById('iiif-0-704597d2-48f0-4dfe-8861-11c5e8cb4fcb-0-map').dispatchEvent(new Event('resize'));
        var CollapsibleList = [].slice.call(context.querySelectorAll('.accordion-collapse.collapse'));
        const CollapsibleThatMatches = CollapsibleList.map(function (collapseEl) {
          const el = collapseEl.querySelector('.strawberry-leaflet-item.leafletViewer');
          if (el) {
            collapseEl.addEventListener('shown.bs.collapse', function () {
              window.dispatchEvent(new Event('resize'));
            })
          }
        });


        // Only act on selects in exposed forms for now.
        $('.views-exposed-form .form-select').each(function(i, e) {
          if (!($(e).data('convert') == 'no')) {
            $(e).hide().removeClass('form-select');
            let selected = $(e).get(0).selectedIndex;
            let option = $(e).children('option:eq(' + selected + ')');
            let current =  option.html();
            let val = option.data('value');
            let name = $(e).attr("name") || '';

            /* if we have multiple selects i could convert them all to a btn-group? */
            let el = document.createElement('div')
            el.classList.add('dropdown');
            let select = $(e).get(0).parentNode.appendChild(el);
            let dropdown = document.createElement('button')
            dropdown.classList.add('btn','btn-secondary','dropdown-toggle');
            dropdown.type = 'button';
            /* Came case gets transformed into - so bsToggle becomes bs-toggle */
            dropdown.dataset.bsToggle = 'dropdown';
            dropdown.ariaExpanded = 'false';
            dropdown.textContent = current;
            let dropdownItems = document.createElement('div');
            dropdownItems.classList.add('dropdown-menu');
            let hidden = document.createElement('input');
            hidden.type = 'hidden';
            hidden.value = val;
            hidden.name = name;
            hidden.id = $(e).attr('id');
            select.appendChild(dropdown);
            select.appendChild(dropdownItems);
            select.appendChild(hidden);

            for (const option of $(e).get(0).options) {
              // const item = document.createElement('li');
              // item.classList.add('dropdown-item');
              const link = document.createElement('a');
              link.classList.add('dropdown-item');
              link.dataset.value = option.value;
              link.textContent = option.label;
              link.href = '#';
              link.rel = 'nofollow';
              //item.appendChild(link);
              dropdownItems.appendChild(link);
            }
            var linkList = [].slice.call(select.querySelectorAll('.dropdown-menu a'))
            var dropdownList = linkList.map(function (menuItemLinks) {
              menuItemLinks.addEventListener('click',function (e) {
                let hidden = select.querySelector('input[type=hidden]');
                if (hidden) {
                  hidden.value = this.dataset.value;
                  let toggle = select.querySelector('.dropdown-toggle');
                  toggle.textContent = this.textContent;
                }
                e.preventDefault();
              }, false);
            });

            $(e).remove();
          }
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
