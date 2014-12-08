
class Timepicker extends SimpleModule
  opts:
    target: null
    time: null
    hours: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
    minutes: ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55']

  tpl: '''
    <div class="simple-timepicker">
      <div class="time"></div>
      <div class="segment">
        <div class="clock am">上午</div>
        <div class="clock pm">下午</div>
      </div>
      <div class="hours"></div>
      <div class="minutes"></div>
      <div class="buttons">
        <div class="btn btn-ok">确定</div>
        <div class="link link-cancel">取消</div>
      </div>
    </div>
  '''

  hourTpl: '<div class="hour"></div>'
  minuteTpl: '<div class="minute"></div>'


  _init: ->
    @target = $(@opts.target)
    throw new Error "simple-timepicker: target option is invalid" if @target.length == 0

    @time = if moment.isMoment(@opts.time) then @opts.time else moment(@opts.time, 'HH:mm')
    @_time =
      format: @time.format('a')
      hour: @time.format('hh')
      minute: @time.format('mm')

    @_render()
    @_bind()

  _render: ->
    @el = $(@tpl)

    @hours = @el.find('.hours')
    @minutes = @el.find('.minutes')

    @_renderHours()
    @_renderMinutes()
    @_renderTime()
    @_setPosition()

    @el.css('display', 'none')
      .insertAfter @target

  _bind: ->
    @target.on 'click', =>
      @show()

    @el.on 'mousedown', ->
      false

    @el.on 'click', '.clock', (e) =>
      $target = $(e.currentTarget)
      text = $target.text()
      $target.addClass('active')
        .siblings().removeClass('active')
      if text is '.am'
        @_time.format = 'am'
      else
        @_time.format = 'pm'
      @_renderTime()

    @el.find('.link-cancel').on 'click', (e) =>
      e.preventDefault()
      @hide()

    @el.find('.btn-ok').on 'click', =>
      @hide()
      @trigger('timepicked', [@time])

    @hours.on 'click', '.hour', (e) =>
      $target = $(e.currentTarget)
      hour = $target.text()
      $target.addClass('active')
        .siblings().removeClass('active')
      @_time.hour = hour;
      @_renderTime()

    @minutes.on 'click', '.minute', (e) =>
      $target = $(e.currentTarget)
      minute = $target.text()
      $target.addClass('active')
        .siblings().removeClass('active')
      @_time.minute = minute;
      @_renderTime()

  _renderTime: ->
    @time = moment("#{@_time.format} #{@_time.hour}:#{@_time.minute}",'a hh:mm')
    @el.find('.time').text(@time.format('A h时m分'))

  _renderHours: ->
    $(@hourTpl).text(hour).appendTo @hours for hour in @opts.hours

  _renderMinutes: ->
    $(@minuteTpl).text(hour).appendTo @minutes for hour in @opts.minutes

  _setPosition: ->
    offset = @target.offset()
    @el.css
      'position': 'absolute'
      'z-index': 100
      'left': offset.left
      'top': offset.top + @target.outerHeight(true)

  show: ->
    @el.show()

  hide: ->
    @el.hide()

timepicker = (opts) ->
  new Timepicker(opts)
