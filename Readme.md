Extracts code comments from code files.

Usage:

    $ mdextract file.js > docs.md

Or:

    $ cat docs.md

    add `include` comments to your markdown file

    <!-- include: file.js -->
    <!-- /include: file.js -->

    $ mdextract -u docs.md
