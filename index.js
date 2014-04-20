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
  /** options: the options passed onto the constructor. */
  this.options = options || {};

  /** blocks: array of blocks. */
  this.blocks = [];
};

Document.prototype = {

  /**
   * parse : .parse(options)
   * parses the document and saves its JSON tree to [data].
   */

  parse: function (src, fname) {
    var ctx = new Context(this, src, fname);
    ctx.process();
    this.blocks = this.blocks.concat(ctx.blocks);
  },

  toMarkdown: function (options) {
    var lines = [];

    this.blocks.forEach(function (block) {
      // skip internal blocks
      if (block.internal && !(options && options.showInternal)) return;

      var prefix = Array(block.level+1).join('#');
      var headingText = prefix + ' ' + block.heading;
      if (block.subheading) headingText += ' `' + block.subheading + '`';

      lines.push('<a name="'+slugify(block.heading)+'"></a>');
      lines.push(headingText);
      lines.push('');
      lines.push(block.body);
      lines.push('');
    });

    return lines.join('\n').trim();
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

    var unpackCode = require('./lib/transforms').unpackCode;
    var expandDefLists = require('./lib/transforms').expandDefLists;

    block.body = bodylines.join("\n");
    block.body = unpackCode(block.body, { lang: 'js' });
    block.body = expandDefLists(block.body);

    if (m = block.body.match(/^\((?:internal|private)\)\s*(.+)$/i)) {
      block.body = m[1];
      block.internal = true;
    }
  }
};

/***
 * Context: a parsing context.
 */

function Context(doc, src, fname) {
  this.doc = doc;
  this.src = src;
  this.fname = fname;
  this.blocks = [];
  this.block = undefined;
}

Context.prototype = {
  process: function () {
    var ctx = this;

    eachLine(ctx.src, function (line, i) {
      rules.switch(line, {
        h2: function (m) {
          ctx.flush();
          ctx.block = ctx.newBlock(2, m.doc, i+1);
        },
        h3: function (m) {
          ctx.flush();
          ctx.block = ctx.newBlock(3, m.doc, i+1);
        },
        blank: function() {
          ctx.flush();
        },
        doc: function (m) {
          if (!ctx.block) return;
          ctx.block.lines.push(m.doc);
        },
        else: function () {
          var block = ctx.lastBlock();
          if (block) block.codeline = i+1;
        }
      });
    });

    ctx.flush();
  },

  /** newBlock: (internal) Creates a new block. */
  newBlock: function (level, line, docline) {
    return new Block({
      level: level,
      lines: [line],
      docline: docline,
      filename: this.fname,
      internal: false
    });
  },

  /** lastBlock: (internal) Returns the last defined block. */
  lastBlock: function () {
    return this.blocks[this.blocks.length-1];
  },

  /**
   * warn : warn(text, line)
   * (internal) Issues a warning
   */

  warn: function (text, line) {
    console.warn("%s:%s: warning: %s", this.fname, line, text);
  },

  /** flush: finalizes the last block defined. */
  flush: function () {
    if (!this.block) return;

    if (!this.block.lines) {
      this.warn("no lines found", block.docline);
      this.block = null;
      return;
    }

    this.block.lines = this.block.lines.join("\n").trim();
    this.doc.processText(this.block.lines, this.block);
    delete this.block.lines;

    if (!this.block.heading) {
      this.warn("no heading found", this.block.docline);
      this.block = null;
      return;
    }

    this.blocks.push(this.block);
    this.block = null;
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

/***
 * Helpers:
 * (internal)
 */

/** eachline: (internal) Helper for iterating through each line. */
function eachLine (src, fn) {
  src.split('\n').forEach(fn);
}

/** slugify: slugger */
function slugify (str) {
  return str.match(/[A-Za-z0-9]+/g).join('_');
}

mdextract.Document = Document;

