interface StatusTypes {
  stock: number;
  threshold: number;
}

const StatusBadge = ({ stock, threshold }: StatusTypes) => {
  if (stock === 0) {
    return (
      <span className="max-w-[100px] font-extrabold text-center px-2 py-1 text-xs border bg-red-100 border-red-700 text-red-700">
        OUT OF STOCK
      </span>
    );
  }
  if (stock <= threshold) {
    return (
      <span className="max-w-[100px] font-extrabold text-center px-2 py-1 text-xs bg-yellow-100 border border-orange-700 text-orange-700">
        LOW STOCK
      </span>
    );
  }
  return (
    <span className="max-w-[100px] font-extrabold text-center px-2 py-1 text-xs bg-green-100 border border-green-700 text-green-700">
      IN STOCK
    </span>
  );
};

export default StatusBadge;
