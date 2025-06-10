import React from 'react';
import { useNavigate } from 'react-router-dom';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Footer from '@/components/layout/Footer';
import OrderStatusIndicator, { OrderStatus } from '@/components/OrderStatusIndicator'; // Ensure correct import path
import { Package, History, ShoppingBag } from 'lucide-react';

// Placeholder data
const sampleActiveOrders = [
  { 
    id: 'order123', 
    restaurantName: 'Pasta Paradise', 
    status: 'PREPARING' as OrderStatus, 
    estimatedDelivery: '4:30 PM', 
    total: 23.98,
    items: [
      { name: 'Spaghetti Carbonara', quantity: 1, price: 15.99 },
      { name: 'Tiramisu', quantity: 1, price: 7.99 },
    ]
  },
  { 
    id: 'order456', 
    restaurantName: 'Taco Town', 
    status: 'OUT_FOR_DELIVERY' as OrderStatus, 
    estimatedDelivery: '4:15 PM', 
    total: 18.50,
    items: [
      { name: 'Chicken Tacos (3)', quantity: 1, price: 12.50 },
      { name: 'Guacamole & Chips', quantity: 1, price: 6.00 },
    ]
  },
];

const samplePastOrders = [
  { id: 'order789', restaurantName: 'Curry Corner', date: '2024-07-15', total: 35.75, status: 'DELIVERED' as OrderStatus, items: [{ name: 'Chicken Tikka Masala', quantity: 1 }, { name: 'Naan Bread', quantity: 2 }] },
  { id: 'orderABC', restaurantName: 'Wok Wonders', date: '2024-07-10', total: 22.00, status: 'CANCELLED' as OrderStatus, items: [{ name: 'Kung Pao Chicken', quantity: 1 }] },
];

const OrderPage = () => {
  console.log('OrderPage loaded');
  const navigate = useNavigate();

  const handleReorder = (orderId: string) => {
    console.log('Reordering order:', orderId);
    // Logic to add past order items to cart and navigate to cart
    navigate('/cart-checkout'); 
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
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuLink href="/cart-checkout" className="text-sm font-medium">Cart</NavigationMenuLink>
                </NavigationMenuItem>
                 <NavigationMenuItem className="ml-4">
                    <NavigationMenuLink href="/profile" className="text-sm font-medium">Profile</NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold tracking-tight mb-8">Your Orders</h1>
        
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active"><Package className="mr-2 h-4 w-4" />Active Orders</TabsTrigger>
            <TabsTrigger value="past"><History className="mr-2 h-4 w-4" />Past Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-6">
            {sampleActiveOrders.length > 0 ? (
              <div className="space-y-6">
                {sampleActiveOrders.map(order => (
                  <Card key={order.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">Order #{order.id.slice(-6).toUpperCase()}</CardTitle>
                          <CardDescription>From: {order.restaurantName}</CardDescription>
                        </div>
                        <OrderStatusIndicator status={order.status} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-1">Estimated Delivery: <span className="font-medium text-foreground">{order.estimatedDelivery}</span></p>
                      <p className="text-lg font-semibold">Total: ${order.total.toFixed(2)}</p>
                      <Accordion type="single" collapsible className="w-full mt-2">
                        <AccordionItem value="items">
                          <AccordionTrigger className="text-sm">View Items ({order.items.length})</AccordionTrigger>
                          <AccordionContent>
                            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                              {order.items.map(item => (
                                <li key={item.name}>{item.name} (x{item.quantity}) - ${item.price?.toFixed(2) || 'N/A'}</li>
                              ))}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </CardContent>
                    <CardFooter>
                        <Button variant="outline" className="w-full" onClick={() => console.log('Track order:', order.id)}>Track Order Details</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardHeader>
                  <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
                  <CardTitle>No Active Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>You don't have any orders currently in progress. Why not treat yourself?</CardDescription>
                </CardContent>
                <CardFooter className="justify-center">
                  <Button onClick={() => navigate('/')}>Browse Restaurants</Button>
                </CardFooter>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="past" className="mt-6">
            {samplePastOrders.length > 0 ? (
              <Card>
                <CardHeader>
                    <CardTitle>Order History</CardTitle>
                    <CardDescription>Review your previous orders.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Restaurant</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {samplePastOrders.map(order => (
                        <TableRow key={order.id}>
                            <TableCell className="font-medium">#{order.id.slice(-6).toUpperCase()}</TableCell>
                            <TableCell>{order.restaurantName}</TableCell>
                            <TableCell>{order.date}</TableCell>
                            <TableCell><OrderStatusIndicator status={order.status} /></TableCell>
                            <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                            <TableCell className="text-center space-x-2">
                                <Button variant="outline" size="sm" onClick={() => console.log('View details for order:', order.id)}>Details</Button>
                                {order.status === 'DELIVERED' && <Button variant="secondary" size="sm" onClick={() => handleReorder(order.id)}>Reorder</Button>}
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </CardContent>
              </Card>
            ) : (
              <Card className="text-center py-12">
                <CardHeader>
                  <History className="mx-auto h-12 w-12 text-muted-foreground" />
                  <CardTitle>No Past Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Your order history is empty. Your next delicious meal is just a few clicks away!</CardDescription>
                </CardContent>
                 <CardFooter className="justify-center">
                  <Button onClick={() => navigate('/')}>Start Ordering</Button>
                </CardFooter>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default OrderPage;