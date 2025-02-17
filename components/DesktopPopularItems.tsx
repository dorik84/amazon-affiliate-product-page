import { ProductData } from "@/types/product";
import { FilmStrip } from "./FilmStrip";

export const DesktopPopularItems = ({ items }: { items: ProductData[] }) => (
  <div className="flex flex-row gap-4 w-full">
    {Array.from({ length: 5 }, (_, i) => (
      <FilmStrip
        key={i}
        items={items?.slice(i * 2, (i + 1) * 2).concat(items?.slice(0, i * 2))} //creating a rotating or cyclic view of popular items
      />
    ))}
  </div>
);
