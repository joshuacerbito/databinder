// Create the DataBinder generator
function DataBinder(object_id) {
  // Create a simple PubSub object
  let pubSub = {
    callbacks: {},

    on: function(msg, callback) {
      this.callbacks[msg] = this.callbacks[msg] || [];
      this.callbacks[msg].push(callback);
    },

    publish: function(msg) {
      this.callbacks[msg] = this.callbacks[msg] || [];
      for (let i = 0, len = this.callbacks[msg].length; i < len; i++) {
        this.callbacks[msg][i].apply(this, arguments);
      }
    }
  },

  data_attr = `bind-${object_id}`,

  message = `${object_id}:change`,

  changeHandler = function(evt) {
    let target = evt.target || evt.srcElement, // IE8 compatibility
        prop_name = target.getAttribute(data_attr);

    if (prop_name && prop_name !== '') {
      pubSub.publish(message, prop_name, target.value);
    }
  };

  // Listen to change events and proxy to PubSub
  if (document.addEventListener) {
    document.addEventListener('change', changeHandler, false);
  } else {
    // IE8 uses attachEvent instead of addEventListener
    document.attachEvent('onchange', changeHandler);
  }

  // PubSub propagates changes to all bound elements
  pubSub.on(message, function(evt, prop_name, new_val) {
    let elements = document.querySelectorAll(`[${data_attr}=${prop_name}]`),
        tag_name;

    for (let i = 0, len = elements.length; i < len; i++) {
      tag_name = elements[i].tagName.toLowerCase();

      if (tag_name === 'input' || tag_name === 'textarea' || tag_name === 'select') {
        elements[i].value = new_val;
      } else if (tag_name === 'img' || tag_name === 'video') {
        elements[i].setAttribute('src', new_val);
      } else {
        elements[i].innerHTML = new_val;
      }
    }
  });

  return pubSub;
}

function Binder(id) {
  let binder = new DataBinder(id),
      model = {
        attributes: {},
        computes: {},

        // The attribute setter publish changes using the DataBinder PubSub
        set: function(prop, val) {
          this.attributes[prop] = val;
          // Use the `publish` method

          binder.publish(`${id}:change`, prop, val, this);

          return { prop, val };
        },

        setComputed: function (prop, attrs, handler) {
          if( typeof handler !== 'function' ){
            throw Error('The handler must be a function');
            return;
          } else if ( Object.prototype.toString.call( attrs ) !== '[object Array]' ) {
            throw Error('Attributes must be an array of properties');
            return;
          }

          this.computes[prop] = { attrs, handler };

          let values = {};
          attrs.forEach(item => {
            this.computes[item] = prop;
            values[item] = this.attributes[item] || '';
          });

          let computedValue = handler(values);
          this.attributes[prop] = computedValue;

          binder.publish(`${id}:compute`, prop, computedValue, this);
        },

        get: function(attr) {
          return this.attributes[attr];
        },

        _binder: binder
      };

  // Subscribe to the PubSub
  binder.on(`${id}:change`, function(evt, attr, new_val, initiator) {
    if (initiator !== model) {
      model.set(attr, new_val);
    }
  });

  return model;
}
