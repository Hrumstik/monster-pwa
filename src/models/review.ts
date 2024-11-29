export interface Review {
  reviewAuthorName: string;
  reviewAuthorIcon?: string;
  reviewAuthorRating: number;
  reviewIconColor?: string;
  reviewText: Record<string, string>;
  devResponse?: Record<string, string>;
  reviewDate: string;
  id?: string;
  isActive?: boolean;
}
