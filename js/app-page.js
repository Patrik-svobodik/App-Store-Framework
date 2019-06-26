/* JSHint settings */
/* jshint esversion: 6 */

class UIAppPage {
    constructor(currentApp, cache, appPage) {
        this.cache = window.appCache || cache || {};
        this.currentApp = currentApp || defaultApp();
        this.directory = appDirectory();
        // Defaults for elements, you can change these if your elements are different
        this.appPage = appPage || $(".app-page");
        this.iconWrapper = this.appPage.find(".app-page-app-icon-wrapper");
        this.headerIconWrapper = this.appPage.find(".header-app-icon-wrapper");
        this.headerIcon = this.appPage.find(".header-app-icon");
        this.headerItems = this.appPage.find(".header-app-icon, .app-page-btn-download-header");
        this.headerImgWrapper = this.appPage.find(".app-page-header-img-wrapper");
        this.appNameElement = this.appPage.find(".app-page-app-name");
        this.appSubtitleElement = this.appPage.find(".app-page-app-subtitle");
        this.btnDownload = this.appPage.find(".app-page-btn-download-append");
        this.headerBtnDownload = this.appPage.find(".app-page-btn-download-header");
        this.header = this.appPage.find(".app-page-header");
        this.tintedElements = this.appPage.find(".tinted");
        this.similarApps = this.appPage.find(".app-page-similar-apps-list");
        this.lastStar = $("[fifth-star]");
        // Values
        this.closeDuration = 500;
        // Overrides
        this.settingsOverrideDefaults = {
            "appName": false,
            "appSubtitle": false
        };
        this.overrideDefaults = {};
        this.override = this.overrideDefaults;
        this.settingsOverride = this.settingsOverrideDefaults;
    }
    blockScroll() {
        $("body").addClass("noscroll");
    }
    init(app) {
        this.checkIfNeededToReload(app);
    }
    closePayPopup() {
        payPopupClose();
    }
    checkIfNeededToReload(app) {
        if (this.currentApp != app) {
            this.reset();
            this.currentApp = app;
            this.initAll();
        } else if (this.currentApp == app) {
            this.initAll();
        }
    }
    checkCardsVisibility() {
        var cardDisplay = $(".card").not(".active").css("display");
        var cardsWereVisible;
        if (cardDisplay == "none") {
            cardsWereVisible = "false";
        } else {
            cardsWereVisible = "true";
        }
        this.appPage.attr("cardsWereVisible", cardsWereVisible);
        return cardsWereVisible;
    }
    parseJSON(pathToJSON) {
        var path = pathToJSON || this.directory + this.currentApp + ".json";
        var JSONData = [];
        var cache = this.cache;
        if (typeof this.cache[this.currentApp] == "undefined") {
            $.ajax({
                url: path,
                async: false,
                dataType: 'json',
                success: function (data) {
                  JSONData = data;
                  cache[currentApp] = data;
                  window.appCache[currentApp] = data;
                }
            });
            this.JSONData = JSONData;
            this.cache[this.currentApp] = cache[this.currentApp];
        } else {
            this.JSONData = this.cache[this.currentApp];
        }
        return this.JSONData;
    }
    spawnSimilarApps() {
        var alreadyRan = this.similarApps.attr("already-ran");
        if (alreadyRan == "false") {
            this.similarApps.spawnSimilarApps();
        }
        this.similarApps.attr("already-ran", "true");
        window.currentApp = this.currentApp;
    }
    initAppIcon() {
        appendIcon(this.iconWrapper, "app-page-app-icon");
        appendIcon(this.headerIconWrapper, "header-app-icon app-icon");
    }
    initAppName() {
        if (typeof this.JSONData == "undefined" && typeof window.appCache[this.currentApp] == "undefined") {
            this.parseJSON();
        }
        appendAppName(this.appNameElement, this.settingsOverride.appName, this.override.appName);
    }
    initBtnDownload() {
        if (typeof this.JSONData == "undefined" && typeof window.appCache[this.currentApp] == "undefined") {
            this.parseJSON();
        }
        appendBtnDownloadContent(this.btnDownload);
    }
    initSubtitle() {
        if (typeof this.JSONData == "undefined" && typeof window.appCache[this.currentApp] == "undefined") {
            this.parseJSON();
        }
        appendSubtitleContent(this.appSubtitleElement, this.settingsOverride.appSubtitle, this.override.appSubtitle);
    }
    initDescription() {
        if (typeof this.JSONData == "undefined" && typeof window.appCache[this.currentApp] == "undefined") {
            this.parseJSON();
        }
        appendDescription(this.depictionPath, $(".app-page-text-description"), this.JSONData);
    }
    initRating() {
        if (typeof this.JSONData == "undefined" && typeof window.appCache[this.currentApp] == "undefined") {
            this.parseJSON();
        }
        var ratingsText = "ratings";
        parseRating(this.JSONData.rating, $("[first-star]"), $("[second-star]"), $("[third-star]"), $("[fourth-star]"), this.lastStar);
        this.appPage.find(".rating-num").text("" + this.JSONData.rating);
        this.appPage.find(".number-of-ratings").text("" + this.JSONData.numberOfRatings + " " + ratingsText);
    }
    initHeader() {
        if (typeof this.JSONData == "undefined" && typeof window.appCache[this.currentApp] == "undefined") {
            this.parseJSON();
        }
        var alreadyRan = this.headerImgWrapper.attr("alreadyRan");
        if (this.JSONData.hasHeader == true && alreadyRan != "true") {
            this.headerImgWrapper.css({display: "block"}).append('<img class="app-page-header-img" src="' + this.JSONData.headerPhoto + '"></img>').addClass("has-header");
            this.header.css({"-webkit-backdrop-filter": "blur(0)", "backdrop-filter": "blur(0)", backgroundColor: "transparent"}).addClass("has-header");
            this.appPage.css({paddingTop: "0"});
        }
        statusBarInit($(".header-app-icon, .app-page-btn-download-header"));
        this.headerImgWrapper.attr("alreadyRan", "true");
    }
    resetHeader() {
        this.headerImgWrapper
            .html("")
            .css({display: "none"})
            .attr("alreadyRan", "false")
            .removeClass("has-header");
        this.header
            .css({"-webkit-backdrop-filter": '', backgroundColor: ''})
            .removeClass("has-header");
        this.appPage.css({paddingTop: ''});
    }
    initScreenshots() {
        parseScreenshots($(".app-page-screenshot-wrapper"), this.depictionPath, this.JSONData);
    }
    tintElements() {
        tintElements(this.tintedElements, this.JSONData.textTint2);
    }
    initAll() {
        // Parse the JSON
        this.parseJSON();
        // Append app name
        this.initAppName();
        // Append subtitle
        this.initSubtitle();
        // Add app icon
        this.initAppIcon();
        // Tint elements
        this.tintElements();
        // Append the description/depiction
        this.initDescription();
        // Check if cards were visible
        this.checkCardsVisibility();
        // Block scroll
        this.blockScroll();
        // Append things to btn-download
        this.initBtnDownload();
        // Parse rating
        this.initRating();
        // Parse screenshots
        this.initScreenshots();
        // Init the header
        this.initHeader();
        // Spawn similarApps
        this.spawnSimilarApps();
        // Close pay popup
        this.closePayPopup();
        // Show app-page
        this.open();
    }
    // Open appPage
    open() {
        this.appPage.css({visibility: "visible", right: "0"});
        this.header.css({right: "0", visibility: "visible"});
    }
    close() {
        toggleCards();
        // Hide the app page
        this.appPage.css({right: "-100%"});
        this.header.css({right: "-100%", visibility: "hidden"});
        // Reset all the things back once it is closed
        setTimeout(function() {
            window.appPage.reset();
        }, this.closeDuration);
        
    }
    reset() {
        resetScreenshots($(".app-page-screenshot-wrapper"));
        resetDescription($(".app-page-text-description"));
        resetRating(this.lastStar);
        this.similarApps.html("").attr("already-ran", false);
        this.resetHeader();
        // Reset overrides back to default
        this.settingsOverride = this.settingsOverrideDefaults;
        this.override = this.overrideDefaults;
        return;
    }
}
function appPageInit(parent) {
    window.currentApp = parent.attr("app");
    appPage.init(currentApp);
}
function resetScreenshots(parent) {
    parent
        .html("")
        .attr("screenshotsAppended", "false");
}
function resetDescription(parent) {
    parent
        .html("")
        .attr("alreadyRan", "false");
}
function toggleCards(parentElem) {
    var parent = parentElem || $(".app-page");
    var wasVisible = parent.attr("cardsWereVisible");
    $(".active").show();
    if (wasVisible == "true") {
        $(".card").show();
    }
    $("body").removeClass("noscroll");
}
function parseRating(refAppRating, firstStar, secondStar, thirdStar, fourthStar, fifthStar) {
    if (refAppRating == 1) {
        firstStar.addClass("fas").removeClass("far");
    }
    if (refAppRating == 2) {
        secondStar.prevAll().not("rating-num").addClass("fas").removeClass("far");
        secondStar.addClass("fas").removeClass("far");
    }
    if (refAppRating == 3) {
        thirdStar.prevAll().not("rating-num").addClass("fas").removeClass("far");
        thirdStar.addClass("fas").removeClass("far");
    }
    if (refAppRating == 4) {
        fourthStar.prevAll().not("rating-num").addClass("fas").removeClass("far");
        fourthStar.addClass("fas").removeClass("far");
    }
    if (refAppRating == 5) {
        fifthStar.prevAll().not("rating-num").addClass("fas").removeClass("far");
        fifthStar.addClass("fas").removeClass("far");
    }
}
function resetRating(lastStar) {
    lastStar.prevAll().addClass("far").removeClass("fas");
    lastStar.addClass("far").removeClass("fas");
}
function statusBarInit(element, scrollView) {
    var scrollViewElement = scrollView || ".app-page";
    var appPageHeader = element.closest(".app-page-header");
    element.closest(scrollViewElement).scroll(function() {
        if (element.closest(scrollViewElement).scrollTop() > 100){
            element
                .css({opacity: 1})
                .addClass("is-visible");
            if (appPageHeader.hasClass("has-header")) {
                appPageHeader.css({
                    "-webkit-backdrop-filter": "blur(15px)",
                    "backdrop-filter": 'blur(15px)',
                    backgroundColor: ''});
            }
        } else {
            element
                .css({top: '', opacity: ''})
                .removeClass("is-visible");
            if (appPageHeader.hasClass("has-header")) {
                appPageHeader.css({
                    "-webkit-backdrop-filter": 'blur(0)',
                    "backdrop-filter": 'blur(0)',
                    backgroundColor: 'transparent'});
            }
            
        }
    });
}

/*
    Set appPage variable to be UIAppPage
    This is also where you set the overrides for default elements
    For example: appPage.header = $(".header"); (Don't use this, it will F up if you won't change your markup acordingly)
*/
var appPage;
function defineAppPage() {
    window.appPage = new UIAppPage();
}