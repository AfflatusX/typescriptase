import { interface1, interface2, interface3 } from "./examples";

test(
  "interface1",
  async (): Promise<void> => {
    expect(interface1.print({
      name: "interface1",
      path: "src/__tests__/interface.test.ts",
    }))
      .toMatchSnapshot();
  },
);

test(
  "interface2",
  async (): Promise<void> => {
    expect(interface2.print({
      name: "interface2",
      path: "src/__tests__/interface.test.ts",
    }))
      .toMatchSnapshot();
  },
);

test(
  "interface3",
  async (): Promise<void> => {
    expect(interface3.print({
      name: "interface3",
      path: "src/__tests__/interface.test.ts",
    }))
      .toMatchSnapshot();
  },
);
