interface Window {
  Mp3LameEncoder: any;
}

declare module '*?worker' {
  const InlineWorker: {
    new(): Worker;
  };

  export default InlineWorker;
}

declare module 'worker-loader!*' {
  const InlineWorker: {
    new(): Worker;
  };

  export default InlineWorker;
}

declare module '*.svg' {
  const id: string;
  export default id;
}
