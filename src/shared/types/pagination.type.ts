type Pagination = {
  currentPage: number;
  limit: number;
  skip: number;
  prevPage: number | null;
  nextPage: number | null;
  numberOfPages: number;
};

export default Pagination;
