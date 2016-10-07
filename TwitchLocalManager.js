// ==UserScript==
// @name         Twitch Local Manager
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Protect your eyes from seeing chat name who using hurt-eye color.
// @author       Tokenyet (or Dowen)
// @supportURL   tokenyete@gmail.com
// @homepage     https://github.com/Tokenyet/Twitch-Chat-Darker
// @include      http*://www.twitch.tv*
// @grant        none
// @icon         https://www.twitch.tv/favicon.ico
// @require      https://gist.githubusercontent.com/PizzaBrandon/5709010/raw/e539a6f16c10465eb948b9ef6b0fe1d4c17a7c3e/jquery.waituntilexists.js
/* Thanks to the waituntilexists script from https://gist.github.com/BrockA*/
// ==/UserScript==
var dictionary = {};
var time = new Date();
(function() {
    'use strict';
    //=== Custom Parameter Start ===
    var FONT_SIZE = 14;
    var ENABLE_CHINESE_NAME = 1; // 1 on 2 off
    var ENABLE_FONT_SIZE = 1; //1 on, 2 off
    var ENABLE_EYE_CORRECTION = 1; //1 on, 2 off
    var ENABLE_MSG_PREVENT_DELETE = 1;
    //=== Custom Parameter End ===
    function hookChat() {
        $('.chat-lines').bind("DOMSubtreeModified",function(e){
            var chatobject = $(e.target);
            var chatChildList = chatobject.children('li');
            var lastChild = chatChildList.last();
            if(ENABLE_EYE_CORRECTION == 1)
                userCustomFontColor(lastChild);
            if(ENABLE_FONT_SIZE == 1)
                userCustomFontSize(lastChild, FONT_SIZE);
            if(ENABLE_CHINESE_NAME == 2)
                userCustomEliminateChinese(lastChild);
            if(ENABLE_MSG_PREVENT_DELETE == 1)
                processChatDetails(chatChildList);
            //fromInfoOfChild.css("color", color ); // directly make chat be black font display.
        });
    }
    function userCustomEliminateChinese(object) {
        var lastChild = object;
        var fromInfoOfChild = lastChild.children(".from");
        var englishObject = fromInfoOfChild.children(".intl-login");
        if(englishObject === null || englishObject === undefined || englishObject.length === 0 )
            return;
        var englishNameWithColon = englishObject.html();
        //console.log(englishNameWithColon);.replace("(","").replace(")","");
        var englishName = englishNameWithColon.replace("(","").replace(")","");
        fromInfoOfChild.html(englishName);
    }
    function userCustomFontSize(object, size) {
        var fontsize = size;
        var lastChild = object;
        var fromInfoOfChild = lastChild.children(".from");
        var colnChild = lastChild.children(".colon");
        var msgChild = lastChild.children(".message");
        fromInfoOfChild.css({ 'font-size': fontsize });
        colnChild.css({ 'font-size': fontsize });
        msgChild.css({ 'font-size': fontsize });
    }
    function userCustomFontColor(object) {
        var lastChild = object;
        var fromInfoOfChild = lastChild.children(".from");
        var rgbString = lastChild.children(".from").css("color");
        var rgbArray = parseRGB(rgbString);
        hurtEyeCorrection(rgbArray); // call by ref, when variable is object.
        rgbString = stringRGB(rgbArray);
        fromInfoOfChild.css("color", rgbString);
    }

    function processChatDetails(chatList) {
        for(var i = 0; i < chatList.length; i++){
            var chat = chatList[i];
            var msg = $(chat).children(".message");
            var del = $(chat).children(".deleted");
            if(dictionary[chat.id] === undefined)
            {
                var timeStamp = time.getElapsed();
                var text = msg.text();
                var object = {time: timeStamp, text: text};
                dictionary[chat.id] = object;
            }
            else if(del !== undefined)
                del.text(dictionary[chat.id].text + "[-deleted-]");
        }
        reduceChats();
    }

    function reduceChats()
    {
        var removeKeyLists;
        var currentTime= time.getElapsed();
        for (var key in dictionary)
            if(currentTime - dictionary[key].time > 120000)
                removeKeyLists.push(key);

        for(var element in removeKeyLists)
            delete dictionary[element];
    }

    function parseRGB(string) {
        var array = string.replace(/[^\d,]/g, '').split(',');
        return array;
    }

    function stringRGB(array) {
        return 'rgb(' + array[0] +', ' + array[1] +', ' + array[2] + ')';
    }

    // You could change any eye-friendly algorithm in this function.
    function hurtEyeCorrection(array) {
        var arrayLength = array.length;
        for (var i = 0; i < arrayLength; i++) {
            if(array[i] > 125)
               array[i] -= 125;
        }
        return array;
    }

    function waitUntilExists(str, func) {
        $(str).waitUntilExists(func);
    }

    var elementName = ".chat-lines";
    waitUntilExists(elementName, function() { hookChat(); } );
})();
