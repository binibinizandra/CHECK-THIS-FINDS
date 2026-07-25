"use client";
import { useEffect, useRef, useState } from "react";
import WidgetDashboard from "@/components/dashboard/WidgetDashboard";
import { fetchLiveDashboard } from "@/lib/dashboard/actions";
import type { LiveDashboardData } from "@/lib/dashboard/store";
import type { TikTokConnection } from "@/lib/tiktok/store";

export default function LiveDashboard({
  initial,
  tiktokConnection,
}: {
  initial: LiveDashboardData;
  tiktokConnection: TikTokConnection | null;
}) {
  const [data, setData] = useState(initial);
  const inFlight = useRef(false);

  useEffect(() => {
    const id = setInterval(async () => {
      if (inFlight.current) return;
      inFlight.current = true;
      try {
        const fresh = await fetchLiveDashboard();
        if (fresh) setData(fresh);
      } finally {
        inFlight.current = false;
      }
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return <WidgetDashboard agents={data.agents} stats={data.stats} activity={data.activity} tiktokConnection={tiktokConnection} />;
}
