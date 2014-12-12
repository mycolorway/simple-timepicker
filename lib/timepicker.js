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
    inline: false,
    offset: 0
  };

  Timepicker.prototype.hoursOpts = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11'];

  Timepicker.prototype.minutesOpts = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];

  Timepicker.prototype.tpl = '<div class="simple-timepicker">\n  <div class="time"></div>\n  <div class="picker">\n    <div class="meridiem">\n      <div class="clock am">上午</div>\n      <div class="clock pm">下午</div>\n    </div>\n    <div class="hours"></div>\n    <span class="divider">:</span>\n    <div class="minutes"></div>\n  </div>\n  <div class="buttons">\n    <div class="btn btn-ok">确定</div>\n    <div class="link link-cancel">取消</div>\n  </div>\n</div>';

  Timepicker.prototype.hourTpl = '<div class="hour"></div>';

  Timepicker.prototype.minuteTpl = '<div class="minute"></div>';

  Timepicker.prototype._init = function() {
    this.target = $(this.opts.target);
    if (this.target.length === 0 || !this.target.is('input')) {
      throw new Error("simple-timepicker: target option is invalid");
    }
    this._render();
    return this._bind();
  };

  Timepicker.prototype._render = function() {
    var hour, minute, _i, _j, _len, _len1, _ref, _ref1;
    this.el = $(this.tpl);
    this.hours = this.el.find('.hours');
    this.minutes = this.el.find('.minutes');
    _ref = this.hoursOpts;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      hour = _ref[_i];
      $(this.hourTpl).text(hour).attr('data-hour', hour).appendTo(this.hours);
    }
    _ref1 = this.minutesOpts;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      minute = _ref1[_j];
      $(this.minuteTpl).text(minute).attr('data-minute', minute).appendTo(this.minutes);
    }
    this.setTime(this.opts.time);
    this._setPosition();
    this.el.css('display', 'none').insertAfter(this.target);
    if (this.opts.inline) {
      return this.show();
    }
  };

  Timepicker.prototype._bind = function() {
    if (!this.opts.inline) {
      this.target.on('click', (function(_this) {
        return function() {
          _this.oldTime = _this.target.val();
          return _this.show();
        };
      })(this));
    }
    this.el.on('click.simple-timepicker', '.link-cancel', (function(_this) {
      return function(e) {
        e.preventDefault();
        _this.target.val(_this.oldTime);
        if (!_this.opts.inline) {
          return _this.hide();
        }
      };
    })(this));
    this.el.on('click.simple-timepicker', '.btn-ok', (function(_this) {
      return function() {
        if (!_this.opts.inline) {
          _this.hide();
        }
        return _this.trigger('timepicked', [_this.time]);
      };
    })(this));
    this.el.on('mousedown', function() {
      return false;
    });
    this.el.on('click.simple-timepicker', '.clock', (function(_this) {
      return function(e) {
        var $target;
        $target = $(e.currentTarget);
        $target.addClass('active').siblings().removeClass('active');
        return _this._refreshTime();
      };
    })(this));
    this.el.on('click.simple-timepicker', '.hour', (function(_this) {
      return function(e) {
        var $target, hour;
        $target = $(e.currentTarget);
        hour = $target.text();
        $target.addClass('active').siblings().removeClass('active');
        return _this._refreshTime();
      };
    })(this));
    return this.el.on('click.simple-timepicker', '.minute', (function(_this) {
      return function(e) {
        var $target, minute;
        $target = $(e.currentTarget);
        minute = $target.text();
        $target.addClass('active').siblings().removeClass('active');
        return _this._refreshTime();
      };
    })(this));
  };

  Timepicker.prototype._unbind = function() {
    return this.el.off('.simple-timepicker');
  };

  Timepicker.prototype._refreshTime = function() {
    var hour, meridiem, minute;
    meridiem = this.el.find('.clock.active').text() === '上午' ? 'am' : 'pm';
    hour = this.el.find('.hour.active').text();
    minute = this.el.find('.minute.active').text();
    this.time = moment("" + meridiem + " " + hour + ":" + minute, 'a hh:mm');
    return this._renderTime();
  };

  Timepicker.prototype._renderTime = function() {
    var meridiem;
    meridiem = this.time.format('a') === 'am' ? '上午' : '下午';
    this.el.find('.time').text(meridiem + ' ' + this.time.format('h时m分'));
    return this.target.val(this.time.format('HH:mm'));
  };

  Timepicker.prototype._setPosition = function() {
    var offset;
    offset = this.target.offset();
    return this.el.css({
      'position': 'absolute',
      'z-index': 100,
      'left': offset.left,
      'top': offset.top + this.target.outerHeight(true) + this.opts.offset
    });
  };

  Timepicker.prototype.show = function() {
    return this.el.show();
  };

  Timepicker.prototype.hide = function() {
    return this.el.hide();
  };

  Timepicker.prototype.getTime = function() {
    return this.time;
  };

  Timepicker.prototype.setTime = function(time) {
    var hour, meridiem, minute;
    if (moment.isMoment(time)) {
      this.time = time;
    } else {
      this.time = moment(time, 'HH:mm');
    }
    if (!this.time.isValid()) {
      this.time = moment();
    }
    meridiem = this.time.format('a');
    hour = this.time.format('hh');
    minute = this.time.format('mm');
    minute = Math.round(minute / 5) * 5;
    this.time.set('minute', minute);
    this.el.find("." + meridiem).addClass('active').siblings().removeClass('active');
    this.el.find("[data-hour=" + hour + "]").addClass('active').siblings().removeClass('active');
    this.el.find("[data-minute=" + minute + "]").addClass('active').siblings().removeClass('active');
    return this._renderTime();
  };

  Timepicker.prototype.destroy = function() {
    this._unbind();
    return this.el.remove();
  };

  return Timepicker;

})(SimpleModule);

timepicker = function(opts) {
  return new Timepicker(opts);
};

return timepicker;

}));

