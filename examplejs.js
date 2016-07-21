(function(exportName) {
  /* global exports */
  var exports = exports || {};
  /**
   * @file examplejs
   *
   * A tool for converting example code into test cases
   * @author
   *   zswang (http://weibo.com/zswang)
   * @version 0.1.4
   * @date 2016-07-21
   */
  /*<function name="format">*/
  /**
   * 格式化函数
   *
   * @param {string} template 模板
   * @param {object} json 数据项
   '''<example>'''
   * @example format():array
    ```js
    console.log(jstrs.format('#{0} #{1}', [1, 2]));
    // > 1 2
    ```
   * @example format():object
    ```js
    console.log(jstrs.format('#{level} -- #{color}', {
      color: 'red',
      level: 2
    }));
    // > 2 -- red
    ```
   * @example format():undefined
    ```js
    console.log(jstrs.format('#{level} -- #{color}', {
      color: 'red'
    }));
    // >  -- red
    ```
   * @example format():function
   '''<jdists encoding="regex" pattern="/~/g" replacement="*" trigger="example">'''
    ```js
    // "~" 替换成 "*"
    console.log(jstrs.format(function () {
    /~
      #{color}: #{level}
    ~/
    }, {
      color: 'red',
      level: 2
    }));
    // > red: 2
    ```
   '''</jdists>'''
   '''</example>'''
   */
  function format(template, json) {
    return template.replace(/#\{(.*?)\}/g, function (all, key) {
      return json && (key in json) ? json[key] : "";
    });
  }
  /*</function>*/
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
          exampleCode += format( "\n  it(#{it}, function (done) {\n    jsdom.env(#{html}, function (err, window) {\n      global.window = window;\n      ['atob', 'btoa', 'document', 'navigator', 'location', 'screen', 'alert', 'prompt'].forEach(\n        function (key) {\n          global[key] = window[key];\n        }\n      );\n      assert.equal(err, null);\n      done();\n    });\n  });\n          ", {
            html: JSON.stringify(codes.html.join('\n')),
            it: JSON.stringify('jsdom@' + it)
          });
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
        exampleCode += format( "\n  it(#{it}, function (#{done}) {\n    examplejs_printLines = [];\n#{code}\n  });\n          ", {
          code: code,
          done: hasDone ? 'done' : '',
          it: JSON.stringify(it)
        });
      }
    );
    if (!exampleCode) {
      return '';
    }
    var lines = [];
    if (options.header) {
      lines.push(options.header);
    }
    lines.push(
      format( "\ndescribe(#{desc}, function () {\n  var assert = require('should');\n  var util = require('util');\n  var examplejs_printLines;\n  function examplejs_print() {\n    examplejs_printLines.push(util.format.apply(util, arguments));\n  }\n  #{jsdom}\n  #{timeout}\n#{exampleCode}\n});\n         ", {
        desc: JSON.stringify(options.desc || 'none'),
        jsdom: (jsdomExists ? "var jsdom = require('jsdom');" : ''),
        timeout: options.timeout ? 'this.timeout(' + options.timeout + ');' : '',
        exampleCode: exampleCode
      })
    );
    return lines.join('\n');
  }
  /*</function>*/
  exports.build = examplejs_build;
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