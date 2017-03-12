module.exports = (function(storage) {
  function get(key, expiry) {
    var store = storage.getItem(key);
    var now = new Date();

    expiry = expiry || 0;
    store = store ? JSON.parse(store) : null;

    // Don't use stored data if it's expired
    if (store && (now - store.added) > expiry) {
      storage.removeItem(key);
      store = null;
    }

    return store ? store.data : null;
  }

  function set(key, value) {
    var store = {
      added: new Date(),
      data: value
    };

    storage.setItem(key, JSON.stringify(store));
  }

  return {
    get: get,
    set: set
  };
})(window.localStorage);
