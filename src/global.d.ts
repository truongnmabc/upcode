// global.d.ts
interface GoogleAccounts {
  id: {
    renderButton: (
      element: HTMLElement | null,
      options: {
        theme?: string;
        size?: string;
        text?: string;
        logo_alignment?: string;
        width?: number;
      }
    ) => void;
  };
}

interface Window {
  google?: {
    accounts: GoogleAccounts;
  };
}
