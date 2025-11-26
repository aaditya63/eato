import Link from "next/link";
import { ChevronRight, Ham, Pizza } from "lucide-react";

// This is the new part you requested
export default function CategorySection() {
  const categories = [
    {
      id: 8,
      name: "Pizza",
      image: "./assets/pizzacat.png",
      count: "24 Varieties",
      icon: <Pizza className="w-6 h-6" />,
    },
    {
      id: 9,
      name: "Burger",
      image: "./assets/burgercat.png",
      count: "18 Delicious Options",
      icon: <Ham className="w-6 h-6" />,
    },
  ];

  return (
    <section className="w-full pt-8 pb-4 bg-bgxbase">
      {/* Header matches your theme */}
      <div className="flex justify-between items-end px-4 sm:px-8 mb-6">
        <div className="w-full flex justify-center">
          <p className="text-2xl text-btnxprimary sm:text-3xl font-extrabold">
            Browse by Category
          </p>
        </div>
      </div>

      <div className="px-4 sm:px-8 grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
        {categories.map((cat) => (
          <div key={cat.id}>
            <Link href={`/menu?q=${cat.id}`}>
              <div className="group relative h-40 sm:h-48 rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 isolate transform-gpu">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
                </div>

                {/* Content */}
                <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-center items-start">
                  <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl mb-3 text-white border border-white/30 group-hover:bg-textxsecondary group-hover:border-textxmuted transition-colors duration-300">
                    {cat.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-bgxbase mb-1 group-hover:translate-x-2 transition-transform duration-300">
                    {cat.name}
                  </h3>
                  <p className="text-gray-300 text-sm font-medium">
                    {cat.count}
                  </p>
                </div>

                {/* Hover Arrow */}
                <div className="absolute bottom-6 right-6 opacity-0 transform translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 delay-75">
                  <div className="bg-white text-textxsecondary p-2 rounded-full shadow-lg">
                    <ChevronRight size={20} />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
