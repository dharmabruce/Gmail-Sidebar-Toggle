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

setTimeout(function () {
    $(document).ready(function () {
        check();
    });
}, 1000);

var tries = 10;

function check () {
    var sidebar = $("div[style*='172px']");
    if (sidebar.length) {
        var list = sidebar.siblings().eq(1);
        var message = $("div[style*='" + (list.width() - 8) + "']");
        var div = "<div id='sidebarToggle' style=" + '"' + "text-align: center; cursor: pointer;" + '"' + ">&lt; &lt; &lt;</div>";
        sidebar.wrap("<div style=" + '"' + "float: left; width: 172px;" + '"' + "></div>");
        sidebar.before(div);
        $("#sidebarToggle").click(function (ev) {
            if (sidebar.is(":hidden")) {
                list.animate({ width: "-=162" });
                message.animate({width: "-=162"});
                sidebar.show();
                sidebar.parent().animate({ width: 172 }, function () {
                    $("#sidebarToggle").text("< < <");
                });
            } else {
                sidebar.parent().animate({ width: 10 }, function () {
                    sidebar.hide();
                    $("#sidebarToggle").text("> > >");
                });
                list.animate({width: "+=162"});
                message.animate({width: "+=162"});
            }
        });
        
        var resizeTimer;
        $(window).resize( function () {
            if (resizeTimer) {
                clearTimeout(resizeTimer);
            }
            resizeTimer = setTimeout(function () {
                if(sidebar.is(":hidden")) {
                    list.width(list.width() + 162);
                    message.width(message.width() + 162);
                }
            }, 100);
        });
        
        tries = 0;
    } else if (tries-- > 0) {
        setTimeout(check, 1000);
    }
}