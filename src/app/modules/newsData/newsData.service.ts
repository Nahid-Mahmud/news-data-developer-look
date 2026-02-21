import axios from "axios";
import envVariables from "../../config/env";
import { QueryBuilder } from "../../utils/queryBuilder";
import NewsData from "./newsData.model";
import { INewsData } from "./newsData.interface";

const getNewsData = async (query: Record<string, string>) => {
  // build a clean filter object that supports advanced fields
  const filters: Record<string, unknown> = {};

  // date range support (pubDate)
  if (query.startDate || query.endDate) {
    const range: Record<string, unknown> = {};
    if (query.startDate) {
      // convert to ISO string for stored pubDate
      const start = new Date(query.startDate).toISOString();
      range.$gte = start;
    }
    if (query.endDate) {
      const end = new Date(query.endDate).toISOString();
      range.$lte = end;
    }
    filters.pubDate = range;
  }

  // author/creator search (partial match using regex)
  if (query.author) {
    filters.creator = { $regex: query.author, $options: "i" };
  }

  // language exact match
  if (query.language && query.language !== "all") {
    filters.language = query.language;
  }

  // country filter (array member)
  if (query.country) {
    // allow comma separated list
    const countries = query.country
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);
    if (countries.length === 1) {
      filters.country = countries[0];
    } else if (countries.length > 1) {
      filters.country = { $in: countries };
    }
  }

  // category multi-select
  if (query.category) {
    const cats = query.category
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);
    if (cats.length === 1) {
      filters.category = cats[0];
    } else if (cats.length > 1) {
      filters.category = { $in: cats };
    }
  }

  // content type (datatype)
  if (query.datatype && query.datatype !== "all") {
    filters.datatype = query.datatype;
  }

  // merge other simple filters (e.g. any other query params that map directly)
  const passthrough = { ...query };
  [
    "startDate",
    "endDate",
    "author",
    "language",
    "country",
    "category",
    "datatype",
    "searchTerm",
    "page",
    "limit",
    "sort",
    "fields",
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
  ].forEach((key) => delete passthrough[key]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mergedQuery: Record<string, any> = { ...passthrough, ...filters };

  const queryBuilder = new QueryBuilder(NewsData.find({}), mergedQuery)
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

const getUniqueAuthors = async () => {
  try {
    const authors = await NewsData.distinct("creator");
    return authors;
  } catch (error) {
    console.error("Error fetching unique authors:", error);
    return [];
  }
};

const getUniqueLanguages = async () => {
  try {
    const languages = await NewsData.distinct("language");
    return languages;
  } catch (error) {
    console.error("Error fetching unique languages:", error);
    return [];
  }
};

const getUniqueCountries = async () => {
  try {
    const countries = await NewsData.distinct("country");
    return countries;
  } catch (error) {
    console.error("Error fetching unique countries:", error);
    return [];
  }
};

const getUniqueDatatypes = async () => {
  try {
    const datatypes = await NewsData.distinct("datatype");
    return datatypes;
  } catch (error) {
    console.error("Error fetching unique datatypes:", error);
    return [];
  }
};

export const newsDataService = {
  getNewsData,
  fetchNews,
  getUniqueCategories,
  getUniqueAuthors,
  getUniqueLanguages,
  getUniqueCountries,
  getUniqueDatatypes,
};
