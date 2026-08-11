export interface JaniBridge {
  getMemory: () => Promise<Record<string, any>>;
  setMemory: (key: string, value: any) => Promise<boolean>;
}

declare global {
  interface Window {
    janiBridge?: JaniBridge;
  }
}

export {};
