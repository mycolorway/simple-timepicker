class Hourview extends SimpleDatepicker.View

  name: 'hour'

  _inputTpl: '<input typt="text" class="view-input hour-input" data-type="minute" />'

  isAm: true

  _renderPanel: ->
    @isAm = false if @value >= 12

    el = "<div class='panel panel-hour' data-meridiem=#{if @isAm then 'am' else 'pm'}>"

    el += '''
        <a class="menu-item" data-action="am">AM</a><a class="menu-item" data-action="pm">PM</a>
    '''

    for hour in [0..11]
      el += "<a class='panel-item' data-value='#{hour}' data-meridiem='am'>#{String("00" + hour).slice(-2)}</a><a class='panel-item' data-value='#{hour+12}' data-meridiem='pm'>#{hour+12}</a>"

    el += '</div>'

  _handleAction: (action) ->
    @isAm = if action is 'am' then true else false
    if @isAm
      @panel.attr 'data-meridiem', 'am'
    else
      @panel.attr 'data-meridiem', 'pm'

  _onInputHandler: (e) ->
    value = @input.val()
    if value.length is 2 and Number(value) < 24
      @select(value, true, true)
    else if value.length is 1
      if Number(value) > 2
        @select(value, true, true)
      else
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

SimpleDatepicker.View.addView Hourview
