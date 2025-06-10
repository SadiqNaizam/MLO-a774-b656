import React from 'react';
import { Button } from '@/components/ui/button'; // Using Button for clickable chips

interface Cuisine {
  id: string;
  name: string;
}

interface CuisineFilterChipsProps {
  cuisines: Cuisine[];
  selectedCuisineId?: string | null;
  onSelectCuisine: (cuisineId: string | null) => void;
}

const CuisineFilterChips: React.FC<CuisineFilterChipsProps> = ({
  cuisines,
  selectedCuisineId,
  onSelectCuisine,
}) => {
  console.log("Rendering CuisineFilterChips, selected:", selectedCuisineId);

  return (
    <div className="flex flex-wrap gap-2 py-2">
      <Button
        variant={!selectedCuisineId ? 'default' : 'outline'}
        size="sm"
        onClick={() => {
          console.log("All cuisines chip clicked");
          onSelectCuisine(null);
        }}
        className="rounded-full"
      >
        All
      </Button>
      {cuisines.map((cuisine) => (
        <Button
          key={cuisine.id}
          variant={selectedCuisineId === cuisine.id ? 'default' : 'outline'}
          size="sm"
          onClick={() => {
            console.log(`Cuisine chip clicked: ${cuisine.name} (ID: ${cuisine.id})`);
            onSelectCuisine(cuisine.id);
          }}
          className="rounded-full"
        >
          {cuisine.name}
        </Button>
      ))}
    </div>
  );
};

export default CuisineFilterChips;