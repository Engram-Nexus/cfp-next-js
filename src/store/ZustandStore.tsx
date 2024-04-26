"use client";

import { useEffect } from "react";
import { useVisitorStore } from "./useVisitorStore";

const ZustandStore = ({ data }: { data: any }) => {
  const setVisitorData = useVisitorStore((state) => state.setVisitorData);

  useEffect(() => {
    setVisitorData(data);
  }, [data, setVisitorData]);

  return <></>;
};
export default ZustandStore;
