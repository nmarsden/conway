// src/types.d.ts
import React from 'react'

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  namespace React {
    interface ReactElement {
      nodeName: any;
      attributes: any;
      children: any;
    }
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */
