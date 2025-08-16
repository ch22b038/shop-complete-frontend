import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, Calendar, Star, Users, Fuel, Settings, MapPin, Clock, Shield } from 'lucide-react';
import { cars } from '@/data/carData';
import { useBookingStore } from '@/stores/useBookingStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const CarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [durationType, setDurationType] = useState<'days' | 'hours'>('days');
  const [pickupLocation, setPickupLocation] = useState('');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { setCurrentBooking, calculateCost } = useBookingStore();
  const { toast } = useToast();

  const car = cars.find(c => c.id === parseInt(id || '0'));

  if (!car) {
    return (
      <div className="container-padding py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Car Not Found</h1>
        <p className="text-muted-foreground mb-8">The car you're looking for doesn't exist.</p>
        <Button asChild>
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    );
  }

  const calculateDuration = () => {
    if (!startDate || !endDate) return 0;
    
    if (durationType === 'days') {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } else {
      if (!startTime || !endTime) return 0;
      const start = new Date(`${startDate} ${startTime}`);
      const end = new Date(`${endDate} ${endTime}`);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60));
    }
  };

  const duration = calculateDuration();
  const totalCost = calculateCost(car.pricePerDay, car.pricePerHour, duration, durationType);

  const handleBookNow = () => {
    if (!startDate || !endDate || !pickupLocation) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required booking details.",
        variant: "destructive"
      });
      return;
    }

    if (durationType === 'hours' && (!startTime || !endTime)) {
      toast({
        title: "Missing Time",
        description: "Please select start and end times for hourly rental.",
        variant: "destructive"
      });
      return;
    }

    const booking = {
      carId: car.id,
      carName: car.name,
      carImage: car.image,
      pricePerDay: car.pricePerDay,
      pricePerHour: car.pricePerHour,
      startDate,
      endDate,
      startTime: durationType === 'hours' ? startTime : undefined,
      endTime: durationType === 'hours' ? endTime : undefined,
      duration,
      durationType,
      totalCost,
      pickupLocation,
      dropoffLocation: pickupLocation, // Assuming same location for now
    };

    setCurrentBooking(booking);
    navigate('/booking');
  };

  const discountPercentage = car.originalPrice 
    ? Math.round(((car.originalPrice - car.pricePerDay) / car.originalPrice) * 100)
    : null;

  return (
    <div className="container-padding py-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Cars
          </Link>
        </Button>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Car Images */}
        <div className="space-y-4">
          <div className="aspect-[4/3] overflow-hidden rounded-lg border border-border">
            <img
              src={car.image}
              alt={car.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Car Info */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <div className="text-sm text-muted-foreground mb-2">{car.brand}</div>
            <h1 className="text-3xl font-bold mb-4">{car.name}</h1>
            
            {/* Rating */}
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(car.rating)
                        ? 'fill-rating text-rating'
                        : 'text-muted-foreground/30'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {car.rating} ({car.reviewCount} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-3 mb-6">
              <span className="text-3xl font-bold text-success">
                ${car.pricePerDay}/day
              </span>
              <span className="text-xl text-muted-foreground">
                ${car.pricePerHour}/hour
              </span>
              {car.originalPrice && (
                <>
                  <span className="text-xl text-price-original line-through">
                    ${car.originalPrice}
                  </span>
                  <Badge variant="destructive">
                    -{discountPercentage}% OFF
                  </Badge>
                </>
              )}
            </div>
          </div>

          {/* Car Specs */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary" />
              <span>{car.seatingCapacity} seats</span>
            </div>
            <div className="flex items-center space-x-2">
              <Fuel className="h-5 w-5 text-primary" />
              <span>{car.fuelType}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-primary" />
              <span>{car.transmission}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-primary" />
              <span>{car.location}</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground leading-relaxed">
              {car.description}
            </p>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-semibold mb-2">Features</h3>
            <div className="grid grid-cols-2 gap-2">
              {car.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Booking Form */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Book This Car</h3>
            
            {/* Rental Type */}
            <div className="flex space-x-4">
              <Button
                variant={durationType === 'days' ? 'default' : 'outline'}
                onClick={() => setDurationType('days')}
                size="sm"
              >
                Daily Rental
              </Button>
              <Button
                variant={durationType === 'hours' ? 'default' : 'outline'}
                onClick={() => setDurationType('hours')}
                size="sm"
              >
                Hourly Rental
              </Button>
            </div>

            {/* Date Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate || new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            {/* Time Selection for Hourly */}
            {durationType === 'hours' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Pickup Location */}
            <div>
              <Label htmlFor="pickupLocation">Pickup Location</Label>
              <Input
                id="pickupLocation"
                placeholder="Enter pickup location"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
              />
            </div>

            {/* Cost Summary */}
            {duration > 0 && (
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span>Duration:</span>
                  <span className="font-medium">{duration} {durationType}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span>Rate:</span>
                  <span className="font-medium">
                    ${durationType === 'days' ? car.pricePerDay : car.pricePerHour}/{durationType.slice(0, -1)}
                  </span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Total Cost:</span>
                  <span className="text-success">${totalCost.toFixed(2)}</span>
                </div>
              </div>
            )}

            <div className="flex space-x-4">
              <Button 
                size="lg" 
                className="flex-1"
                onClick={handleBookNow}
                disabled={!car.available}
              >
                <Calendar className="mr-2 h-5 w-5" />
                {car.available ? 'Book Now' : 'Unavailable'}
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setIsWishlisted(!isWishlisted)}
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-destructive text-destructive' : ''}`} />
              </Button>
              <Button variant="outline" size="lg">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Service Features */}
          <div className="grid grid-cols-1 gap-4 pt-6">
            <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg">
              <Shield className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">Fully Insured</div>
                <div className="text-sm text-muted-foreground">Comprehensive coverage included</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">24/7 Support</div>
                <div className="text-sm text-muted-foreground">Round-the-clock assistance</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">Flexible Pickup</div>
                <div className="text-sm text-muted-foreground">Multiple locations available</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetail;