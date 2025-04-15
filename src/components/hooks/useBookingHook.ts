
import { useState } from 'react';
import axios from 'axios';
import { BOOKING_SERVICE_URL } from '@/envConfig';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { resetFormData } from '@/redux/formSlice';

interface BookingPayload {
  userId: string;
  vehicleId: string;
  startDate: string; // ISO string
  endDate: string;   // ISO string
}

export const useCreateBooking = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const dispatch = useDispatch()

  const createBooking = async (payload: BookingPayload) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const response = await axios.post(BOOKING_SERVICE_URL, payload);
      setSuccess(true);
      toast.success("Booking created successfully!")
      dispatch(resetFormData())
      return response.data;
    } catch (err: any) {
      console.error('Booking failed:', err);
      setError(err?.response?.data?.message || 'Something went wrong');
      toast.error(err?.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false);
    }
  };

  return {
    createBooking,
    loading,
    error,
    success,
  };
};
