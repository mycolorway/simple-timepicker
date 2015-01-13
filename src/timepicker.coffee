
class Timepicker extends SimpleModule
  @i18n:
    'zh-CN':
      'am': '上午'
      'pm': '下午'
    'en':
      'am': 'AM'
      'pm': 'PM'
  opts:
    target: null
    inline: false
    offset: 0
    format: 'HH:mm'

  hoursOpts: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11']
  minutesOpts: ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55']

  tpl: """
    <div class="simple-timepicker">
      <div class="picker">
        <div class="meridiem">
          <div class="clock am" data-meridiem="am">#{@_t('am')}</div>
          <div class="clock pm" data-meridiem="pm">#{@_t('pm')}</div>
        </div>
        <div class="hours"></div>
        <span class="divider">:</span>
        <div class="minutes"></div>
      </div>
    </div>
  """

  hourTpl: '<div class="hour"></div>'
  minuteTpl: '<div class="minute"></div>'

  _init: ->
    @target = $(@opts.target)
    throw new Error "simple-timepicker: target option is invalid" if @target.length == 0 or not @target.is 'input'

    @target.data 'timepicker', @

    @_render()
    @_bind()

  _render: ->
    @el = $(@tpl)
    @el.data @

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

    if @opts.inline
      @el.addClass 'inline'
      @el.insertAfter @target
    else
      @el.css('display', 'none')
        .appendTo 'body'
      @_setPosition()

      @target.on 'focus.simple-timepicker', =>
        @show()
      .focus()

      @target.on 'blur.simple-timepicker', (e) =>
        @hide()

  _bind: ->
    @el.on 'click.simple-timepicker', ->
      false

    @el.on 'mousedown.simple-timepicker', ->
      false

    @el.on 'click.simple-timepicker', '.clock', (e) =>
      $target = $(e.currentTarget)
      $target.addClass('active')
        .siblings().removeClass('active')

      @_checkMeridiem()
      @_refreshTime()

    @el.on 'click.simple-timepicker', '.hour', (e) =>
      $target = $(e.currentTarget)
      $target.addClass('active')
        .siblings().removeClass('active')

      @_refreshTime()

    @el.on 'click.simple-timepicker', '.minute', (e) =>
      $target = $(e.currentTarget)
      $target.addClass('active')
        .siblings().removeClass('active')

      @_refreshTime()
      @hide() unless @opts.inline
      @target.blur()

  _unbind: ->
    @el.off '.simple-timepicker'
    $(document).off '.simple-timepicker'
    @target.off '.simple-timepicker'

  _refreshTime: ->
    meridiem = @el.find('.clock.active').data 'meridiem'
    hour = @el.find('.hour.active').data 'hour'
    minute = @el.find('.minute.active').data 'minute'

    @time = moment("#{meridiem} #{hour}:#{minute}",'a hh:mm', 'en').locale(moment.locale())
    @_renderTime()
    @trigger('select', [@time])

  _renderTime: ->
    @target.val(@time.format(@opts.format))

  _setPosition: ->
    offset = @target.offset()
    @el.css
      'position': 'absolute'
      'z-index': 100
      'left': offset.left
      'top': offset.top + @target.outerHeight(true) + @opts.offset

  _checkMeridiem: ->
    if @el.find('.meridiem .clock.pm').hasClass('active')
      @hours.find('.hour[data-hour=00]').text('12')
    else
      @hours.find('.hour[data-hour=00]').text('00')

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

    meridiem = @time.clone().locale('en').format('a') #global moment() may not be English
    hour = @time.format('hh')
    minute = @time.format('mm')
    minute = Math.round(minute / 5) * 5 #force end with 5/0
    @time.set('minute', minute)
    minute = @time.format('mm')
    hour = '00' if hour is '12'

    @el.find("[data-meridiem=#{meridiem}]").addClass('active')
      .siblings().removeClass('active')
    @el.find("[data-hour=#{hour}]").addClass('active')
      .siblings().removeClass('active')
    @el.find("[data-minute=#{minute}]").addClass('active')
      .siblings().removeClass('active')


    @_checkMeridiem()
    @_renderTime()

  destroy: ->
    @_unbind()
    @el.remove()

timepicker = (opts) ->
  new Timepicker(opts)
