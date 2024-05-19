import AppError from "../helpers/AppError";
import Pagination from "../types/pagination.type";
import HelperFunctions from "./HelperFunctions.service";

class QueryBuilder {
  paginationResult?: Pagination;
  constructor(public query: any, public queryString: any) {}

  paginate(countDocuments: number) {
    const pagination = HelperFunctions.getPaginationFromQuery(this.queryString);

    const { limit, currentPage, skip } = pagination;

    pagination.numberOfPages = Math.ceil(countDocuments / limit);
    const endIndex = currentPage * limit;

    if (countDocuments !== 0 && pagination.numberOfPages < currentPage) {
      throw AppError.NotFoundException("There is not data in this page");
    }

    if (endIndex < countDocuments) {
      pagination.nextPage = currentPage + 1;
    }

    if (skip > 0) {
      pagination.prevPage = currentPage - 1;
    }

    this.query = this.query.skip(skip).limit(limit);
    this.paginationResult = pagination;
    return this;
  }

  filter() {
    const excludedFields = ["page", "sort", "limit", "fields"];

    const excludedString = HelperFunctions.excludeFieldsFromQuery(
      this.queryString,
      excludedFields
    );
    const queryStr = HelperFunctions.replaceQueryOperators(excludedString);
    this.query = this.query.find(queryStr);
    return this;
  }

  search(fields?: string[]) {
    if (!fields) return this;

    const keyword = this.queryString.search;
    if (!keyword) return this;

    const searchConditions = fields.map((field) => ({
      [field]: { $regex: keyword, $options: "i" },
    }));

    this.query = this.query.find({ $or: searchConditions });
    return this;
  }

  sort() {
    const sortBy = HelperFunctions.getSortByFromQuery(this.queryString);
    this.query = this.query.sort(sortBy);
    return this;
  }

  select() {
    const fields = HelperFunctions.limitFieldsForResponse(this.queryString);
    this.query = this.query.select(fields);
    return this;
  }

  build() {
    return this.query;
  }
}

export default QueryBuilder;
