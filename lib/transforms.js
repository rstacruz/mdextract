/**
 * unpackCode : unpackCode(code, options)
 * puts code blocks from string `code` into fences. Works with 2-space and
 * 4-space indents. Returns a string.
 *
 * ~ lang (string): language for the codeblock
 *
 *     unpackCode(code, { lang: 'js' });
 */

exports.unpackCode = function(str, options) {
  var output = [];
  var last;

  eachBlock(str, function (block) {
    var m = block.match(/^(  (?:  )?)/);
    if (m) {
      var spaces = m[1];
      var blocklines = ("\n"+block).split(new RegExp("\n"+spaces));
      blocklines = offByOneCheck(blocklines);
      if (last) {
        last += '\n' + blocklines;
        output[output.length-1] = '```' + options.lang + last + '\n```';
      } else {
        output.push('```' + options.lang + blocklines + '\n```');
        last = blocklines;
      }
    } else {
      output.push(block);
      last = null;
    }
  });

  return output.join("\n\n");
};

/**
 * expandDefLists : expandDefLists(code)
 * Expands definition lists.
 */

exports.expandDefLists = function (code) {
  return eachBlock(code, function (block) {
    if (!block.match(/^~ /)) return block;

    var lines = block.split("\n");
    return lines.map(function (line) {
      var m = line.match(/^~ (.+) \((.+?)\):(?: (.+))?$/);
      if (m) return "* `"+m[1]+"` *("+m[2]+")* <span class='dash'>&mdash;</span> "+m[3];

      m = line.match(/^~ (.+) :$/);
      if (m) return "* `"+m[1]+"` <span class='dash'>&mdash;</span>";

      m = line.match(/^~ (.+): (.+)$/);
      if (m) return "* `"+m[1]+"` <span class='dash'>&mdash;</span> "+m[2];

      return line;
    }).join("\n");
  });
};

/**
 * eachBlock:
 * (internal) iteration helper. also works as map
 */

function eachBlock (code, fn) {
  var blocks = code.split('\n\n');
  return blocks.map(function (block) {
    return fn(block);
  }).join('\n\n');
}

/**
 * offByOneCheck:
 * (internal) checks spacing of first line in block to test for unnecessary sapces
 * trims all lines down to prevent off-by-one errors, which choke a parser like Jade
 */
 
function offByOneCheck(blocklines) {
  var testLine = blocklines[1]; // first item in array is the empty string
  var output = [];
  
  // the first line in a code block shouldn't start with a space
  // if there's a space, we can assume there's an off-by-one error
  // so then we'll slice off the first character of all lines
  if (/^\s/.test(testLine)) {
    blocklines.forEach(function(line) {
      output.push(line.slice(1));
    });
    return output.join('\n');
  } else {
    return blocklines.join('\n');
  }
}
