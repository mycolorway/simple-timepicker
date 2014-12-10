
class Timepicker extends SimpleModule
  opts:
    target: null
    time: null
    offset: 0

  hoursOpts: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11']
  minutesOpts: ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55']

  tpl: '''
    <div class="simple-timepicker">
      <div class="time"></div>
      <div class="picker">
        <div class="segment">
          <div class="clock am">上午</div>
          <div class="clock pm">下午</div>
        </div>
        <div class="hours"></div>
        <span class="divider">:</span>
        <div class="minutes"></div>
      </div>
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

    @_render()
    @_bind()

  _render: ->
    @el = $(@tpl)

    @hours = @el.find('.hours')
    @minutes = @el.find('.minutes')

    #renderHours
    for hour in @hoursOpts
      $(@hourTpl).text(hour)
        .attr('data-hour', hour)
        .appendTo @hours
    #renderMinutes
    for minute in @minutesOpts
      $(@minuteTpl).text(minute)
        .attr('data-minute', minute)
        .appendTo @minutes

    @setTime(@opts.time)

    @_renderTime()
    @_setPosition()

    @el.css('display', 'none')
      .insertAfter @target

  _bind: ->
    @target.on 'click', =>
      @show()

    @el.on 'mousedown', ->
      false

    @el.on 'click.simple-timepicker', '.clock', (e) =>
      $target = $(e.currentTarget)
      $target.addClass('active')
        .siblings().removeClass('active')
      if $target.is '.am'
        @_time.format = 'am'
      else
        @_time.format = 'pm'
      @_renderTime()

    @el.on 'click.simple-timepicker', '.link-cancel', (e) =>
      e.preventDefault()
      @hide()

    @el.on 'click.simple-timepicker', '.btn-ok', =>
      @hide()
      @trigger('timepicked', [@time])

    @el.on 'click.simple-timepicker', '.hour', (e) =>
      $target = $(e.currentTarget)
      hour = $target.text()
      $target.addClass('active')
        .siblings().removeClass('active')
      @_time.hour = hour;
      @_renderTime()

    @el.on 'click.simple-timepicker', '.minute', (e) =>
      $target = $(e.currentTarget)
      minute = $target.text()
      $target.addClass('active')
        .siblings().removeClass('active')
      @_time.minute = minute;
      @_renderTime()

  _unbind: ->
    @el.off '.simple-timepicker'

  _renderTime: ->
    format =if @_time.format is 'am' then '上午' else '下午'
    @time = moment("#{@_time.format} #{@_time.hour}:#{@_time.minute}",'a hh:mm')
    @el.find('.time').text(format + ' ' + @time.format('h时m分'))


  _setPosition: ->
    offset = @target.offset()
    @el.css
      'position': 'absolute'
      'z-index': 100
      'left': offset.left
      'top': offset.top + @target.outerHeight(true) + @opts.offset

  show: ->
    @el.show()

  hide: ->
    @el.hide()

  getTime: ->
    @time

  setTime: (time) ->
    if moment.isMoment(time)
      @time = time
    else
      @time = moment(time, 'HH:mm')

    @time = moment() unless @time.isValid()

    @_time = {}
    @_time =
      format: @time.format('a')
      hour: @time.format('hh')
      minute: @time.format('mm')

    @el.find(".#{@_time.format}").addClass('active')
      .siblings().removeClass('active')
    @el.find("[data-hour=#{@_time.hour}]").addClass('active')
      .siblings().removeClass('active')

    #TODO minute mod 5!!!
    @el.find("[data-minute=#{@_time.minute}]").addClass('active')
      .siblings().removeClass('active')


  destroy: ->
    @_unbind()
    @el.remove()

timepicker = (opts) ->
  new Timepicker(opts)
