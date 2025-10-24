interface StatusTypes {
  stock: number;
  threshold: number;
}

const StatusBadge = ({ stock, threshold }: StatusTypes) => {
  const getStatusConfig = () => {
    if (stock === 0) {
      return {
        label: "Out of Stock",
        className: "bg-red-50 border-red-300 text-red-700",
        dotColor: "bg-red-500",
        dotShadow: "shadow-red-500/50",
      };
    }
    if (stock <= threshold) {
      return {
        label: "Low Stock",
        className: "bg-amber-50 border-amber-300 text-amber-700",
        dotColor: "bg-amber-500",
        dotShadow: "shadow-amber-500/50",
      };
    }
    return {
      label: "In Stock",
      className: "bg-emerald-50 border-emerald-300 text-emerald-700",
      dotColor: "bg-emerald-500",
      dotShadow: "shadow-emerald-500/50",
    };
  };

  const status = getStatusConfig();

  return (
    <span
      className={`
        inline-flex items-center justify-center gap-1.5
        w-[150px]
        px-2.5 py-1.5
        rounded-md
        text-xs font-semibold
        border-2
        ${status.className}
        transition-colors duration-200
      `}
      role="status"
      aria-label={`Stock status: ${status.label}`}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${status.dotColor}`}
          aria-hidden="true"
        />
        <span
          className={`relative inline-flex rounded-full h-1.5 w-1.5 ${status.dotColor} ${status.dotShadow} shadow-lg`}
          aria-hidden="true"
        />
      </span>
      {status.label}
    </span>
  );
};

export default StatusBadge;
