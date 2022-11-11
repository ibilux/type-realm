export type Decimal128 = import('bson').Decimal128;
export type ObjectId = import('bson').ObjectId;
export type UUID = import('bson').UUID;

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * PropertyType
 * @see { @link https://realm.io/docs/javascript/latest/api/Realm.html#~PropertyType }
 */
type PropertyType =
  | string
  | 'bool'
  | 'int'
  | 'float'
  | 'double'
  | 'decimal128'
  | 'objectId'
  | 'string'
  | 'data'
  | 'date'
  | 'list'
  | 'linkingObjects';

/**
 * ObjectSchemaProperty
 * @see { @link https://realm.io/docs/javascript/latest/api/Realm.html#~ObjectSchemaProperty }
 */
interface ObjectSchemaProperty {
  type: PropertyType;
  objectType?: string;
  property?: string;
  default?: any;
  optional?: boolean;
  indexed?: boolean;
  mapTo?: string;
}

// properties types
interface PropertiesTypes {
  [keys: string]: ObjectSchemaProperty | PropertyType;
}

/**
 * ObjectSchema
 * @see { @link https://realm.io/docs/javascript/latest/api/Realm.html#~ObjectSchema }
 */
interface BaseObjectSchema {
  name: string;
  primaryKey?: string;
  embedded?: boolean;
  asymmetric?: boolean;
}

export interface ObjectSchema extends BaseObjectSchema {
  properties: PropertiesTypes;
}

type PropertyDecorator = (target: any, key: string) => void;
type ClassDecorator = (constructor: any) => void;

type OptionalPropertyType =
  | 'bool?'
  | 'int?'
  | 'float?'
  | 'double?'
  | 'decimal128?'
  | 'string?'
  | 'data?'
  | 'date?'
  | 'list?';

type BasicPropertyType =
  | 'uuid'
  | 'bool'
  | 'int'
  | 'float'
  | 'double'
  | 'decimal128'
  | 'objectId'
  | 'string'
  | 'data'
  | 'date'
  | 'list'
  | 'linkingObjects';

interface BasicPropertyConfig {
  type: BasicPropertyType | OptionalPropertyType;
  optional?: boolean;
  default?: any;
  indexed?: boolean;
  mapTo?: string;
  primaryKey?: boolean;
}
type ListPropertyType =
  | 'bool[]'
  | 'int[]'
  | 'float[]'
  | 'double[]'
  | 'string[]'
  | 'data[]'
  | 'date[]';
interface ListPropertyConfig {
  type: ListPropertyType;
  default?: any;
  mapTo?: string;
}
interface LinkedPropertyConfig {
  linkedModel: string;
  objectType?: string;
  property?: string;
  optional?: boolean;
  default?: any;
  indexed?: boolean;
  mapTo?: string;
}
type PropertyConfig = BasicPropertyConfig | ListPropertyConfig | LinkedPropertyConfig;

function initializeSchema(constructor: any): void {
  if (!constructor.schema) {
    constructor.schema = {
      properties: {},
    };
  } else if (!constructor.schema.properties) {
    constructor.schema.properties = {};
  }
}

export function Property(
  type: BasicPropertyType | OptionalPropertyType | ListPropertyType,
): PropertyDecorator;
export function Property(type: string): PropertyDecorator;
export function Property(config: PropertyConfig): PropertyDecorator;
export function Property(arg1: string | PropertyConfig): PropertyDecorator {
  return (target, key) => {
    let property: ObjectSchemaProperty | string;
    let isPrimaryKey = false;
    if (typeof arg1 === 'string') {
      property = arg1;
    } else {
      if ('linkedModel' in arg1) {
        property = {
          type: arg1.linkedModel,
        };
        if (arg1.objectType) property.objectType = arg1.objectType;
        if (arg1.property) property.property = arg1.property;
        if (arg1.optional) property.optional = arg1.optional;
        if (arg1.default) property.default = arg1.default;
        if (arg1.indexed) property.indexed = arg1.indexed;
        if (arg1.mapTo) property.mapTo = arg1.mapTo;
      } else {
        isPrimaryKey = 'primaryKey' in arg1 && !!arg1.primaryKey;
        if (isPrimaryKey) {
          property = arg1.type;
        } else {
          property = { ...arg1 };
        }
      }
    }

    initializeSchema(target.constructor);
    target.constructor.schema.properties[key] = property;
    if (isPrimaryKey) {
      target.constructor.schema.primaryKey = key;
    }
  };
}

/**
 * This will add the "name" field to the static schema object. While the name could be inferred from the class's
 * constructor, it is required because obfuscating the JS bundle in production builds changes the class names, and thus
 * produces inconsistent or duplicate Realm model names.
 * @param name The model name in realm. This can be different from the class name
 */
export function Model(name: string, embedded?: boolean): ClassDecorator {
  return constructor => {
    initializeSchema(constructor);
    constructor.schema.name = name;
    if (embedded) {
      constructor.schema.embedded = embedded;
    }
  };
}
