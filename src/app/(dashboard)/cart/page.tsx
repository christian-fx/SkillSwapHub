'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { CreditCard, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { MarketplaceItem } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

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


export default function CartPage() {
  const [cart, setCart] = usePersistentState<(MarketplaceItem & { quantity: number })[]>('cart', []);
  const { toast } = useToast();

  const handleRemoveFromCart = (itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
    toast({
        title: "Item Removed",
        description: "The item has been removed from your cart."
    })
  };

  const handleQuantityChange = (itemId: string, quantity: number) => {
    if (quantity < 1) {
        handleRemoveFromCart(itemId);
        return;
    }
    setCart(prevCart => prevCart.map(item => item.id === itemId ? { ...item, quantity } : item));
  };
  
  // This is a workaround to sync the cart between marketplace and cart page
  useEffect(() => {
    const enrichedCart = cart.map(item => item.quantity ? item : {...item, quantity: 1});
    if (JSON.stringify(enrichedCart) !== JSON.stringify(cart)) {
        setCart(enrichedCart);
    }
  }, [cart, setCart]);

  const subtotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.price * (item.quantity || 1), 0);
  }, [cart]);

  const tax = subtotal * 0.07; // 7% tax
  const total = subtotal + tax;

  const handleCheckout = (e: React.FormEvent) => {
      e.preventDefault();
      toast({
          title: "Purchase Complete!",
          description: "Thank you for your order. Your items will be delivered shortly."
      });
      setCart([]);
  }

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <h1 className="text-2xl font-bold tracking-tight font-headline mb-6">Shopping Cart</h1>
        {cart.length > 0 ? (
          <div className="space-y-4">
            {cart.map(item => (
              <Card key={item.id} className="flex items-center p-4">
                <div className="relative h-20 w-20 rounded-md overflow-hidden mr-4">
                    <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">by {item.author}</p>
                  <p className="text-sm font-semibold mt-1">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                    <Input
                        type="number"
                        min="1"
                        value={item.quantity || 1}
                        onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                        className="w-16 h-9"
                    />
                  <Button variant="ghost" size="icon" onClick={() => handleRemoveFromCart(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border rounded-lg bg-card">
            <h2 className="text-xl font-semibold">Your cart is empty</h2>
            <p className="text-muted-foreground mt-2">Looks like you haven't added anything to your cart yet.</p>
          </div>
        )}
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (7%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </CardContent>
          <CardFooter>
            {/* This is a mock checkout form */}
            <form className="w-full space-y-4" onSubmit={handleCheckout}>
                 <div>
                    <Label htmlFor="card-number">Card Number</Label>
                    <div className="relative">
                        <Input id="card-number" placeholder="0000 0000 0000 0000" required />
                        <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="expiry-date">Expiry</Label>
                        <Input id="expiry-date" placeholder="MM/YY" required />
                    </div>
                     <div>
                        <Label htmlFor="cvc">CVC</Label>
                        <Input id="cvc" placeholder="123" required />
                    </div>
                </div>
                <Button type="submit" className="w-full" disabled={cart.length === 0}>
                    Checkout
                </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
