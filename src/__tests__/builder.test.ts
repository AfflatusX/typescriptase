import { Builder } from "../index";

test(
  "Empty",
  async (): Promise<void> => {
    expect(
      Builder
        .new()
        .print(),
    )
      .toEqual("");
  },
);

test(
  "Add",
  async (): Promise<void> => {
    expect(
      Builder
        .new()
        .add("a")
        .print(),
    )
      .toEqual("a");
  },
);

test(
  "AddHeader",
  async (): Promise<void> => {
    expect(
      Builder
        .new()
        .add("b")
        .setHeader("\na\t")
        .print(),
    )
      .toEqual("\na\t\n\nb");
  },
);

test(
  "AddLine",
  async (): Promise<void> => {
    expect(
      Builder
        .new()
        .addThenNewline("a")
        .print(),
    )
      .toEqual("a\n");
  },
);

test(
  "Newline",
  async (): Promise<void> => {
    expect(
      Builder
        .new()
        .add("a")
        .ensureOnNewline()
        .print(),
    )
      .toEqual("a\n");
    expect(
      Builder
        .new()
        .addThenNewline("a")
        .ensureOnNewline()
        .print(),
    )
      .toEqual("a\n");
  },
);

test(
  "NewlineAfterEmptyline",
  async (): Promise<void> => {
    expect(
      Builder
        .new()
        .add("a")
        .ensureOnNewlineAfterEmptyline()
        .addThenNewline("b")
        .print(),
    )
      .toEqual("a\n\nb\n");
    expect(
      Builder
        .new()
        .addThenNewline("a")
        .ensureOnNewlineAfterEmptyline()
        .print(),
    )
      .toEqual("a\n");
  },
);

test(
  "Indentation",
  async (): Promise<void> => {
    expect(
      Builder
        .new()
        .addThenNewline("a")
        .indent()
        .addThenNewline("b")
        .indent()
        .ensureOnNewlineAfterEmptyline()
        .addThenNewline("c")
        .unindent()
        .unindent()
        .addThenNewline("d")
        .print(),
    )
      .toEqual("a\n  b\n\n    c\nd\n");
  },
);

test(
  "EmptyError",
  async (): Promise<void> => {
    expect(
      () => Builder
        .new()
        .add(""),
    )
      .toThrow();
  },
);

test(
  "TabError",
  async (): Promise<void> => {
    expect(
      () => Builder
        .new()
        .addThenNewline("a\tb"),
    )
      .toThrow();
  },
);

test(
  "NewlineError",
  async (): Promise<void> => {
    expect(
      () => Builder
        .new()
        .addThenNewline("a\nb"),
    )
      .toThrow();
  },
);

test(
  "UnindentError",
  async (): Promise<void> => {
    expect(
      () => Builder
        .new()
        .addThenNewline("a")
        .unindent(),
    )
      .toThrow();
  },
);

test(
  "IndentError",
  async (): Promise<void> => {
    expect(
      () => Builder
        .new()
        .addThenNewline("a")
        .indent()
        .print(),
    )
      .toThrow();
  },
);

test(
  "IndentNewlineError",
  async (): Promise<void> => {
    expect(
      () => Builder
        .new()
        .indent(),
    )
      .toThrow();
  },
);

test(
  "AddHeaderError",
  async (): Promise<void> => {
    expect(
      () => Builder
        .new()
        .setHeader("\na\t")
        .setHeader("\na\t"),
    )
      .toThrow();
  },
);
