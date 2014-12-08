
describe 'Simple timepicker', ->

  it 'should inherit from SimpleModule', ->
    timepicker = simple.timepicker({target: 'body'})
    expect(timepicker instanceof SimpleModule).toBe(true)
