(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports=  (lunr) =>{
  lunr.default = function(){
    this.stemmer = lunr.stemmer
    this.enSeparators = `[\\s\\.\\-\\'\\,\\n;\\:\\\/\\!~<>\\?\\{\\}\\[\\]\\|\\+"]`
    lunr.default.tokenizer = lunr.tokenizer
    lunr.default.trimmer = (token) =>{
      return token.update((s) =>{
        return s.replace(`^${this.enSeparators}+`, '').replace(`${this.enSeparators}+$`, '')
      })
    }
    lunr.default.stopWordFilter = lunr.stopWordFilter
    lunr.default.stemmer = lunr.stemmer
    if(this.pipeline){
      this.pipeline.add(
        lunr.default.trimmer,
        lunr.default.stopWordFilter,
        //lunr.default.stemmer
      );  
    }
    this.pipeline.reset()
    if (this.searchPipeline) {
      this.searchPipeline.reset();
      //this.searchPipeline.add(lunr.default.stemmer)
    }
    lunr.Pipeline.registerFunction(lunr.default.trimmer, 'trimmer-default');
    lunr.Pipeline.registerFunction(lunr.default.stopWordFilter, 'stopwords-default');
    //lunr.Pipeline.registerFunction(lunr.default.stemmer, 'stemmer-default');
  }
}
},{}],2:[function(require,module,exports){
(function (global){
let rh = global.rh
let lunrlang = require('../indexer/default_language.ts')
rh._.exports(lunrlang)

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../indexer/default_language.ts":1}]},{},[2]);
