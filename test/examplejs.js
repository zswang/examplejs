var examplejs = require('../');

describe("src/examplejs.js", function () {
  var assert = require('should');
  var util = require('util');
  var examplejs_printLines;
  function examplejs_print() {
    examplejs_printLines.push(util.format.apply(util, arguments));
  }
  var jsdom = require('jsdom');
  

  it("build():content empty", function () {
    examplejs_printLines = [];
    var text = examplejs.build('');
    examplejs_print(text.length);
    assert.equal(examplejs_printLines.join("\n"), "0"); examplejs_printLines = [];
  });
          
  it("build():example empty", function () {
    examplejs_printLines = [];
    var text = examplejs.build('space', {});
    examplejs_print(text.length);
    assert.equal(examplejs_printLines.join("\n"), "0"); examplejs_printLines = [];
  });
          
  it("build():lang => javascript && console.log(1)", function () {
    examplejs_printLines = [];
    var text = examplejs.build('@example\n\`\`\`javascript\nexamplejs_print(1);\n// > 1\n\`\`\`');
    examplejs_print(/examplejs_print\(1\);/.test(text));
    assert.equal(examplejs_printLines.join("\n"), "true"); examplejs_printLines = [];
  });
          
  it("build():options.timeout", function () {
    examplejs_printLines = [];
    var text = examplejs.build('@example\n\`\`\`js\nexamplejs_print(1);\n// > 1\n\`\`\`', {
      timeout: 1234
    });
    examplejs_print(/this.timeout\(1234\);/.test(text));
    assert.equal(examplejs_printLines.join("\n"), "true"); examplejs_printLines = [];
  });
          
  it("build():done", function () {
    examplejs_printLines = [];
    var text = examplejs.build('@example\n\`\`\`js\nsetTimeout(function() {examplejs_print(1);\n// > 1\n// \* done\n},500)\`\`\`');
    examplejs_print(/\(done\)/.test(text));
    assert.equal(examplejs_printLines.join("\n"), "true"); examplejs_printLines = [];
  });
          
  it("build():throw", function () {
    examplejs_printLines = [];
    var text = examplejs.build('@example\n\`\`\`js\nexamplejs_print(xyz);\n// \* throw\n\`\`\`');
    examplejs_print(/throw\(\);/.test(text));
    assert.equal(examplejs_printLines.join("\n"), "true"); examplejs_printLines = [];
  });
          
  it("build():options.header", function () {
    examplejs_printLines = [];
    var text = examplejs.build('@example\n\`\`\`js\nexamplejs_print(xyz);\n// \* throw\n\`\`\`', {
      header: 'var url = require(\'url\');'
    });
    examplejs_print(text.indexOf('var url = require(\'url\');'));
    assert.equal(examplejs_printLines.join("\n"), "0"); examplejs_printLines = [];
  });
          
  it("build():jsdom css & html", function () {
    examplejs_printLines = [];
    var text = examplejs.build('@example\n\`\`\`css\ndiv { color: red; }\n\`\`\`\n\`\`\`html\n<div></div>\n\`\`\`');
    examplejs_print(text.indexOf('var jsdom = require(\'jsdom\');') >= 0);
    assert.equal(examplejs_printLines.join("\n"), "true"); examplejs_printLines = [];
  });
          
  it("build():options.globals", function () {
    examplejs_printLines = [];
    var text = examplejs.build('@example\n\`\`\`css\ndiv { color: red; }\n\`\`\`\n\`\`\`html\n<div></div>\n\`\`\`', {
      globals: 'btoa,atob'
    });
    examplejs_print(text.indexOf('atob') >= 0 && text.indexOf('btoa') >= 0);
    assert.equal(examplejs_printLines.join("\n"), "true"); examplejs_printLines = [];
  });
          
  it("jsdom@浏览器环境", function (done) {
    jsdom.env("    <div></div>", {
        features: {
          FetchExternalResources : ["script", "link"],
          ProcessExternalResources: ["script"]
        }
      },
      function (err, window) {
        global.window = window;
        ["document","navigator"].forEach(
          function (key) {
            global[key] = window[key];
          }
        );
        assert.equal(err, null);
        done();
      }
    );
  });
          
  it("浏览器环境", function () {
    examplejs_printLines = [];
    examplejs_print(document.querySelector('div') !== null);
    assert.equal(examplejs_printLines.join("\n"), "true"); examplejs_printLines = [];
  });
          
});
         