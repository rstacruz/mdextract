## mdextract

hello.

To extract from source, use:

```js
mdextract(source, options)
```

Returns a JSON block.

## Document

A markdown document with multiple source files.

### options

Options to be used.

* `forceHeadings` *(boolean)* <span class='dash'>&mdash;</span> If true, sections without headings will be
ignored.
* `lang` *(string)* <span class='dash'>&mdash;</span> Language to be used. Defaults to `"js"`.

### blocks

array of blocks.

### parse
> `.parse(options)`

parses the document and saves its JSON tree to [data].

### processText
> `processText(text, block)`

Propagates `text` into the given `block`.

## Context

a parsing context.

### newBlock

Creates a new block.

### lastBlock

Returns the last defined block.

### warn
> `warn(text, line)`

Issues a warning

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

## Helpers

(internal)

### eachline

Helper for iterating through each line.

### slugify

slugger
