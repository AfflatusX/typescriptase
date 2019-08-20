enum EBuilderVerifyMode {
  CASE,
  CONTENT,
  FOR,
  HEADER,
  IF,
  INDENT,
  PRINT,
  SWITCH,
  TRY,
  BLOB,
}

export interface IBuilder {
  readonly name: string;
  readonly path: string;
}

export class Builder {
  public static new(props: IBuilder): Builder {
    return new Builder(props);
  }

  protected bespokes: string[] = [];
  protected built: string = '';
  protected forLevel: number = 0;
  protected header: string | undefined;
  protected identifiers: string[] = [];
  protected ifLevel: number = 0;
  protected indentation: number = 0;
  protected switchCaseLevel: number = 0;
  protected tryLevel: number = 0;

  public constructor(protected readonly props: IBuilder) {}

  public addBlob(blob: string): Builder {
    return this._add(blob, false, false, false, true);
  }

  public add(content: string): Builder {
    return this._add(content, false, false, false);
  }

  public addThenNewline(content: string): Builder {
    return this._add(content, false, true, false);
  }

  public await(content: string): Builder {
    return this._add(content, true, false, false);
  }

  public awaitThenNewline(content: string): Builder {
    return this._add(content, true, true, false);
  }

  public case(check: string): Builder {
    this.switchCaseLevel++;
    this.verify(EBuilderVerifyMode.CASE);

    return this.addThenNewline(`case ${check}: {`).indent();
  }

  public catch(name?: string): Builder {
    this.verify(EBuilderVerifyMode.TRY);
    this.unindent();
    if (name === undefined) {
      this.addThenNewline('} catch {');
    } else {
      this.addThenNewline(`} catch(${name}) {`);
    }

    return this.indent();
  }

  public default(): Builder {
    this.switchCaseLevel++;
    this.verify(EBuilderVerifyMode.CASE);

    return this.addThenNewline('default: {').indent();
  }

  public else(): Builder {
    this.verify(EBuilderVerifyMode.IF);

    return this.unindent().addThenNewline('} else {').indent();
  }

  public elseIf(check: string): Builder {
    this.verify(EBuilderVerifyMode.IF);

    return this.unindent().addThenNewline(`} else if (${check}) {`).indent();
  }

  public endCase(): Builder {
    this.verify(EBuilderVerifyMode.CASE);
    this.switchCaseLevel--;

    return this.addThenNewline('break;').unindent().addThenNewline('}');
  }

  public endFor(): Builder {
    this.verify(EBuilderVerifyMode.FOR);
    this.forLevel--;

    return this.unindent().addThenNewline('}');
  }

  public endIf(): Builder {
    this.verify(EBuilderVerifyMode.IF);
    this.ifLevel--;

    return this.unindent().addThenNewline('}');
  }

  public endSwitch(): Builder {
    this.verify(EBuilderVerifyMode.SWITCH);
    this.switchCaseLevel--;

    return this.unindent().addThenNewline('}');
  }

  public endTry(): Builder {
    this.verify(EBuilderVerifyMode.TRY);
    this.tryLevel--;

    return this.unindent().addThenNewline('}');
  }

  public ensureOnNewline(): Builder {
    return this._ensureOnNewline(1);
  }

  public ensureOnNewlineAfterEmptyline(): Builder {
    return this._ensureOnNewline(2);
  }

  public finally(): Builder {
    this.verify(EBuilderVerifyMode.TRY);

    return this.unindent().addThenNewline('} finally {').indent();
  }

  public for(check: string): Builder {
    this.forLevel++;
    this.verify(EBuilderVerifyMode.FOR);

    return this.addThenNewline(`for (${check}) {`).indent();
  }

  public getBespokes(): string[] {
    return this.bespokes;
  }

  public getIdentifiers(): string[] {
    return this.identifiers;
  }

  public getName(): string {
    return this.props.name;
  }

  public getPath(): string {
    return this.props.path;
  }

  public if(check: string): Builder {
    this.ifLevel++;
    this.verify(EBuilderVerifyMode.IF);

    return this.addThenNewline(`if (${check}) {`).indent();
  }

  public indent(): Builder {
    return this._indent(1);
  }

  public async print(): Promise<string> {
    this.verify(EBuilderVerifyMode.PRINT);
    const b: Builder = Builder.new(this.props);
    if (this.header !== undefined) {
      b.built = this.header;
    }
    b.ensureOnNewlineAfterEmptyline();
    b.built += this.built;
    while (b.built.endsWith('\n\n')) {
      b.built = b.built.slice(0, b.built.length - 1);
    }

    return b.built;
  }

  public return(content: string): Builder {
    return this._add(content, false, true, true);
  }

  public returnAwait(content: string): Builder {
    return this._add(content, true, true, true);
  }

  public setHeader(header: string): Builder {
    this.verify(EBuilderVerifyMode.HEADER);
    this.header = header;

    return this;
  }

  public switch(check: string): Builder {
    this.switchCaseLevel++;
    this.verify(EBuilderVerifyMode.SWITCH);

    return this.addThenNewline(`switch (${check}) {`).indent();
  }

  public try(): Builder {
    this.tryLevel++;
    this.verify(EBuilderVerifyMode.TRY);

    return this.addThenNewline('try {').indent();
  }

  public unindent(): Builder {
    return this._indent(-1);
  }

  public withBespokes(...bespokes: string[]): Builder {
    this.bespokes = this.bespokes.concat(bespokes);

    return this;
  }

  public withIdentifiers(...identifiers: string[]): Builder {
    this.identifiers = this.identifiers.concat(identifiers);

    return this;
  }

  protected _add(
    content: string,
    isAsync: boolean,
    newlineAfter: boolean,
    isReturn: boolean,
    isBlob: boolean = false,
  ): Builder {
    this.verify(
      isBlob ? EBuilderVerifyMode.BLOB : EBuilderVerifyMode.CONTENT,
      content,
    );
    if (this.built.length > 0 && this.built.endsWith('\n')) {
      this.built += '  '.repeat(this.indentation);
    }
    if (isReturn) {
      this.built += 'return ';
    }
    if (isAsync) {
      this.built += 'await ';
    }
    this.built += content;
    if (newlineAfter) {
      this.built += '\n';
    }

    return this;
  }

  protected _ensureOnNewline(newLinesWanted: number): Builder {
    if (this.built.length === 0) {
      return this;
    }
    let newLinesFound: number = 0;
    for (let idx: number = 0; idx < newLinesWanted; idx++) {
      if (this.built.charAt(this.built.length - idx - 1) === '\n') {
        newLinesFound++;
      } else {
        break;
      }
    }
    this.built += '\n'.repeat(newLinesWanted - newLinesFound);

    return this;
  }

  protected _indent(delta: number): Builder {
    this.indentation += delta;
    this.verify(EBuilderVerifyMode.INDENT);

    return this;
  }

  protected verify(mode: EBuilderVerifyMode, content?: string): void {
    if (mode === EBuilderVerifyMode.CASE) {
      if (this.switchCaseLevel < 1 || this.switchCaseLevel % 2 !== 0) {
        throw new Error('Not inside case statement');
      }
    }
    if (mode === EBuilderVerifyMode.CONTENT) {
      if (content === undefined) {
        throw new Error('Unreachable');
      }
      if (content === '') {
        throw new Error('Unexpected empty string');
      }
      if (content.includes('\n')) {
        throw new Error('Unexpected newline');
      }
      if (content.includes('\t')) {
        throw new Error('Unexpected tab');
      }
      if (content.includes('await')) {
        throw new Error('Unexpected await');
      }
      if (content.includes('return')) {
        throw new Error('Unexpected return');
      }
    }
    if (mode === EBuilderVerifyMode.HEADER) {
      if (this.header !== undefined) {
        throw new Error('Cannot set header twice');
      }
    }
    if (mode === EBuilderVerifyMode.INDENT) {
      if (!this.built.endsWith('\n')) {
        throw new Error('Cannot change indentation without being on newline');
      }
      if (this.indentation < 0) {
        throw new Error('Cannot unindent past 0');
      }
    }
    if (mode === EBuilderVerifyMode.PRINT) {
      if (this.indentation !== 0) {
        throw new Error('Cannot print without zeroed indentation');
      }
      if (this.forLevel !== 0) {
        throw new Error('Cannot print without completing for statements');
      }
      if (this.ifLevel !== 0) {
        throw new Error('Cannot print without completing if statements');
      }
      if (this.switchCaseLevel !== 0) {
        throw new Error('Cannot print without completing switch statements');
      }
      if (this.tryLevel !== 0) {
        throw new Error('Cannot print without completing try statements');
      }
    }
    if (mode === EBuilderVerifyMode.FOR) {
      if (this.forLevel < 1) {
        throw new Error('Not inside for statement');
      }
    }
    if (mode === EBuilderVerifyMode.IF) {
      if (this.ifLevel < 1) {
        throw new Error('Not inside if statement');
      }
    }
    if (mode === EBuilderVerifyMode.SWITCH) {
      if (this.switchCaseLevel < 1 || this.switchCaseLevel % 2 !== 1) {
        throw new Error('Not inside switch statement');
      }
    }
    if (mode === EBuilderVerifyMode.TRY) {
      if (this.tryLevel < 1) {
        throw new Error('Not inside try statement');
      }
    }
  }
}
