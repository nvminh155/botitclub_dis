

module.exports = {
    excute: () => {},
    setExcute: function(callback) {
      this.excute = callback
    },
    clear: function() {
      clearTimeout(this.excute);
    }
  };
