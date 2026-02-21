import axios from "axios";
import envVariables from "../../config/env";
import { QueryBuilder } from "../../utils/queryBuilder";
import NewsData from "./newsData.model";
import { INewsData } from "./newsData.interface";

const getNewsData = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(NewsData.find({}), query)
    .filter()
    .search(["title", "description", "content"])
    .sort()
    .fields()
    .paginate();

  // execute the query and also grab metadata for pagination
  const data = await queryBuilder.modelQuery;
  const meta = await queryBuilder.getMeta();
  return { data, meta };
};

const fetchNews = async () => {
  const API_KEY = envVariables.NEWS_DATA_API_KEY;
  const url1 = `https://newsdata.io/api/1/news?apikey=${API_KEY}`;

  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);

  try {
    const response = await axios.get(url1);
    // eslint-disable-next-line no-console
    console.log(`[${new Date().toISOString()}] News fetched successfully:`, response.data.results);

    const convertedData = response.data.results.map((item: INewsData) => {
      return {
        ...item,
        pubDate: new Date(item.pubDate),
      };
    });

    // insert many in the database

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const result = await NewsData.insertMany(convertedData, { ordered: false });

    return convertedData;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error fetching news:", error);
  }
};

const getUniqueCategories = async () => {
  try {
    const categories = await NewsData.distinct("category");
    return categories;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error fetching unique categories:", error);
    return [];
  }
};

export const newsDataService = {
  getNewsData,
  fetchNews,
  getUniqueCategories,
};
