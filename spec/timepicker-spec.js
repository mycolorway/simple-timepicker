(function() {
  describe('Simple timepicker', function() {
    return it('should inherit from SimpleModule', function() {
      var timepicker;
      $('<input id="time">').appendTo('body');
      timepicker = simple.timepicker({
        target: '#time'
      });
      return expect(timepicker instanceof SimpleModule).toBe(true);
    });
  });

}).call(this);
