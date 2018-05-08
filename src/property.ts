import { Builder } from "./builder";
import { IContext, Renderable } from "./renderable";
import { NamedType } from "./type";

export enum EPropertyKind {
  PRIVATE = "private",
  PROTECTED = "protected",
  PUBLIC = "public",
}

export interface IProperty {
  readonly assignment?: string;
  readonly type: NamedType;
}

export abstract class Property extends Renderable {

  protected constructor(
    private readonly props: IProperty,
    private readonly readonly: boolean,
    private readonly isStatic: boolean,
    private readonly kind: EPropertyKind,
  ) {
    super();
  }

  public bespokes(): string[] {
    return [];
  }

  public identifiers(): string[] {
    return this.props.type.identifiers();
  }

  protected render(
    context: IContext,
    builder: Builder,
  ): void {
    builder.add(`${this.kind} `);
    if (this.readonly) {
      builder.add("readonly ");
    }
    if (this.isStatic) {
      builder.add("static ");
    }
    this.props.type.run(context, builder);
    if (this.props.assignment !== undefined) {
      builder.addLine(` = ${this.props.assignment};`);
    } else {
      builder.addLine(";");
    }
  }

  protected verify(context: IContext): void {
  }
}

export class PrivateProperty extends Property {

  public static newImmutableInstance(props: IProperty): PrivateProperty {
    return new PrivateProperty(props, true, false, EPropertyKind.PRIVATE);
  }

  public static newImmutableStatic(props: IProperty): PrivateProperty {
    return new PrivateProperty(props, true, true, EPropertyKind.PRIVATE);
  }

  public static newMutableInstance(props: IProperty): PrivateProperty {
    return new PrivateProperty(props, false, false, EPropertyKind.PRIVATE);
  }

  public static newMutableStatic(props: IProperty): PrivateProperty {
    return new PrivateProperty(props, false, true, EPropertyKind.PRIVATE);
  }
}

export class ProtectedProperty extends Property {

  public static newImmutableInstance(props: IProperty): ProtectedProperty {
    return new ProtectedProperty(props, true, false, EPropertyKind.PROTECTED);
  }

  public static newImmutableStatic(props: IProperty): ProtectedProperty {
    return new ProtectedProperty(props, true, true, EPropertyKind.PROTECTED);
  }

  public static newMutableInstance(props: IProperty): ProtectedProperty {
    return new ProtectedProperty(props, false, false, EPropertyKind.PROTECTED);
  }

  public static newMutableStatic(props: IProperty): ProtectedProperty {
    return new ProtectedProperty(props, false, true, EPropertyKind.PROTECTED);
  }
}

export class PublicProperty extends Property {

  public static newImmutableInstance(props: IProperty): PublicProperty {
    return new PublicProperty(props, true, false, EPropertyKind.PUBLIC);
  }

  public static newImmutableStatic(props: IProperty): PublicProperty {
    return new PublicProperty(props, true, true, EPropertyKind.PUBLIC);
  }

  public static newMutableInstance(props: IProperty): PublicProperty {
    return new PublicProperty(props, false, false, EPropertyKind.PUBLIC);
  }

  public static newMutableStatic(props: IProperty): PublicProperty {
    return new PublicProperty(props, false, true, EPropertyKind.PUBLIC);
  }
}
