import { Query, Model, PipelineStage } from "mongoose";
import { excludeFields } from "../constants/constants";

export class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public readonly query: Record<string, string>;
  private appliedFilters: Record<string, unknown> = {};
  private searchQuery: Record<string, unknown> = {};
  private isAggregation = false;
  private aggregationPipeline: PipelineStage[] = [];
  private model: Model<T>; 

  constructor(modelQuery: Query<T[], T>, query: Record<string, string>) {
    this.modelQuery = modelQuery;
    this.query = query;
    this.model = modelQuery.model; 
  }

  filter(): this {
    if (this.isAggregation) {
    
      const filter = { ...this.query };
      for (const field of excludeFields) {
        
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete filter[field];
      }
      Object.keys(filter).forEach((key) => {
        if (
          filter[key] === "" ||
          filter[key] === "all" ||
          filter[key] === null ||
          filter[key] === undefined ||
          filter[key] === "null" ||
          filter[key] === "undefined"
        ) {
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
          delete filter[key];
        }
      });
      this.appliedFilters = { ...filter };
      this.aggregationPipeline.push({ $match: filter });
    } else {
      // Original find() logic
      const filter = { ...this.query };
      for (const field of excludeFields) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete filter[field];
      }
      Object.keys(filter).forEach((key) => {
        if (
          filter[key] === "" ||
          filter[key] === "all" ||
          filter[key] === null ||
          filter[key] === undefined ||
          filter[key] === "null" ||
          filter[key] === "undefined"
        ) {
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
          delete filter[key];
        }
      });
      this.appliedFilters = { ...filter };
      this.modelQuery = this.modelQuery.find(filter);
    }
    return this;
  }

  search(searchableFields: string[]): this {
    if (this.isAggregation) {
      // For aggregation, add $match stage with $or
      const searchTerm = this.query.searchTerm || "";
      if (searchTerm) {
        const searchQuery = {
          $or: searchableFields.map((field: string) => ({ [field]: { $regex: searchTerm, $options: "i" } })),
        };
        this.searchQuery = searchQuery;
        this.aggregationPipeline.push({ $match: searchQuery });
      }
    } else {
      // Original find() logic
      const searchTerm = this.query.searchTerm || "";
      if (searchTerm) {
        const searchQuery = {
          $or: searchableFields.map((field: string) => ({ [field]: { $regex: searchTerm, $options: "i" } })),
        };
        this.searchQuery = searchQuery;
        this.modelQuery = this.modelQuery.find(searchQuery);
      }
    }
    return this;
  }

  sort(): this {
    if (this.isAggregation) {
      const sort = this.query?.sort || "-createdAt";
      this.aggregationPipeline.push({ $sort: this.parseSort(sort) });
    } else {
      const sort = this.query?.sort || "-createdAt";
      this.modelQuery = this.modelQuery.sort(sort);
    }
    return this;
  }

  fields(): this {
    if (this.isAggregation) {
      const fields = this.query.fields?.split(",").join(" ") || "";
      if (fields) {
        const project: Record<string, 1> = {};
        fields.split(" ").forEach((field) => {
          project[field.trim()] = 1;
        });
        this.aggregationPipeline.push({ $project: project });
      }
    } else {
      const fields = this.query.fields?.split(",").join(" ") || "";
      this.modelQuery = this.modelQuery.select(fields);
    }
    return this;
  }

  paginate(): this {
    if (this.isAggregation) {
      const page = parseInt(this.query.page, 10) || 1;
      const limit = parseInt(this.query.limit, 10) || 10;
      const skip = (page - 1) * limit;
      this.aggregationPipeline.push({ $skip: skip }, { $limit: limit });
    } else {
      const page = parseInt(this.query.page, 10) || 1;
      const limit = parseInt(this.query.limit, 10) || 10;
      const skip = (page - 1) * limit;
      this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    }
    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  populate(populateFields: string | string[] | any, select?: string): this {
    if (!this.isAggregation) {
      // Only for find() queries
      if (Array.isArray(populateFields)) {
        for (const field of populateFields) {
          this.modelQuery = this.modelQuery.populate(field);
        }
      } else if (typeof populateFields === "string" && select) {
        this.modelQuery = this.modelQuery.populate({
          path: populateFields,
          select: select,
        });
      } else {
        this.modelQuery = this.modelQuery.populate(populateFields);
      }
    }
    return this;
  }

  // New method to enable aggregation mode
  aggregate(): this {
    this.isAggregation = true;
    this.aggregationPipeline = []; // Reset pipeline
    return this;
  }

  // New method to build and execute aggregation
  async buildAggregation(): Promise<T[]> {
    if (!this.isAggregation) {
      throw new Error("Call aggregate() first to enable aggregation mode.");
    }
    return await this.model.aggregate(this.aggregationPipeline);
  }

  async getMeta() {
    if (this.isAggregation) {
      // For aggregation, count using a separate aggregation pipeline
      const countPipeline = [...this.aggregationPipeline];
      // Remove $skip and $limit for count
      const skipIndex = countPipeline.findIndex((stage) => "$skip" in stage);
      if (skipIndex !== -1) {
        countPipeline.splice(skipIndex, 2); // Remove $skip and $limit
      }
      countPipeline.push({ $count: "total" });
      const countResult = await this.model.aggregate(countPipeline);
      const totalDocuments = countResult[0]?.total || 0;
      const page = parseInt(this.query.page, 10) || 1;
      const limit = parseInt(this.query.limit, 10) || 10;
      const totalPages = Math.ceil(totalDocuments / limit);
      return { page, limit, total: totalDocuments, totalPages };
    } else {
      // Original logic for find()
      const baseConditions = this.modelQuery.getQuery();
      const combinedFilters = {
        ...baseConditions,
        ...this.appliedFilters,
        ...this.searchQuery,
      };
      const totalDocuments = await this.modelQuery.model.countDocuments(combinedFilters);
      const page = parseInt(this.query.page, 10) || 1;
      const limit = parseInt(this.query.limit, 10) || 10;
      const totalPages = Math.ceil(totalDocuments / limit);
      return { page, limit, total: totalDocuments, totalPages };
    }
  }

  dateWise(dateField = "createdAt"): this {
    const days = parseInt(this.query.days, 10);
    if (!days || days <= 0) return this;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const dateFilter = { [dateField]: { $gte: startDate } };
    if (this.isAggregation) {
      this.aggregationPipeline.push({ $match: dateFilter });
    } else {
      this.modelQuery = this.modelQuery.find(dateFilter);
    }
    this.appliedFilters = { ...this.appliedFilters, ...dateFilter };
    return this;
  }

  build(): Query<T[], T> {
    if (this.isAggregation) {
      throw new Error("Use buildAggregation() for aggregation queries.");
    }
    return this.modelQuery;
  }

  // Method to add custom aggregation stages
  addStage(stage: PipelineStage): this {
    if (this.isAggregation) {
      this.aggregationPipeline.push(stage);
    }
    return this;
  }

  // Method to insert stages at specific position
  insertStages(index: number, ...stages: PipelineStage[]): this {
    if (this.isAggregation) {
      this.aggregationPipeline.splice(index, 0, ...stages);
    }
    return this;
  }

  // Helper to parse sort string for aggregation
  private parseSort(sortStr: string): Record<string, 1 | -1> {
    const sort: Record<string, 1 | -1> = {};
    sortStr.split(",").forEach((field) => {
      if (field.startsWith("-")) {
        sort[field.slice(1)] = -1;
      } else {
        sort[field] = 1;
      }
    });
    return sort;
  }
}
