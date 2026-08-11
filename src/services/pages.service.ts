import api from "@/lib/axios";
import { PagesResponse, SinglePageResponse } from "@/types/pages";

export const pagesService = {
  getPages: async () => {
    const response = await api.get<PagesResponse>("/pages");
    return response.data;
  },
  getPage: async (slug: string) => {
    const response = await api.get<SinglePageResponse>(`/pages/${slug}`);
    return response.data;
  },
};
