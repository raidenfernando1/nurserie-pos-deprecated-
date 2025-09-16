"use client";

export const Product = [
  {
    id: 1,
    name: "Mushie Baby Carrier Wrap Beige Melange",
    price: 3000.0,
    description: "sample description lorem 10",
    url: "https://nurserie.myshopify.com/cdn/shop/files/37_a934bc81-89a3-4384-839f-22e8e1c348aa.png?v=1725092585&width=493",
  },
  {
    id: 2,
    name: "Mushie Baby Carrier Wrap Blush",
    price: 3000.0,
    description: "sample description lorem 10",
    url: "https://nurserie.myshopify.com/cdn/shop/files/37_a934bc81-89a3-4384-839f-22e8e1c348aa.png?v=1725092585&width=493",
  },
  {
    id: 3,
    name: "Mushie Baby Carrier Wrap Cedar",
    price: 3000.0,
    description: "sample description lorem 10",
    url: "https://nurserie.myshopify.com/cdn/shop/files/37_a934bc81-89a3-4384-839f-22e8e1c348aa.png?v=1725092585&width=493",
  },
  {
    id: 4,
    name: "Mushie Baby Carrier Wrap Gray Melange",
    price: 3000.0,
    description: "sample description lorem 10",
    url: "https://images.pexels.com/photos/33801362/pexels-photo-33801362.jpeg",
  },
  {
    id: 5,
    name: "Mushie Baby Carrier Wrap Mustard Melange",
    price: 3000.0,
    description: "sample description lorem 10",
    url: "https://fbtrading.com/shop/mushie-baby-carrier-2375p.html",
  },
  {
    id: 6,
    name: "Mushie Baby Carrier Wrap Roman Green",
    price: 3000.0,
    description: "sample description lorem 10",
    url: "https://fbtrading.com/shop/mushie-baby-carrier-2370p.html",
  },
  {
    id: 7,
    name: "Mushie Baby Carrier Wrap Tradewinds",
    price: 3000.0,
    description: "sample description lorem 10",
    url: "https://fbtrading.com/shop/mushie-baby-carrier-2371p.html",
  },
  {
    id: 8,
    name: "Mushie Baby Carrier Wrap Ivory",
    price: 3000.0,
    description: "sample description lorem 10",
    url: "https://via.placeholder.com/150?text=Product+8",
  },
  {
    id: 9,
    name: "Mushie Ribbed Baby Beanie Beige Melange",
    price: 800.0,
    description: "sample description lorem 10",
    url: "https://via.placeholder.com/150?text=Product+9",
  },
  {
    id: 10,
    name: "Mushie Ribbed Baby Beanie Blush",
    price: 800.0,
    description: "sample description lorem 10",
    url: "https://fbtrading.com/shop/mushie-ribbed-baby-2311p.html",
  },
];

function ProductCard() {
  return (
    <div className="py-4">
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 
                      md:max-h-[70vh] md:overflow-y-auto"
      >
        {Product.map((data) => (
          <div
            key={data.id}
            className="bg-white border rounded-lg shadow-sm p-1 flex flex-col"
          >
            <button
              onClick={() => alert(`Added ${data.name} to cart`)}
              className="w-full text-center flex flex-col"
            >
              <img
                src={data.url}
                alt={data.name}
                className="w-full h-32 object-cover rounded mb-2"
              />
              <h3 className="text-lg font-semibold">{data.name}</h3>
              <p className="text-base font-bold my-4 text-blue-600">
                ${data.price.toFixed(2)}
              </p>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductCard;
