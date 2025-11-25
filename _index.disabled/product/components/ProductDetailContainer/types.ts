export type Review = {
  reviewer_name: string;
  review_date: string;
  content: string;
  rating: number;
  images: string[];
}

export type ReviewResponse = {
  number_of_raters: number;
  average_rating: number;
  reviews: Review[];
};