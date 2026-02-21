import { model, Schema } from "mongoose";
import { INewsData } from "./newsData.interface";

const newsDataSchema = new Schema<INewsData>(
  {
    article_id: { type: String, required: true },
    link: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    content: { type: String, required: true },
    keywords: [{ type: String }],
    creator: [{ type: String }],
    language: { type: String },
    country: [{ type: String }],
    category: [{ type: String }],
    datatype: { type: String },
    pubDate: { type: String, required: true },
    pubDateTZ: { type: String, required: true },
    fetched_at: { type: String, required: true },
    image_url: { type: String },
    video_url: { type: String },
    source_id: { type: String, required: true },
    source_name: { type: String, required: true },
    source_priority: { type: Number, required: true },
    source_url: { type: String, required: true },
    source_icon: { type: String, required: true },
    sentiment: { type: String, required: true },
    sentiment_stats: { type: String, required: true },
    ai_tag: { type: String, required: true },
    ai_region: { type: String, required: true },
    ai_summary: { type: String, required: true },
    duplicate: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const NewsData = model<INewsData>("NewsData", newsDataSchema);

export default NewsData;
