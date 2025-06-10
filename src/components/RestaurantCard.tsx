import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Star, Clock } from 'lucide-react'; // Icons for rating and delivery time

interface RestaurantCardProps {
  id: string;
  name: string;
  imageUrl: string;
  cuisines: string[]; // e.g., ["Italian", "Pizza"]
  rating: number; // e.g., 4.5
  deliveryTimeMinutes: number; // e.g., 30-45
  onClick: (id: string) => void;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  id,
  name,
  imageUrl,
  cuisines,
  rating,
  deliveryTimeMinutes,
  onClick,
}) => {
  console.log("Rendering RestaurantCard:", name);

  const handleCardClick = () => {
    console.log("RestaurantCard clicked:", name, id);
    onClick(id);
  };

  return (
    <Card
      className="w-full max-w-sm overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer"
      onClick={handleCardClick}
    >
      <CardHeader className="p-0">
        <AspectRatio ratio={16 / 9}>
          <img
            src={imageUrl || '/placeholder.svg'}
            alt={`Image of ${name}`}
            className="object-cover w-full h-full"
            onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
          />
        </AspectRatio>
      </CardHeader>
      <CardContent className="p-4 space-y-2">
        <CardTitle className="text-lg font-semibold">{name}</CardTitle>
        {cuisines.length > 0 && (
          <CardDescription className="text-sm text-gray-600 truncate">
            {cuisines.join(', ')}
          </CardDescription>
        )}
        <div className="flex items-center justify-between text-sm text-gray-700">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <span>{rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{deliveryTimeMinutes} min</span>
          </div>
        </div>
      </CardContent>
      {/* CardFooter can be used for actions if needed, e.g., a quick "View Menu" button */}
      {/* <CardFooter className="p-4 pt-0">
        <Button variant="outline" size="sm" className="w-full">View Menu</Button>
      </CardFooter> */}
    </Card>
  );
};

export default RestaurantCard;