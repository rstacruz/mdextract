var Matcher = require('./lib/matcher');

var mdextract = module.exports = function (src, options) {
  var doc = new Document(options);
  doc.parse(src);
  return doc.blocks;
};

var rules = new Matcher({
  space: "\\s",
  string: '.*?',
  eol: '(\\s*%{endcomment})?\\s*',
  h2: '\\s*%{h2prefix}\\s*%{doc:string}%{eol}',
  h3: '\\s*%{h3prefix}\\s*%{doc:string}%{eol}',
  doc: '\\s*%{docprefix}\\s?%{doc:string}%{eol}',
  blank: '%{eol}',
  h2prefix: '/\\*\\*',
  h3prefix: '\\*\\*\\*',
  docprefix: '\\*',
  endcomment: '\\*/',
});

/**
 * Document:
 * A markdown document with multiple source files.
 */

var Document = function (options) {
  /*** options: the options passed onto the constructor. */
  this.options = options || {};
  this.blocks = [];
};

Document.prototype = {

  /***
   * parse: .parse(options)
   * parses the document and saves its JSON tree to [data].
   */

  parse: function (src, fname) {
    var blocks = [];
    var block;

    function flush() {
      if (!block) return;
      if (block.lines) block.lines = block.lines.join("\n").trim();
      blocks.push(block);
      block = null;
    }

    eachLine(src, function (line, i) {
      rules.switch(line, {
        h2: function (m) {
          flush();
          block = {
            level: 2,
            lines: [m.doc],
            docline: i+1,
            filename: fname
          };
        },
        blank: function() {
          flush();
        },
        doc: function (m) {
          if (!block) return;
          block.lines.push(m.doc);
        },
        else: function () {
          if (blocks.length === 0) return;
          blocks[blocks.length-1].codeline = i+1;
          flush();
        }
      });
    });

    flush();

    this.blocks = this.blocks.concat(blocks);
    return blocks;
  }
};

function eachLine (src, fn) {
  src.split('\n').forEach(fn);
}
