# mdextract

Extracts `/** code comments */` from code files and turns them into markdown 
docs.

Usage:

    $ mdextract file.js > docs.md

Or:

    $ cat README.md

      add `include` comments to your markdown file

      <!-- include: file.js -->
      <!-- /include: file.js -->

    $ mdextract --update README.md

File format
-----------

Sections:

```
/**
 * Sections:
 * Start your sections with two stars.
 *
 * If your first line of text ends in a colon (:), it will be turned into an
 * `<h3>` heading.
 */
```

Main sections (h2):

```
/***
 * Main sections:
 * start your main sections with three stars. They will be turned into <h2> 
 sections.
 */
```

Code blocks:

```
/**
 * Here's some example code. They will be converted into syntax-highlighted
 * code fences.
 *
 *     function () {
 *       return true;
 *     }
 */
```

Definition lists:

```
/**
 * Specify parameters with the special definition list syntax (~).
 *
 * ~ name: description
 * ~ id: the identifier
 * ~ callback (Function): the callback to run afterwards
```

Thanks
------

**mdextract** © 2014+, Rico Sta. Cruz. Released under the [MIT License].<br>
Authored and maintained by Rico Sta. Cruz with help from [contributors].

> [ricostacruz.com](http://ricostacruz.com) &nbsp;&middot;&nbsp;
> GitHub [@rstacruz](https://github.com/rstacruz) &nbsp;&middot;&nbsp;
> Twitter [@rstacruz](https://twitter.com/rstacruz)

[MIT License]: http://mit-license.org/
[contributors]: http://github.com/rstacruz/mdextract/contributors
