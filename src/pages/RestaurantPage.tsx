import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import MenuItemCard from '@/components/MenuItemCard';
import Footer from '@/components/layout/Footer';
import { Star, Clock, Utensils, ShoppingCart } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";


// Placeholder data
const sampleRestaurantDetails = {
  id: 'r1',
  name: 'Pasta Paradise',
  bannerImageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=1000&q=80',
  logoImageUrl: 'https://via.placeholder.com/100/FFD700/000000?Text=PP',
  address: '123 Pasta Lane, Food City',
  contact: '555-1234',
  openingHours: '11:00 AM - 10:00 PM',
  rating: 4.5,
  cuisines: ['Italian', 'Pizza', 'Pasta'],
  menu: {
    appetizers: [
      { id: 'm1', name: 'Garlic Bread', description: 'Crusty bread with garlic butter and herbs.', price: 6.99, imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Z2FybGljJTIwYnJlYWR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=400&q=60' },
      { id: 'm2', name: 'Bruschetta', description: 'Toasted bread topped with fresh tomatoes, garlic, and basil.', price: 8.50, imageUrl: 'https://images.unsplash.com/photo-1505253716362-af78f6d37fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YnJ1c2NoZXR0YXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=400&q=60' },
    ],
    mainCourses: [
      { id: 'm3', name: 'Spaghetti Carbonara', description: 'Classic Roman pasta with eggs, cheese, pancetta, and pepper.', price: 15.99, imageUrl: 'https://images.unsplash.com/photo-1588013273468-315088ea3426?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c3BhZ2hldHRpJTIwY2FyYm9uYXJhfGVufDB8fDB8fHww&auto=format&fit=crop&w=400&q=60' },
      { id: 'm4', name: 'Margherita Pizza', description: 'Traditional pizza with tomatoes, mozzarella, basil.', price: 13.50, imageUrl: 'https://images.unsplash.com/photo-1595854368080-e080c801a561?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bWFyZ2hlcml0YSUyMHBpenphfGVufDB8fDB8fHww&auto=format&fit=crop&w=400&q=60' },
      { id: 'm5', name: 'Lasagna Bolognese', description: 'Layered pasta with rich meat sauce and béchamel.', price: 16.50, imageUrl: 'https://images.unsplash.com/photo-1619895092649-f598fd69321c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bGFzYWduYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=400&q=60' },
    ],
    desserts: [
      { id: 'm6', name: 'Tiramisu', description: 'Coffee-flavoured Italian dessert.', price: 7.99, imageUrl: 'https://images.unsplash.com/photo-1571877275904-68eb265aBEC5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dGlyYW1pc3V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=400&q=60' },
    ],
    drinks: [
      { id: 'm7', name: 'Mineral Water', description: 'Still or sparkling.', price: 2.50 },
      { id: 'm8', name: 'Coke', description: 'Classic Coca-Cola.', price: 3.00 },
    ],
  }
};

const RestaurantPage = () => {
  const { id } = useParams(); // Restaurant ID from URL
  console.log('RestaurantPage loaded for ID:', id);
  const navigate = useNavigate();
  const { toast } = useToast();

  // In a real app, fetch restaurant data based on `id`
  const restaurant = sampleRestaurantDetails; // Using placeholder

  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0); // Simple cart count

  const handleAddToCart = (itemId: string, itemName: string) => {
    console.log('Added to cart:', itemId, itemName);
    setCartCount(prev => prev + 1);
    toast({
      title: "Item Added to Cart",
      description: `${itemName} has been added to your cart.`,
    });
    // Add to actual cart state/context here
  };

  // const handleShowItemDetails = (item: any) => {
  //   setSelectedItem(item);
  //   setIsDialogOpen(true);
  // };

  if (!restaurant) {
    return <div className="flex justify-center items-center min-h-screen">Loading restaurant details...</div>;
  }

  const menuCategories = Object.keys(restaurant.menu);

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
              <Button variant="ghost" onClick={() => navigate('/cart-checkout')} className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-2 -right-2 px-1.5 py-0.5 text-xs rounded-full">
                    {cartCount}
                  </Badge>
                )}
                <span className="sr-only">View Cart</span>
              </Button>
            </NavigationMenuItem>
            <NavigationMenuItem className="ml-2">
              <NavigationMenuLink href="/profile">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://via.placeholder.com/40" alt="User"/>
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </header>

      <main className="flex-grow">
        <div className="relative h-64 md:h-80">
          <img src={restaurant.bannerImageUrl} alt={`${restaurant.name} banner`} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="container mx-auto px-4 py-8 -mt-20 relative z-10">
          <Card className="overflow-hidden shadow-xl">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background shadow-md">
                  <AvatarImage src={restaurant.logoImageUrl} alt={`${restaurant.name} logo`} />
                  <AvatarFallback>{restaurant.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Breadcrumb className="mb-2">
                    <BreadcrumbList>
                      <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem><BreadcrumbPage>{restaurant.name}</BreadcrumbPage></BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{restaurant.name}</h1>
                  <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-muted-foreground">
                    {restaurant.cuisines.map(c => <Badge key={c} variant="outline">{c}</Badge>)}
                    <span className="flex items-center"><Star className="h-4 w-4 mr-1 text-yellow-500 fill-yellow-500" /> {restaurant.rating.toFixed(1)}</span>
                    <span className="flex items-center"><Clock className="h-4 w-4 mr-1" /> Open until {restaurant.openingHours.split(' - ')[1]}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{restaurant.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue={menuCategories[0] || "menu"} className="mt-8">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-2">
              {menuCategories.map(category => (
                <TabsTrigger key={category} value={category} className="capitalize">{category.replace(/([A-Z])/g, ' $1')}</TabsTrigger>
              ))}
            </TabsList>
            {menuCategories.map(category => (
              <TabsContent key={category} value={category} className="mt-6">
                <h2 className="text-2xl font-semibold mb-4 capitalize">{category.replace(/([A-Z])/g, ' $1')}</h2>
                <ScrollArea className="h-[500px] pr-3"> {/* Adjust height as needed */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(restaurant.menu as any)[category].map((item: any) => (
                      <MenuItemCard
                        key={item.id}
                        id={item.id}
                        name={item.name}
                        description={item.description}
                        price={item.price}
                        imageUrl={item.imageUrl}
                        onAddToCart={() => handleAddToCart(item.id, item.name)}
                        // onShowDetails={() => handleShowItemDetails(item)} // Optional: implement if dialog needs more complex logic
                      />
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>

      {/* Optional Dialog for item details/customization */}
      {selectedItem && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{selectedItem.name}</DialogTitle>
              <DialogDescription>{selectedItem.description}</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {/* Add customization options here if needed */}
              <p className="text-lg font-semibold">Price: ${selectedItem.price.toFixed(2)}</p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Close</Button>
              <Button onClick={() => { handleAddToCart(selectedItem.id, selectedItem.name); setIsDialogOpen(false); }}>Add to Cart</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      <Footer />
    </div>
  );
};

export default RestaurantPage;