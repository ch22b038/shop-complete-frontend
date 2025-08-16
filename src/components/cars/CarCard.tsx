import { Link } from 'react-router-dom';
import { Star, Users, Fuel, Settings, MapPin } from 'lucide-react';
import { Car } from '@/types/car';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CarCardProps {
  car: Car;
}

export function CarCard({ car }: CarCardProps) {
  const discountPercentage = car.originalPrice 
    ? Math.round(((car.originalPrice - car.pricePerDay) / car.originalPrice) * 100)
    : null;

  return (
    <Link to={`/car/${car.id}`} className="group block">
      <div className="car-card group bg-card border border-border rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/20">
        {/* Image Container */}
        <div className="relative overflow-hidden aspect-[4/3]">
          <img
            src={car.image}
            alt={car.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Availability Badge */}
          <div className="absolute top-3 left-3">
            <Badge variant={car.available ? "default" : "secondary"}>
              {car.available ? "Available" : "Unavailable"}
            </Badge>
          </div>

          {/* Discount Badge */}
          {discountPercentage && (
            <div className="absolute top-3 right-3">
              <Badge variant="destructive">
                -{discountPercentage}% OFF
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Brand and Model */}
          <div>
            <div className="text-sm text-muted-foreground">{car.brand}</div>
            <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
              {car.name}
            </h3>
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(car.rating)
                      ? 'fill-rating text-rating'
                      : 'text-muted-foreground/30'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {car.rating} ({car.reviewCount})
            </span>
          </div>

          {/* Key Features */}
          <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{car.seatingCapacity} seats</span>
            </div>
            <div className="flex items-center space-x-1">
              <Fuel className="h-4 w-4" />
              <span>{car.fuelType}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Settings className="h-4 w-4" />
              <span>{car.transmission}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4" />
              <span>{car.location}</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-success">
                  ${car.pricePerDay}
                </span>
                <span className="text-sm text-muted-foreground">/day</span>
                {car.originalPrice && (
                  <span className="text-sm text-price-original line-through">
                    ${car.originalPrice}
                  </span>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                ${car.pricePerHour}/hour
              </div>
            </div>
            
            <Button 
              size="sm" 
              disabled={!car.available}
              onClick={(e) => {
                e.preventDefault();
                // Handle book now action
              }}
            >
              {car.available ? 'Book Now' : 'Unavailable'}
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}