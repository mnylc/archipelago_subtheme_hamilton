/**
 * @file
 * Global utilities.
 *
 */
(function($, Drupal) {

  'use strict';

  Drupal.behaviors.archipelago_subtheme_hamilton = {
    attach: function (context, settings) {
      function SetFixedPositioning(ele) {
        let element = $(ele);
        element.css("position", "");
        element.css("left","");
        element.css("top","");
        var currentOffset = element.offset();
        element.css("position", "fixed");
        element.offset(currentOffset);
        /* For some reason when the page starts already scrolled, the offset v/s the top property are all messed up */
        /* 128 here is very specific to this theme. Sorry! */
        const topCss = +element.css('top').replace('px', '')
        if (topCss < 128) {
          element.css("top","128px");
        }
      }


      function ResetFixedPositioning(ele) {
        let element = $(ele);
        console.log(element.offset());
        let currentFixedOffset = element.offset();
        // We want to keep the Vertical offset
        element.css("position", "");
        element.css("left","");
        element.css("top","");
        var currentOffset = element.offset();
        currentOffset.top = currentFixedOffset.top;
        element.css("position", "fixed");
        element.offset(currentOffset);
        /* For some reason when the page starts already scrolled, the offset v/s the top property are all messed up */
        /* 128 here is very specific to this theme. Sorry! */
        const topCss = +element.css('top').replace('px', '')
        if (topCss < 128) {
          element.css("top","128px");
        }
      }


      function UnSetFixedPositioning(ele) {
        let element = $(ele);
        element.css("position", "");
        element.css("left","");
        element.css("top","");
      }
      /* resize needs to be aware of this offset.
               Can't be any offset.
                */
      $(once('hamilton-list-scrollspy', '.list-scrollspy', context)).each(function () {
        var ele = this;
        // To make the fixed scrollspy absolute when we reach the end (imagine a scalled window)
        // or a another block after the content we are spying on
        // we will add an element just after the div.content and check intersection
        // This is extremely dependent on this themes/sites needs
        // see html.html.twig where we set up the scroll spy data elements at the body level.
        // and assumes only things inside ".content block" are spied on.
        let $content = document.querySelector('#content div.content');
        let trackerDiv = document.createElement("div");
        trackerDiv.setAttribute("id", "scrollspyAfter");
        $content.insertAdjacentElement('afterend', trackerDiv);

        $(window).on('resize', function () {
          if (ele.classList.contains('list-scrollspy-fixed')) {
            ResetFixedPositioning(ele);
          }
        });
      });

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
      if ($(context).is('.view') || context == document || $(context).is('.views-exposed-form')) {
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
            let val = option.attr('value');
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
              console.log(ratio);
              if (ratio < 0.1) {
                let $scrollspy = document.querySelector('.list-scrollspy');
                if ($scrollspy) {
                  if (!$scrollspy.classList.contains('list-scrollspy-fixed')) {
                    SetFixedPositioning($scrollspy);
                    $scrollspy.classList.add('list-scrollspy-fixed');
                  }
                }
              }
              if (ratio < 0.4) {
                let $topbar = document.querySelector('#navbar-top');
                if (!$topbar.classList.contains('intersected')) {
                  $topbar.classList.add('intersected');
                }
              }
              else if (ratio > 0.6) {
                let $topbar = document.querySelector('#navbar-top');
                let $scrollspy = document.querySelector('.list-scrollspy');
                if ($topbar.classList.contains('intersected')) {
                  $topbar.classList.remove('intersected');
                  if ($scrollspy) {
                    $scrollspy.classList.remove('list-scrollspy-fixed');
                    UnSetFixedPositioning($scrollspy);
                  }
                }
              }
            },{
              root: null,
              rootMargin: '0px 0px',
              threshold: [...Array(20).keys()].map(x => x / 20)
            });

          let passtThreasHold = false;

          var observerAfter = new IntersectionObserver(function (entries) {
            const ratio = entries[0].intersectionRatio;
            console.log(ratio);
            if (ratio == 1) {
              console.log(passtThreasHold);
            }
            // So here is the hard thing. On scroll down we will move from 0 to 1 but then again to 0
            // which migh trigger again a "fixed". So we need a 3 state thing
            // where once 1 and scrolling down we stay there and only a 0 from 1 when scrolling up should
            // re-fix the nav. Too much engineering.
            // Also this threshold is in 10 increments to make it less sensitive and also less CPU
            // consuming.
          },{
            root: null,
            rootMargin: '0px 0px',
            threshold: [...Array(10).keys()].map(x => x / 10)
          });


            let $observedElement = document.querySelector("#navbar-main");
            if ($observedElement) {
              observer.observe($observedElement)
            }
            let $observedAfterElement = document.querySelector("#scrollspyAfter");

          if ($observedAfterElement) {
            observerAfter.observe($observedAfterElement)
          }


          }
        );
    }
  }
})(jQuery, Drupal);
