export interface User {
  username: string;
  nickname: string;
  avatar: string;
  coverImage: string;
  bio: string;
  joinDate: string;
  socialLinks: {
    facebook: string;
    twitter: string;
    instagram: string;
    pinterest: string;
  };
}
