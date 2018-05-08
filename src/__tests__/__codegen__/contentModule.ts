/**
 * This file is partially generated; only edit bespoke sections.
 *
 * SOURCE<<src/__tests__/examples.ts::contentModule>>
 * BESPOKE<<TEST1, test2, fn3>>
 * SIGNED<<R5LWPEMH43tDiNMcqKfNgngQJ0YszrmFxh1cD1ttFu2+t7MZ94ZJtqJebh2i9iqPze3SpYmzHJWTvdJXk8wTIg==>>
 */

export abstract class MyClass1<T> {

  public property1: string = "MYVAR";

  public async method1<T>(
    var1: string,
    var2: object,
  ): Promise<string[]> {
  }
}

type Ty1<T> = number;

/* BESPOKE START <<TEST1>> */
"DO NOT DELETE"
/* BESPOKE END <<TEST1>> */

interface If1<T> {
}

function function1<T>(
): void {
}

export const variable1: string;

export type Ty2<T, V> = string | null;

export async function function2<T, V>(
): Promise<string> {
}

export interface If3 {
  test: null | string;
  test2: If2;
}

const variable2: string | undefined = "TEST";

let variable3: number | null | undefined = 1;

/* BESPOKE START <<test2>> */
/* BESPOKE END <<test2>> */

export async function function3(
  var1: string,
  var2: object,
): Promise<string[]> {
  /* BESPOKE START <<fn3>> */
  /* BESPOKE END <<fn3>> */
}

export interface If2<T, V> {
  item: string;
}

export type Ty3 = Ty2 | Ty1;
