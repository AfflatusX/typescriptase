import { Builder } from "./builder";
import { NamedRenderer, TRenderer } from "./renderer";

export namespace Class {

  export interface I {
    readonly content: TRenderer[];
    readonly extends?: string;
    readonly implements?: string[];
    readonly name: string;
    readonly templates?: string[];
    readonly decorators?: string[];
  }

  export abstract class Base extends NamedRenderer {

    protected constructor(
      private readonly props: I,
      private readonly abstract: boolean,
      private readonly exported: boolean,
    ) {
      super();
    }

    protected render(builder: Builder): void {
      if (this.props.decorators != null) {
        this.props.decorators.forEach(d => builder.addThenNewline(d));
      }
      builder.withIdentifiers(this.props.name);
      if (this.exported) {
        builder.add("export ");
      }
      if (this.abstract) {
        builder.add("abstract ");
      }
      builder.add(`class ${this.props.name}`);
      if (this.props.templates !== undefined) {
        builder.add(`<${this.props.templates.join(", ")}>`);
      }
      builder.add(" ");
      if (this.props.extends !== undefined) {
        builder.add(`extends ${this.props.extends} `);
      }
      if (this.props.implements !== undefined) {
        builder.add(`implements ${this.props.implements.join(", ")} `);
      }
      builder
        .addThenNewline("{")
        .indent();
      this.props.content
        .forEach(
          (content: TRenderer): void => {
            builder.ensureOnNewlineAfterEmptyline();
            Base.genericRenderer(content)(builder);
          },
        );
      builder
        .unindent()
        .addThenNewline("}");
    }

    protected verify(builder: Builder): void {
    }
  }

  export class Abstract extends Base {

    public static newExported(props: I): Abstract {
      return new Abstract(props, true, true);
    }

    public static newInternal(props: I): Abstract {
      return new Abstract(props, true, false);
    }
  }

  export class Concrete extends Base {

    public static newExported(props: I): Concrete {
      return new Concrete(props, false, true);
    }

    public static newInternal(props: I): Concrete {
      return new Concrete(props, false, false);
    }
  }
}
