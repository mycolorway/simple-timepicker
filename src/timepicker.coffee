
class Timepicker extends SimpleModule

  opts:
    list: ['hour', '%-', 'minute']
    el: null
    inline: false
    valueFormat: 'HH:mm'
    displayFormat: 'HH点mm分'
    defaultView: 'auto'
    viewOpts:
      minute:
        forceFormat: true #format minute end with 0/5

  _init: ->
    @view = []
    @viewList = []

    @el = $(@opts.el)

    unless @el.length
      throw 'simple timepicker: option el is required'
      return

    @el.data 'timepicker', @
    val = @el.val() || moment()
    @date = if moment.isMoment(val) then val else moment(val, @opts.valueFormat)

    @_render()
    @_bind()

  _render: ->
    tpl = '''
      <div class="simple-timepicker">
        <div class="timepicker-header">
        </div>
        <div class="timepicker-panels">
        </div>
      </div>
    '''
    @picker = $(tpl)
    @headerContainer = @picker.find('.timepicker-header')
    @panelContainer = @picker.find('.timepicker-panels')
    @_renderViews()

    if @opts.inline
      @picker.insertAfter @el
      @show()
    else
      @_renderFakeInput()
      @picker.appendTo 'body'

  _renderFakeInput: ->
    type = @el.attr 'type'
    @input = $('<input />').addClass('display-input').attr
      'readonly': 'true'
      'type': type
    .css
        'cursor': 'pointer'

    @input.insertAfter @el
    @el.hide()

  _renderViews: ->
    for name in @opts.list
      if name.indexOf('%') is -1
        opt =
          parent: @
          inputContainer: @headerContainer
          panelContainer: @panelContainer
        opt.defaultValue = switch name
          when 'hour'
            @date.hour()
          when 'minute'
            @date.minute()

        $.extend opt, @opts['viewOpts'][name] if @opts['viewOpts'][name]
        @view[name] = new SimpleDatepicker.View::constructor.views[name](opt)
        @viewList.push name
        @_bindView(@view[name])
      else
        @headerContainer.append("<span>#{name.substr(1)}</span>")

  _setPosition: ->
    offset = @input.offset()
    @picker.css
      'position': 'absolute'
      'z-index': 100
      'left': offset.left
      'top': offset.top + @input.outerHeight(true)

  _bind: ->
    @picker.on 'click mousedown', ->
      false

    return if @opts.inline
    @input.on 'focus.timepicker', =>
      @show()

    $(document).on 'click.timepicker', (e) =>
      return if @input.is e.target
      return if @picker.has(e.target).length
      return if @picker.is e.target
      @hide()

  _bindView: (view) ->
    view.on 'select', (e, event) =>
      source = event.source
      newDate = event.value

      if newDate.hour isnt null
        @date.hour newDate.hour

      if newDate.minute isnt null
        @date.minute newDate.minute

      if event.finished
        index = @viewList.indexOf(source)
        if index is @viewList.length-1
          # close panel
          @_selectDate()
        else
          @view[@viewList[index+1]].setActive()

    view.on 'showpanel', (e, event) =>
      source = event.source
      if event.prev
        #show prev view
        @view[source].setActive(false)
        index = @viewList.indexOf(source) - 1
        index = 0 if index < 0
        @view[@viewList[index]].setActive()

      else
        for name in @viewList
          @view[name].setActive(false) unless name is source

    view.on 'close', (e, event) =>
      if event?.selected
        @_selectDate()
      @hide() unless @opts.inline

  _selectDate: ->
    @el.val @date.format(@opts.valueFormat)
    @input.val @date.format(@opts.displayFormat) if @input

    @trigger 'select', [@date]
    @hide() unless @opts.inline

  setDate: (date) ->
    @date = if moment.isMoment(date) then date else moment(date, @opts.valueFormat)
    @el.val @date.format(@opts.valueFormat)
    @input.val @date.format(@opts.displayFormat) if @input

    @view['hour']?.trigger 'datechange', {hour: @date.hour()}
    @view['minute']?.trigger 'datechange', {minute: @date.minute()}

  clear: ->
    @el.val ''
    @date = moment()
    for name in @viewList
      @view[name].clear()

  getDate: ->
    if @el.val()
      @date ||= moment(@el.val(), @opts.valueFormat)
    else
      null

  show: ->
    @_setPosition() unless @opts.inline

    @picker.show()
    @picker.addClass 'active'
    view = @opts.defaultView

    if @viewList.indexOf(view) isnt -1
      @view[view].setActive()
    else
      #deafultView is 'auto'
      @view['hour'].setActive()

  hide: ->
    @picker.hide()
    @picker.removeClass 'active'

  toggle: ->
    if @picker.is '.active'
      @hide()
    else
      @show()

  destroy: ->
    @picker?.remove()
    @picker = null

    unless @opts.inline
      @input.remove()
      @el.show()
      $(document).off '.timepicker'


timepicker = (opts) ->
  return new Timepicker opts


