/*
 * jQuery Foundation Top Bar 2.0.4
 * http://foundation.zurb.com
 * Copyright 2012, ZURB
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
*/

/*jslint unparam: true, browser: true, indent: 2 */

;(function ($, window, undefined) {
  'use strict';

  var settings = {
      index : 0,
      initialized : false
    },

    methods = {
      init : function (options) {
        return this.each(function () {
          settings = $.extend(settings, options);
          settings.$w = $(window),
          settings.$topbar = $('nav.top-bar'),
          settings.$section = settings.$topbar.find('section'),
          settings.$titlebar = settings.$topbar.children('ul:first');

          var breakpoint = $("<div class='top-bar-js-breakpoint'/>").appendTo("body");
          settings.breakPoint = breakpoint.width();
          breakpoint.remove();

          if (!settings.initialized) {
            methods.assemble();
            settings.initialized = true;
          }

          if (!settings.height) {
            methods.largestUL();
          }

          if (settings.$topbar.parent().hasClass('fixed')) {
            $('body').css('padding-top',settings.$topbar.outerHeight())
          }

          $('.top-bar .toggle-topbar').off('click.fndtn').on('click.fndtn', function (e) {
            e.preventDefault();

            if (methods.breakpoint()) {
              settings.$topbar.toggleClass('expanded');
              settings.$topbar.css('min-height', '');
            }

            if (!settings.$topbar.hasClass('expanded')) {
              settings.$section.css({left: '0%'});
              settings.$section.find('>.name').css({left: '100%'});
              settings.$section.find('li.moved').removeClass('moved');
              settings.index = 0;
            }

            if ($('.fixed').length > 0) {
              var offst = $('.top-bar').outerHeight();

              if ($('.top-bar').parent().hasClass('fixed')) {
                $('.top-bar').parent().removeClass('fixed');
                $('body').css('padding-top','0');
                window.scrollTo(0);
              } else {
                $('.top-bar').parent().addClass('fixed');
                $('body').css('padding-top',offst);
              }
            }
          });

          // Show the Dropdown Levels on Click
          $('.top-bar .has-dropdown>a').off('click.fndtn').on('click.fndtn', function (e) {
            if (Modernizr.touch || methods.breakpoint())
              e.preventDefault();

            if (methods.breakpoint()) {
              var $this = $(this),
                  $selectedLi = $this.closest('li');

              settings.index += 1;
              $selectedLi.addClass('moved');
              settings.$section.css({left: -(100 * settings.index) + '%'});
              settings.$section.find('>.name').css({left: 100 * settings.index + '%'});

              $this.siblings('ul').height(settings.height + settings.$titlebar.outerHeight(true));
              settings.$topbar.css('min-height', settings.height + settings.$titlebar.outerHeight(true) * 2)
            }
          });

          $(window).on('resize.fndtn.topbar',function() {
            if (!methods.breakpoint()) {
              settings.$topbar.css('min-height', '');
            }
          });

          // Go up a level on Click
          $('.top-bar .has-dropdown .back').off('click.fndtn').on('click.fndtn', function (e) {
            e.preventDefault();

            var $this = $(this),
              $movedLi = $this.closest('li.moved'),
              $previousLevelUl = $movedLi.parent();

            settings.index -= 1;
            settings.$section.css({left: -(100 * settings.index) + '%'});
            settings.$section.find('>.name').css({'left': 100 * settings.index + '%'});

            if (settings.index === 0) {
              settings.$topbar.css('min-height', 0);
            }

            setTimeout(function () {
              $movedLi.removeClass('moved');
            }, 300);
          });
        });
      },

      breakpoint : function () {
        return settings.$w.width() <= settings.breakPoint;
      },

      assemble : function () {
        // Pull element out of the DOM for manipulation
        settings.$section.detach();

        settings.$section.find('.has-dropdown>a').each(function () {
          var $link = $(this),
              $dropdown = $link.siblings('.dropdown'),
              url = $link.attr('href');

          if (url && url.length > 1) {
            var $titleLi = $('<li class="title back js-generated"><h5><a href="#"></a></h5></li><li><a class="parent-link js-generated" href="' + url + '">' + $link.text() +'</a></li>');
          } else {
            var $titleLi = $('<li class="title back js-generated"><h5><a href="#"></a></h5></li>');
          }

          // Copy link to subnav
          $titleLi.find('h5>a').html($link.html());
          $dropdown.prepend($titleLi);
        });

        // Put element back in the DOM
        settings.$section.appendTo(settings.$topbar);

        methods.sticky();
      },

      largestUL : function () {
        var uls = settings.$topbar.find('section ul ul'),
            largest = uls.first(),
            total = 0;

        uls.each(function () {
          if ($(this).children('li').length > largest.children('li').length) {
            largest = $(this);
          }
        });

        largest.children('li').each(function () { total += $(this).outerHeight(true); });

        settings.height = total;
      },

      sticky : function () {
        if ($('.sticky').length > 0) {
          var distance = $('.sticky').length ? $('.sticky').offset().top: 0,
              $window = $(window);
              var offst = $('nav.top-bar').outerHeight()+20;

            $window.scroll(function() {
              if ( $window.scrollTop() >= ( distance ) ) {
                 $(".sticky").addClass("fixed");
                   $('body').css('padding-top',offst);
              }

             else if ( $window.scrollTop() < distance ) {
                $(".sticky").removeClass("fixed");
                $('body').css('padding-top','0');
             }
          });
        }
      }
    };

  $.fn.foundationTopBar = function (method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    } else {
      $.error('Method ' +  method + ' does not exist on jQuery.foundationTopBar');
    }
  };

}(jQuery, this));
