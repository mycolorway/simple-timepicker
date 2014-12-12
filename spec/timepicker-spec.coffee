
describe 'Simple timepicker', ->

  it 'should inherit from SimpleModule', ->
    $('<input id="time">').appendTo 'body'
    timepicker = simple.timepicker({target: '#time'})
    expect(timepicker instanceof SimpleModule).toBe(true)
