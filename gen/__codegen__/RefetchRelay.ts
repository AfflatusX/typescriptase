/**
 * This file is partially generated; only edit bespoke sections.
 *
 * SOURCE<<gen/views.ts::refetchRelayView>>
 * BESPOKE<<imports, state, render, implementation, relay>>
 * SIGNED<<DZ8CPgf3qSD63BC2iN5dsrRjhk5HAOowDYR0i6Ivqzo7RohXbxWzN79ZnfxDN81SzhfiIP7kLPWETzo06J5MVA==>>
 */

import * as React from "react";
import {
  polyfill,
} from "react-lifecycles-compat";
import {
  commitMutation,
  createRefetchContainer,
  graphql,
} from "react-relay";

/* BESPOKE START <<imports>> */
/* BESPOKE END <<imports>> */

export interface IRefetchRelayProps {
  test1: string;
}

export interface IRefetchRelayState {
  test2?: string;
}

class __RefetchRelay extends React.Component<IRefetchRelayProps, IRefetchRelayState> {

  public constructor(
    props: IRefetchRelayProps,
  ) {
    super(props);
    this.state = {
      /* BESPOKE START <<state>> */
      /* BESPOKE END <<state>> */
    };
  }

  public render(
  ): JSX.Element {
    /* BESPOKE START <<render>> */
    /* BESPOKE END <<render>> */
  }

  /* BESPOKE START <<implementation>> */
  /* BESPOKE END <<implementation>> */
}

const _RefetchRelay: React.ComponentType = createRefetchContainer(
  __RefetchRelay,
  /* BESPOKE START <<relay>> */
  /* BESPOKE END <<relay>> */
);

polyfill(_RefetchRelay);
export const RefetchRelay: React.Component<IRefetchRelayProps, IRefetchRelayState> = _RefetchRelay;
