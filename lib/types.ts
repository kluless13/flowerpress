import { Timestamp } from "firebase/firestore";

export interface Flower {
  id?: string;
  imageUrl: string;
  note: string;
  dateTaken: Date | Timestamp;
  category: 'garden' | 'wild' | 'herbs';
  aspectRatio: number;
  userId?: string;
  createdAt?: Date | Timestamp;
  updatedAt?: Date | Timestamp;
  background?: {
    type: 'none' | 'preset' | 'custom';
    value?: string; // preset name or custom image URL
  };
}

export interface User {
  id: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date | Timestamp;
  lastLoginAt?: Date | Timestamp;
} 