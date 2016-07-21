var examplejs = require('../');

describe("README.md", function () {
  var assert = require('should');
  var util = require('util');
  var examplejs_printLines;
  function examplejs_print() {
    examplejs_printLines.push(util.format.apply(util, arguments));
  }
  var jsdom = require('jsdom');
  this.timeout(30000);

  it("xxyy", function () {
    examplejs_printLines = [];
      var a = 1;
      var b = 2;
      examplejs_print(a === b); // false
  });
          
  it("表达式相等预判", function () {
    examplejs_printLines = [];
      var a = 1;
      var b = 2;
      examplejs_print(a === b);
      assert.equal(examplejs_printLines.join("\n"), "false"); examplejs_printLines = [];
  });
          
  it("表达式结果预判", function () {
    examplejs_printLines = [];
      var a = 1;
      var b = 2;
      examplejs_print(a + b);
      assert.equal(examplejs_printLines.join("\n"), "3"); examplejs_printLines = [];
  });
          
  it("表达式类型预判", function () {
    examplejs_printLines = [];
      var a = 1;
      examplejs_print(JSON.stringify(a + '1'));
      assert.equal(examplejs_printLines.join("\n"), "\"11\""); examplejs_printLines = [];
  });
          
  it("批量表达式预判", function () {
    examplejs_printLines = [];
      for (var i = 0; i < 5; i++) {
        examplejs_print(i);
      }
      assert.equal(examplejs_printLines.join("\n"), "0\n1\n2\n3\n4"); examplejs_printLines = [];
  });
          
  it("异步执行预判", function (done) {
    examplejs_printLines = [];
      var a = 1;
      setTimeout(function () {
        examplejs_print(a);
        assert.equal(examplejs_printLines.join("\n"), "2"); examplejs_printLines = [];
        done();
      }, 1000);
      a++;
  });
          
  it("异常执行预判", function () {
    examplejs_printLines = [];

      (function() {
      var a = JSON.parse('#error');
      // * throw
      }).should.throw();
  });
          
  it("jsdom@浏览器环境", function (done) {
    jsdom.env("      <div></div>", {
        features: {
          FetchExternalResources : ["script", "link"],
          ProcessExternalResources: ["script"]
        }
      },
      function (err, window) {
        global.window = window;
        ["$","document"].forEach(
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
          
  it("jsdom@jQuery", function (done) {
    jsdom.env("<style>       .red {\n         background-color: red;\n       }</style>\n       <div class=\"red\"></div>\n       <script src=\"https://code.jquery.com/jquery-3.1.0.min.js\"></script>", {
        features: {
          FetchExternalResources : ["script", "link"],
          ProcessExternalResources: ["script"]
        }
      },
      function (err, window) {
        global.window = window;
        ["$","document"].forEach(
          function (key) {
            global[key] = window[key];
          }
        );
        assert.equal(err, null);
        done();
      }
    );
  });
          
  it("jQuery", function (done) {
    examplejs_printLines = [];
       $(function () {
         examplejs_print($('.red').css('background-color'));
         assert.equal(examplejs_printLines.join("\n"), "red"); examplejs_printLines = [];
         done();
       })
  });
          
});
         