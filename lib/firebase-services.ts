import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentSnapshot,
  Timestamp,
  serverTimestamp
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "./firebase";
import { Flower, User } from "./types";

// Collections
const FLOWERS_COLLECTION = "flowers";
const USERS_COLLECTION = "users";

// Flower Services
export class FlowerService {
  
  // Get all flowers for a user with pagination
  static async getFlowers(
    userId: string, 
    limitCount: number = 20, 
    lastVisible?: DocumentSnapshot
  ): Promise<{ flowers: Flower[], lastVisible: DocumentSnapshot | null }> {
    try {
      // Add a small delay to ensure index is ready
      await new Promise(resolve => setTimeout(resolve, 100));
      
      let q = query(
        collection(db, FLOWERS_COLLECTION),
        where("userId", "==", userId),
        orderBy("dateTaken", "desc"),
        limit(limitCount)
      );

      if (lastVisible) {
        q = query(q, startAfter(lastVisible));
      }

      const querySnapshot = await getDocs(q);
      const flowers: Flower[] = [];
      let newLastVisible: DocumentSnapshot | null = null;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        flowers.push({
          id: doc.id,
          ...data,
          dateTaken: data.dateTaken instanceof Timestamp ? data.dateTaken.toDate() : data.dateTaken,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
          updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt,
        } as Flower);
      });

      if (querySnapshot.docs.length > 0) {
        newLastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      }

      return { flowers, lastVisible: newLastVisible };
    } catch (error) {
      console.error("Error getting flowers:", error);
      throw error;
    }
  }

  // Get a single flower by ID
  static async getFlower(flowerId: string): Promise<Flower | null> {
    try {
      const docRef = doc(db, FLOWERS_COLLECTION, flowerId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          dateTaken: data.dateTaken instanceof Timestamp ? data.dateTaken.toDate() : data.dateTaken,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
          updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt,
        } as Flower;
      }
      return null;
    } catch (error) {
      console.error("Error getting flower:", error);
      throw error;
    }
  }

  // Add a new flower
  static async addFlower(flowerData: Omit<Flower, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, FLOWERS_COLLECTION), {
        ...flowerData,
        dateTaken: flowerData.dateTaken instanceof Date ? Timestamp.fromDate(flowerData.dateTaken) : flowerData.dateTaken,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error adding flower:", error);
      throw error;
    }
  }

  // Update a flower
  static async updateFlower(flowerId: string, updates: Partial<Flower>): Promise<void> {
    try {
      const docRef = doc(db, FLOWERS_COLLECTION, flowerId);
      const updateData = {
        ...updates,
        updatedAt: serverTimestamp(),
      };

      if (updates.dateTaken instanceof Date) {
        updateData.dateTaken = Timestamp.fromDate(updates.dateTaken);
      }

      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error("Error updating flower:", error);
      throw error;
    }
  }

  // Delete a flower
  static async deleteFlower(flowerId: string): Promise<void> {
    try {
      const docRef = doc(db, FLOWERS_COLLECTION, flowerId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting flower:", error);
      throw error;
    }
  }

  // Search flowers by note or category
  static async searchFlowers(
    userId: string, 
    searchTerm: string, 
    limitCount: number = 20
  ): Promise<Flower[]> {
    try {
      // Note: Firestore doesn't support full-text search natively
      // This is a basic implementation. For better search, consider using Algolia or similar
      const q = query(
        collection(db, FLOWERS_COLLECTION),
        where("userId", "==", userId),
        orderBy("dateTaken", "desc"),
        limit(limitCount * 2) // Get more to filter client-side
      );

      const querySnapshot = await getDocs(q);
      const flowers: Flower[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const flower = {
          id: doc.id,
          ...data,
          dateTaken: data.dateTaken instanceof Timestamp ? data.dateTaken.toDate() : data.dateTaken,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
          updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt,
        } as Flower;

        // Client-side filtering (not ideal for large datasets)
        if (
          flower.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
          flower.category.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          flowers.push(flower);
        }
      });

      return flowers.slice(0, limitCount);
    } catch (error) {
      console.error("Error searching flowers:", error);
      throw error;
    }
  }

  // Filter flowers by category and stage
  static async filterFlowers(
    userId: string, 
    filters: {
      category?: 'garden' | 'wild' | 'herbs' | null;
      stage?: 'fresh' | 'pressing' | 'pressed' | 'preserved' | null;
    },
    limitCount: number = 20
  ): Promise<Flower[]> {
    try {
      let q = query(
        collection(db, FLOWERS_COLLECTION),
        where("userId", "==", userId),
        orderBy("dateTaken", "desc"),
        limit(limitCount * 2) // Get more to filter client-side for stage
      );

      // Add category filter if specified
      if (filters.category) {
        q = query(q, where("category", "==", filters.category));
      }

      const querySnapshot = await getDocs(q);
      const flowers: Flower[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const flower = {
          id: doc.id,
          ...data,
          dateTaken: data.dateTaken instanceof Timestamp ? data.dateTaken.toDate() : data.dateTaken,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
          updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt,
        } as Flower;

        // Client-side stage filtering
        if (filters.stage) {
          const today = new Date();
          const flowerDate = flower.dateTaken instanceof Date ? flower.dateTaken : flower.dateTaken.toDate();
          const daysElapsed = Math.floor((today.getTime() - flowerDate.getTime()) / (1000 * 60 * 60 * 24));
          
          let matchesStage = false;
          switch (filters.stage) {
            case 'fresh':
              matchesStage = daysElapsed < 7;
              break;
            case 'pressing':
              matchesStage = daysElapsed >= 7 && daysElapsed < 30;
              break;
            case 'pressed':
              matchesStage = daysElapsed >= 30 && daysElapsed < 90;
              break;
            case 'preserved':
              matchesStage = daysElapsed >= 90;
              break;
          }
          
          if (matchesStage) {
            flowers.push(flower);
          }
        } else {
          flowers.push(flower);
        }
      });

      return flowers.slice(0, limitCount);
    } catch (error) {
      console.error("Error filtering flowers:", error);
      throw error;
    }
  }
}

// Image Services
export class ImageService {
  
  // Upload image to Firebase Storage with retry logic
  static async uploadImage(file: File, userId: string, retries: number = 3): Promise<string> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const timestamp = Date.now();
        const fileName = `${userId}/${timestamp}_${file.name}`;
        const storageRef = ref(storage, `flower-images/${fileName}`);
        
        // Add metadata to help with CORS
        const metadata = {
          contentType: file.type,
          customMetadata: {
            uploadedBy: userId,
            uploadedAt: new Date().toISOString()
          }
        };
        
        await uploadBytes(storageRef, file, metadata);
        const downloadURL = await getDownloadURL(storageRef);
        
        return downloadURL;
      } catch (error: any) {
        console.error(`Upload attempt ${attempt} failed:`, error);
        
        // If it's the last attempt, throw the error
        if (attempt === retries) {
          if (error.code === 'storage/unauthorized' || error.message?.includes('CORS')) {
            throw new Error('Upload failed due to permissions. Please check your internet connection and try again.');
          }
          throw new Error(`Upload failed after ${retries} attempts. Please try again later.`);
        }
        
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
    
    throw new Error('Upload failed');
  }
  
  // Upload background image to Firebase Storage
  static async uploadBackgroundImage(file: File, userId: string): Promise<string> {
    try {
      const timestamp = Date.now();
      const fileName = `${userId}/${timestamp}_${file.name}`;
      const storageRef = ref(storage, `background-images/${fileName}`);
      
      const metadata = {
        contentType: file.type,
        customMetadata: {
          uploadedBy: userId,
          uploadedAt: new Date().toISOString(),
          type: 'background'
        }
      };
      
      await uploadBytes(storageRef, file, metadata);
      const downloadURL = await getDownloadURL(storageRef);
      
      return downloadURL;
    } catch (error) {
      console.error("Error uploading background image:", error);
      throw new Error('Failed to upload background image. Please try again.');
    }
  }

  // Delete image from Firebase Storage
  static async deleteImage(imageUrl: string): Promise<void> {
    try {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
    } catch (error) {
      console.error("Error deleting image:", error);
      throw error;
    }
  }
}

// User Services
export class UserService {
  
  // Create or update user profile
  static async createOrUpdateUser(userData: Omit<User, 'createdAt'>): Promise<void> {
    try {
      const docRef = doc(db, USERS_COLLECTION, userData.id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // Update existing user
        await updateDoc(docRef, {
          ...userData,
          lastLoginAt: serverTimestamp(),
        });
      } else {
        // Create new user - use setDoc instead of updateDoc
        await setDoc(docRef, {
          ...userData,
          createdAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error("Error creating/updating user:", error);
      throw error;
    }
  }

  // Get user profile
  static async getUser(userId: string): Promise<User | null> {
    try {
      const docRef = doc(db, USERS_COLLECTION, userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
          lastLoginAt: data.lastLoginAt instanceof Timestamp ? data.lastLoginAt.toDate() : data.lastLoginAt,
        } as User;
      }
      return null;
    } catch (error) {
      console.error("Error getting user:", error);
      throw error;
    }
  }
} 