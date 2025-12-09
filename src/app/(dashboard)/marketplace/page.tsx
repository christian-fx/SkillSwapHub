
'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { marketplaceItems } from '@/lib/data';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ITEMS_PER_PAGE = 8;

export default function MarketplacePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<'default' | 'price-asc' | 'price-desc'>('default');

  const sortedItems = useMemo(() => {
    let items = [...marketplaceItems];
    if (sortOrder === 'price-asc') {
      items.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'price-desc') {
      items.sort((a, b) => b.price - a.price);
    }
    return items;
  }, [sortOrder]);

  const totalPages = Math.ceil(sortedItems.length / ITEMS_PER_PAGE);
  const paginatedItems = sortedItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-headline">Marketplace</h1>
          <p className="text-muted-foreground">Browse and purchase resources from community experts.</p>
        </div>
        <div className="w-full sm:w-auto sm:min-w-[180px]">
          <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {paginatedItems.map((item) => (
          <Card key={item.id} className="flex flex-col overflow-hidden">
            <CardHeader className="p-0">
              <div className="aspect-video relative">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover"
                  data-ai-hint={item.imageHint}
                />
              </div>
            </CardHeader>
            <CardContent className="flex-grow p-4">
              <Badge variant="secondary" className="mb-2">{item.type}</Badge>
              <h3 className="text-lg font-semibold leading-tight">{item.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">by {item.author}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between items-center">
              <p className="text-xl font-bold">${item.price.toFixed(2)}</p>
              <Button>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Buy Now
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

       {totalPages > 1 && (
            <div className="flex items-center justify-center pt-8">
                <div className="flex items-center gap-2">
                    <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    <div className="flex items-center gap-1 text-sm">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <Button 
                                key={page}
                                variant={currentPage === page ? "default" : "ghost"}
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handlePageChange(page)}
                            >
                                {page}
                            </Button>
                        ))}
                    </div>
                    <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </Button>
                </div>
            </div>
        )}
    </div>
  );
}
