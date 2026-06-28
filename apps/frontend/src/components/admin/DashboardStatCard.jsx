import { Card, CardContent } from "@/components/ui/card";

export default function DashboardStatCard({
  title,
  value,
  icon: Icon,
  color = "bg-blue-500",
}) {
  return (
    <Card className="shadow-md hover:shadow-xl transition-all duration-300 border-0">
      <CardContent className="p-6 flex justify-between items-center">

        <div>
          <p className="text-slate-500 text-sm">{title}</p>

          <h2 className="text-4xl font-bold mt-2">
            {value}
          </h2>
        </div>

        <div
          className={`${color} h-16 w-16 rounded-2xl flex items-center justify-center shadow-lg`}
        >
          <Icon className="text-white" size={32} />
        </div>

      </CardContent>
    </Card>
  );
}