// ==UserScript==
// @extensionName GMail Sidebar Toggle
// @extensionAuthor Sean J. Vaughan
// @extensionDescription GMail Sidebar Toggle adds a "< < <" control above "Compose Mail" so you can selectively hide the sidebar.
// @extensionGUID e5ab5bc9-4f0a-4a61-b825-b53284e6025e
// @version 1.0
// @name GMail Sidebar Toggle
// @when Pages Match
// @description GMail Sidebar Toggle adds a "< < <" control above "Compose Mail" so you can selectively hide the sidebar.
// @match http://mail.google.com/*
// @match https://mail.google.com/*
// ==/UserScript==

/*jslint white: true, onevar: true, undef: true, nomen: false, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true */
/*global $ window document setTimeout clearTimeout */

"use strict";

function isSidebarAvailable() {
    var sidebar = $("div[style*='172px']");
    if (sidebar.length) {
        return true;
    }
    return false;
}

function toggleSidebar(elements) {
    var sidebar = elements.sidebar, list = elements.list, message = elements.message;
    if (sidebar.css('position') === 'static') {
        // hide
        $("#sidebarToggle").parent().animate({ width: 10 }, function () {
            sidebar.css(
                {
                    position: 'absolute',
                    left: '-1000px'
                }
            );
            $("#sidebarToggle").text("> > >");
            $.cookie('sidebar-closed', 'true', {expires: 100});
        });
        list.animate({width: "+=162"});
        message.animate({width: "+=162"});
    } else {
        // show
        sidebar.css(
            {
                position: 'static'
            }
        );

        list.animate({ width: "-=162" });
        message.animate({width: "-=162"});
        
        $("#sidebarToggle").parent().animate({ width: 172 }, function () {
            $("#sidebarToggle").text("< < <");
            $.cookie('sidebar-closed', null);
        });
    }

}

function modifyHTML(elements) {
    var control, sidebar = elements.sidebar;
    control = "<div id='sidebarToggle' style=" + '"' + "text-align: center; cursor: pointer;" + '"' + ">&lt; &lt; &lt;</div>";
    sidebar.wrap("<div style=" + '"' + "float: left; width: 172px;" + '"' + "></div>");
    sidebar.before(control);
    $("#sidebarToggle").click(function (ev) {
        toggleSidebar(elements);
    });
    if ($.cookie('sidebar-closed') !== null) {
        toggleSidebar(elements);
    }
}

function addResizeHandler(elements) {
    var resizeTimer, sidebar = elements.sidebar, list = elements.list, message = elements.message;
    $(window).resize(function () {
        if (resizeTimer) {
            clearTimeout(resizeTimer);
        }
        resizeTimer = setTimeout(function () {
            if (elements.isSidebarAttached) {
                list.width(list.width() + 162);
                message.width(message.width() + 162);
            }
        }, 100);
    });
}

function addSidebarControl() {
    var elements = {
        sidebar: $("div[style*='172px']").eq(0),
        list: null,
        message: null
    };

    elements.list = elements.sidebar.siblings().eq(1);
    elements.message = $("div[style*='" + (elements.list.width() - 8) + "']");

    modifyHTML(elements);
    addResizeHandler(elements);
}

function check() {
    var tries = 10;
    
    if (isSidebarAvailable()) {
        addSidebarControl();
    } else if (tries > 0) {
        tries--;
        setTimeout(check, 1000);
    }
}

setTimeout(function () {
    $(document).ready(function () {
        check();
    });
}, 1000);



