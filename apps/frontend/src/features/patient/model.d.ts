declare module '*.glb' {
  const content: string;
  export default content;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      geometry: any;
      mesh: any;
      primitive: any;
    }
  }
}
