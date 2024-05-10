"use client";
import Authorize from "@/components/Authorize";
import { decrypt } from "@/lib/jwt";
import { useEffect, useState } from "react";
import Slides from "./_component/Slides";

export const runtime = "edge";

const GoogleSlidesChat = ({
  searchParams: { token },
}: {
  searchParams: { token: string };
}) => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!token) return;
    const decode = async () => {
      const url = token;
      const decodedData = await decrypt(url);
      setData(decodedData);
    };
    decode();
  }, [token]);

  return <>{!token ? <Authorize /> : <Slides data={data} />}</>;
};

export default GoogleSlidesChat;
