require './setup'

parseText = null

describe 'Parse text', ->
  before ->
    parseText = mdextract.Document::parseText

  beforeEach ->
    @block = {}

  it 'heading', ->
    parseText """
    constructor:
    ran on init
    """, @block

    expect(@block.heading).eq 'constructor'
    expect(@block.body).eq 'ran on init'

  it 'subheading', ->
    parseText """
    map : _.map()
    maps function to elements
    """, @block

    expect(@block.heading).eq 'map'
    expect(@block.subheading).eq '_.map()'
    expect(@block.body).eq 'maps function to elements'

  it 'inline', ->
    parseText """
    map: maps function to elements
    """, @block

    expect(@block.heading).eq 'map'
    expect(@block.body).eq 'maps function to elements'

  it 'inline2', ->
    parseText """
    map: maps a function to
    multiple elements
    """, @block

    expect(@block.heading).eq 'map'
    expect(@block.body).eq 'maps a function to\nmultiple elements'
