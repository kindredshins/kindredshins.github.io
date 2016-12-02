function Storage() {}

Storage.prototype = {
  get: function get(key, expiry) {
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

  set: function set(key, value) {
    var store = {
      added: new Date(),
      data: value
    };

    window.localStorage.setItem(key, JSON.stringify(value));
  }
}

module.exports = new Storage();
