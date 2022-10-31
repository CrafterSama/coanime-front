import axios from 'axios';

import { httpClientExternal } from '@/lib/http';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useRandomImageByTitle = (title) => {
  return useQuery(['randomImageByTitle', title], async () => {
    try {
      const { data } = await httpClientExternal.get(
        `random-image-title/${title}`
      );
      return data;
    } catch (error) {
      return error.response.data.message.text;
    }
  });
};

/** example for Mutations */
export function useProductLivePreview() {
  return useMutation(async (productId: string) => {
    const response = await axios.put(`products/${productId}/live_preview`);

    return response;
  });
}
