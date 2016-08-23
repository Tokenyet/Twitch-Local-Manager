// ==UserScript==
// @name         Dark Chat Script
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

(function() {
    'use strict';
    function hookChat() {
        $('.chat-lines').bind("DOMSubtreeModified",function(e){
            var chatobject = $(e.target);
            var chatChildList = chatobject.children('li');
            var lastChild = chatChildList.last();
            var fromInfoOfChild = lastChild.children(".from");
            var color = "black";
            var rgbString = lastChild.children(".from").css("color");
            var rgbArray = parseRGB(rgbString);
            hurtEyeCorrection(rgbArray); // call by ref, when variable is object.
            rgbString = stringRGB(rgbArray);
            fromInfoOfChild.css("color", rgbString);
            //fromInfoOfChild.css("color", color ); // directly make chat be black font display.
        });
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
            if(array[i] > 100)
               array[i] -= 100;
        }
        return array;
    }

    function waitUntilExists(str, func) {
        $(str).waitUntilExists(func);
    }
    var elementName = ".chat-lines";
    waitUntilExists(elementName, function() { hookChat(); } );
})();