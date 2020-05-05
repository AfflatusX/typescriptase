import { Builder } from "./builder";
import { NamedRenderer, TRenderer } from "./renderer";
import { Type } from "./type";

export namespace Method {

  export enum E {
    PRIVATE = "private",
    PROTECTED = "protected",
    PUBLIC = "public",
  }

  export interface IBase {
    readonly content?: TRenderer[];
    readonly templates?: string[];
  }

  export interface IConstructor extends IBase {
    readonly inTypes: Array<Type.Argument | Type.FromProperty>;
    readonly decorators?: string[];
  }

  export interface INormal extends IBase {
    readonly inTypes: Type.Argument[];
    readonly name: string;
    readonly outType: Type.Anonymous;
    readonly decorators?: string[];
  }

  export type T = IConstructor | INormal;

  export abstract class Base extends NamedRenderer {

    protected constructor(
      private readonly props: T,
      private readonly async: boolean,
      private readonly isStatic: boolean,
      private readonly kind: E,
    ) {
      super();
    }

    protected render(builder: Builder): void {
      if (this.props.decorators != null) {
        this.props.decorators.forEach(d => builder.addThenNewline(`@${d}`));
      }
      builder.add(`${this.kind} `);
      if (this.isStatic) {
        builder.add("static ");
      }
      if (this.async) {
        builder.add("async ");
      }
      if (this.props.content === undefined) {
        builder.add("abstract ");
      }
      if ("name" in this.props) {
        builder.withIdentifiers(this.props.name);
        builder.add(this.props.name);
      } else {
        builder.add("constructor");
      }
      if (this.props.templates !== undefined) {
        builder.add(`<${this.props.templates.join(", ")}>`);
      }
      builder
        .addThenNewline("(")
        .indent();
      (this.props.inTypes as Type.Base[]).forEach(
        (type: Type.Base): void => {
          type.run(builder);
          builder.addThenNewline(",");
        },
      );
      builder
        .unindent()
        .add(")");
      if ("outType" in this.props) {
        builder.add(": ");
        this.props.outType.run(builder);
      }
      if (this.props.content === undefined) {
        builder.addThenNewline(";");
      } else {
        builder
          .addThenNewline(" {")
          .indent();
        this.props.content
          .forEach(
            (content: TRenderer): void => {
              Base.genericRenderer(content)(builder);
            },
          );
        builder
          .unindent()
          .addThenNewline("}");
      }
    }

    protected verify(builder: Builder): void {
    }
  }

  export abstract class BaseInstance extends Base {}

  export namespace Instance {

    export class Private extends BaseInstance {

      public static newAsync(props: INormal): Private {
        return new Private(props, true, false, E.PRIVATE);
      }

      public static newConstructor(props: IConstructor): Private {
        return new Private(props, false, false, E.PRIVATE);
      }

      public static newSync(props: INormal): Private {
        return new Private(props, false, false, E.PRIVATE);
      }
    }

    export class Protected extends BaseInstance {

      public static newAsync(props: INormal): Protected {
        return new Protected(props, true, false, E.PROTECTED);
      }

      public static newConstructor(props: IConstructor): Protected {
        return new Protected(props, false, false, E.PROTECTED);
      }

      public static newSync(props: INormal): Protected {
        return new Protected(props, false, false, E.PROTECTED);
      }
    }

    export class Public extends BaseInstance {

      public static newAsync(props: INormal): Public {
        return new Public(props, true, false, E.PUBLIC);
      }

      public static newConstructor(props: IConstructor): Public {
        return new Public(props, false, false, E.PUBLIC);
      }

      public static newSync(props: INormal): Public {
        return new Public(props, false, false, E.PUBLIC);
      }
    }
  }

  export abstract class BaseStatic extends Base {}

  export namespace Static {

    export class Private extends BaseStatic {

      public static newAsync(props: INormal): Private {
        return new Private(props, true, true, E.PRIVATE);
      }

      public static newSync(props: INormal): Private {
        return new Private(props, false, true, E.PRIVATE);
      }
    }

    export class Protected extends BaseStatic {

      public static newAsync(props: INormal): Protected {
        return new Protected(props, true, true, E.PROTECTED);
      }

      public static newSync(props: INormal): Protected {
        return new Protected(props, false, true, E.PROTECTED);
      }
    }

    export class Public extends BaseStatic {

      public static newAsync(props: INormal): Public {
        return new Public(props, true, true, E.PUBLIC);
      }

      public static newSync(props: INormal): Public {
        return new Public(props, false, true, E.PUBLIC);
      }
    }
  }
}
