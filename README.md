# DataBinder

**DataBinder** is a simple two-way data-binding JavaScript library inspired by the now obsolete [`Object.observe`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/observe) spec and the data-binding capabilities of JS libraries such as Vue, Angular, Ember, etc.

*Note: This library is in active development.*

## Usage

###

### Binder Constructor

Use the `new` keyword to create a new Binder instance—this constructor only requires one argument: element's `binding ID`.

Example:

```
const myUser = 'user123';
const user = new Binder(myUser);
```


### Markup

Add the `bind-<binding ID>` attribute in the elements that you want to be data-bound, and specify the `property` that it'll be bound to.

Example:

```
<!-- binding ID: user123, property: name -->
<input type="text" bind-user123="name" />

<!-- binding ID: user123, property: age -->
<p bind-user123="age">Replace this</p>
```

### The `get` and `set` method

**`set`**: assigns a value to a specified property inside the parent binder instance.


```
user.set('firstName', 'Joshua');
```

**`get`**: returns the value of the specified property inside the parent binder instance.

```
user.get('firstName', 'Joshua');
```

___

In Development:

- [ ] Add functionality for computed values
- [ ] Make module easily exportable
- [ ] Add test scripts
