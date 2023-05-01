/*
* Template Name: BreezyCV - Resume / CV / vCard / Portfolio Template
* Author: LMPixels
* Author URL: http://themeforest.net/user/lmpixels
* Version: 1.5.0
*/

var PageTransitions = (function ($, options) {
"use strict";
    var sectionsContainer = $(".animated-sections"),
        isAnimating = false,
        endCurrentPage = true,
        endNextPage = false,
        windowArea = $(window),
        animEndEventNames = {
            'WebkitAnimation'   : 'webkitAnimationEnd',
            'OAnimation'        : 'oAnimationEnd',
            'msAnimation'       : 'MSAnimationEnd',
            'animation'         : 'animationend'
        },

        // animation end event name
        animEndEventName = animEndEventNames[Modernizr.prefixed('animation')],

        // support css animations
        support = Modernizr.cssanimations;

    function init(options) {

        // Get all the .animated-section sections.
        $('.animated-section').each( function() {
            var $page = $(this);
            $page.data('originalClassList', $page.attr('class'));
        });

        // Get all the .pt-wrapper div which is the parent for all pt-div
        sectionsContainer.each( function() {
            if (location.hash === "") {
                $('section[data-id='+ pageStart +']').addClass('section-active');
            }
        });

        // Adding click event to main menu link
        $('.nav-anim').on("click", function (e) {
            e.preventDefault();
            if (isAnimating) {
                return false;
            }
            var pageTrigger = $(this);
            $('ul.main-menu a').blur(); // Remove focus and thus gold color

            activeMenuItem( pageTrigger );

            Animate( pageTrigger );

            location.hash = $(this).attr('href');

            if (window.innerWidth < 1024) {
                $('.menu-toggle').removeClass('open');
                $('#site_header').addClass('mobile-menu-hide');
            }
        });

        window.onhashchange = function(event) {
            if(location.hash) {
                if (isAnimating) {
                    return false;
                }
                var menuLink = $(menu+' a[href*="'+location.hash.split('/')[0]+'"]');
                activeMenuItem( menuLink );
                Animate(menuLink);

                ajaxLoader();
            }
        };

        var menu = options.menu,
        pageStart = getActiveSection();

        location.hash = pageStart;
        var menuLink = $(menu+' a[href*="'+location.hash.split('/')[0]+'"]');

        activeMenuItem(menuLink);

        Animate(menuLink);

        $('body').append('<div id="page-ajax-loaded" class="page-ajax-loaded animated animated-section-moveFromLeft"></div>');
        ajaxLoader();

        $(".lmpixels-arrow-right").click(function() {

            if (window.innerWidth > 1024) {
                var activeItem = $('.main-menu a.active').parent("li");
                activeItem.next("li").children("a").click();
                if (activeItem.is(':last-child')) {
                    $('.main-menu li:first-child').children("a").click();
                }
            }
            else {
                var activeItemLi = document.querySelector(".main-menu-mobile.mobile-only li.active");
                if (activeItemLi === null) {
                    document.querySelector('.main-menu-mobile.mobile-only li:nth-child(2) a').click();
                } else if (activeItemLi.nextElementSibling === null) {
                    document.querySelector('.main-menu-mobile.mobile-only li:first-child a').click();
                }
                else {
                    activeItemLi.nextElementSibling.querySelector('a').click();
                }
            }
        });

        $(".lmpixels-arrow-left").click(function() {

            if (window.innerWidth > 1024) {
                var activeItem = $('.main-menu a.active').parent("li");
                activeItem.prev("li").children("a").click();
                if (activeItem.is(':first-child')) {
                    $('.main-menu li:last-child').children("a").click();
                }
            }
            else {
                var activeItemLi = document.querySelector(".main-menu-mobile.mobile-only li.active");
                if (activeItemLi === null || activeItemLi.previousElementSibling === null) {
                    document.querySelector('.main-menu-mobile.mobile-only li:last-child a').click();
                } else {
                    activeItemLi.previousElementSibling.querySelector('a').click();
                }
            }
        });
    }

    function getActiveSection() {
        if(location.hash === "") {
            return location.hash = $('section.animated-section').first().attr('data-id');
        } 
        else {
            return location.hash;
        }
    }

    function activeMenuItem(item) {
        if ( !item ) {
            return false;
        }

        var navLink = $(item);
        navLink = navLink['0'];
        navLink = $(navLink);
            
        if(navLink) {
            // Desktop
            $('ul.main-menu a').removeClass('active');

            // Mobile
            $('ul.main-menu-mobile .mobile-menu-item-li').removeClass('active');
            $('ul.main-menu-mobile a').removeClass('active');
            navLink.addClass('active');
            navLink.siblings().addClass('active');
            navLink.parent('li').addClass('active');
        }
    }

    function ajaxLoader() {
        // Check for hash value in URL
        var ajaxLoadedContent = $('#page-ajax-loaded');

        function showContent() {
            ajaxLoadedContent.removeClass('animated-section-moveToRight closed');
            ajaxLoadedContent.show();
            $('body').addClass('ajax-page-visible');
        }

        function hideContent() {
            $('#page-ajax-loaded').addClass('animated-section-moveToRight closed');
            $('body').removeClass('ajax-page-visible');
            setTimeout(function(){
                $('#page-ajax-loaded.closed').html('');
                ajaxLoadedContent.hide();
            }, 500);
        }

        var href = $('.ajax-page-load').each(function(){
            href = $(this).attr('href');
            if(location.hash == location.hash.split('/')[0] + '/' + href.substr(0,href.length-5)){
                var toLoad =  $(this).attr('href');
                showContent();
                ajaxLoadedContent.load(toLoad);
                return false;
            }
        });

        $(document)
            .on("click",".main-menu, #ajax-page-close-button", function (e) { // Hide Ajax Loaded Page on Navigation cleck and Close button
                e.preventDefault();
                hideContent();
                location.hash = location.hash.split('/')[0];
            })
            .on("click",".ajax-page-load", function () { // Show Ajax Loaded Page
                var hash = location.hash.split('/')[0] + '/' + $(this).attr('href').substr(0,$(this).attr('href').length-5);
                location.hash = hash;
                showContent();

                return false;
            });
    }

    function getOrderBasedOnHref(hrefValue) {
        const anchorTags = document.querySelectorAll('a.nav-anim');
        let order = -1; // default value if no matching href found
        anchorTags.forEach((anchorTag) => {
            if (anchorTag.getAttribute('href') === hrefValue) {
                order = anchorTag.getAttribute('data-order');
            }
        });
        return order;
    }

    function Animate($pageTrigger, gotoPage) {

        $pageTrigger.data('animation',0);
        var animation = $pageTrigger.data('animation').toString(), inClass, outClass;

        // This will get the nav-anim elements parent wrapper div
        var $pageWrapper = sectionsContainer,
            currentPageId = $pageWrapper.data('current'), tempPageIndex,
            linkhref = $pageTrigger.attr('href').split("#"),
            gotoPage = linkhref[1];
            
            tempPageIndex = currentPageId;

            // Current page to be removed.
            var $currentPage = $('section[data-id="' + currentPageId + '"]');

            // NEXT PAGE
            currentPageId = gotoPage;

            // Check if the current page is same as the next page then do not do the animation
            // else reset the 'isAnimatiing' flag
            if (tempPageIndex != currentPageId) {
                isAnimating = true;

                $pageWrapper.data('current', currentPageId);

                // Next page to be animated.

                var $nextPage = $('section[data-id='+currentPageId+']').addClass('section-active');

                $nextPage.scrollTop(0);

                var currentPageOrder = getOrderBasedOnHref('#' + tempPageIndex);
                var nextPageOrder = getOrderBasedOnHref('#' + gotoPage);

                if (nextPageOrder < currentPageOrder) {
                    inClass = 'animated-section-rotateCubeBottomIn';
                    outClass = 'animated-section-rotateCubeBottomOut animated-section-ontop';
                }
                else {
                    inClass = 'animated-section-rotateCubeTopIn';
                    outClass = 'animated-section-rotateCubeTopOut animated-section-ontop';
                }

                $currentPage.addClass(outClass).on(animEndEventName, function() {
                    $currentPage.off(animEndEventName);
                    endCurrentPage = true;
                    if(endNextPage) {
                        onEndAnimation($pageWrapper, $nextPage, $currentPage);
                        endCurrentPage = false;
                    }
                });

                $nextPage.addClass(inClass).on(animEndEventName, function() {
                    $nextPage.off(animEndEventName);
                    endNextPage = true;
                    if(endCurrentPage) {
                        onEndAnimation($pageWrapper, $nextPage, $currentPage);
                        endNextPage = false;
                        isAnimating = false;
                    }
                });
            }
            else {
                isAnimating = false;
            }


        // Check if the animation is supported by browser and reset the pages.
        if(!support) {
            onEndAnimation($currentPage, $nextPage);
        }

    }

    function onEndAnimation($pageWrapper, $nextPage, $currentPage) {
        resetPage($nextPage, $currentPage);
    }

    function resetPage($nextPage, $currentPage) {
        $currentPage.attr('class', $currentPage.data('originalClassList'));
        $nextPage.attr('class', $nextPage.data('originalClassList') + ' section-active');
    }

    return {
        init : init,
    };

})(jQuery);
