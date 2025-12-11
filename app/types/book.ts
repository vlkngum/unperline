export interface Book {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
      extraLarge?: string;
      large?: string;
      medium?: string;
      small?: string;
    };
    description?: string;
    publishedDate?: string;
    publisher?: string;
    averageRating?: number;
  };
}

export interface GoogleBooksResponse {
  items?: Book[];
  totalItems: number;
}
