import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ProductData } from "@/types/product";
import { Loader2, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ProductListProps {
  products: ProductData[];
  onRefreshProduct: (productId: string) => void;
  onDeleteProduct: (productId: string) => void;
  loading: { [key: string]: boolean };
}

export function ProductList({ products, onRefreshProduct, onDeleteProduct, loading }: ProductListProps) {
  console.log("ProductList rerenders");
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Image</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
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
              <div className="flex space-x-2 flex-col md:flex-row">
                <Button
                  onClick={() => onRefreshProduct(product.url)}
                  variant="outline"
                  size="sm"
                  disabled={loading[product.url]}
                >
                  {loading[product.url] ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
                </Button>
                <Button
                  onClick={() => onDeleteProduct(product.url)}
                  variant="destructive"
                  size="sm"
                  disabled={loading[product.url]}
                >
                  {loading[product.url] ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
                </Button>
                <a
                  href={decodeURIComponent(product.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span className="sr-only">External Link</span>
                </a>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
