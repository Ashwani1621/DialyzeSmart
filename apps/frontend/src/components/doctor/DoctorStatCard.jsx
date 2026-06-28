import { Card, CardContent } from "@/components/ui/card";

export default function DoctorStatCard({
  title,
  value,
  icon: Icon,
  color = "bg-blue-600",
}) {
  return (
    <Card className="shadow-md hover:shadow-xl transition-all">
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <p className="text-sm text-slate-500">{title}</p>

          <h2 className="mt-2 text-3xl font-bold">{value}</h2>
        </div>

        <div
          className={`${color} h-16 w-16 rounded-xl flex items-center justify-center`}
        >
          <Icon className="text-white" size={30} />
        </div>
      </CardContent>
    </Card>
  );
}