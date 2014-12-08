(function() {
  describe('Simple timepicker', function() {
    return it('should inherit from SimpleModule', function() {
      var timepicker;
      timepicker = simple.timepicker({
        target: 'body'
      });
      return expect(timepicker instanceof SimpleModule).toBe(true);
    });
  });

}).call(this);
