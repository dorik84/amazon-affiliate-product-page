import { ProductData } from "@/types/product";
import { FilmStrip } from "./FilmStrip";

const CARDS_IN_STRIP = 3;

export const DesktopPopularItems = ({ items }: { items: ProductData[] }) => {
  const stripsCount = Math.floor(items.length / CARDS_IN_STRIP) % 5;
  return (
    <div className="flex flex-row justify-center gap-4 w-full">
      {Array.from({ length: stripsCount }, (_, i) => (
        <FilmStrip
          key={i}
          items={items
            ?.slice(i * CARDS_IN_STRIP, (i + 1) * CARDS_IN_STRIP)
            .concat(items?.slice(i * CARDS_IN_STRIP, (i + 1) * CARDS_IN_STRIP))} //creating a rotating or cyclic view of popular items
        />
      ))}
    </div>
  );
};
