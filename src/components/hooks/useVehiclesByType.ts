import { useState, useEffect } from 'react';
import axios from 'axios';
import { VEHICLE_CATEGORY_SERVICE_URL, VEHICLE_SERVICE_URL } from '@/envConfig';

export const useVehiclesByType = (vehicleType: 'TWO_WHEELER' | 'FOUR_WHEELER') => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${VEHICLE_CATEGORY_SERVICE_URL}/get-all-category`, {
        params: { vehicleType },
      });
      setVehicles(res.data);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to fetch vehicles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (vehicleType) {
      fetchVehicles();
    }
  }, [vehicleType]);

  return { vehicles, loading, error };
};
