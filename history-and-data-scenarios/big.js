'use strict';
/* global big */

window.onload = function() {
    var s = document.getElementsByTagName('div'), ti;
    if (!s) return;
    window.big = { current: 0, forward: fwd, reverse: rev, go: go, length: s.length };
    function go(n) {
        big.current = n;
        var i = 1e3, e = s[n], t = parseInt(e.dataset.timeToNext || 0, 10);
        var notes = e.getElementsByTagName('aside');
        document.body.className = e.dataset.bodyclass || '';
        for (var log = 0; typeof console === 'object' && log < notes.length; log++) {
          console.log('%c%s: %s', 'padding:5px;font-family:serif;font-size:18px;line-height:150%;', n, notes[log].innerHTML.trim());
        }
        for (var k = 0; k < s.length; k++) s[k].style.display = 'none';
        e.style.display = 'block';
        e.style.fontSize = i + 'px';
        if (e.firstChild && e.firstChild.nodeName === 'IMG') {
            document.body.style.backgroundImage = 'url(' + e.firstChild.src + ')';
            e.firstChild.style.display = 'none';
            if ('classList' in e) e.classList.add('imageText');
        } else {
            document.body.style.backgroundImage = '';
            document.body.style.backgroundColor = e.style.backgroundColor;
        }
        if (ti !== undefined) window.clearInterval(ti);
        if (t > 0) ti = window.setTimeout(fwd, (t * 1000));
        while ((e.offsetWidth > window.innerWidth ||
            e.offsetHeight > window.innerHeight) && i >= 0) {
            e.style.fontSize = (i -= 2) + 'px';
        }
        if (window.location.hash !== n) {
            window.location.hash = n;
            document.body.className = 'slide-' + (n + 1);
        }
        document.title = e.textContent || e.innerText;
    }
    document.onclick = function() {
      go(++big.current % (s.length));
    };

    function fwd() {
      go(Math.min(s.length - 1, ++big.current));
    }

    function rev() {
      go(Math.max(0, --big.current));
    }

    document.onkeydown = function(e) {
        if (e.which === 39 || e.which === 34 || e.which === 40) fwd();
        if (e.which === 37 || e.which === 33 || e.which === 38) rev();
    };
    document.ontouchstart = function(e) {
        var x0 = e.changedTouches[0].pageX;
        document.ontouchend = function(e) {
            var x1 = e.changedTouches[0].pageX;
            if (x1 - x0 < 0) fwd();
            if (x1 - x0 > 0) rev();
        };
    };
    function parse_hash() {
        return Math.max(Math.min(s.length - 1,
            parseInt(window.location.hash.substring(1), 10)), 0);
    }
    if (window.location.hash) big.current = parse_hash() || big.current;
    window.onhashchange = function() {
        var c = parse_hash();
        if (c !== big.current) go(c);
    };
    go(big.current);
};
