var Matcher = require('./lib/matcher');

var mdextract = module.exports = function (src, options) {
  return new Document(src, options).parse();
};

var rules = new Matcher({
  space: "\\s",
  string: '.*?',
  h2prefix: '/\\*\\*',
  h2: '\\s*%{h2prefix}\\s*%{heading:string}(\\s*%{endcomment})?',
  docprefix: '\\*',
  endcomment: '\\*/',
  doc: '\\s*%{docprefix}\\s*%{string}(\\s*%{endcomment})?',
  blank: '\\s*%{endcomment}\\s*'
});

var Document = function (src, options) {
  this.src = src;
  this.options = options || {};
};

Document.prototype = {
  parse: function () {
    var blocks = [];
    var block;

    function flush() {
      if (!block) return;
      if (block.lines) block.lines = block.lines.join("\n");
      blocks.push(block);
      block = null;
    }

    eachLine(this.src, function (line, i) {
      rules.switch(line, {
        h2: function (m) {
          flush();
          block = {
            heading: m.heading,
            level: 2,
            lines: [],
            docline: i+1
          };
        },
        blank: function() {
          flush();
        },
        doc: function (m) {
          block.lines.push(m.string);
        },
        else: function () {
          blocks[blocks.length-1].codeline = i+1;
          flush();
        }
      });
    });

    flush();
    return blocks;
  }
};

function eachLine (src, fn) {
  src.split('\n').forEach(fn);
}
