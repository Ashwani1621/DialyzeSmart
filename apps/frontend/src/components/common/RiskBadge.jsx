const STYLES = {
  High: "bg-red-100 text-red-700",
  Medium: "bg-yellow-100 text-yellow-700",
  Low: "bg-green-100 text-green-700",
};

function RiskBadge({ level }) {
  const style = STYLES[level] || "bg-slate-100 text-slate-600";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${style}`}>
      {level || "N/A"}
    </span>
  );
}

export default RiskBadge;
