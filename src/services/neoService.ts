import axios from 'axios';
import { NeoResponse } from '../types/neo';

const NASA_API_KEY = process.env.NEXT_PUBLIC_NASA_API_KEY || 'DEMO_KEY';
const BASE_URL = 'https://api.nasa.gov/neo/rest/v1';

export const fetchNeos = async (startDate: string, endDate: string): Promise<NeoResponse> => {
  const response = await axios.get(
    `${BASE_URL}/feed?start_date=${startDate}&end_date=${endDate}&api_key=${NASA_API_KEY}`
  );
  return response.data;
};
