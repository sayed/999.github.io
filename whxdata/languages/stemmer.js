(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/*!
 * Snowball JavaScript Library v0.3
 * http://code.google.com/p/urim/
 * http://snowball.tartarus.org/
 *
 * Copyright 2010, Oleg Mazko
 * http://www.mozilla.org/MPL/
 */

/**
 * export the module via AMD, CommonJS or as a browser global
 * Export code from https://github.com/umdjs/umd/blob/master/returnExports.js
 */
;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory)
    } else if (typeof exports === 'object') {
        /**
         * Node. Does not work with strict CommonJS, but
         * only CommonJS-like environments that support module.exports,
         * like Node.
         */
        module.exports = factory()
    } else {
        // Browser globals (root is window)
        factory()(root.lunr);
    }
}(this, function () {
    /**
     * Just return a value to define the module export.
     * This example returns an object, but the module
     * can return a function as the exported value.
     */
    return function(lunr) {
        /* provides utilities for the included stemmers */
        lunr.stemmerSupport = {
            Among: function(s, substring_i, result, method) {
                this.toCharArray = function(s) {
                    var sLength = s.length, charArr = new Array(sLength);
                    for (var i = 0; i < sLength; i++)
                        charArr[i] = s.charCodeAt(i);
                    return charArr;
                };

                if ((!s && s != "") || (!substring_i && (substring_i != 0)) || !result)
                    throw ("Bad Among initialisation: s:" + s + ", substring_i: "
                        + substring_i + ", result: " + result);
                this.s_size = s.length;
                this.s = this.toCharArray(s);
                this.substring_i = substring_i;
                this.result = result;
                this.method = method;
            },
            SnowballProgram: function() {
                var current;
                return {
                    bra : 0,
                    ket : 0,
                    limit : 0,
                    cursor : 0,
                    limit_backward : 0,
                    setCurrent : function(word) {
                        current = word;
                        this.cursor = 0;
                        this.limit = word.length;
                        this.limit_backward = 0;
                        this.bra = this.cursor;
                        this.ket = this.limit;
                    },
                    getCurrent : function() {
                        var result = current;
                        current = null;
                        return result;
                    },
                    in_grouping : function(s, min, max) {
                        if (this.cursor < this.limit) {
                            var ch = current.charCodeAt(this.cursor);
                            if (ch <= max && ch >= min) {
                                ch -= min;
                                if (s[ch >> 3] & (0X1 << (ch & 0X7))) {
                                    this.cursor++;
                                    return true;
                                }
                            }
                        }
                        return false;
                    },
                    in_grouping_b : function(s, min, max) {
                        if (this.cursor > this.limit_backward) {
                            var ch = current.charCodeAt(this.cursor - 1);
                            if (ch <= max && ch >= min) {
                                ch -= min;
                                if (s[ch >> 3] & (0X1 << (ch & 0X7))) {
                                    this.cursor--;
                                    return true;
                                }
                            }
                        }
                        return false;
                    },
                    out_grouping : function(s, min, max) {
                        if (this.cursor < this.limit) {
                            var ch = current.charCodeAt(this.cursor);
                            if (ch > max || ch < min) {
                                this.cursor++;
                                return true;
                            }
                            ch -= min;
                            if (!(s[ch >> 3] & (0X1 << (ch & 0X7)))) {
                                this.cursor++;
                                return true;
                            }
                        }
                        return false;
                    },
                    out_grouping_b : function(s, min, max) {
                        if (this.cursor > this.limit_backward) {
                            var ch = current.charCodeAt(this.cursor - 1);
                            if (ch > max || ch < min) {
                                this.cursor--;
                                return true;
                            }
                            ch -= min;
                            if (!(s[ch >> 3] & (0X1 << (ch & 0X7)))) {
                                this.cursor--;
                                return true;
                            }
                        }
                        return false;
                    },
                    eq_s : function(s_size, s) {
                        if (this.limit - this.cursor < s_size)
                            return false;
                        for (var i = 0; i < s_size; i++)
                            if (current.charCodeAt(this.cursor + i) != s.charCodeAt(i))
                                return false;
                        this.cursor += s_size;
                        return true;
                    },
                    eq_s_b : function(s_size, s) {
                        if (this.cursor - this.limit_backward < s_size)
                            return false;
                        for (var i = 0; i < s_size; i++)
                            if (current.charCodeAt(this.cursor - s_size + i) != s
                                .charCodeAt(i))
                                return false;
                        this.cursor -= s_size;
                        return true;
                    },
                    find_among : function(v, v_size) {
                        var i = 0, j = v_size, c = this.cursor, l = this.limit, common_i = 0, common_j = 0, first_key_inspected = false;
                        while (true) {
                            var k = i + ((j - i) >> 1), diff = 0, common = common_i < common_j
                                ? common_i
                                : common_j, w = v[k];
                            for (var i2 = common; i2 < w.s_size; i2++) {
                                if (c + common == l) {
                                    diff = -1;
                                    break;
                                }
                                diff = current.charCodeAt(c + common) - w.s[i2];
                                if (diff)
                                    break;
                                common++;
                            }
                            if (diff < 0) {
                                j = k;
                                common_j = common;
                            } else {
                                i = k;
                                common_i = common;
                            }
                            if (j - i <= 1) {
                                if (i > 0 || j == i || first_key_inspected)
                                    break;
                                first_key_inspected = true;
                            }
                        }
                        while (true) {
                            var w = v[i];
                            if (common_i >= w.s_size) {
                                this.cursor = c + w.s_size;
                                if (!w.method)
                                    return w.result;
                                var res = w.method();
                                this.cursor = c + w.s_size;
                                if (res)
                                    return w.result;
                            }
                            i = w.substring_i;
                            if (i < 0)
                                return 0;
                        }
                    },
                    find_among_b : function(v, v_size) {
                        var i = 0, j = v_size, c = this.cursor, lb = this.limit_backward, common_i = 0, common_j = 0, first_key_inspected = false;
                        while (true) {
                            var k = i + ((j - i) >> 1), diff = 0, common = common_i < common_j
                                ? common_i
                                : common_j, w = v[k];
                            for (var i2 = w.s_size - 1 - common; i2 >= 0; i2--) {
                                if (c - common == lb) {
                                    diff = -1;
                                    break;
                                }
                                diff = current.charCodeAt(c - 1 - common) - w.s[i2];
                                if (diff)
                                    break;
                                common++;
                            }
                            if (diff < 0) {
                                j = k;
                                common_j = common;
                            } else {
                                i = k;
                                common_i = common;
                            }
                            if (j - i <= 1) {
                                if (i > 0 || j == i || first_key_inspected)
                                    break;
                                first_key_inspected = true;
                            }
                        }
                        while (true) {
                            var w = v[i];
                            if (common_i >= w.s_size) {
                                this.cursor = c - w.s_size;
                                if (!w.method)
                                    return w.result;
                                var res = w.method();
                                this.cursor = c - w.s_size;
                                if (res)
                                    return w.result;
                            }
                            i = w.substring_i;
                            if (i < 0)
                                return 0;
                        }
                    },
                    replace_s : function(c_bra, c_ket, s) {
                        var adjustment = s.length - (c_ket - c_bra), left = current
                            .substring(0, c_bra), right = current.substring(c_ket);
                        current = left + s + right;
                        this.limit += adjustment;
                        if (this.cursor >= c_ket)
                            this.cursor += adjustment;
                        else if (this.cursor > c_bra)
                            this.cursor = c_bra;
                        return adjustment;
                    },
                    slice_check : function() {
                        if (this.bra < 0 || this.bra > this.ket || this.ket > this.limit
                            || this.limit > current.length)
                            throw ("faulty slice operation");
                    },
                    slice_from : function(s) {
                        this.slice_check();
                        this.replace_s(this.bra, this.ket, s);
                    },
                    slice_del : function() {
                        this.slice_from("");
                    },
                    insert : function(c_bra, c_ket, s) {
                        var adjustment = this.replace_s(c_bra, c_ket, s);
                        if (c_bra <= this.bra)
                            this.bra += adjustment;
                        if (c_bra <= this.ket)
                            this.ket += adjustment;
                    },
                    slice_to : function() {
                        this.slice_check();
                        return current.substring(this.bra, this.ket);
                    },
                    eq_v_b : function(s) {
                        return this.eq_s_b(s.length, s);
                    }
                };
            }
        };

        lunr.trimmerSupport = {
            generateTrimmer: function(wordCharacters) {
                var startRegex = new RegExp("^[^" + wordCharacters + "]+")
                var endRegex = new RegExp("[^" + wordCharacters + "]+$")

                return function(token) {
                    // for lunr version 2
                    if (typeof token.update === "function") {
                        return token.update(function (s) {
                            return s
                                .replace(startRegex, '')
                                .replace(endRegex, '');
                        })
                    } else { // for lunr version 1
                        return token
                            .replace(startRegex, '')
                            .replace(endRegex, '');
                    }
                };
            }
        }
    }
}));

},{}],2:[function(require,module,exports){
(function (global){
'use strict';

var rh = global.rh;
var stemmer = require('../../node_modules/lunr-languages/lunr.stemmer.support.js');
rh._.exports(stemmer);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../node_modules/lunr-languages/lunr.stemmer.support.js":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvbHVuci1sYW5ndWFnZXMvbHVuci5zdGVtbWVyLnN1cHBvcnQuanMiLCJzcmMvbGFuZ3VhZ2VzL3N0ZW1tZXIuanM2Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNoVEEsSUFBSSxLQUFLLE9BQU8sRUFBaEI7QUFDQSxJQUFJLFVBQVUsUUFBUSwyREFBUixDQUFkO0FBQ0EsR0FBRyxDQUFILENBQUssT0FBTCxDQUFhLE9BQWIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvKiFcbiAqIFNub3diYWxsIEphdmFTY3JpcHQgTGlicmFyeSB2MC4zXG4gKiBodHRwOi8vY29kZS5nb29nbGUuY29tL3AvdXJpbS9cbiAqIGh0dHA6Ly9zbm93YmFsbC50YXJ0YXJ1cy5vcmcvXG4gKlxuICogQ29weXJpZ2h0IDIwMTAsIE9sZWcgTWF6a29cbiAqIGh0dHA6Ly93d3cubW96aWxsYS5vcmcvTVBML1xuICovXG5cbi8qKlxuICogZXhwb3J0IHRoZSBtb2R1bGUgdmlhIEFNRCwgQ29tbW9uSlMgb3IgYXMgYSBicm93c2VyIGdsb2JhbFxuICogRXhwb3J0IGNvZGUgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vdW1kanMvdW1kL2Jsb2IvbWFzdGVyL3JldHVybkV4cG9ydHMuanNcbiAqL1xuOyhmdW5jdGlvbiAocm9vdCwgZmFjdG9yeSkge1xuICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgLy8gQU1ELiBSZWdpc3RlciBhcyBhbiBhbm9ueW1vdXMgbW9kdWxlLlxuICAgICAgICBkZWZpbmUoZmFjdG9yeSlcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuICAgICAgICAvKipcbiAgICAgICAgICogTm9kZS4gRG9lcyBub3Qgd29yayB3aXRoIHN0cmljdCBDb21tb25KUywgYnV0XG4gICAgICAgICAqIG9ubHkgQ29tbW9uSlMtbGlrZSBlbnZpcm9ubWVudHMgdGhhdCBzdXBwb3J0IG1vZHVsZS5leHBvcnRzLFxuICAgICAgICAgKiBsaWtlIE5vZGUuXG4gICAgICAgICAqL1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKVxuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEJyb3dzZXIgZ2xvYmFscyAocm9vdCBpcyB3aW5kb3cpXG4gICAgICAgIGZhY3RvcnkoKShyb290Lmx1bnIpO1xuICAgIH1cbn0odGhpcywgZnVuY3Rpb24gKCkge1xuICAgIC8qKlxuICAgICAqIEp1c3QgcmV0dXJuIGEgdmFsdWUgdG8gZGVmaW5lIHRoZSBtb2R1bGUgZXhwb3J0LlxuICAgICAqIFRoaXMgZXhhbXBsZSByZXR1cm5zIGFuIG9iamVjdCwgYnV0IHRoZSBtb2R1bGVcbiAgICAgKiBjYW4gcmV0dXJuIGEgZnVuY3Rpb24gYXMgdGhlIGV4cG9ydGVkIHZhbHVlLlxuICAgICAqL1xuICAgIHJldHVybiBmdW5jdGlvbihsdW5yKSB7XG4gICAgICAgIC8qIHByb3ZpZGVzIHV0aWxpdGllcyBmb3IgdGhlIGluY2x1ZGVkIHN0ZW1tZXJzICovXG4gICAgICAgIGx1bnIuc3RlbW1lclN1cHBvcnQgPSB7XG4gICAgICAgICAgICBBbW9uZzogZnVuY3Rpb24ocywgc3Vic3RyaW5nX2ksIHJlc3VsdCwgbWV0aG9kKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50b0NoYXJBcnJheSA9IGZ1bmN0aW9uKHMpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNMZW5ndGggPSBzLmxlbmd0aCwgY2hhckFyciA9IG5ldyBBcnJheShzTGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzTGVuZ3RoOyBpKyspXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFyQXJyW2ldID0gcy5jaGFyQ29kZUF0KGkpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2hhckFycjtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgaWYgKCghcyAmJiBzICE9IFwiXCIpIHx8ICghc3Vic3RyaW5nX2kgJiYgKHN1YnN0cmluZ19pICE9IDApKSB8fCAhcmVzdWx0KVxuICAgICAgICAgICAgICAgICAgICB0aHJvdyAoXCJCYWQgQW1vbmcgaW5pdGlhbGlzYXRpb246IHM6XCIgKyBzICsgXCIsIHN1YnN0cmluZ19pOiBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgKyBzdWJzdHJpbmdfaSArIFwiLCByZXN1bHQ6IFwiICsgcmVzdWx0KTtcbiAgICAgICAgICAgICAgICB0aGlzLnNfc2l6ZSA9IHMubGVuZ3RoO1xuICAgICAgICAgICAgICAgIHRoaXMucyA9IHRoaXMudG9DaGFyQXJyYXkocyk7XG4gICAgICAgICAgICAgICAgdGhpcy5zdWJzdHJpbmdfaSA9IHN1YnN0cmluZ19pO1xuICAgICAgICAgICAgICAgIHRoaXMucmVzdWx0ID0gcmVzdWx0O1xuICAgICAgICAgICAgICAgIHRoaXMubWV0aG9kID0gbWV0aG9kO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFNub3diYWxsUHJvZ3JhbTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIGN1cnJlbnQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgYnJhIDogMCxcbiAgICAgICAgICAgICAgICAgICAga2V0IDogMCxcbiAgICAgICAgICAgICAgICAgICAgbGltaXQgOiAwLFxuICAgICAgICAgICAgICAgICAgICBjdXJzb3IgOiAwLFxuICAgICAgICAgICAgICAgICAgICBsaW1pdF9iYWNrd2FyZCA6IDAsXG4gICAgICAgICAgICAgICAgICAgIHNldEN1cnJlbnQgOiBmdW5jdGlvbih3b3JkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50ID0gd29yZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3Vyc29yID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubGltaXQgPSB3b3JkLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubGltaXRfYmFja3dhcmQgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5icmEgPSB0aGlzLmN1cnNvcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMua2V0ID0gdGhpcy5saW1pdDtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgZ2V0Q3VycmVudCA6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGN1cnJlbnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50ID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGluX2dyb3VwaW5nIDogZnVuY3Rpb24ocywgbWluLCBtYXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmN1cnNvciA8IHRoaXMubGltaXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2ggPSBjdXJyZW50LmNoYXJDb2RlQXQodGhpcy5jdXJzb3IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjaCA8PSBtYXggJiYgY2ggPj0gbWluKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoIC09IG1pbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNbY2ggPj4gM10gJiAoMFgxIDw8IChjaCAmIDBYNykpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnNvcisrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGluX2dyb3VwaW5nX2IgOiBmdW5jdGlvbihzLCBtaW4sIG1heCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY3Vyc29yID4gdGhpcy5saW1pdF9iYWNrd2FyZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjaCA9IGN1cnJlbnQuY2hhckNvZGVBdCh0aGlzLmN1cnNvciAtIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjaCA8PSBtYXggJiYgY2ggPj0gbWluKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoIC09IG1pbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNbY2ggPj4gM10gJiAoMFgxIDw8IChjaCAmIDBYNykpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnNvci0tO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIG91dF9ncm91cGluZyA6IGZ1bmN0aW9uKHMsIG1pbiwgbWF4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jdXJzb3IgPCB0aGlzLmxpbWl0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNoID0gY3VycmVudC5jaGFyQ29kZUF0KHRoaXMuY3Vyc29yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2ggPiBtYXggfHwgY2ggPCBtaW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJzb3IrKztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoIC09IG1pbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIShzW2NoID4+IDNdICYgKDBYMSA8PCAoY2ggJiAwWDcpKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJzb3IrKztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBvdXRfZ3JvdXBpbmdfYiA6IGZ1bmN0aW9uKHMsIG1pbiwgbWF4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jdXJzb3IgPiB0aGlzLmxpbWl0X2JhY2t3YXJkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNoID0gY3VycmVudC5jaGFyQ29kZUF0KHRoaXMuY3Vyc29yIC0gMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNoID4gbWF4IHx8IGNoIDwgbWluKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3Vyc29yLS07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaCAtPSBtaW47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEoc1tjaCA+PiAzXSAmICgwWDEgPDwgKGNoICYgMFg3KSkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3Vyc29yLS07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgZXFfcyA6IGZ1bmN0aW9uKHNfc2l6ZSwgcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMubGltaXQgLSB0aGlzLmN1cnNvciA8IHNfc2l6ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNfc2l6ZTsgaSsrKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50LmNoYXJDb2RlQXQodGhpcy5jdXJzb3IgKyBpKSAhPSBzLmNoYXJDb2RlQXQoaSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3Vyc29yICs9IHNfc2l6ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBlcV9zX2IgOiBmdW5jdGlvbihzX3NpemUsIHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmN1cnNvciAtIHRoaXMubGltaXRfYmFja3dhcmQgPCBzX3NpemUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzX3NpemU7IGkrKylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudC5jaGFyQ29kZUF0KHRoaXMuY3Vyc29yIC0gc19zaXplICsgaSkgIT0gc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY2hhckNvZGVBdChpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJzb3IgLT0gc19zaXplO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGZpbmRfYW1vbmcgOiBmdW5jdGlvbih2LCB2X3NpemUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpID0gMCwgaiA9IHZfc2l6ZSwgYyA9IHRoaXMuY3Vyc29yLCBsID0gdGhpcy5saW1pdCwgY29tbW9uX2kgPSAwLCBjb21tb25faiA9IDAsIGZpcnN0X2tleV9pbnNwZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGsgPSBpICsgKChqIC0gaSkgPj4gMSksIGRpZmYgPSAwLCBjb21tb24gPSBjb21tb25faSA8IGNvbW1vbl9qXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gY29tbW9uX2lcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBjb21tb25faiwgdyA9IHZba107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaTIgPSBjb21tb247IGkyIDwgdy5zX3NpemU7IGkyKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGMgKyBjb21tb24gPT0gbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlmZiA9IC0xO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlmZiA9IGN1cnJlbnQuY2hhckNvZGVBdChjICsgY29tbW9uKSAtIHcuc1tpMl07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkaWZmKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbisrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGlmZiA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaiA9IGs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbl9qID0gY29tbW9uO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGkgPSBrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tb25faSA9IGNvbW1vbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGogLSBpIDw9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGkgPiAwIHx8IGogPT0gaSB8fCBmaXJzdF9rZXlfaW5zcGVjdGVkKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpcnN0X2tleV9pbnNwZWN0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHcgPSB2W2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb21tb25faSA+PSB3LnNfc2l6ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnNvciA9IGMgKyB3LnNfc2l6ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF3Lm1ldGhvZClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB3LnJlc3VsdDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlcyA9IHcubWV0aG9kKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3Vyc29yID0gYyArIHcuc19zaXplO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHcucmVzdWx0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpID0gdy5zdWJzdHJpbmdfaTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaSA8IDApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBmaW5kX2Ftb25nX2IgOiBmdW5jdGlvbih2LCB2X3NpemUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpID0gMCwgaiA9IHZfc2l6ZSwgYyA9IHRoaXMuY3Vyc29yLCBsYiA9IHRoaXMubGltaXRfYmFja3dhcmQsIGNvbW1vbl9pID0gMCwgY29tbW9uX2ogPSAwLCBmaXJzdF9rZXlfaW5zcGVjdGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBrID0gaSArICgoaiAtIGkpID4+IDEpLCBkaWZmID0gMCwgY29tbW9uID0gY29tbW9uX2kgPCBjb21tb25falxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IGNvbW1vbl9pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogY29tbW9uX2osIHcgPSB2W2tdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkyID0gdy5zX3NpemUgLSAxIC0gY29tbW9uOyBpMiA+PSAwOyBpMi0tKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjIC0gY29tbW9uID09IGxiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaWZmID0gLTE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaWZmID0gY3VycmVudC5jaGFyQ29kZUF0KGMgLSAxIC0gY29tbW9uKSAtIHcuc1tpMl07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkaWZmKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbisrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGlmZiA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaiA9IGs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbl9qID0gY29tbW9uO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGkgPSBrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tb25faSA9IGNvbW1vbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGogLSBpIDw9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGkgPiAwIHx8IGogPT0gaSB8fCBmaXJzdF9rZXlfaW5zcGVjdGVkKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpcnN0X2tleV9pbnNwZWN0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHcgPSB2W2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb21tb25faSA+PSB3LnNfc2l6ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnNvciA9IGMgLSB3LnNfc2l6ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF3Lm1ldGhvZClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB3LnJlc3VsdDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlcyA9IHcubWV0aG9kKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3Vyc29yID0gYyAtIHcuc19zaXplO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHcucmVzdWx0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpID0gdy5zdWJzdHJpbmdfaTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaSA8IDApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICByZXBsYWNlX3MgOiBmdW5jdGlvbihjX2JyYSwgY19rZXQsIHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhZGp1c3RtZW50ID0gcy5sZW5ndGggLSAoY19rZXQgLSBjX2JyYSksIGxlZnQgPSBjdXJyZW50XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnN1YnN0cmluZygwLCBjX2JyYSksIHJpZ2h0ID0gY3VycmVudC5zdWJzdHJpbmcoY19rZXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudCA9IGxlZnQgKyBzICsgcmlnaHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxpbWl0ICs9IGFkanVzdG1lbnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jdXJzb3IgPj0gY19rZXQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJzb3IgKz0gYWRqdXN0bWVudDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuY3Vyc29yID4gY19icmEpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJzb3IgPSBjX2JyYTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhZGp1c3RtZW50O1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBzbGljZV9jaGVjayA6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuYnJhIDwgMCB8fCB0aGlzLmJyYSA+IHRoaXMua2V0IHx8IHRoaXMua2V0ID4gdGhpcy5saW1pdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8IHRoaXMubGltaXQgPiBjdXJyZW50Lmxlbmd0aClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyAoXCJmYXVsdHkgc2xpY2Ugb3BlcmF0aW9uXCIpO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBzbGljZV9mcm9tIDogZnVuY3Rpb24ocykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zbGljZV9jaGVjaygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXBsYWNlX3ModGhpcy5icmEsIHRoaXMua2V0LCBzKTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgc2xpY2VfZGVsIDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNsaWNlX2Zyb20oXCJcIik7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGluc2VydCA6IGZ1bmN0aW9uKGNfYnJhLCBjX2tldCwgcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGFkanVzdG1lbnQgPSB0aGlzLnJlcGxhY2VfcyhjX2JyYSwgY19rZXQsIHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNfYnJhIDw9IHRoaXMuYnJhKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYnJhICs9IGFkanVzdG1lbnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY19icmEgPD0gdGhpcy5rZXQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5rZXQgKz0gYWRqdXN0bWVudDtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgc2xpY2VfdG8gOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2xpY2VfY2hlY2soKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjdXJyZW50LnN1YnN0cmluZyh0aGlzLmJyYSwgdGhpcy5rZXQpO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBlcV92X2IgOiBmdW5jdGlvbihzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5lcV9zX2Iocy5sZW5ndGgsIHMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBsdW5yLnRyaW1tZXJTdXBwb3J0ID0ge1xuICAgICAgICAgICAgZ2VuZXJhdGVUcmltbWVyOiBmdW5jdGlvbih3b3JkQ2hhcmFjdGVycykge1xuICAgICAgICAgICAgICAgIHZhciBzdGFydFJlZ2V4ID0gbmV3IFJlZ0V4cChcIl5bXlwiICsgd29yZENoYXJhY3RlcnMgKyBcIl0rXCIpXG4gICAgICAgICAgICAgICAgdmFyIGVuZFJlZ2V4ID0gbmV3IFJlZ0V4cChcIlteXCIgKyB3b3JkQ2hhcmFjdGVycyArIFwiXSskXCIpXG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24odG9rZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZm9yIGx1bnIgdmVyc2lvbiAyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdG9rZW4udXBkYXRlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0b2tlbi51cGRhdGUoZnVuY3Rpb24gKHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZShzdGFydFJlZ2V4LCAnJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoZW5kUmVnZXgsICcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7IC8vIGZvciBsdW5yIHZlcnNpb24gMVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRva2VuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2Uoc3RhcnRSZWdleCwgJycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoZW5kUmVnZXgsICcnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59KSk7XG4iLCJsZXQgcmggPSBnbG9iYWwucmhcclxubGV0IHN0ZW1tZXIgPSByZXF1aXJlKCcuLi8uLi9ub2RlX21vZHVsZXMvbHVuci1sYW5ndWFnZXMvbHVuci5zdGVtbWVyLnN1cHBvcnQuanMnKVxyXG5yaC5fLmV4cG9ydHMoc3RlbW1lcikiXX0=
