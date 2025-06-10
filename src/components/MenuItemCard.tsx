import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { PlusCircle } from 'lucide-react'; // Icon for Add to cart

interface MenuItemCardProps {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  onAddToCart: (itemId: string) => void;
  // onShowDetails?: (itemId: string) => void; // Optional: for opening a dialog with more details/customizations
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  id,
  name,
  description,
  price,
  imageUrl,
  onAddToCart,
  // onShowDetails
}) => {
  console.log("Rendering MenuItemCard:", name);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click if button is inside clickable card area
    console.log("Add to cart clicked for item:", name, id);
    onAddToCart(id);
  };

  // const handleCardClick = () => {
  //   if (onShowDetails) {
  //     console.log("MenuItemCard clicked, showing details for:", name, id);
  //     onShowDetails(id);
  //   }
  // };

  return (
    <Card
      className="w-full overflow-hidden transition-all duration-300 hover:shadow-md"
      // onClick={handleCardClick} // Make card clickable if onShowDetails is provided
      // className={`w-full overflow-hidden transition-all duration-300 ${onShowDetails ? 'hover:shadow-md cursor-pointer' : ''}`}
    >
      {imageUrl && (
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
      )}
      <CardContent className={`p-4 space-y-1 ${!imageUrl ? 'pt-4' : ''}`}>
        <CardTitle className="text-md font-semibold">{name}</CardTitle>
        {description && (
          <CardDescription className="text-xs text-gray-600 line-clamp-2">
            {description}
          </CardDescription>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <span className="text-lg font-bold text-primary">${price.toFixed(2)}</span>
        <Button variant="outline" size="sm" onClick={handleAddToCart}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MenuItemCard;