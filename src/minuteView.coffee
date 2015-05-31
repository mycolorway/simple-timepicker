class MinuteView extends SimpleDatepicker.View

  name: 'minute'

  opts:
    forceFormat: true

  _inputTpl: '<input typt="text" class="view-input minute-input" data-type="minute" />'

  _renderPanel: ->
    @value = Math.floor(Number(@value) / 5) * 5 if @opts.forceFormat
    el = "<div class='panel panel-minute'>"

    for minute in [0..55] by 5
      el += "<a class='panel-item' data-value='#{minute}'>#{String("00" + minute).slice(-2);}</a>"

    el += '</div>'

  _handleAction: (action) ->
    @isAm = if action is 'am' then true else false
    if @isAm
      @panel.attr 'data-meridiem', 'am'
    else
      @panel.attr 'data-meridiem', 'pm'

  _onInputHandler: (e) ->
    value = @input.val()
    if value.length is 2 and Number(value) < 60
      value = Math.floor(Number(value) / 5) * 5 if @opts.forceFormat
      @select(value, true, true)
    else if value.length is 1
      @timer = setTimeout =>
        @select(value, false, true)
        @timer = null
      , 800

  _onKeydownHandler: (e) ->
    clearTimeout @timer if @timer

    super(e)

  _onDateChangeHandler: (e) ->
    @value = e.minute
    @isAm = if @value > 12 then false else true

    @_refreshInput()
    @_refreshSelected()
    @_handleAction(if @isAM then 'am' else 'pm')

Timepicker.addView MinuteView
