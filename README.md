# TypeRealm

![NPM Version](https://img.shields.io/npm/v/type-realm) ![License](https://img.shields.io/github/license/ibilux/type-realm) ![Issues](https://img.shields.io/github/issues/ibilux/type-realm)

![ ](https://github.com/ibilux/type-realm/raw/master/coverage/badge-statements.svg) ![ ](https://github.com/ibilux/type-realm/raw/master/coverage/badge-branches.svg) ![ ](https://github.com/ibilux/type-realm/raw/master/coverage/badge-functions.svg) ![ ](https://github.com/ibilux/type-realm/raw/master/coverage/badge-lines.svg)


Create Realm schema with TypeScript, using classes and decorators!

## Basic Usage

The [Realm JavaScript docs](https://www.mongodb.com/docs/realm/sdk/node/examples/define-a-realm-object-model/) suggest defining Realm object schema this way:

```ts
class Car {
  static schema = {
    name: "Car",
    properties: {
      _id: 'objectId',
      make: "string?",
      model: "string",
      miles: { type: "int", default: 0 },
    },
    primaryKey: '_id',
  };
  get carName() {
    return `${this.make} ${this.model}`;
  }
}
```

TypeRealm makes writing Realm Object Schema an enjoyable process, i.e. by defining the schema using only classes and a bit of decorator magic.

So, to create Realm object schema we use a kind of DTO classes. For example, to declare the previous `Car` type we simply create a class and annotate it with decorators:

```ts
import type { ObjectSchema } from 'type-realm';
import { Model, Property } from 'type-realm';

@Model('Car')
class Car {
  @Property({ type: 'objectId', primaryKey: true })
  _id!: number;

  @Property('string?')
  make?: string;

  @Property('string')
  model!: string;

  @Property({ type: 'int', default: 0 })
  miles = 0;

  static schema: ObjectSchema;

  get carName() {
    return `${this.make} ${this.model}`;
  }
}
```

And we get the corresponding part of the schema :

```
{
  properties: {
    _id: 'objectId',
    make: 'string?',
    model: 'string',
    miles: { type: 'int', default: 0 }
  },
  primaryKey: '_id',
  name: 'Car'
}
```

We can pass the class itself to the schema property of the Realm.Configuration object when opening a realm. You can then read and write data normally.

```ts
const realm = await Realm.open({
  path: "myrealm",
  schema: [Car],
});
let car1;
realm.write(() => {
  car1 = realm.create("Car", {
    make: "Nissan",
    model: "Sentra",
    miles: 1000,
  });
});
```

## Advanced Usage

For more advanced usage, checkout the [examples in](https://github.com/ibilux/type-realm/tree/master/__tests__/TypeRealm.test.ts)!


Since this library is written in TypeScript, all editors with some form of intellisense should also be able to provide strongly types suggestions for the decorators as well!

## Documentation

The documentation for the Realm React Native SDK can be found at [docs.mongodb.com/realm/sdk/react-native/](https://docs.mongodb.com/realm/sdk/react-native/). The documentation for Realm Node.js SDK can be found at [docs.mongodb.com/realm/sdk/node](https://docs.mongodb.com/realm/sdk/node/).

The API reference is located at [docs.mongodb.com/realm-sdks/js/latest/](https://docs.mongodb.com/realm-sdks/js/latest/).

## More Examples
Coming soon.
