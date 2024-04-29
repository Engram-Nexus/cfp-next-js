

import { create } from "zustand";

interface IClientData {
  clientData: any;
  setClientData: (data: any) => void;
}
export const useClientStore = create<IClientData>((set) => ({
    clientData: undefined,
  setClientData: (data: any) =>
    set({
        clientData: data,
    }),
}));
