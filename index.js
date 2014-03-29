var Matcher = require('./lib/matcher');
var extend = require('util')._extend;

/***
 * mdextract:
 * hello.
 *
 * To extract from source, use:
 *
 *     mdextract(source, options)
 *
 * Returns a JSON block.
 */

var mdextract = module.exports = function (src, options) {
  var doc = new Document(options);
  doc.parse(src);
  return doc;
};

var rules = new Matcher({
  space: "\\s",
  string: '.*?',
  eol: '(\\s*%{endcomment})?\\s*',
  h2: '\\s*%{h2prefix}\\s*%{doc:string}%{eol}',
  h3: '\\s*%{h3prefix}\\s*%{doc:string}%{eol}',
  doc: '\\s*%{docprefix}\\s?%{doc:string}%{eol}',
  blank: '%{eol}',
  h2prefix: '/\\*\\*\\*',
  h3prefix: '/\\*\\*',
  docprefix: '\\*',
  endcomment: '\\*/',
});

/***
 * Document:
 * A markdown document with multiple source files.
 */

var Document = function (options) {
  /*** options: the options passed onto the constructor. */
  this.options = options || {};
  this.blocks = [];
};

Document.prototype = {

  /**
   * parse : .parse(options)
   * parses the document and saves its JSON tree to [data].
   */

  parse: function (src, fname) {
    // TODO: refactor into a new class

    var blocks = [];
    var block;
    var doc = this;

    function flush() {
      if (!block) return;
      if (!block.lines) {
        warn("no lines found", block.docline);
        block = null;
        return;
      }

      if (block.lines) {
        doc.processText(block.lines.join("\n").trim(), block);
        delete block.lines;
      }

      if (!block.heading) {
        warn("no heading found", block.docline);
        block = null;
        return;
      }

      blocks.push(block);
      block = null;
    }

    function warn(text, line) {
      doc.warn(text, fname, line);
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
        h3: function (m) {
          flush();
          block = new Block({
            level: 3,
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
   * warn : warn(text, file, line)
   * (internal) Issues a warning
   */

  warn: function (text, file, line) {
    console.warn("%s:%s: warning: %s", file, line, text);
  },

  /**
   * processText : processText(text, block)
   * (internal) Propagates `text` into the given `block`.
   */

  processText: function (text, block) {
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

/***
 * Block:
 * A block. Options:
 *
 * ~ docline (number): line number where the documentation starts
 * ~ codeline (number): line number where code starts
 * ~ level (number): heading level
 * ~ heading (string): heading text
 * ~ subheading (string, optional): optional subheading text
 * ~ body (string): body text
 */

function Block (data) {
  extend(this, data);
}

function eachLine (src, fn) {
  src.split('\n').forEach(fn);
}

mdextract.Document = Document;
