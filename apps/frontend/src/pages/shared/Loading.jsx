function Loading({ label = "Loading..." }) {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
      <p className="text-slate-500">{label}</p>
    </div>
  );
}

export default Loading;
