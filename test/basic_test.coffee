require './setup'

describe 'Mdextract', ->
  it 'ok', ->
    str = """
    /**
     * hello:
     * world
     * its great
     */

    var x = y
    """

    out = mdextract(str)
    expect(out).have.length 1
    expect(out[0].heading).eq 'hello'
    expect(out[0].body).eq 'world\nits great'
    expect(out[0].docline).eq 1
    expect(out[0].codeline).eq 7

  it 'pre block', ->
    str = """
    /**
     * hello:
     * world
     *
     *     abc
     */
    """

    out = mdextract(str)
    expect(out).have.length 1
    expect(out[0].heading).eq 'hello'
    expect(out[0].body).eq 'world\n\n    abc'

  it 'comment closing on doc heading EOL', ->
    str = "/** hello: world */"

    out = mdextract(str)
    expect(out).have.length 1
    expect(out[0].heading).eq 'hello'

  it 'comment closing on doc line EOL', ->
    str = """
    /**
     * hello:
     * world */
    """

    out = mdextract(str)
    expect(out).have.length 1
    expect(out[0].body).eq 'world'
