(function(exportName) {

  /*<remove>*/
  'use strict';
  /*</remove>*/

  /* global exports */
  var exports = exports || {};

  /*<jdists encoding="ejs" data="../package.json">*/
  /**
   * @file <%- name %>
   *
   * <%- description %>
   * @author
       <% (author instanceof Array ? author : [author]).forEach(function (item) { %>
   *   <%- item.name %> (<%- item.url %>)
       <% }); %>
   * @version <%- version %>
       <% var now = new Date() %>
   * @date <%- [
        now.getFullYear(),
        now.getMonth() + 101,
        now.getDate() + 100
      ].join('-').replace(/-1/g, '-') %>
   */
  /*</jdists>*/

  /*<jdists encoding="fndep" depend="format" import="../node_modules/jstrs/jstrs.js">*/
  var format = require('jstrs').format;
  /*</jdists>*/

  /*<function name="examplejs_build" depend="format">*/
  /**
   * @example build():content empty
    ```js
    var text = examplejs.build('');
    console.log(text.length);
    // > 0
    ```
   * @example build():example empty
    ```js
    var text = examplejs.build('space', {});
    console.log(text.length);
    // > 0
    ```
   * @example build():lang => javascript && console.log(1)
    ```js
    var text = examplejs.build('@example\n\`\`\`javascript\nconsole.log(1);\n// > 1\n\`\`\`');
    console.log(/examplejs_print\(1\);/.test(text));
    // > true
    ```
   * @example build():options.timeout
    ```js
    var text = examplejs.build('@example\n\`\`\`js\nconsole.log(1);\n// > 1\n\`\`\`', {
      timeout: 1234
    });
    console.log(/this.timeout\(1234\);/.test(text));
    // > true
    ```
   * @example build():done
    ```js
    var text = examplejs.build('@example\n\`\`\`js\nsetTimeout(function() {console.log(1);\n// > 1\n// \* done\n},500)\`\`\`');
    console.log(/\(done\)/.test(text));
    // > true
    ```
   * @example build():throw
    ```js
    var text = examplejs.build('@example\n\`\`\`js\nconsole.log(xyz);\n// \* throw\n\`\`\`');
    console.log(/throw\(\);/.test(text));
    // > true
    ```
   * @example build():options.header
    ```js
    var text = examplejs.build('@example\n\`\`\`js\nconsole.log(xyz);\n// \* throw\n\`\`\`', {
      header: 'var url = require(\'url\');'
    });
    console.log(text.indexOf('var url = require(\'url\');'));
    // > 0
    ```
   * @example build():jsdom css & html
    ```js
    var text = examplejs.build('@example\n\`\`\`css\ndiv { color: red; }\n\`\`\`\n\`\`\`html\n<div></div>\n\`\`\`');
    console.log(text.indexOf('var jsdom = require(\'jsdom\');') >= 0);
    // > true
    ```
   */
  function examplejs_build(content, options) {
    if (!content) {
      return content;
    }
    options = options || {};

    var exampleCode = '';
    var jsdomExists;
    String(content).replace(/\s*\*?\s*@example\s*(.*)\n\s*((```(?:javascript|js|html|css)\s*\n([^]*?)\s*```[\s]*)+)/ig,
      function(all, it, example) {
        var codes = {
          js: [],
          css: [],
          html: []
        };
        it = it || 'none';
        example.replace(/```(javascript|js|html|css)\s*\n([^]*?)\s*```/g, function(all, lang, code) {
          lang = lang.toLowerCase();
          if ('javascript' === lang) {
            lang = 'js';
          }
          if (code.trim()) {
            codes[lang].push(code);
          }
        });
        if (codes.css.length > 0) {
          codes.html.unshift('<style>' + codes.css.join('\n') + '</style>');
        }
        if (codes.html.length > 0) { // jsdom
          jsdomExists = true;

          /*<jdists encoding="candy">*/
          exampleCode += format( /*#*/ function() {
            /*
  it(#{it}, function (done) {
    jsdom.env(#{html}, function (err, window) {
      global.window = window;
      ['atob', 'btoa', 'document', 'navigator', 'location', 'screen', 'alert', 'prompt'].forEach(
        function (key) {
          global[key] = window[key];
        }
      );
      assert.equal(err, null);
      done();
    });
  });
          */
          }, {
            html: JSON.stringify(codes.html.join('\n')),
            it: JSON.stringify('jsdom@' + it)
          });
          /*</jdists>*/
        }
        var code = codes.js.join('\n');
        var hasDone = code.indexOf('// * done') >= 0;
        var hasThrows = code.indexOf('// * throw') >= 0;

        code = code.replace(/^(\s*\/\/ > .*\n??)+/mg,
          function(all) {
            var space = all.match(/^(\s*)\/\/ > /)[1];
            var output = all.replace(/^\s*\/\/ > /mg, '');
            return space + 'assert.equal(examplejs_printLines.join("\\n"), ' + JSON.stringify(output) + '); examplejs_printLines = [];';
          }
        ).replace(/console\.log/g, 'examplejs_print');

        if (hasDone) {
          code = code.replace('// * done', 'done();');
        }

        if (hasThrows) {
          var space = code.match(/^(\s*)/)[1];
          code = '\n' + space + '(function() {\n' + code + '\n' + space + '}).should.throw();';
        }
        /*<jdists encoding="candy">*/
        exampleCode += format( /*#*/ function() {
          /*
  it(#{it}, function (#{done}) {
    examplejs_printLines = [];
#{code}
  });
          */
        }, {
          code: code,
          done: hasDone ? 'done' : '',
          it: JSON.stringify(it)
        });
        /*</jdists>*/
      }
    );
    if (!exampleCode) {
      return '';
    }
    var lines = [];
    if (options.header) {
      lines.push(options.header);
    }
    /*<jdists encoding="candy">*/
    lines.push(
      format( /*#*/ function() {
        /*
describe(#{desc}, function () {
  var assert = require('should');
  var util = require('util');
  var examplejs_printLines;
  function examplejs_print() {
    examplejs_printLines.push(util.format.apply(util, arguments));
  }
  #{jsdom}
  #{timeout}
#{exampleCode}
});
         */
      }, {
        desc: JSON.stringify(options.desc || 'none'),
        jsdom: (jsdomExists ? "var jsdom = require('jsdom');" : ''),
        timeout: options.timeout ? 'this.timeout(' + options.timeout + ');' : '',
        exampleCode: exampleCode
      })
    );
    /*</jdists>*/
    return lines.join('\n');
  }
  /*</function>*/

  exports.build = examplejs_build;

  /*<remove>*/
  console.log(examplejs_build(String(function() {
  /*
   * @example 浏览器环境
    ```html
    <div></div>
    ```
    ```js
    console.log(document.querySelector('div') !== null);
    // > true
    ```
   */
  }).match(/\/\*([^]*)\*\//)[1]));
  /*</remove>*/
  if (typeof define === 'function') {
    if (define.amd) {
      define(function() {
        return exports;
      });
    }
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = exports;
  } else {
    window[exportName] = exports;
  }
})('examplejs');