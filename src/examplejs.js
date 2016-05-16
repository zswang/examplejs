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
   * @example build():console.log(1)
    ```js
    var text = examplejs.build('@example\n\`\`\`js\nconsole.log(1);\n// > 1\n\`\`\`');
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
   */

  function examplejs_build(content, options) {
    if (!content) {
      return content;
    }
    options = options || {};

    var exampleCode = '';
    String(content).replace(/\s*\*?\s*@example\s*(.*)\n\s*```(?:javascript|js)\s*\n([^]*?)\s*```/ig,
      function(all, it, code) {
        var hasDone = code.indexOf('// * done') >= 0;
        var hasThrows = code.indexOf('// * throw') >= 0;
        it = it || 'none';
        exampleCode += '\n  it(' + JSON.stringify(it) + ', function(' + (hasDone ? 'done' : '') + ') {';
        exampleCode += '\n    examplejs_printLines = [];\n';

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
        exampleCode += code;
        exampleCode += '\n  });';
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
      'describe("' + (options.desc || 'none') + '", function () {',
      '  var assert = require(\'should\');',
      '  var util = require(\'util\');',
      '  var examplejs_printLines;',
      '  function examplejs_print() {',
      '    examplejs_printLines.push(util.format.apply(util, arguments));',
      '  }'
    );
    if (options.timeout) {
      lines.push('  this.timeout(' + options.timeout + ');');
    }
    lines.push(exampleCode);
    lines.push('});');
    return lines.join('\n');
  }
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