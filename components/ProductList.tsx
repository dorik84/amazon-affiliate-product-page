import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ProductData } from "@/types/product";

interface ProductListProps {
  products: ProductData[];
  onRefreshProduct: (productId: string) => void;
  onDeleteProduct: (productId: string) => void;
}

export function ProductList({ products, onRefreshProduct, onDeleteProduct }: ProductListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
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
            <TableCell>{product.name}</TableCell>
            <TableCell>{product.description.substring(0, 100)}...</TableCell>
            <TableCell>${product.defaultPrice.toFixed(2)}</TableCell>
            <TableCell>{product.category || "N/A"}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button onClick={() => onRefreshProduct(product.url)} variant="outline" size="sm">
                  Refresh
                </Button>
                <Button onClick={() => onDeleteProduct(product.url)} variant="destructive" size="sm">
                  Delete
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
