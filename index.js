var Matcher = require('./lib/matcher');
var extend = require('util')._extend;

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
   * parse : .parse(options)
   * parses the document and saves its JSON tree to [data].
   */

  parse: function (src, fname) {
    var blocks = [];
    var block;
    var doc = this;

    function flush() {
      if (!block) return;
      if (block.lines) block.lines = block.lines.join("\n").trim();
      doc.parseText(block.lines, block);

      blocks.push(block);
      block = null;
    }

    eachLine(src, function (line, i) {
      rules.switch(line, {
        h2: function (m) {
          flush();
          block = new Block({
            level: 2,
            lines: [m.doc],
            docline: i+1,
            filename: fname
          });
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
  },

  /**
   * parseText : parseText(text, block)
   * Propagates text into the block
   */

  parseText: function (text, block) {
    var lines = text.split("\n");
    var m;
    var bodylines = [];

    lines.forEach(function (line, i) {
      if (i === 0) {
        if (m = line.match(/^(.*?):$/)) {
          block.heading = m[1];
        }
        else if (m = line.match(/^(.*?) : (.*?)$/)) {
          block.heading = m[1];
          block.subheading = m[2];
        }
        else if (m = line.match(/^(.*?):(?: (.*?))?$/)) {
          block.heading = m[1];
          bodylines.push(m[2]);
        }
      } else {
        bodylines.push(line);
      }
    });

    block.body = bodylines.join("\n");
  }
};

/**
 * Block:
 * A block
 */

function Block (data) {
  extend(this, data);
}

function eachLine (src, fn) {
  src.split('\n').forEach(fn);
}

mdextract.Document = Document;
