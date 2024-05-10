"use client";

import { useEffect } from "react";
import { useClientStore } from "./useClientStore";
import { useVisitorStore } from "./useVisitorStore";

const ZustandStore = ({
  visitorData,
  clientData,
}: {
  visitorData: any;
  clientData: any;
}) => {
  const setVisitorData = useVisitorStore((state) => state.setVisitorData);
  const setClientData = useClientStore((state) => state.setClientData);

  useEffect(() => {
    setVisitorData(visitorData);
  }, [setVisitorData, visitorData]);

  useEffect(() => {
    setClientData(clientData);
  }, [clientData, setClientData]);

  return <></>;
};
export default ZustandStore;
