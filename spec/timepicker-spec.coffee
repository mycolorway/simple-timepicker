
describe 'Simple timepicker', ->

  beforeEach ->
    $('<input id="time">').appendTo 'body'

  afterEach ->
    timepicker = $('#time').data 'timepicker'
    timepicker?.destroy()
    $('#time').remove()

  it 'should throw Error when target option is not input', ->
    testError = ->
      simple.timepicker
        target: null

    expect(testError).toThrow()

  it 'should render specific layout', ->
    timepicker = simple.timepicker
      target: '#time'

    expect($('.simple-timepicker')).toExist()
    expect($('.simple-timepicker').find('.picker .clock')).toExist()
    expect($('.simple-timepicker').find('.minutes, .hours, .buttons')).toExist()

  it 'should show when focused when inline false', ->
    timepicker = simple.timepicker
      target: '#time'
      inline: false

    $timepicker = $('.simple-timepicker')
    $input = $('#time')

    $input.blur()
    expect($timepicker).not.toBeVisible()
    $input.focus()
    expect($timepicker).toBeVisible()

  it 'should show or hide when call show or hide method', ->
    timepicker = simple.timepicker
      target: '#time'
      inline: false

    $timepicker = $('.simple-timepicker')

    timepicker.hide()
    expect($timepicker).not.toBeVisible()

    timepicker.show()
    expect($timepicker).toBeVisible()

  it 'should render layout after input when inline on', ->
    timepicker = simple.timepicker
      target: '#time'
      inline: true

    expect($('#time+.simple-timepicker')).toExist()
    expect($('.simple-timepicker')).toBeVisible()

  it 'should set correct time when call setTime', ->
    timepicker = simple.timepicker
      target: '#time'
      inline: true

    expect($('#time').val()).not.toBe('08:45')
    timepicker.setTime('08:45')
    expect($('#time').val()).toBe('08:45')

  it 'should set specific component active', ->
    timepicker = simple.timepicker
      target: '#time'
      inline: true
      time: '09:00'

    $timepicker = $('.simple-timepicker')
    expect($timepicker.find('[data-meridiem=am]')).toHaveClass('active')
    expect($timepicker.find('[data-hour=09]')).toHaveClass('active')
    expect($timepicker.find('[data-minute=00]')).toHaveClass('active')

    $timepicker.find('[data-meridiem=pm]').click()
    $timepicker.find('[data-hour=11]').click()
    $timepicker.find('[data-minute=30]').click()

    expect($timepicker.find('[data-meridiem=pm]')).toHaveClass('active')
    expect($timepicker.find('[data-hour=11]')).toHaveClass('active')
    expect($timepicker.find('[data-minute=30]')).toHaveClass('active')

  it 'should set correct time when click OK button', ->
    timepicker = simple.timepicker
      target: '#time'
      inline: true
      time: '09:00'

    $timepicker = $('.simple-timepicker')
    $timepicker.find('[data-meridiem=pm]').click()
    $timepicker.find('[data-hour=11]').click()
    $timepicker.find('[data-minute=30]').click()

    expect($('#time').val()).toBe('23:30')

  it 'should reset all when call destroy', ->
    timepicker = simple.timepicker
      target: '#time'
      inline: true
      time: '09:00'

    timepicker.destroy()
    expect($('.simple-timepicker')).not.toExist()
