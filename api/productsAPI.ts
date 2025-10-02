import apiClient from "@/api/axiosClient";

export type Product = {
  id: string;
  artName: string;
  price: number;
  description: string;
  glassSurface: boolean;
  image: string;
  brand: string;
  limitedTimeDeal: number;
  feedbacks: {
    rating: number;
    comment: string;
    author: string;
    date: string;
  }[];
};

// fetchProducts trả về Product[]
export const fetchProducts = async (): Promise<Product[]> => {
  const res = await apiClient.get<Product[]>("/api/product");
  return res.data;
};

// createProduct trả về Product
export const createProduct = async (product: Product): Promise<Product> => {
  const res = await apiClient.post<Product>("/api/product", product);
  return res.data;
};
