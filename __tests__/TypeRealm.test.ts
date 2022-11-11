import { Property, Model, type ObjectSchema } from '../';

describe('decorators', () => {
  describe('property(type)', () => {
    it('should set the properties field to the type passed in', () => {
      const type = 'int';

      class Test {
        @Property(type)
        public test!: number;

        public static schema: ObjectSchema;
      }

      expect(Test.schema).toEqual({
        properties: {
          test: type,
        },
      });
    });
  });

  describe('property(linkedModelName)', () => {
    it("should set the properties field to the type and optional when the type isn't an array", () => {
      const linkedModelName = 'LinkedModelName';

      class Test {
        @Property(linkedModelName)
        public test!: any;

        public static schema: ObjectSchema;
      }

      expect(Test.schema).toEqual({
        properties: {
          test: linkedModelName,
        },
      });
    });
  });

  describe('property({config})', () => {
    it('should spread the config object into the property on the schema', () => {
      const config = {
        type: 'int' as const,
        optional: true,
      };

      class Test {
        @Property(config)
        public test!: any;

        public static schema: ObjectSchema;
      }

      expect(Test.schema).toEqual({
        properties: {
          test: config,
        },
      });
    });

    it('should set the primary key when included', () => {
      const config = {
        type: 'int' as const,
        optional: true,
        primaryKey: true,
      };

      class Test {
        @Property(config)
        public test!: any;

        public static schema: ObjectSchema;
      }

      expect(Test.schema.primaryKey).toBe('test');
      expect(Test.schema.properties.test).toEqual('int');
    });

    it('should map the linked model properties to a regular property', () => {
      const config = {
        linkedModel: 'OtherModel',
        optional: true,
        default: 'test',
        indexed: true,
        mapTo: 'map to'
      };

      class Test {
        @Property(config)
        public test!: any;

        public static schema: ObjectSchema;
      }

      expect(Test.schema).toEqual({
        properties: {
          test: {
            type: config.linkedModel,
            optional: true,
            default: 'test',
            indexed: true,
            mapTo: 'map to',
          },
        },
      });
    });
  });

  describe('model(name)', () => {
    it('should set the name field on the schema', () => {
      const modelName = 'Name of Model';

      @Model(modelName)
      class Test {
        public static schema: ObjectSchema;
      }

      expect(Test.schema).toEqual({
        name: modelName,
        properties: {},
      });
    });

    it('should add to an existing schema', () => {
      const modelName = 'Name of Model';

      @Model(modelName)
      class Test {
        public static schema = {
          primaryKey: 'test',
        };
      }

      expect(Test.schema).toEqual({
        name: modelName,
        primaryKey: 'test',
        properties: {},
      });
    });
  });

  describe('model and properties', () => {
    @Model('TestItem')
    class TestItem {
      @Property({ type: 'int', primaryKey: true })
      public id!: number;
      @Property('int')
      public index!: number;
      @Property({ linkedModel: 'OtherItem' })
      public otherItem?: any;
      @Property('FinalItem?')
      public finalItem?: any;

      public static schema: ObjectSchema;
    }

    it('should have the name set to "TestItem"', () => {
      expect(TestItem.schema.name).toBe('TestItem');
    });

    it('should have the id as the primary key', () => {
      expect(TestItem.schema.primaryKey).toBe('id');
    });

    it('should have id as an "int"', () => {
      expect(TestItem.schema.properties.id).toEqual('int');
    });

    it('should have index as an "int"', () => {
      expect(TestItem.schema.properties.index).toEqual('int');
    });

    it('should have otherItem as an "OtherItem"', () => {
      expect(TestItem.schema.properties.otherItem).toEqual({
        type: 'OtherItem',
      });
    });

    it('should have finalItem as a "FinalItem?"', () => {
      expect(TestItem.schema.properties.finalItem).toEqual('FinalItem?');
    });
  });
});
