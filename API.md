## mdextract
> `mdextract(src, options)`


Extracts source documents.

```js
var mdextract = require('mdextract');
var doc = mdextract(source);

console.log(doc.toMarkdown());
```

Returns a [Document](#document) instance.

## Document
> `new Document(options)`

A markdown document with multiple source files.

The options available are:

* `forceHeadings` *(boolean)* <span class='dash'>&mdash;</span> If true, sections without headings will be
  ignored.
* `lang` *(string)* <span class='dash'>&mdash;</span> Language to be used. Defaults to `"js"`.

### options

the available options. See [Document](#document).

### blocks

array of blocks.

### parse
> `.parse(options)`

parses the document and saves its JSON tree to [data].

### toMarkdown
> `.toMarkdown(options)`

Converts the document to markdown. Returns the Markdown string.
Available options are:

* `showInternal` *(boolean)* <span class='dash'>&mdash;</span> renders internal/private API if true.

## Context

a parsing context.

### flush

finalizes the last block defined.

## Block

A block. Options:

* `docline` *(number)* <span class='dash'>&mdash;</span> line number where the documentation starts
* `codeline` *(number)* <span class='dash'>&mdash;</span> line number where code starts
* `level` *(number)* <span class='dash'>&mdash;</span> heading level
* `heading` *(string)* <span class='dash'>&mdash;</span> heading text
* `subheading` *(string, optional)* <span class='dash'>&mdash;</span> optional subheading text
* `body` *(string)* <span class='dash'>&mdash;</span> body text
