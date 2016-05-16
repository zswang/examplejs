var examplejs = require('../');
describe("src/examplejs.js", function () {
  var assert = require('should');
  var util = require('util');
  var examplejs_printLines;
  function examplejs_print() {
    examplejs_printLines.push(util.format.apply(util, arguments));
  }

  it("build():content empty", function() {
    examplejs_printLines = [];
    var text = examplejs.build('');
    examplejs_print(text.length);
    assert.equal(examplejs_printLines.join("\n"), "0"); examplejs_printLines = [];
  });
  it("build():example empty", function() {
    examplejs_printLines = [];
    var text = examplejs.build('space', {});
    examplejs_print(text.length);
    assert.equal(examplejs_printLines.join("\n"), "0"); examplejs_printLines = [];
  });
  it("build():console.log(1)", function() {
    examplejs_printLines = [];
    var text = examplejs.build('@example\n\`\`\`js\nexamplejs_print(1);\n// > 1\n\`\`\`');
    examplejs_print(/examplejs_print\(1\);/.test(text));
    assert.equal(examplejs_printLines.join("\n"), "true"); examplejs_printLines = [];
  });
  it("build():options.timeout", function() {
    examplejs_printLines = [];
    var text = examplejs.build('@example\n\`\`\`js\nexamplejs_print(1);\n// > 1\n\`\`\`', {
      timeout: 1234
    });
    examplejs_print(/this.timeout\(1234\);/.test(text));
    assert.equal(examplejs_printLines.join("\n"), "true"); examplejs_printLines = [];
  });
  it("build():done", function() {
    examplejs_printLines = [];
    var text = examplejs.build('@example\n\`\`\`js\nsetTimeout(function() {examplejs_print(1);\n// > 1\n// \* done\n},500)\`\`\`');
    examplejs_print(/\(done\)/.test(text));
    assert.equal(examplejs_printLines.join("\n"), "true"); examplejs_printLines = [];
  });
  it("build():throw", function() {
    examplejs_printLines = [];
    var text = examplejs.build('@example\n\`\`\`js\nexamplejs_print(xyz);\n// \* throw\n\`\`\`');
    examplejs_print(/throw\(\);/.test(text));
    assert.equal(examplejs_printLines.join("\n"), "true"); examplejs_printLines = [];
  });
  it("build():options.header", function() {
    examplejs_printLines = [];
    var text = examplejs.build('@example\n\`\`\`js\nexamplejs_print(xyz);\n// \* throw\n\`\`\`', {
      header: 'var url = require(\'url\');'
    });
    examplejs_print(text.indexOf('var url = require(\'url\');'));
    assert.equal(examplejs_printLines.join("\n"), "0"); examplejs_printLines = [];
  });
});

  