import axios from 'axios';
import httpClient from '@/lib/http';
import { useMutation, useQuery } from 'react-query';

export const useRandomImageByTitle = title => {
  return useQuery(['randomImageByTitle', title], async () => {
    const { data } = await httpClient.get(`random-image-title/${title}`);
    return data;
  });
};

/** example for Mutations */
export function useProductLivePreview() {
  return useMutation(async (productId: string) => {
    const response = await axios.put(`products/${productId}/live_preview`);

    return response;
  });
}
