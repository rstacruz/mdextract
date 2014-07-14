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

Thanks
------

**mdextract** © 2014+, Rico Sta. Cruz. Released under the [MIT License].<br>
Authored and maintained by Rico Sta. Cruz with help from [contributors].

> [ricostacruz.com](http://ricostacruz.com) &nbsp;&middot;&nbsp;
> GitHub [@rstacruz](https://github.com/rstacruz) &nbsp;&middot;&nbsp;
> Twitter [@rstacruz](https://twitter.com/rstacruz)

[MIT License]: http://mit-license.org/
[contributors]: http://github.com/rstacruz/mdextract/contributors
