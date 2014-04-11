/**
 * unpackCode : unpackCode(code, options)
 * puts code blocks from string `code` into fences. Works with 2-space and
 * 4-space indents. Returns a string.
 *
 * Available options are:
 *
 * ~ lang (string): language for the codeblock
 *
 *     unpackCode(code, { lang: 'js' });
 */

exports.unpackCode = function(str, options) {
  var output = [];

  var blocks = str.split('\n\n');
  var last;

  blocks.forEach(function (block) {
    var m = block.match(/^(  (?:  )?)/);
    if (m) {
      var spaces = m[1];
      var blocklines = block.split(new RegExp("\n?"+spaces)).join('\n');
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
