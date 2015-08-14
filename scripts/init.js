/* Namespace declarations and other initialization values */

var BattleTanks = BattleTanks || {};

var browser = navigator.userAgent.toLowerCase();
if (browser.indexOf('firefox') === -1) {
    document.getElementById('mozfox-msg').style.display = 'block';
}