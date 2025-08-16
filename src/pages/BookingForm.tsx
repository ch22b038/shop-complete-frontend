import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Phone, CreditCard, MapPin, Calendar, Car } from 'lucide-react';
import { useBookingStore } from '@/stores/useBookingStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

const BookingForm = () => {
  const navigate = useNavigate();
  const { currentBooking, addToHistory, clearCurrentBooking } = useBookingStore();
  const { isAuthenticated } = useAuthStore();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    driverAge: '',
    licenseNumber: '',
    specialRequests: '',
  });

  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
  });

  if (!currentBooking) {
    return (
      <div className="container-padding py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">No Booking Selected</h1>
        <p className="text-muted-foreground mb-8">Please select a car first to proceed with booking.</p>
        <Button asChild>
          <button onClick={() => navigate('/')}>Browse Cars</button>
        </Button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.licenseNumber) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (!paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv || !paymentData.cardholderName) {
      toast({
        title: "Payment Information Required",
        description: "Please complete the payment details.",
        variant: "destructive"
      });
      return;
    }

    // Simulate booking confirmation
    addToHistory(currentBooking);
    
    toast({
      title: "Booking Confirmed!",
      description: `Your ${currentBooking.carName} has been booked successfully.`,
    });

    navigate('/booking-confirmation');
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updatePaymentData = (field: string, value: string) => {
    setPaymentData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="container-padding py-8">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Booking Form */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Complete Your Booking</h1>
            <p className="text-muted-foreground">Fill in your details to confirm the rental</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => updateFormData('firstName', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => updateFormData('lastName', e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateFormData('phone', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="driverAge">Driver Age</Label>
                    <Input
                      id="driverAge"
                      type="number"
                      min="18"
                      max="100"
                      value={formData.driverAge}
                      onChange={(e) => updateFormData('driverAge', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="licenseNumber">Driver's License Number *</Label>
                  <Input
                    id="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={(e) => updateFormData('licenseNumber', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="specialRequests">Special Requests</Label>
                  <Textarea
                    id="specialRequests"
                    placeholder="Any special requirements or requests..."
                    value={formData.specialRequests}
                    onChange={(e) => updateFormData('specialRequests', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="cardholderName">Cardholder Name *</Label>
                  <Input
                    id="cardholderName"
                    value={paymentData.cardholderName}
                    onChange={(e) => updatePaymentData('cardholderName', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cardNumber">Card Number *</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={paymentData.cardNumber}
                    onChange={(e) => updatePaymentData('cardNumber', e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiryDate">Expiry Date *</Label>
                    <Input
                      id="expiryDate"
                      placeholder="MM/YY"
                      value={paymentData.expiryDate}
                      onChange={(e) => updatePaymentData('expiryDate', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV *</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={paymentData.cvv}
                      onChange={(e) => updatePaymentData('cvv', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button type="submit" size="lg" className="w-full">
              Confirm Booking & Pay ${currentBooking.totalCost.toFixed(2)}
            </Button>
          </form>
        </div>

        {/* Booking Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Car Details */}
              <div className="flex space-x-3">
                <img
                  src={currentBooking.carImage}
                  alt={currentBooking.carName}
                  className="w-16 h-12 object-cover rounded"
                />
                <div className="flex-1">
                  <div className="font-medium">{currentBooking.carName}</div>
                  <div className="text-sm text-muted-foreground">
                    ${currentBooking.durationType === 'days' ? currentBooking.pricePerDay : currentBooking.pricePerHour}/
                    {currentBooking.durationType.slice(0, -1)}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Booking Details */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    Start Date
                  </span>
                  <span className="text-sm">
                    {new Date(currentBooking.startDate).toLocaleDateString()}
                    {currentBooking.startTime && ` ${currentBooking.startTime}`}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    End Date
                  </span>
                  <span className="text-sm">
                    {new Date(currentBooking.endDate).toLocaleDateString()}
                    {currentBooking.endTime && ` ${currentBooking.endTime}`}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4" />
                    Pickup
                  </span>
                  <span className="text-sm">{currentBooking.pickupLocation}</span>
                </div>
              </div>

              <Separator />

              {/* Cost Breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span>{currentBooking.duration} {currentBooking.durationType}</span>
                </div>
                <div className="flex justify-between">
                  <span>Rate:</span>
                  <span>
                    ${currentBooking.durationType === 'days' ? currentBooking.pricePerDay : currentBooking.pricePerHour}/
                    {currentBooking.durationType.slice(0, -1)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-success">${currentBooking.totalCost.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;