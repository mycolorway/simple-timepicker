
class Timepicker extends SimpleModule
  opts:
    target: null
    inline: false
    offset: 0

  hoursOpts: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11']
  minutesOpts: ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55']

  tpl: '''
    <div class="simple-timepicker">
      <div class="time"></div>
      <div class="picker">
        <div class="meridiem">
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
    @oldTime = @target.val()
    throw new Error "simple-timepicker: target option is invalid" if @target.length == 0 or not @target.is 'input'

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
    @_setPosition()

    @el.css('display', 'none')
      .insertAfter @target
    @show() if @opts.inline

  _bind: ->
    unless @opts.inline
      @target.on 'click', =>
        @oldTime = @target.val()
        @show()

    @el.on 'click.simple-timepicker', '.link-cancel', (e) =>
      e.preventDefault()
      @target.val(@oldTime)
      @hide() unless @opts.inline

    @el.on 'click.simple-timepicker', '.btn-ok', =>
      @hide() unless @opts.inline
      @trigger('timepicked', [@time])

    @el.on 'mousedown', ->
      false

    @el.on 'click.simple-timepicker', '.clock', (e) =>
      $target = $(e.currentTarget)
      $target.addClass('active')
        .siblings().removeClass('active')

      @_refreshTime()

    @el.on 'click.simple-timepicker', '.hour', (e) =>
      $target = $(e.currentTarget)
      hour = $target.text()
      $target.addClass('active')
        .siblings().removeClass('active')

      @_refreshTime()

    @el.on 'click.simple-timepicker', '.minute', (e) =>
      $target = $(e.currentTarget)
      minute = $target.text()
      $target.addClass('active')
        .siblings().removeClass('active')

      @_refreshTime()

  _unbind: ->
    @el.off '.simple-timepicker'

  _refreshTime: ->
    meridiem = if @el.find('.clock.active').text() is '上午' then 'am' else 'pm'
    hour = @el.find('.hour.active').text()
    minute = @el.find('.minute.active').text()

    @time = moment("#{meridiem} #{hour}:#{minute}",'a hh:mm')
    @_renderTime()

  _renderTime: ->
    meridiem = if @time.format('a') is 'am' then '上午' else '下午'
    @el.find('.time').text(meridiem + ' ' + @time.format('h时m分'))
    @target.val(@time.format('HH:mm'))


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

    meridiem = @time.format('a')
    hour = @time.format('hh')
    minute = @time.format('mm')
    minute = Math.round(minute / 5) * 5 #force end with 5/0
    @time.set('minute', minute)

    @el.find(".#{meridiem}").addClass('active')
      .siblings().removeClass('active')
    @el.find("[data-hour=#{hour}]").addClass('active')
      .siblings().removeClass('active')
    @el.find("[data-minute=#{minute}]").addClass('active')
      .siblings().removeClass('active')

    @_renderTime()

  destroy: ->
    @_unbind()
    @el.remove()

timepicker = (opts) ->
  new Timepicker(opts)
