import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/supabaseClient";

import avatar1 from "@/assets/images/avatars/avatar-1.png";
import avatar2 from "@/assets/images/avatars/avatar-2.png";
import avatar3 from "@/assets/images/avatars/avatar-3.png";
import avatar4 from "@/assets/images/avatars/avatar-4.png";
import avatar5 from "@/assets/images/avatars/avatar-5.png";

import { Chart, useChart } from "@/components/chart";
import Icon from "@/components/icon/icon";
import { GLOBAL_CONFIG } from "@/global-config";

import { AvatarImage } from "@/ui/avatar";
import { Button } from "@/ui/button";
import { Card, CardContent } from "@/ui/card";
import { Progress } from "@/ui/progress";
import { Text, Title } from "@/ui/typography";

import { rgbAlpha } from "@/utils/theme";
import BannerCard from "./banner-card";

/* ------------------------------------------
   STATIC DATA
-------------------------------------------*/
const projectTasks = [
  { label: "Horizontal Layout", color: "#3b82f6" },
  { label: "Invoice Generator", color: "#f59e42" },
  { label: "Package Upgrades", color: "#fbbf24" },
  { label: "Figma Auto Layout", color: "#10b981" },
];

const fallbackAvatars = [
  { avatar: avatar1, name: "User1" },
  { avatar: avatar2, name: "User2" },
  { avatar: avatar3, name: "User3" },
  { avatar: avatar4, name: "User4" },
  { avatar: avatar5, name: "User5" },
];

export default function Workbench() {
  const [loading, setLoading] = useState(true);

  const [quickStats, setQuickStats] = useState([
    { icon: "solar:wallet-outline", label: "All Earnings", value: "₦0", color: "#3b82f6", chart: [] },
    { icon: "solar:graph-outline", label: "Page Views", value: "0", color: "#f59e42", chart: [] },
    { icon: "solar:users-group-rounded-outline", label: "Active Users", value: "0", color: "#10b981", chart: [] },
    { icon: "solar:download-outline", label: "Downloads", value: "0", color: "#ef4444", chart: [] },
  ]);

  const [monthlyRevenue, setMonthlyRevenue] = useState({
    series: [{ name: "Revenue", data: [] }],
    categories: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    percent: 0,
  });

  const [projectUsers, setProjectUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);

    try {
      // Run everything in parallel
      const [earningsRes, txMonthlyRes, usersRes, txRes] = await Promise.all([
        supabase.from("transactions").select("amount").eq("status", "success"),
        supabase.from("transactions").select("amount, created_at"),
        supabase.from("profiles").select("avatar_url, display_name").limit(5),
        supabase.from("transactions").select("*").order("created_at", { ascending: false }).limit(10),
      ]);

      /* ------------------ CLEANED & OPTIMIZED ------------------ */
      const earningsData = earningsRes.data || [];
      const txMonthly = txMonthlyRes.data || [];
      const users = usersRes.data || [];
      const tx = txRes.data || [];

      /* 1️⃣ Total earnings */
      const totalEarnings = earningsData.reduce(
        (sum, t) => sum + (t.amount || 0),
        0
      );

      /* 2️⃣ Analytics */
      const pageViews = 125000;
      const appDownloads = 2067;

      /* 3️⃣ Monthly revenue */
      const monthlySeries = Array(12).fill(0);
      for (const t of txMonthly) {
        const m = new Date(t.created_at).getMonth();
        monthlySeries[m] += t.amount || 0;
      }

      /* 4️⃣ Recent users */
      setProjectUsers(users.length ? users : fallbackAvatars);

      /* 5️⃣ Latest transactions */
      setTransactions(
        tx.map((t) => ({
          icon: "mdi:cash",
          name: t.description || "Transaction",
          id: "#" + t.id,
          amount: t.amount,
          time: new Date(t.created_at).toLocaleTimeString(),
          status: t.amount >= 0 ? "up" : "down",
        }))
      );

      /* 6️⃣ Quick stats */
      setQuickStats([
        {
          icon: "solar:wallet-outline",
          label: "All Earnings",
          value: "₦" + totalEarnings.toLocaleString(),
          color: "#3b82f6",
          chart: monthlySeries,
        },
        {
          icon: "solar:graph-outline",
          label: "Page Views",
          value: pageViews.toLocaleString(),
          color: "#f59e42",
          chart: [20, 40, 15, 60, 25, 30, 50, 70],
        },
        {
          icon: "solar:users-group-rounded-outline",
          label: "Active Users",
          value: users.length.toString(),
          color: "#10b981",
          chart: [5, 10, 20, 30, 40, 50],
        },
        {
          icon: "solar:download-outline",
          label: "Downloads",
          value: appDownloads.toLocaleString(),
          color: "#ef4444",
          chart: [12, 14, 10, 8, 20, 25, 30, 22],
        },
      ]);

      /* 7️⃣ Revenue chart */
      setMonthlyRevenue({
        series: [{ name: "Revenue", data: monthlySeries }],
        categories: monthlyRevenue.categories,
        percent: 5.44,
      });

    } catch (error) {
      console.error("Dashboard Error:", error);
    }

    setLoading(false);
  };

  const chartOptions = useMemo(
    () => ({
      chart: { type: "area", toolbar: { show: false } },
      stroke: { curve: "smooth", width: 2 },
      dataLabels: { enabled: false },
      xaxis: { categories: monthlyRevenue.categories },
      yaxis: {
        labels: { formatter: (v) => "₦" + v.toLocaleString() },
      },
      tooltip: {
        y: { formatter: (v) => "₦" + v.toLocaleString() },
      },
      colors: ["#3b82f6"],
    }),
    [monthlyRevenue.categories]
  );

  return (
    <div className="flex flex-col gap-4 w-full">
      <BannerCard />

      {/* QUICK STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat) => (
          <Card key={stat.label} className="flex flex-col justify-between h-full">
            <CardContent className="flex flex-col gap-2 p-4">
              <div className="flex items-center gap-2">
                <div className="rounded-lg p-2" style={{ background: rgbAlpha(stat.color, 0.1) }}>
                  <Icon icon={stat.icon} size={24} color={stat.color} />
                </div>
                <Text variant="body2" className="font-semibold">
                  {stat.label}
                </Text>
              </div>

              <Title as="h3" className="text-2xl font-bold">
                {stat.value}
              </Title>

              <div className="w-full h-10 mt-2">
                <Chart
                  type="bar"
                  height={40}
                  options={useChart({
                    chart: { sparkline: { enabled: true } },
                    colors: [stat.color],
                    grid: { show: false },
                    yaxis: { show: false },
                    tooltip: { enabled: false },
                  })}
                  series={[{ data: stat.chart }]}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* MONTHLY REVENUE + PROJECT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Text variant="body2" className="font-semibold">
                App Monthly Transaction
              </Text>
              <span className="flex items-center gap-1 text-green-500 font-bold text-sm">
                <Icon icon="mdi:arrow-up" size={16} />
                {monthlyRevenue.percent}%
              </span>
            </div>

            <Chart type="area" height={220} options={chartOptions} series={monthlyRevenue.series} />
          </CardContent>
        </Card>

        <Card className="flex flex-col gap-4 p-6">
          <Text variant="body2" className="font-semibold mb-2">
            Project - {GLOBAL_CONFIG.appName}
          </Text>

          <div className="flex items-center justify-between mb-2">
            <Text variant="body2">Release v1.1.0</Text>
            <span className="text-xs font-bold text-blue-500">70%</span>
          </div>

          <Progress value={70} />

          <ul className="flex flex-col gap-2 mt-2 mb-4">
            {projectTasks.map((task) => (
              <li key={task.label} className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full" style={{ background: task.color }} />
                <Text variant="body2">{task.label}</Text>
              </li>
            ))}
          </ul>

          <Button className="w-full mt-auto" size="sm">
            <Icon icon="mdi:plus" size={18} /> Upgrade
          </Button>
        </Card>
      </div>
    </div>
  );
}
