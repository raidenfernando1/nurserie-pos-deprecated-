interface StatusTypes {
  stock: number;
  threshold: number;
}

const StatusBadge = ({ stock, threshold }: StatusTypes) => {
  if (stock === 0) {
    return (
      <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
        Out of Stock
      </span>
    );
  }
  if (stock <= threshold) {
    return (
      <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-orange-800">
        Low Stock
      </span>
    );
  }
  return (
    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
      In Stock
    </span>
  );
};

export default StatusBadge;
