(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define('SimpleTimepicker', ["jquery",
      "simple-module",
      "simple-datepicker"], function ($, SimpleModule, SimpleDatepicker) {
      return (root.returnExportsGlobal = factory($, SimpleModule, SimpleDatepicker));
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like enviroments that support module.exports,
    // like Node.
    module.exports = factory(require("jquery"),
      require("simple-module"),
      require("simple-datepicker"));
  } else {
    root.simple = root.simple || {};
    root.simple['timepicker'] = factory(jQuery,
      SimpleModule,
      simple.datepicker);
  }
}(this, function ($, SimpleModule, SimpleDatepicker) {

var Timepicker, timepicker,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Timepicker = (function(_super) {
  __extends(Timepicker, _super);

  function Timepicker() {
    return Timepicker.__super__.constructor.apply(this, arguments);
  }

  Timepicker.prototype.opts = {
    list: ['hour', '%-', 'minute'],
    el: null,
    inline: false,
    valueFormat: 'HH:mm',
    displayFormat: 'HH点mm分',
    defaultView: 'auto',
    viewOpts: {
      minute: {
        forceFormat: true
      }
    }
  };

  Timepicker.prototype._init = function() {
    var val;
    this.view = [];
    this.viewList = [];
    this.el = $(this.opts.el);
    if (!this.el.length) {
      throw 'simple timepicker: option el is required';
      return;
    }
    this.el.data('timepicker', this);
    val = this.el.val() || moment();
    this.date = moment.isMoment(val) ? val : moment(val, this.opts.valueFormat);
    this._render();
    return this._bind();
  };

  Timepicker.prototype._render = function() {
    var tpl;
    tpl = '<div class="simple-timepicker">\n  <div class="timepicker-header">\n  </div>\n  <div class="timepicker-panels">\n  </div>\n</div>';
    this.picker = $(tpl);
    this.headerContainer = this.picker.find('.timepicker-header');
    this.panelContainer = this.picker.find('.timepicker-panels');
    this._renderViews();
    if (this.opts.inline) {
      this.picker.insertAfter(this.el);
      return this.show();
    } else {
      this._renderFakeInput();
      return this.picker.appendTo('body');
    }
  };

  Timepicker.prototype._renderFakeInput = function() {
    var type;
    type = this.el.attr('type');
    this.input = $('<input />').addClass('display-input').attr({
      'readonly': 'true',
      'type': type
    }).css({
      'cursor': 'pointer'
    });
    this.input.insertAfter(this.el);
    return this.el.hide();
  };

  Timepicker.prototype._renderViews = function() {
    var name, opt, _i, _len, _ref, _results;
    _ref = this.opts.list;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      name = _ref[_i];
      if (name.indexOf('%') === -1) {
        opt = {
          parent: this,
          inputContainer: this.headerContainer,
          panelContainer: this.panelContainer
        };
        opt.defaultValue = (function() {
          switch (name) {
            case 'hour':
              return this.date.hour();
            case 'minute':
              return this.date.minute();
          }
        }).call(this);
        if (this.opts['viewOpts'][name]) {
          $.extend(opt, this.opts['viewOpts'][name]);
        }
        this.view[name] = new SimpleDatepicker.View.prototype.constructor.views[name](opt);
        this.viewList.push(name);
        _results.push(this._bindView(this.view[name]));
      } else {
        _results.push(this.headerContainer.append("<span>" + (name.substr(1)) + "</span>"));
      }
    }
    return _results;
  };

  Timepicker.prototype._setPosition = function() {
    var offset;
    offset = this.input.offset();
    return this.picker.css({
      'position': 'absolute',
      'z-index': 100,
      'left': offset.left,
      'top': offset.top + this.input.outerHeight(true)
    });
  };

  Timepicker.prototype._bind = function() {
    this.picker.on('click mousedown', function() {
      return false;
    });
    if (this.opts.inline) {
      return;
    }
    this.input.on('focus.timepicker', (function(_this) {
      return function() {
        return _this.show();
      };
    })(this));
    return $(document).on('click.timepicker', (function(_this) {
      return function(e) {
        if (_this.input.is(e.target)) {
          return;
        }
        if (_this.picker.has(e.target).length) {
          return;
        }
        if (_this.picker.is(e.target)) {
          return;
        }
        return _this.hide();
      };
    })(this));
  };

  Timepicker.prototype._bindView = function(view) {
    view.on('select', (function(_this) {
      return function(e, event) {
        var index, newDate, source;
        source = event.source;
        newDate = event.value;
        if (newDate.hour !== null) {
          _this.date.hour(newDate.hour);
        }
        if (newDate.minute !== null) {
          _this.date.minute(newDate.minute);
        }
        if (event.finished) {
          index = _this.viewList.indexOf(source);
          if (index === _this.viewList.length - 1) {
            return _this._selectDate();
          } else {
            return _this.view[_this.viewList[index + 1]].setActive();
          }
        }
      };
    })(this));
    view.on('showpanel', (function(_this) {
      return function(e, event) {
        var index, name, source, _i, _len, _ref, _results;
        source = event.source;
        if (event.prev) {
          _this.view[source].setActive(false);
          index = _this.viewList.indexOf(source) - 1;
          if (index < 0) {
            index = 0;
          }
          return _this.view[_this.viewList[index]].setActive();
        } else {
          _ref = _this.viewList;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            name = _ref[_i];
            if (name !== source) {
              _results.push(_this.view[name].setActive(false));
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        }
      };
    })(this));
    return view.on('close', (function(_this) {
      return function(e, event) {
        if (event != null ? event.selected : void 0) {
          _this._selectDate();
        }
        if (!_this.opts.inline) {
          return _this.hide();
        }
      };
    })(this));
  };

  Timepicker.prototype._selectDate = function() {
    this.el.val(this.date.format(this.opts.valueFormat));
    if (this.input) {
      this.input.val(this.date.format(this.opts.displayFormat));
    }
    this.trigger('select', [this.date]);
    if (!this.opts.inline) {
      return this.hide();
    }
  };

  Timepicker.prototype.setDate = function(date) {
    var _ref, _ref1;
    this.date = moment.isMoment(date) ? date : moment(date, this.opts.valueFormat);
    this.el.val(this.date.format(this.opts.valueFormat));
    if (this.input) {
      this.input.val(this.date.format(this.opts.displayFormat));
    }
    if ((_ref = this.view['hour']) != null) {
      _ref.trigger('datechange', {
        hour: this.date.hour()
      });
    }
    return (_ref1 = this.view['minute']) != null ? _ref1.trigger('datechange', {
      minute: this.date.minute()
    }) : void 0;
  };

  Timepicker.prototype.clear = function() {
    var name, _i, _len, _ref, _results;
    this.el.val('');
    this.date = moment();
    _ref = this.viewList;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      name = _ref[_i];
      _results.push(this.view[name].clear());
    }
    return _results;
  };

  Timepicker.prototype.getDate = function() {
    if (this.el.val()) {
      return this.date || (this.date = moment(this.el.val(), this.opts.valueFormat));
    } else {
      return null;
    }
  };

  Timepicker.prototype.show = function() {
    var view;
    if (!this.opts.inline) {
      this._setPosition();
    }
    this.picker.show();
    this.picker.addClass('active');
    view = this.opts.defaultView;
    if (this.viewList.indexOf(view) !== -1) {
      return this.view[view].setActive();
    } else {
      return this.view['hour'].setActive();
    }
  };

  Timepicker.prototype.hide = function() {
    this.picker.hide();
    return this.picker.removeClass('active');
  };

  Timepicker.prototype.toggle = function() {
    if (this.picker.is('.active')) {
      return this.hide();
    } else {
      return this.show();
    }
  };

  Timepicker.prototype.destroy = function() {
    var _ref;
    if ((_ref = this.picker) != null) {
      _ref.remove();
    }
    this.picker = null;
    if (!this.opts.inline) {
      this.input.remove();
      this.el.show();
      return $(document).off('.timepicker');
    }
  };

  return Timepicker;

})(SimpleModule);

timepicker = function(opts) {
  return new Timepicker(opts);
};

var Hourview,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Hourview = (function(_super) {
  __extends(Hourview, _super);

  function Hourview() {
    return Hourview.__super__.constructor.apply(this, arguments);
  }

  Hourview.prototype.name = 'hour';

  Hourview.prototype._inputTpl = '<input type="text" class="view-input hour-input" data-type="hour" data-min="0" data-max="23"/>';

  Hourview.prototype._renderPanel = function() {
    var el, hour, _i;
    el = "<div class='panel panel-hour'>";
    for (hour = _i = 0; _i <= 23; hour = ++_i) {
      el += "<a class='panel-item' data-value='" + hour + "'>" + (String("00" + hour).slice(-2)) + "</a>";
    }
    return el += '</div>';
  };

  Hourview.prototype._onInputHandler = function(e) {
    var value;
    value = this.input.val();
    if (value.length === 2 && Number(value) < 24) {
      return this.select(value, true, true);
    } else if (value.length === 1) {
      if (Number(value) > 2) {
        return this.select(value, true, true);
      } else {
        return this.timer = setTimeout((function(_this) {
          return function() {
            _this.select(value, false, true);
            return _this.timer = null;
          };
        })(this), 800);
      }
    }
  };

  Hourview.prototype._onKeydownHandler = function(e) {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    return Hourview.__super__._onKeydownHandler.call(this, e);
  };

  Hourview.prototype._onDateChangeHandler = function(e) {
    this.value = e.hour;
    this._refreshInput();
    return this._refreshSelected();
  };

  Hourview.prototype._refreshInput = function() {
    return this.input.val(String('00' + this.value).slice(-2));
  };

  return Hourview;

})(SimpleDatepicker.View);

SimpleDatepicker.View.addView(Hourview);

var MinuteView,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

MinuteView = (function(_super) {
  __extends(MinuteView, _super);

  function MinuteView() {
    return MinuteView.__super__.constructor.apply(this, arguments);
  }

  MinuteView.prototype.name = 'minute';

  MinuteView.prototype._inputTpl = '<input type="text" class="view-input minute-input" data-type="minute" data-min="0" data-max="59"/>';

  MinuteView.prototype._renderPanel = function() {
    var el, minute, _i;
    el = "<div class='panel panel-minute'>";
    for (minute = _i = 0; _i <= 55; minute = _i += 5) {
      el += "<a class='panel-item' data-value='" + minute + "'>" + (String("00" + minute).slice(-2)) + "</a>";
    }
    return el += '</div>';
  };

  MinuteView.prototype._onInputHandler = function(e) {
    var value;
    value = this.input.val();
    if (value.length === 2 && Number(value) < 60) {
      return this.select(value, true, true);
    } else if (value.length === 1) {
      return this.timer = setTimeout((function(_this) {
        return function() {
          _this.select(value, false, true);
          return _this.timer = null;
        };
      })(this), 800);
    }
  };

  MinuteView.prototype._onKeydownHandler = function(e) {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    return MinuteView.__super__._onKeydownHandler.call(this, e);
  };

  MinuteView.prototype._onDateChangeHandler = function(e) {
    this.value = e.minute;
    this._refreshInput();
    return this._refreshSelected();
  };

  MinuteView.prototype._refreshSelected = function() {
    var value;
    value = this.value;
    value = Math.floor(value / 5) * 5;
    value += this.value % 5 >= 3 ? 5 : 0;
    this.panel.find('.selected').removeClass('selected');
    return this.panel.find("[data-value=" + value + "]").addClass('selected');
  };

  MinuteView.prototype._refreshInput = function() {
    return this.input.val(String('00' + this.value).slice(-2));
  };

  return MinuteView;

})(SimpleDatepicker.View);

SimpleDatepicker.View.addView(MinuteView);

return timepicker;

}));

