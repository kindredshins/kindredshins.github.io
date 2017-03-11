module.exports = {
  get: function(key, expiry) {
    var store = window.localStorage.getItem(key);
    var now = new Date();

    expiry = expiry || 0;
    store = store ? JSON.parse(store) : null;

    // Don't use stored data if it's expired
    if (store && (now - store.added) > expiry) {
      window.localStorage.removeItem(key);
      store = null;
    }

    return store ? store.data : null;
  },

  set: function(key, value) {
    var store = {
      added: new Date(),
      data: value
    };

    window.localStorage.setItem(key, JSON.stringify(store));
  }
};
