
'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { marketplaceItems, users as allUsers } from '@/lib/data';
import type { MarketplaceItem } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Check, BadgeCheck, XCircle, Eye } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

const ITEMS_PER_PAGE = 8;
const userMap = new Map(allUsers.map(u => [u.name, u]));

const getAuthorByName = (name: string) => {
  return userMap.get(name);
}

// Custom hook for persisting state to localStorage
function usePersistentState<T>(key: string, initialState: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialState;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialState;
    } catch (error) {
      console.error(error);
      return initialState;
    }
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, JSON.stringify(state));
    }
  }, [key, state]);

  return [state, setState];
}


import { useFirestore } from '@/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function MarketplacePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<'default' | 'price-asc' | 'price-desc'>('default');
  const [cart, setCart] = usePersistentState<MarketplaceItem[]>('cart', []);
  const { toast } = useToast();
  const firestore = useFirestore();

  const [realItems, setRealItems] = useState<MarketplaceItem[] | null>(null);
  const [loadingItems, setLoadingItems] = useState(true);

  useEffect(() => {
    const fetchRealItems = async () => {
      setLoadingItems(true);
      try {
        const itemsCol = collection(firestore, 'marketplace');
        const itemSnapshot = await getDocs(itemsCol);

        if (!itemSnapshot.empty) {
          const itemsData = itemSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              title: data.title || 'Untitled',
              author: data.author || 'Anonymous',
              price: data.price || 0,
              type: data.type || 'Course',
              imageUrl: data.imageUrl || `https://via.placeholder.com/400x200?text=${encodeURIComponent(data.title || 'Item')}`,
              imageHint: data.imageHint,
              preview: data.preview || '',
              isSoldOut: data.isSoldOut || false,
              rating: data.rating || 0,
              reviews: data.reviews || 0,
            } as MarketplaceItem;
          });
          setRealItems(itemsData);
        } else {
          setRealItems(null); // Force fallback to demo
        }
      } catch (error) {
        console.error("Failed to fetch real marketplace items:", error);
        setRealItems(null);
      } finally {
        setLoadingItems(false);
      }
    };

    fetchRealItems();
  }, [firestore]);

  const handleAddToCart = (item: MarketplaceItem) => {
    if (cart.find(cartItem => cartItem.id === item.id)) {
      toast({
        title: "Already in Cart",
        description: `${item.title} is already in your cart.`,
      });
      return;
    }
    setCart(prevCart => [...prevCart, item]);
    toast({
      title: "Added to Cart",
      description: `${item.title} has been added to your cart.`,
    });
  };

  const isItemInCart = (itemId: string) => {
    return cart.some(item => item.id === itemId);
  };

  const activeDataset = useMemo(() => {
    return realItems && realItems.length > 0 ? realItems : marketplaceItems;
  }, [realItems]);

  const sortedItems = useMemo(() => {
    let items = [...activeDataset];
    if (sortOrder === 'price-asc') {
      items.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'price-desc') {
      items.sort((a, b) => b.price - a.price);
    }
    return items;
  }, [sortOrder, activeDataset]);

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

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString('en-NG')}`;
  }


  return (
    <>
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
          {paginatedItems.map((item) => {
            const author = getAuthorByName(item.author);
            const isSoldOut = item.isSoldOut;
            const itemInCart = isItemInCart(item.id);
            return (
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
                    {isSoldOut && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Badge variant="destructive" className="text-sm">Sold Out</Badge>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-grow p-4">
                  <Badge variant="secondary" className="mb-2">{item.type}</Badge>
                  <h3 className="text-lg font-semibold leading-tight">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                    by {item.author}
                    {author?.isVerified && <BadgeCheck className="h-4 w-4 text-primary" />}
                  </p>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between items-center">
                  <p className="text-xl font-bold">{formatPrice(item.price)}</p>
                  <div className="flex items-center gap-1">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Preview: {item.title}</DialogTitle>
                          <DialogDescription>
                            Here's a sneak peek of the content.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="prose prose-sm dark:prose-invert max-h-80 overflow-y-auto rounded-md border p-4">
                          <p>{item.preview || "No preview available for this item."}</p>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button onClick={() => handleAddToCart(item)} disabled={itemInCart || isSoldOut}>
                      {isSoldOut ? (
                        <XCircle className="mr-2 h-4 w-4" />
                      ) : itemInCart ? (
                        <Check className="mr-2 h-4 w-4" />
                      ) : (
                        <ShoppingCart className="mr-2 h-4 w-4" />
                      )}
                      {isSoldOut ? 'Sold Out' : itemInCart ? 'Added' : 'Add to Cart'}
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            )
          })}
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

      <div className="fixed bottom-6 right-6 z-50">
        <Link href="/cart">
          <Button size="lg" className="rounded-full shadow-lg h-16 w-16 flex items-center justify-center relative">
            <ShoppingCart className="h-6 w-6" />
            <span className="sr-only">Cart</span>
            {cart.length > 0 && (
              <Badge variant="destructive" className="absolute -top-1 -right-1 h-6 w-6 justify-center rounded-full p-0 text-xs">
                {cart.reduce((total, item) => total + (item.quantity || 1), 0)}
              </Badge>
            )}
          </Button>
        </Link>
      </div>
    </>
  );
}
