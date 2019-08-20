import { Builder } from "./builder";

export type AnonymousRenderer = (builder: Builder) => void;

export abstract class NamedRenderer {

  protected static genericRenderer(renderer: TRenderer): AnonymousRenderer {
    if (renderer instanceof NamedRenderer) {
      return (builder: Builder): void => {
        renderer.run(builder);
      };
    } else {
      return renderer;
    }
  }

  public print(builder?: Builder): string {
    let forceBuilder: Builder;
    if (builder === undefined) {
      forceBuilder = Builder.new({
        name: "DO_NOT_COMMIT",
        path: "DO_NOT_COMMIT",
      });
    } else {
      forceBuilder = builder;
    }
    this.run(forceBuilder);

    return forceBuilder.print();
  }

  public run(
    builder: Builder,
  ): void {
    this.render(builder);
    this.verify(builder);
  }

  protected abstract render(builder: Builder): void;

  protected abstract verify(builder: Builder): void;
}

export type TRenderer = AnonymousRenderer | NamedRenderer;
