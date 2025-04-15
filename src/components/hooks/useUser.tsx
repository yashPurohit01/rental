import { USER_SERVICE_URL } from '@/envConfig';
import axios from 'axios';
import { useState } from 'react';



export const useUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addNewUser = async (payload: any) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(USER_SERVICE_URL, payload);

      return response.data; // ✅ Return parsed user data
    } catch (error: any) {
      console.error('User creation failed:', error?.response?.data || error.message);
      setError(error?.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return {
    addNewUser,
    loading,
    error,
  };
};
