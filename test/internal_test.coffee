require './setup'

describe 'Internal', ->
  it 'ok', ->
    str = """
    /**
     * hello:
     * (internal) its great
     */

    var x = y
    """

    out = mdextract(str).blocks
    expect(out).have.length 1
    expect(out[0].heading).eq 'hello'
    expect(out[0].internal).be.true

  it 'negative', ->
    str = """
    /**
     * hello: its great
     */

    var x = y
    """

    out = mdextract(str).blocks
    expect(out).have.length 1
    expect(out[0].internal).be.false
