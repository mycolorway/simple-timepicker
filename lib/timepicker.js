(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define('SimpleTimepicker', ["jquery",
      "simple-module"], function ($, SimpleModule) {
      return (root.returnExportsGlobal = factory($, SimpleModule));
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like enviroments that support module.exports,
    // like Node.
    module.exports = factory(require("jquery"),
      require("simple-module"));
  } else {
    root.simple = root.simple || {};
    root.simple['timepicker'] = factory(jQuery,
      SimpleModule);
  }
}(this, function ($, SimpleModule) {

var Timepicker, timepicker,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Timepicker = (function(_super) {
  __extends(Timepicker, _super);

  function Timepicker() {
    return Timepicker.__super__.constructor.apply(this, arguments);
  }

  Timepicker.prototype.opts = {
    target: null,
    time: null,
    hours: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
    minutes: ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55']
  };

  Timepicker.prototype.tpl = '<div class="simple-timepicker">\n  <div class="time"></div>\n  <div class="segment">\n    <div class="clock am">上午</div>\n    <div class="clock pm">下午</div>\n  </div>\n  <div class="hours"></div>\n  <div class="minutes"></div>\n  <div class="buttons">\n    <div class="btn btn-ok">确定</div>\n    <div class="link link-cancel">取消</div>\n  </div>\n</div>';

  Timepicker.prototype.hourTpl = '<div class="hour"></div>';

  Timepicker.prototype.minuteTpl = '<div class="minute"></div>';

  Timepicker.prototype._init = function() {
    this.target = $(this.opts.target);
    if (this.target.length === 0) {
      throw new Error("simple-timepicker: target option is invalid");
    }
    this.time = moment.isMoment(this.opts.time) ? this.opts.time : moment(this.opts.time, 'HH:mm');
    this._time = {
      format: this.time.format('a'),
      hour: this.time.format('hh'),
      minute: this.time.format('mm')
    };
    this._render();
    return this._bind();
  };

  Timepicker.prototype._render = function() {
    this.el = $(this.tpl);
    this.hours = this.el.find('.hours');
    this.minutes = this.el.find('.minutes');
    this._renderHours();
    this._renderMinutes();
    this._renderTime();
    this._setPosition();
    return this.el.css('display', 'none').insertAfter(this.target);
  };

  Timepicker.prototype._bind = function() {
    this.target.on('click', (function(_this) {
      return function() {
        return _this.show();
      };
    })(this));
    this.el.on('mousedown', function() {
      return false;
    });
    this.el.on('click', '.clock', (function(_this) {
      return function(e) {
        var $target, text;
        $target = $(e.currentTarget);
        text = $target.text();
        $target.addClass('active').siblings().removeClass('active');
        if (text === '.am') {
          _this._time.format = 'am';
        } else {
          _this._time.format = 'pm';
        }
        return _this._renderTime();
      };
    })(this));
    this.el.find('.link-cancel').on('click', (function(_this) {
      return function(e) {
        e.preventDefault();
        return _this.hide();
      };
    })(this));
    this.el.find('.btn-ok').on('click', (function(_this) {
      return function() {
        _this.hide();
        return _this.trigger('timepicked', [_this.time]);
      };
    })(this));
    this.hours.on('click', '.hour', (function(_this) {
      return function(e) {
        var $target, hour;
        $target = $(e.currentTarget);
        hour = $target.text();
        $target.addClass('active').siblings().removeClass('active');
        _this._time.hour = hour;
        return _this._renderTime();
      };
    })(this));
    return this.minutes.on('click', '.minute', (function(_this) {
      return function(e) {
        var $target, minute;
        $target = $(e.currentTarget);
        minute = $target.text();
        $target.addClass('active').siblings().removeClass('active');
        _this._time.minute = minute;
        return _this._renderTime();
      };
    })(this));
  };

  Timepicker.prototype._renderTime = function() {
    this.time = moment("" + this._time.format + " " + this._time.hour + ":" + this._time.minute, 'a hh:mm');
    return this.el.find('.time').text(this.time.format('A h时m分'));
  };

  Timepicker.prototype._renderHours = function() {
    var hour, _i, _len, _ref, _results;
    _ref = this.opts.hours;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      hour = _ref[_i];
      _results.push($(this.hourTpl).text(hour).appendTo(this.hours));
    }
    return _results;
  };

  Timepicker.prototype._renderMinutes = function() {
    var hour, _i, _len, _ref, _results;
    _ref = this.opts.minutes;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      hour = _ref[_i];
      _results.push($(this.minuteTpl).text(hour).appendTo(this.minutes));
    }
    return _results;
  };

  Timepicker.prototype._setPosition = function() {
    var offset;
    offset = this.target.offset();
    return this.el.css({
      'position': 'absolute',
      'z-index': 100,
      'left': offset.left,
      'top': offset.top + this.target.outerHeight(true)
    });
  };

  Timepicker.prototype.show = function() {
    return this.el.show();
  };

  Timepicker.prototype.hide = function() {
    return this.el.hide();
  };

  return Timepicker;

})(SimpleModule);

timepicker = function(opts) {
  return new Timepicker(opts);
};

return timepicker;

}));

