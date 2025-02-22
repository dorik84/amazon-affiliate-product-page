"use client";

import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProductNotFound() {
  return (
    <div className="flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center shadow-xl">
        <CardHeader className="items-center space-y-4 pb-0">
          <AlertCircle className="h-24 w-24 text-destructive" strokeWidth={1.5} />
          <CardTitle className="text-3xl">Product Not Found</CardTitle>
          <CardDescription className="text-base">
            We couldn&apos;t find the product you were looking for.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <p className="text-muted-foreground">The item may have been removed or is temporarily unavailable.</p>
            <Link href="/" className="block">
              <Button className="w-full">Return to Home Page</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
