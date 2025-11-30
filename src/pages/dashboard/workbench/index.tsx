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

/* ------------------------------------------
  SAFE DATE PARSER – FIXES Invalid Date
-------------------------------------------*/
function safeDate(value: any): Date {
  if (!value) return new Date("1970-01-01");

  const d = new Date(value);

  if (!isNaN(d.getTime())) return d;

  // Try forcing ISO format
  return new Date(String(value).replace(" ", "T"));
}
  
/* ------------------------------------------
  MAIN COMPONENT
-------------------------------------------*/
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

  interface User {
  avatar?: string; // fallback avatars have `avatar`
  name: string;
  avatar_url?: string; // supabase users have `avatar_url`
  display_name?: string; // supabase users have `display_name`
}

const [projectUsers, setProjectUsers] = useState<User[]>([]);

  interface Transaction {
  icon: string;
  name: string;
  id: string;
  amount: number;
  time: string;
  status: "up" | "down";
}

const [transactions, setTransactions] = useState<Transaction[]>([]);


  useEffect(() => {
    loadDashboard();
  }, []);

  /* ------------------------------------------
      LOAD DASHBOARD DATA
  -------------------------------------------*/
  const loadDashboard = async () => {
    setLoading(true);

    try {
      const [earningsRes, txMonthlyRes, usersRes, txRes] = await Promise.all([
        supabase.from("transactions").select("amount").eq("status", "success"),
        supabase.from("transactions").select("amount, created_at"),
        supabase.from("profiles").select("avatar_url, display_name").limit(5),
        supabase.from("transactions").select("*").order("created_at", { ascending: false }).limit(10),
      ]);

      const earningsData = earningsRes.data || [];
      const txMonthly = txMonthlyRes.data || [];
      const users = usersRes.data || [];
      const tx = txRes.data || [];

      /* 1️⃣ Total earnings */
      interface TransactionAmount {
  amount?: number;
}

const totalEarnings = (earningsData as TransactionAmount[]).reduce(
  (sum: number, t: TransactionAmount) => sum + (t.amount || 0),
  0
);

     // const totalEarnings = earningsData.reduce((sum, t) => sum + (t.amount || 0), 0);

      /* 2️⃣ Fake analytics */
      const pageViews = 125000;
      const appDownloads = 2067;

      /* 3️⃣ Monthly revenue */
      const monthlySeries = Array(12).fill(0);

      txMonthly.forEach((t: { amount: number; created_at: string }) => {
        const m = safeDate(t.created_at).getMonth(); // FIXED DATE
        monthlySeries[m] += t.amount || 0;
      });


      interface SupabaseUser {
  avatar_url?: string;
  display_name?: string;
}

setProjectUsers(
  (users as SupabaseUser[]).length
    ? (users as SupabaseUser[]).map((u: SupabaseUser) => ({
        avatar: u.avatar_url || avatar1,
        name: u.display_name || "Unknown",
      }))
    : fallbackAvatars
);

      // setProjectUsers(users.length ? users : fallbackAvatars);

      /* 5️⃣ Latest transactions */
      interface Transaction {
  id: string;
  description?: string;
  amount: number;
  created_at: string;
}

setTransactions(
  (tx as Transaction[]).map((t: Transaction) => ({
    icon: "mdi:cash",
    name: t.description || "Transaction",
    id: "#" + t.id,
    amount: t.amount,
    time: safeDate(t.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    status: t.amount >= 0 ? "up" : "down",
  }))
);

      /* 6️⃣ Quick Stats */
     interface QuickStat {
  icon: string;
  label: string;
  value: string;
  color: string;
  chart: number[];
}

const [quickStats, setQuickStats] = useState<QuickStat[]>([
  { icon: "solar:wallet-outline", label: "All Earnings", value: "₦0", color: "#3b82f6", chart: [] },
  { icon: "solar:graph-outline", label: "Page Views", value: "0", color: "#f59e42", chart: [] },
  { icon: "solar:users-group-rounded-outline", label: "Active Users", value: "0", color: "#10b981", chart: [] },
  { icon: "solar:download-outline", label: "Downloads", value: "0", color: "#ef4444", chart: [] },
]);


      /* 7️⃣ Revenue chart config */
      interface MonthlyRevenue {
  series: { name: string; data: number[] }[];
  categories: string[];
  percent: number;
}

const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenue>({
  series: [{ name: "Revenue", data: [] }],
  categories: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
  percent: 0,
});

    } catch (error) {
      console.error("Dashboard Error:", error);
    }

    setLoading(false);
  };

  /* ------------------------------------------
      CHART CONFIG
  -------------------------------------------*/
  const chartOptions: ApexCharts.ApexOptions = useMemo(
  () => ({
    chart: { type: "area" as const, toolbar: { show: false } }, // note the `as const`
    stroke: { curve: "smooth", width: 2 },
    dataLabels: { enabled: false },
    xaxis: { categories: monthlyRevenue.categories },
    yaxis: {
      labels: { formatter: (v: number) => "₦" + v.toLocaleString() },
    },
    tooltip: { y: { formatter: (v: number) => "₦" + v.toLocaleString() } },
    colors: ["#3b82f6"],
  }),
  [monthlyRevenue.categories]
);


  /* ------------------------------------------
      RENDER UI
  -------------------------------------------*/
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

              <Title as="h3" className="text-2xl font-bold">{stat.value}</Title>

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
              <Text variant="body2" className="font-semibold">App Monthly Transaction</Text>
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
