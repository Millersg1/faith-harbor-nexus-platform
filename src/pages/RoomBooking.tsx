import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Users, Clock, Calendar, Settings, CheckCircle, XCircle } from "lucide-react";
import { format, isAfter, isBefore } from "date-fns";

interface Room {
  id: string;
  name: string;
  capacity?: number;
  equipment?: string[];
  location?: string;
  amenities?: string[];
  booking_rules?: string;
  status: string;
}

interface RoomBooking {
  id: string;
  room_id: string;
  event_title: string;
  start_time: string;
  end_time: string;
  purpose?: string;
  attendee_count?: number;
  setup_requirements?: string;
  equipment_needed?: string[];
  status: string;
  created_at: string;
}

const RoomBooking = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<RoomBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [bookingForm, setBookingForm] = useState({
    room_id: "",
    event_title: "",
    start_time: "",
    end_time: "",
    purpose: "",
    attendee_count: "",
    setup_requirements: "",
    equipment_needed: [] as string[]
  });
  const [equipmentInput, setEquipmentInput] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [roomsResult, bookingsResult] = await Promise.all([
        supabase.from("rooms").select("*").eq("status", "available").order("name"),
        supabase.from("room_bookings").select("*").order("start_time", { ascending: false })
      ]);

      if (roomsResult.error) throw roomsResult.error;
      if (bookingsResult.error) throw bookingsResult.error;

      setRooms(roomsResult.data || []);
      setBookings(bookingsResult.data || []);
    } catch (error) {
      console.error("Error fetching room booking data:", error);
      toast({
        title: "Error",
        description: "Failed to load room booking data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bookingForm.room_id || !bookingForm.event_title || !bookingForm.start_time || !bookingForm.end_time) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const startTime = new Date(bookingForm.start_time);
    const endTime = new Date(bookingForm.end_time);

    if (isAfter(startTime, endTime)) {
      toast({
        title: "Error",
        description: "End time must be after start time",
        variant: "destructive",
      });
      return;
    }

    // Check for conflicts
    const conflicts = bookings.filter(booking => 
      booking.room_id === bookingForm.room_id &&
      booking.status !== 'cancelled' &&
      (
        (isAfter(startTime, new Date(booking.start_time)) && isBefore(startTime, new Date(booking.end_time))) ||
        (isAfter(endTime, new Date(booking.start_time)) && isBefore(endTime, new Date(booking.end_time))) ||
        (isBefore(startTime, new Date(booking.start_time)) && isAfter(endTime, new Date(booking.end_time)))
      )
    );

    if (conflicts.length > 0) {
      toast({
        title: "Error",
        description: "This room is already booked during the selected time",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("room_bookings")
        .insert({
          room_id: bookingForm.room_id,
          event_title: bookingForm.event_title,
          start_time: bookingForm.start_time,
          end_time: bookingForm.end_time,
          purpose: bookingForm.purpose || null,
          attendee_count: bookingForm.attendee_count ? parseInt(bookingForm.attendee_count) : null,
          setup_requirements: bookingForm.setup_requirements || null,
          equipment_needed: bookingForm.equipment_needed.length > 0 ? bookingForm.equipment_needed : null,
          booked_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Room booking request submitted successfully",
      });

      setBookingForm({
        room_id: "",
        event_title: "",
        start_time: "",
        end_time: "",
        purpose: "",
        attendee_count: "",
        setup_requirements: "",
        equipment_needed: []
      });
      setEquipmentInput("");
      setIsBookingDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error creating room booking:", error);
      toast({
        title: "Error",
        description: "Failed to create room booking",
        variant: "destructive",
      });
    }
  };

  const addEquipment = () => {
    if (equipmentInput.trim() && !bookingForm.equipment_needed.includes(equipmentInput.trim())) {
      setBookingForm(prev => ({
        ...prev,
        equipment_needed: [...prev.equipment_needed, equipmentInput.trim()]
      }));
      setEquipmentInput("");
    }
  };

  const removeEquipment = (equipment: string) => {
    setBookingForm(prev => ({
      ...prev,
      equipment_needed: prev.equipment_needed.filter(item => item !== equipment)
    }));
  };

  const getRoomName = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    return room?.name || "Unknown Room";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isUpcoming = (startTime: string) => {
    return isAfter(new Date(startTime), new Date());
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Room Booking</h1>
          <p className="text-muted-foreground">Reserve rooms for events and meetings</p>
        </div>
        <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Calendar className="mr-2 h-4 w-4" />
              Book a Room
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Book a Room</DialogTitle>
              <DialogDescription>
                Reserve a room for your event or meeting.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateBooking} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="room_id">Room</Label>
                <select
                  id="room_id"
                  value={bookingForm.room_id}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, room_id: e.target.value }))}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="">Select a room...</option>
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name} {room.capacity && `(Capacity: ${room.capacity})`}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="event_title">Event Title</Label>
                <Input
                  id="event_title"
                  value={bookingForm.event_title}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, event_title: e.target.value }))}
                  placeholder="Name of your event"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_time">Start Time</Label>
                  <Input
                    id="start_time"
                    type="datetime-local"
                    value={bookingForm.start_time}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, start_time: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_time">End Time</Label>
                  <Input
                    id="end_time"
                    type="datetime-local"
                    value={bookingForm.end_time}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, end_time: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose</Label>
                <Input
                  id="purpose"
                  value={bookingForm.purpose}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, purpose: e.target.value }))}
                  placeholder="Purpose of the booking"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="attendee_count">Expected Attendees</Label>
                <Input
                  id="attendee_count"
                  type="number"
                  value={bookingForm.attendee_count}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, attendee_count: e.target.value }))}
                  placeholder="Number of attendees"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="setup_requirements">Setup Requirements</Label>
                <Textarea
                  id="setup_requirements"
                  value={bookingForm.setup_requirements}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, setup_requirements: e.target.value }))}
                  placeholder="Describe any special setup needs..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Equipment Needed</Label>
                <div className="flex space-x-2">
                  <Input
                    value={equipmentInput}
                    onChange={(e) => setEquipmentInput(e.target.value)}
                    placeholder="Add equipment..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addEquipment())}
                  />
                  <Button type="button" onClick={addEquipment} variant="outline">
                    Add
                  </Button>
                </div>
                {bookingForm.equipment_needed.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {bookingForm.equipment_needed.map((equipment, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center">
                        {equipment}
                        <button
                          type="button"
                          className="ml-1 text-xs"
                          onClick={() => removeEquipment(equipment)}
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsBookingDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Submit Booking Request</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Available Rooms */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Available Rooms</h2>
          <div className="space-y-4">
            {rooms.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No rooms available</h3>
                  <p className="text-muted-foreground text-center">
                    Contact an administrator to set up rooms for booking.
                  </p>
                </CardContent>
              </Card>
            ) : (
              rooms.map((room) => (
                <Card key={room.id} className="cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => setSelectedRoom(room)}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="mr-2 h-5 w-5" />
                      {room.name}
                    </CardTitle>
                    {room.location && (
                      <p className="text-sm text-muted-foreground">{room.location}</p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      {room.capacity && (
                        <div className="flex items-center">
                          <Users className="mr-1 h-3 w-3" />
                          {room.capacity} people
                        </div>
                      )}
                      {room.equipment && room.equipment.length > 0 && (
                        <div className="flex items-center">
                          <Settings className="mr-1 h-3 w-3" />
                          {room.equipment.length} equipment items
                        </div>
                      )}
                    </div>
                    {room.equipment && room.equipment.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Available Equipment:</p>
                        <div className="flex flex-wrap gap-1">
                          {room.equipment.slice(0, 3).map((item, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {item}
                            </Badge>
                          ))}
                          {room.equipment.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{room.equipment.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Recent Bookings */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">My Bookings</h2>
          <div className="space-y-4">
            {bookings.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No bookings found</h3>
                  <p className="text-muted-foreground text-center">
                    Your room bookings will appear here once you make a reservation.
                  </p>
                </CardContent>
              </Card>
            ) : (
              bookings.map((booking) => (
                <Card key={booking.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{booking.event_title}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {getRoomName(booking.room_id)}
                        </p>
                      </div>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Clock className="mr-2 h-3 w-3" />
                        {format(new Date(booking.start_time), "MMM d, yyyy h:mm a")} -
                        {format(new Date(booking.end_time), "h:mm a")}
                        {isUpcoming(booking.start_time) && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            Upcoming
                          </Badge>
                        )}
                      </div>
                      {booking.purpose && (
                        <p className="text-sm text-muted-foreground">{booking.purpose}</p>
                      )}
                      {booking.attendee_count && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Users className="mr-1 h-3 w-3" />
                          {booking.attendee_count} expected attendees
                        </div>
                      )}
                      {booking.equipment_needed && booking.equipment_needed.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Equipment Requested:</p>
                          <div className="flex flex-wrap gap-1">
                            {booking.equipment_needed.map((item, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {item}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Room Details Dialog */}
      {selectedRoom && (
        <Dialog open={!!selectedRoom} onOpenChange={() => setSelectedRoom(null)}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                {selectedRoom.name}
              </DialogTitle>
              {selectedRoom.location && (
                <DialogDescription>{selectedRoom.location}</DialogDescription>
              )}
            </DialogHeader>
            <div className="space-y-4">
              {selectedRoom.capacity && (
                <div>
                  <h4 className="font-medium flex items-center">
                    <Users className="mr-2 h-4 w-4" />
                    Capacity
                  </h4>
                  <p className="text-sm text-muted-foreground">{selectedRoom.capacity} people</p>
                </div>
              )}
              
              {selectedRoom.equipment && selectedRoom.equipment.length > 0 && (
                <div>
                  <h4 className="font-medium flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    Available Equipment
                  </h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedRoom.equipment.map((item, index) => (
                      <Badge key={index} variant="outline">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedRoom.amenities && selectedRoom.amenities.length > 0 && (
                <div>
                  <h4 className="font-medium">Amenities</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedRoom.amenities.map((amenity, index) => (
                      <Badge key={index} variant="secondary">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedRoom.booking_rules && (
                <div>
                  <h4 className="font-medium">Booking Rules</h4>
                  <p className="text-sm text-muted-foreground mt-1">{selectedRoom.booking_rules}</p>
                </div>
              )}

              <div className="flex justify-end">
                <Button
                  onClick={() => {
                    setBookingForm(prev => ({ ...prev, room_id: selectedRoom.id }));
                    setSelectedRoom(null);
                    setIsBookingDialogOpen(true);
                  }}
                >
                  Book This Room
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default RoomBooking;