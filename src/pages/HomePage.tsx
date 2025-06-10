import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import CuisineFilterChips from '@/components/CuisineFilterChips';
import RestaurantCard from '@/components/RestaurantCard';
import Footer from '@/components/layout/Footer';
import { Search } from 'lucide-react';

// Placeholder data
const sampleCuisines = [
  { id: '1', name: 'Italian' },
  { id: '2', name: 'Mexican' },
  { id: '3', name: 'Indian' },
  { id: '4', name: 'Chinese' },
  { id: '5', name: 'Japanese' },
];

const sampleRestaurants = [
  { id: 'r1', name: 'Pasta Paradise', imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60', cuisines: ['Italian', 'Pasta'], rating: 4.5, deliveryTimeMinutes: 30 },
  { id: 'r2', name: 'Taco Town', imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60', cuisines: ['Mexican', 'Tacos'], rating: 4.2, deliveryTimeMinutes: 25 },
  { id: 'r3', name: 'Curry Corner', imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60', cuisines: ['Indian', 'Curry'], rating: 4.8, deliveryTimeMinutes: 40 },
  { id: 'r4', name: 'Wok Wonders', imageUrl: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGZvb2R8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60', cuisines: ['Chinese'], rating: 4.0, deliveryTimeMinutes: 35 },
];

const HomePage = () => {
  console.log('HomePage loaded');
  const navigate = useNavigate();
  const [selectedCuisineId, setSelectedCuisineId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSelectCuisine = (cuisineId: string | null) => {
    console.log('Selected cuisine:', cuisineId);
    setSelectedCuisineId(cuisineId);
    // Add filtering logic here or trigger data refetch
  };

  const handleRestaurantClick = (restaurantId: string) => {
    console.log('Navigating to restaurant:', restaurantId);
    navigate(`/restaurant/${restaurantId}`); // Example route
  };

  const filteredRestaurants = sampleRestaurants.filter(restaurant => {
    const matchesCuisine = selectedCuisineId ? restaurant.cuisines.some(c => c.toLowerCase().includes(sampleCuisines.find(sc => sc.id === selectedCuisineId)?.name.toLowerCase() || '')) : true;
    const matchesSearch = searchTerm ? restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) : true;
    return matchesCuisine && matchesSearch;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        {/* Basic NavigationMenu - can be replaced with a dedicated Header component */}
        <NavigationMenu className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuLink href="/" className="font-bold text-xl">FoodFleet</NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
            {/* Add cart, profile icons here if needed */}
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
        <section aria-labelledby="search-restaurants" className="mb-8">
          <h1 id="search-restaurants" className="text-3xl font-bold tracking-tight mb-2 text-center">
            Order food to your door
          </h1>
          <p className="text-muted-foreground text-center mb-6">
            Enter your address to see restaurants near you.
          </p>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search restaurants or cuisines..."
              className="w-full pl-10 pr-4 py-3 rounded-lg text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </section>

        <section aria-labelledby="cuisine-filters" className="mb-8">
          <h2 id="cuisine-filters" className="text-xl font-semibold mb-3">Filter by Cuisine</h2>
          <CuisineFilterChips
            cuisines={sampleCuisines}
            selectedCuisineId={selectedCuisineId}
            onSelectCuisine={handleSelectCuisine}
          />
        </section>

        <section aria-labelledby="restaurant-listings">
          <h2 id="restaurant-listings" className="text-2xl font-semibold mb-6">
            {selectedCuisineId ? `${sampleCuisines.find(c => c.id === selectedCuisineId)?.name} Restaurants` : "Featured Restaurants"}
          </h2>
          {filteredRestaurants.length > 0 ? (
            <ScrollArea className="h-[calc(100vh-400px)] pr-4"> {/* Adjust height as needed */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredRestaurants.map(restaurant => (
                  <RestaurantCard
                    key={restaurant.id}
                    id={restaurant.id}
                    name={restaurant.name}
                    imageUrl={restaurant.imageUrl}
                    cuisines={restaurant.cuisines}
                    rating={restaurant.rating}
                    deliveryTimeMinutes={restaurant.deliveryTimeMinutes}
                    onClick={handleRestaurantClick}
                  />
                ))}
              </div>
            </ScrollArea>
          ) : (
            <p className="text-muted-foreground">No restaurants found matching your criteria. Try a different search or filter.</p>
          )}
          {/* Example "Load More" button - implement pagination/infinite scroll if needed */}
          {filteredRestaurants.length > 8 && (
            <div className="mt-8 text-center">
              <Button variant="outline">Load More Restaurants</Button>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;