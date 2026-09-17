export default function Loading({ fullscreen = false }) {
  const cls = fullscreen
    ? "fixed inset-0 bg-white flex items-center justify-center z-50"
    : "flex items-center justify-center py-16";
  return (
    <div className={cls}>
      <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  );
}
