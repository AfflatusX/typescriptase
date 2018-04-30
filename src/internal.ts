export interface IContext {
  name: string;
  path: string;
}

export abstract class Renderable {

  public abstract bespokes(): string[];

  public abstract identifiers(): string[];

  public renderAndVerify(context: IContext): string {
    this.verify(context);

    return this.render(context);
  }

  protected abstract render(context: IContext): string;

  protected abstract verify(context: IContext): void;
}

enum EBuilderVerifyMode {
  CONTENT,
  INDENT,
  RENDER,
}

export class Builder {

  public static new(): Builder {
    return new Builder();
  }

  private built: string = "";
  private indentation: number = 0;

  private constructor() {}

  public add(content: string): Builder {
    return this.addImpl(content, false);
  }

  public addLine(content: string): Builder {
    return this.addImpl(content, true);
  }

  public ensureOnNewline(): Builder {
    return this.ensureOnNewlineImpl(1);
  }

  public ensureOnNewlineAfterEmptyline(): Builder {
    return this.ensureOnNewlineImpl(2);
  }

  public indent(): Builder {
    return this.indentImpl(1);
  }

  public render(): string {
    this.verify(EBuilderVerifyMode.RENDER);

    return this.built;
  }

  public unindent(): Builder {
    return this.indentImpl(-1);
  }

  private addImpl(content: string, newLineAfter: boolean): Builder {
    this.verify(EBuilderVerifyMode.CONTENT, content);
    if (this.built.length > 0 && this.built.endsWith("\n")) {
      this.built += "  ".repeat(this.indentation);
    }
    this.built += content;
    if (newLineAfter) {
      this.built += "\n";
    }

    return this;
  }

  private ensureOnNewlineImpl(newLinesWanted: number): Builder {
    let newLinesFound: number = 0;
    for (let idx: number = 0; idx < newLinesWanted; idx++) {
      if (this.built.charAt(this.built.length - idx - 1) === "\n") {
        newLinesFound++;
      } else {
        break;
      }
    }
    this.built += "\n".repeat(newLinesWanted - newLinesFound);

    return this;
  }

  private indentImpl(delta: number): Builder {
    this.indentation += delta;
    this.verify(EBuilderVerifyMode.INDENT);

    return this;
  }

  private verify(
    mode: EBuilderVerifyMode,
    content?: string,
  ): void {
    if (mode === EBuilderVerifyMode.CONTENT) {
      if (content === undefined) {
        throw new Error("Unreachable");
      }
      if (content === "") {
        throw new Error("Unexpected empty string");
      }
      if (content.trim() !== content) {
        throw new Error("Unexpected whitespace");
      }
      if (content.includes("\n")) {
        throw new Error("Unexpected newline");
      }
      if (content.includes("\t")) {
        throw new Error("Unexpected tab");
      }
    }
    if (mode === EBuilderVerifyMode.INDENT) {
      if (!this.built.endsWith("\n")) {
        throw new Error("Cannot change indentation without being on newline");
      }
      if (this.indentation < 0) {
        throw new Error("Cannot unindent past 0");
      }
    }
    if (mode === EBuilderVerifyMode.RENDER) {
      if (this.indentation !== 0) {
        throw new Error("Cannot render without zeroed indentation");
      }
    }
  }
}
