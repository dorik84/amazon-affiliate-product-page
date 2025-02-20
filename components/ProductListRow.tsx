import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import type { ProductData } from "@/types/product";
import { Loader2, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const ProductListRow = React.memo(
  ({
    product,
    onRefreshProduct,
    onDeleteProduct,
    loading,
  }: {
    product: ProductData;
    onRefreshProduct: (url: string) => void;
    onDeleteProduct: (url: string) => void;
    loading: { [key: string]: boolean };
  }) => {
    return (
      <TableRow key={product.url}>
        <TableCell>
          <Link href={`/product/${product.url}`} target="_blank">
            <Image
              src={product.images[0] || "/placeholder.png"}
              alt={product.name}
              width={50}
              height={50}
              className="object-cover rounded"
            />
          </Link>
        </TableCell>
        <TableCell>{product.name}</TableCell>
        <TableCell>{product.description.substring(0, 100)}...</TableCell>
        <TableCell>${product.defaultPrice.toFixed(2)}</TableCell>
        <TableCell>{product.category || "N/A"}</TableCell>
        <TableCell>
          <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
            <Button
              className="w-full md:w-auto"
              onClick={() => onRefreshProduct(product.url)}
              variant="outline"
              size="sm"
              disabled={loading[product.url]}
            >
              {loading[product.url] ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
            </Button>
            <Button
              className="w-full md:w-auto"
              onClick={() => onDeleteProduct(product.url)}
              variant="destructive"
              size="sm"
              disabled={loading[product.url]}
            >
              {loading[product.url] ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
            </Button>
            <a
              className="w-full md:w-auto inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3"
              href={decodeURIComponent(product.url)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="sr-only">External Link</span>
            </a>
          </div>
        </TableCell>
      </TableRow>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.product === nextProps.product &&
      prevProps.loading[prevProps.product.url] === nextProps.loading[nextProps.product.url]
    );
  }
);

ProductListRow.displayName = "ProductListRow";

export default ProductListRow;
