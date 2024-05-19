import config from "../config/config";
import Pagination from "../types/pagination.type";

class HelperFunctions {
  static getPaginationFromQuery(query: any) {
    const currentPage = Number(query.page) || config.defaultPageNumber;
    const limit = Number(query.limit) || config.defaultPageSize;
    const skip = (currentPage - 1) * limit;

    return { currentPage, limit, skip } as Pagination;
  }

  //a function to selects or picks specific allowedFields fields
  static selectFieldsFromObject(obj: any, ...allowedFields: any) {
    const newObj: any = {};
    Object.keys(obj).forEach((key) => {
      if (allowedFields.includes(key)) newObj[key] = obj[key];
    });
    return newObj;
  }

  // Helper function to filter out excluded fields from query
  static excludeFieldsFromQuery(query: any, excludedFields: string[]) {
    const filteredQuery: any = { ...query };
    excludedFields.forEach((field) => delete filteredQuery[field]);
    return filteredQuery;
  }

  // Helper function to replace query operators
  static replaceQueryOperators(query: any) {
    const queryStr: any = JSON.stringify(query);
    return JSON.parse(
      queryStr.replace(
        /\b(gte|gt|lt|lte)\b/gi,
        (match: any) => `$${match.toLowerCase()}`
      )
    );
  }

  // Helper function to extract Sort from Query
  static getSortByFromQuery(query: any) {
    if (!query.sort) return "-createdAt";

    const sort = query.sort as string;

    return sort.split(",").join(" ");
  }

  // Helper function to extract Fields from Query
  static limitFieldsForResponse(query: any) {
    if (!query.fields) return "-__v";

    const fields = query.fields as string;

    return fields.split(",").join(" ");
  }
}

export default HelperFunctions;
