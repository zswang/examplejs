describe("README.md", function () {
  var assert = require('should');
  var util = require('util');
  var jtests_printLines;
  function jtests_print() {
    jtests_printLines.push(util.format.apply(util, arguments));
  }
  this.timeout(3000);

  it("表达式相等预判", function() {
    jtests_printLines = [];
    var a = 1;
    var b = 2;
    jtests_print(a === b);
    assert.equal(jtests_printLines.join("\n"), "false"); jtests_printLines = [];
  });
  it("表达式结果预判", function() {
    jtests_printLines = [];
    var a = 1;
    var b = 2;
    jtests_print(a + b);
    assert.equal(jtests_printLines.join("\n"), "3"); jtests_printLines = [];
  });
  it("表达式类型预判", function() {
    jtests_printLines = [];
    var a = 1;
    jtests_print(JSON.stringify(a + '1'));
    assert.equal(jtests_printLines.join("\n"), "\"11\""); jtests_printLines = [];
  });
  it("批量表达式预判", function() {
    jtests_printLines = [];
    for (var i = 0; i < 5; i++) {
      jtests_print(i);
    }
    assert.equal(jtests_printLines.join("\n"), "0\n1\n2\n3\n4"); jtests_printLines = [];
  });
  it("异步执行预判", function(done) {
    jtests_printLines = [];
    var a = 1;
    setTimeout(function () {
      jtests_print(a);
      assert.equal(jtests_printLines.join("\n"), "2"); jtests_printLines = [];
      done();
    }, 1000);
    a++;
  });
  it("异常执行预判", function() {
    jtests_printLines = [];

    (function() {
    var a = JSON.parse('#error');
    // * throw
    }).should.throw();
  });
});

  