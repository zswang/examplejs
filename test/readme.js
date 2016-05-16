describe("debug/README.md", function () {
  var assert = require('should');
  var util = require('util');
  var examplejs_printLines;
  function examplejs_print() {
    examplejs_printLines.push(util.format.apply(util, arguments));
  }
  this.timeout(3000);

  it("表达式相等预判", function() {
    examplejs_printLines = [];
  var a = 1;
  var b = 2;
  examplejs_print(a === b);
  assert.equal(examplejs_printLines.join("\n"), "false"); examplejs_printLines = [];
  });
  it("表达式结果预判", function() {
    examplejs_printLines = [];
  var a = 1;
  var b = 2;
  examplejs_print(a + b);
  assert.equal(examplejs_printLines.join("\n"), "3"); examplejs_printLines = [];
  });
  it("表达式类型预判", function() {
    examplejs_printLines = [];
  var a = 1;
  examplejs_print(JSON.stringify(a + '1'));
  assert.equal(examplejs_printLines.join("\n"), "\"11\""); examplejs_printLines = [];
  });
  it("批量表达式预判", function() {
    examplejs_printLines = [];
  for (var i = 0; i < 5; i++) {
    examplejs_print(i);
  }
  assert.equal(examplejs_printLines.join("\n"), "0\n1\n2\n3\n4"); examplejs_printLines = [];
  });
  it("异步执行预判", function(done) {
    examplejs_printLines = [];
  var a = 1;
  setTimeout(function () {
    examplejs_print(a);
    assert.equal(examplejs_printLines.join("\n"), "2"); examplejs_printLines = [];
    done();
  }, 1000);
  a++;
  });
  it("异常执行预判", function() {
    examplejs_printLines = [];

  (function() {
  var a = JSON.parse('#error');
  // * throw
  }).should.throw();
  });
});

  