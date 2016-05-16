var jtests = require('../');
describe("src/jtests.js", function () {
  var assert = require('should');
  var util = require('util');
  var jtests_printLines;
  function jtests_print() {
    jtests_printLines.push(util.format.apply(util, arguments));
  }

  it("build():content empty", function() {
    jtests_printLines = [];
    var text = jtests.build('');
    jtests_print(text.length);
    assert.equal(jtests_printLines.join("\n"), "0"); jtests_printLines = [];
  });
  it("build():example empty", function() {
    jtests_printLines = [];
    var text = jtests.build('space', {});
    jtests_print(text.length);
    assert.equal(jtests_printLines.join("\n"), "0"); jtests_printLines = [];
  });
  it("build():console.log(1)", function() {
    jtests_printLines = [];
    var text = jtests.build('@example\n\`\`\`js\njtests_print(1);\n// > 1\n\`\`\`');
    jtests_print(/jtests_print\(1\);/.test(text));
    assert.equal(jtests_printLines.join("\n"), "true"); jtests_printLines = [];
  });
  it("build():options.timeout", function() {
    jtests_printLines = [];
    var text = jtests.build('@example\n\`\`\`js\njtests_print(1);\n// > 1\n\`\`\`', {
      timeout: 1234
    });
    jtests_print(/this.timeout\(1234\);/.test(text));
    assert.equal(jtests_printLines.join("\n"), "true"); jtests_printLines = [];
  });
  it("build():done", function() {
    jtests_printLines = [];
    var text = jtests.build('@example\n\`\`\`js\nsetTimeout(function() {jtests_print(1);\n// > 1\n// \* done\n},500)\`\`\`');
    jtests_print(/\(done\)/.test(text));
    assert.equal(jtests_printLines.join("\n"), "true"); jtests_printLines = [];
  });
  it("build():throw", function() {
    jtests_printLines = [];
    var text = jtests.build('@example\n\`\`\`js\njtests_print(xyz);\n// \* throw\n\`\`\`');
    jtests_print(/throw\(\);/.test(text));
    assert.equal(jtests_printLines.join("\n"), "true"); jtests_printLines = [];
  });
  it("build():options.header", function() {
    jtests_printLines = [];
    var text = jtests.build('@example\n\`\`\`js\njtests_print(xyz);\n// \* throw\n\`\`\`', {
      header: 'var url = require(\'url\');'
    });
    jtests_print(text.indexOf('var url = require(\'url\');'));
    assert.equal(jtests_printLines.join("\n"), "0"); jtests_printLines = [];
  });
});

  