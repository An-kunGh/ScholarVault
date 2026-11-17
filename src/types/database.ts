export type Semester = {
  id: string;
  user_id: string;
  semester_number: number;
  academic_year: string;
  period: string;
  created_at: string;
};

export type Course = {
  id: string;
  user_id: string;
  semester_id: string;
  course_code: string | null;
  course_name: string;
  description: string | null;
  color: string;
  created_at: string;
  semesters?: {
    semester_number: number;
    academic_year: string;
    period: string;
  };
};

export type LiteratureType =
  | "journal"
  | "book"
  | "paper"
  | "article"
  | "thesis"
  | "slides"
  | "other";

export type Literature = {
  id: string;
  user_id: string;
  course_id: string;
  title: string;
  description: string | null;
  literature_type: LiteratureType | string;
  file_path: string | null;
  external_url: string | null;
  author: string | null;
  publication_year: number | null;
  source: string | null;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
  courses?: {
    course_name: string;
    course_code: string | null;
    color: string;
  };
  tags?: Tag[];
};

export type Tag = {
  id: string;
  user_id: string;
  name: string;
  color: string;
};

export type LiteratureTag = {
  literature_id: string;
  tag_id: string;
  user_id: string;
};

export type Note = {
  id: string;
  user_id: string;
  literature_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  literatures?: {
    title: string;
    course_id: string;
    courses?: {
      course_name: string;
    };
  };
};
