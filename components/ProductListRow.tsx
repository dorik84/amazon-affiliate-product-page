"use client";

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
    onRefreshProduct: (id: string) => void;
    onDeleteProduct: (id: string) => void;
    loading: { [key: string]: boolean };
  }) => {

    // Format the date
    const formattedDate = new Date(product.updatedAt).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <TableRow key={product.id}>
        <TableCell>
          <Link href={`/product/${product.id}`} target="_blank">
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
        <TableCell>{formattedDate}</TableCell>
        <TableCell>
          <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
            <Button
              className="w-full md:w-auto min-w-[80px]"
              onClick={() => onRefreshProduct(product.id)}
              variant="outline"
              size="sm"
              disabled={loading[product.id]}
            >
              {loading[product.id] ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
            </Button>
            <Button
              className="w-full md:w-auto min-w-[80px]"
              onClick={() => onDeleteProduct(product.id)}
              variant="destructive"
              size="sm"
              disabled={loading[product.id]}
            >
              {loading[product.id] ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
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
      prevProps.loading[prevProps.product.id] === nextProps.loading[nextProps.product.id]
    );
  }
);

ProductListRow.displayName = "ProductListRow";

export default ProductListRow;
