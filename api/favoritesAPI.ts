import apiClient from "./axiosClient";

export type Favorite = {
  id: string;
  artName: string;
  price: number;
  description: string;
  image: string;
  brand: string;
  limitedTimeDeal: number;
};

export const fetchFavorite = async (): Promise<Favorite[]> => {
  const res = await apiClient.get<Favorite[]>("/api/favorite");
  return res.data;
};

export const addFavorite = async (favorite: {
  id: string;
  artName: string;
  price: number;
  description: string;
  image: string;
  brand: string;
  limitedTimeDeal: number;
}): Promise<Favorite> => {
  const res = await apiClient.post<Favorite>(
    `/api/favorite/${favorite.id}`,
    favorite
  );
  return res.data;
};

export const deleteFavorite = async (id: string): Promise<Favorite> => {
  const res = await apiClient.delete<Favorite>(`/api/favorite/${id}`);
  return res.data;
};

export const deleteAllFavorite = async (): Promise<Favorite[]> => {
  const res = await apiClient.delete<Favorite[]>("/api/favorite");
  return res.data;
};
