import { useMutation, useQuery } from 'react-query';

import axios from 'axios';

import { httpClientExternal } from '@/lib/http';

export const useRandomImageByTitle = (title) => {
  return useQuery(['randomImageByTitle', title], async () => {
    const { data } = await httpClientExternal.get(
      `random-image-title/${title}`
    );
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
