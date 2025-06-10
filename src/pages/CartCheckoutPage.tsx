import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Footer from '@/components/layout/Footer';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Trash2, Plus, Minus } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";


const addressSchema = z.object({
  street: z.string().min(5, "Street address is too short"),
  city: z.string().min(2, "City name is too short"),
  state: z.string().min(2, "State is required"),
  zip: z.string().regex(/^\d{5}$/, "Invalid ZIP code"),
  country: z.string().min(2, "Country is required"),
});

const paymentSchema = z.object({
  method: z.enum(["credit-card", "paypal", "cash-on-delivery"]),
  cardNumber: z.string().optional(), // Add more specific validation if "credit-card"
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
});

const checkoutFormSchema = z.object({
  deliveryAddress: addressSchema,
  payment: paymentSchema,
  promoCode: z.string().optional(),
  agreedToTerms: z.boolean().refine(val => val === true, { message: "You must agree to the terms and conditions." }),
});

type CheckoutFormData = z.infer<typeof checkoutFormSchema>;

// Placeholder data
const sampleCartItems = [
  { id: 'm3', name: 'Spaghetti Carbonara', price: 15.99, quantity: 1, imageUrl: 'https://images.unsplash.com/photo-1588013273468-315088ea3426?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c3BhZ2hldHRpJTIwY2FyYm9uYXJhfGVufDB8fDB8fHww&auto=format&fit=crop&w=100&q=60' },
  { id: 'm6', name: 'Tiramisu', price: 7.99, quantity: 2, imageUrl: 'https://images.unsplash.com/photo-1571877275904-68eb265aBEC5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dGlyYW1pc3V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=100&q=60' },
];

const CartCheckoutPage = () => {
  console.log('CartCheckoutPage loaded');
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState(sampleCartItems);
  const [currentStep, setCurrentStep] = useState(1); // 1: Cart Review, 2: Checkout Details

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      deliveryAddress: { street: '', city: '', state: '', zip: '', country: 'USA' },
      payment: { method: "credit-card" },
      agreedToTerms: false,
    },
  });

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxRate = 0.08; // 8%
  const tax = subtotal * taxRate;
  const deliveryFee = subtotal > 0 ? 5.00 : 0;
  const total = subtotal + tax + deliveryFee;

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCartItems(prev => prev.filter(item => item.id !== itemId));
    } else {
      setCartItems(prev => prev.map(item => item.id === itemId ? { ...item, quantity: newQuantity } : item));
    }
  };

  const removeItem = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
    toast({ title: "Item Removed", description: "The item has been removed from your cart." });
  };

  const onSubmit = (data: CheckoutFormData) => {
    console.log('Checkout submitted:', data);
    toast({
      title: "Order Placed!",
      description: "Your order has been successfully placed. Redirecting to orders page...",
    });
    // Simulate API call and redirect
    setTimeout(() => {
      navigate('/order-page'); // Navigate to order tracking page
    }, 2000);
  };

  return (
    <div className="flex flex-col min-h-screen">
       <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <NavigationMenu className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuLink href="/" className="font-bold text-xl">FoodFleet</NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold tracking-tight mb-8">
          {currentStep === 1 ? "Review Your Cart" : "Checkout"}
        </h1>

        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Shopping Cart</CardTitle>
              {cartItems.length === 0 && <CardDescription>Your cart is empty. Add some delicious food!</CardDescription>}
            </CardHeader>
            {cartItems.length > 0 && (
              <>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px] hidden md:table-cell">Image</TableHead>
                        <TableHead>Item</TableHead>
                        <TableHead className="text-center">Quantity</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="text-center">Remove</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cartItems.map(item => (
                        <TableRow key={item.id}>
                          <TableCell className="hidden md:table-cell">
                            <img src={item.imageUrl || 'https://via.placeholder.com/64'} alt={item.name} className="w-16 h-16 object-cover rounded" />
                          </TableCell>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-2">
                                <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <=1}>
                                    <Minus className="h-4 w-4"/>
                                </Button>
                                <span>{item.quantity}</span>
                                <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                    <Plus className="h-4 w-4"/>
                                </Button>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                          <TableCell className="text-right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                          <TableCell className="text-center">
                            <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                              <Trash2 className="h-5 w-5 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter className="flex flex-col items-end space-y-2 pt-4">
                  <div className="text-lg">Subtotal: <span className="font-semibold">${subtotal.toFixed(2)}</span></div>
                  <div className="text-sm text-muted-foreground">Taxes ({(taxRate*100).toFixed(0)}%): ${tax.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">Delivery Fee: ${deliveryFee.toFixed(2)}</div>
                  <div className="text-xl font-bold">Total: ${total.toFixed(2)}</div>
                  <Button size="lg" className="mt-4" onClick={() => setCurrentStep(2)} disabled={cartItems.length === 0}>
                    Proceed to Checkout
                  </Button>
                </CardFooter>
              </>
            )}
             {cartItems.length === 0 && (
                <CardFooter>
                    <Button onClick={() => navigate('/')}>Continue Shopping</Button>
                </CardFooter>
             )}
          </Card>
        )}

        {currentStep === 2 && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader><CardTitle>Delivery Address</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <FormField control={form.control} name="deliveryAddress.street" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address</FormLabel>
                        <FormControl><Input placeholder="123 Main St" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={form.control} name="deliveryAddress.city" render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl><Input placeholder="Anytown" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="deliveryAddress.state" render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl><Input placeholder="CA" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={form.control} name="deliveryAddress.zip" render={({ field }) => (
                        <FormItem>
                          <FormLabel>ZIP Code</FormLabel>
                          <FormControl><Input placeholder="90210" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="deliveryAddress.country" render={({ field }) => (
                         <FormItem>
                            <FormLabel>Country</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="USA">United States</SelectItem>
                                    <SelectItem value="Canada">Canada</SelectItem>
                                    <SelectItem value="UK">United Kingdom</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-8">
                    <Card>
                        <CardHeader><CardTitle>Payment Method</CardTitle></CardHeader>
                        <CardContent>
                        <FormField control={form.control} name="payment.method" render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormControl>
                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl><RadioGroupItem value="credit-card" /></FormControl>
                                    <FormLabel className="font-normal">Credit Card</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl><RadioGroupItem value="paypal" /></FormControl>
                                    <FormLabel className="font-normal">PayPal</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl><RadioGroupItem value="cash-on-delivery" /></FormControl>
                                    <FormLabel className="font-normal">Cash on Delivery</FormLabel>
                                    </FormItem>
                                </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        {/* Conditional fields for credit card would go here */}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Promo Code</CardTitle></CardHeader>
                        <CardContent>
                        <FormField control={form.control} name="promoCode" render={({ field }) => (
                            <FormItem>
                                <FormControl><Input placeholder="Enter promo code" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        </CardContent>
                    </Card>
                </div>
              </div>
              
              <Separator />

              <Card>
                <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                    <div className="flex justify-between"><span>Subtotal:</span> <span>${subtotal.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span>Tax ({(taxRate*100).toFixed(0)}%):</span> <span>${tax.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span>Delivery Fee:</span> <span>${deliveryFee.toFixed(2)}</span></div>
                    <Separator />
                    <div className="flex justify-between font-bold text-xl"><span>Total:</span> <span>${total.toFixed(2)}</span></div>
                </CardContent>
              </Card>

              <FormField control={form.control} name="agreedToTerms" render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                  <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Agree to terms and conditions</FormLabel>
                    <FormDescription>You agree to our Terms of Service and Privacy Policy.</FormDescription>
                    <FormMessage />
                  </div>
                </FormItem>
              )} />
              
              <div className="flex justify-between items-center">
                <Button type="button" variant="outline" onClick={() => setCurrentStep(1)}>Back to Cart</Button>
                <Button type="submit" size="lg" disabled={form.formState.isSubmitting || cartItems.length === 0}>
                  {form.formState.isSubmitting ? "Placing Order..." : `Place Order (\$${total.toFixed(2)})`}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CartCheckoutPage;