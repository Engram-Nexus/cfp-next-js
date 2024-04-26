import { create } from "zustand";

interface IVisitorData {
  visitorData: any;
  setVisitorData: (data: any) => void;
}
export const useVisitorStore = create<IVisitorData>((set) => ({
  visitorData: undefined,
  setVisitorData: (data: any) =>
    set({
      visitorData: data,
    }),
}));
