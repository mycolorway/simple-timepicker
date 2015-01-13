(function() {
  describe('Simple timepicker', function() {
    beforeEach(function() {
      return $('<input id="time">').appendTo('body');
    });
    afterEach(function() {
      var timepicker;
      timepicker = $('#time').data('timepicker');
      if (timepicker != null) {
        timepicker.destroy();
      }
      return $('#time').remove();
    });
    it('should throw Error when target option is not input', function() {
      var testError;
      testError = function() {
        return simple.timepicker({
          target: null
        });
      };
      return expect(testError).toThrow();
    });
    it('should render specific layout', function() {
      var timepicker;
      timepicker = simple.timepicker({
        target: '#time'
      });
      expect($('.simple-timepicker')).toExist();
      expect($('.simple-timepicker').find('.time')).toExist();
      expect($('.simple-timepicker').find('.picker .clock')).toExist();
      return expect($('.simple-timepicker').find('.minutes, .hours, .buttons')).toExist();
    });
    it('should show when focused when inline false', function() {
      var $input, $timepicker, timepicker;
      timepicker = simple.timepicker({
        target: '#time',
        inline: false
      });
      $timepicker = $('.simple-timepicker');
      $input = $('#time');
      $input.blur();
      expect($timepicker).not.toBeVisible();
      $input.focus();
      return expect($timepicker).toBeVisible();
    });
    it('should show or hide when call show or hide method', function() {
      var $timepicker, timepicker;
      timepicker = simple.timepicker({
        target: '#time',
        inline: false
      });
      $timepicker = $('.simple-timepicker');
      timepicker.hide();
      expect($timepicker).not.toBeVisible();
      timepicker.show();
      return expect($timepicker).toBeVisible();
    });
    it('should render layout after input when inline on', function() {
      var timepicker;
      timepicker = simple.timepicker({
        target: '#time',
        inline: true
      });
      expect($('#time+.simple-timepicker')).toExist();
      return expect($('.simple-timepicker')).toBeVisible();
    });
    it('should set correct time when call setTime', function() {
      var timepicker;
      timepicker = simple.timepicker({
        target: '#time',
        inline: true
      });
      expect($('#time').val()).not.toBe('08:45');
      timepicker.setTime('08:45');
      return expect($('#time').val()).toBe('08:45');
    });
    it('should set specific component active', function() {
      var $timepicker, timepicker;
      timepicker = simple.timepicker({
        target: '#time',
        inline: true,
        time: '09:00'
      });
      $timepicker = $('.simple-timepicker');
      expect($timepicker.find('[data-meridiem=am]')).toHaveClass('active');
      expect($timepicker.find('[data-hour=09]')).toHaveClass('active');
      expect($timepicker.find('[data-minute=00]')).toHaveClass('active');
      $timepicker.find('[data-meridiem=pm]').click();
      $timepicker.find('[data-hour=11]').click();
      $timepicker.find('[data-minute=30]').click();
      expect($timepicker.find('[data-meridiem=pm]')).toHaveClass('active');
      expect($timepicker.find('[data-hour=11]')).toHaveClass('active');
      return expect($timepicker.find('[data-minute=30]')).toHaveClass('active');
    });
    it('should set correct time when click OK button', function() {
      var $timepicker, timepicker;
      timepicker = simple.timepicker({
        target: '#time',
        inline: true,
        time: '09:00'
      });
      $timepicker = $('.simple-timepicker');
      $timepicker.find('[data-meridiem=pm]').click();
      $timepicker.find('[data-hour=11]').click();
      $timepicker.find('[data-minute=30]').click();
      $timepicker.find('.btn').click();
      return expect($('#time').val()).toBe('23:30');
    });
    it('shouldn\'t change its time when call cancel button', function() {
      var $timepicker, timepicker;
      timepicker = simple.timepicker({
        target: '#time',
        inline: true,
        time: '09:00'
      });
      expect($('#time').val()).not.toBe('23:00');
      $timepicker = $('.simple-timepicker');
      $timepicker.find('[data-meridiem=pm]').click();
      $timepicker.find('[data-hour=11]').click();
      expect($('#time').val()).toBe('23:00');
      $timepicker.find('.link').click();
      return expect($('#time').val()).toBe('09:00');
    });
    return it('should reset all when call destroy', function() {
      var timepicker;
      timepicker = simple.timepicker({
        target: '#time',
        inline: true,
        time: '09:00'
      });
      timepicker.destroy();
      return expect($('.simple-timepicker')).not.toExist();
    });
  });

}).call(this);
