import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  DocumentData,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from './firebase';
import {
  HospitalInventoryItem,
  MedicalInventoryItem,
  Ward,
  Alert,
  Ambulance,
  TrendingDisease,
  AppUser,
} from './types';

// ============================================
// USER OPERATIONS
// ============================================

export async function createUser(uid: string, userData: Omit<AppUser, 'uid'>): Promise<void> {
  await setDoc(doc(db, 'users', uid), {
    ...userData,
    createdAt: new Date().toISOString(),
  });
}

export async function getUser(uid: string): Promise<AppUser | null> {
  const userDoc = await getDoc(doc(db, 'users', uid));
  if (!userDoc.exists()) return null;
  return { uid, ...userDoc.data() } as AppUser;
}

export async function updateUserRole(uid: string, role: AppUser['role']): Promise<void> {
  await updateDoc(doc(db, 'users', uid), { role });
}

// ============================================
// HOSPITAL INVENTORY OPERATIONS
// ============================================

export async function getHospitalInventory(): Promise<HospitalInventoryItem[]> {
  const snapshot = await getDocs(collection(db, 'hospital_inventory'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as HospitalInventoryItem));
}

export async function updateInventoryItem(id: string, updates: Partial<HospitalInventoryItem>): Promise<void> {
  await updateDoc(doc(db, 'hospital_inventory', id), {
    ...updates,
    last_updated: new Date().toISOString(),
  });
}

export function subscribeToInventory(callback: (items: HospitalInventoryItem[]) => void) {
  return onSnapshot(collection(db, 'hospital_inventory'), (snapshot) => {
    const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as HospitalInventoryItem));
    callback(items);
  });
}

// ============================================
// MEDICAL INVENTORY OPERATIONS
// ============================================

export async function getMedicalInventory(): Promise<MedicalInventoryItem[]> {
  const snapshot = await getDocs(collection(db, 'medical_inventory'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MedicalInventoryItem));
}

export async function requestRestock(itemId: string): Promise<void> {
  await updateDoc(doc(db, 'medical_inventory', itemId), {
    restock_requested: true,
    last_updated: new Date().toISOString(),
  });
}

export function subscribeToMedicalInventory(callback: (items: MedicalInventoryItem[]) => void) {
  return onSnapshot(collection(db, 'medical_inventory'), (snapshot) => {
    const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MedicalInventoryItem));
    callback(items);
  });
}

// ============================================
// WARD/BED OPERATIONS
// ============================================

export async function getWards(): Promise<Ward[]> {
  const snapshot = await getDocs(collection(db, 'wards'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ward));
}

export async function updateWardOccupancy(wardId: string, occupied: number): Promise<void> {
  const wardRef = doc(db, 'wards', wardId);
  const wardDoc = await getDoc(wardRef);
  
  if (wardDoc.exists()) {
    const wardData = wardDoc.data() as Ward;
    await updateDoc(wardRef, {
      occupied_beds: occupied,
      free_beds: wardData.total_beds - occupied,
      last_updated: new Date().toISOString(),
    });
  }
}

export function subscribeToWards(callback: (wards: Ward[]) => void) {
  return onSnapshot(collection(db, 'wards'), (snapshot) => {
    const wards = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ward));
    callback(wards);
  });
}

// ============================================
// ALERT OPERATIONS
// ============================================

export async function getAlerts(target?: 'public' | 'staff' | 'all'): Promise<Alert[]> {
  let q = query(collection(db, 'alerts'), orderBy('created_at', 'desc'));
  
  if (target) {
    q = query(collection(db, 'alerts'), where('target', 'in', [target, 'all']), orderBy('created_at', 'desc'));
  }
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Alert));
}

export async function createAlert(alert: Omit<Alert, 'id'>): Promise<string> {
  const alertRef = doc(collection(db, 'alerts'));
  await setDoc(alertRef, {
    ...alert,
    created_at: new Date().toISOString(),
    acknowledged: false,
  });
  return alertRef.id;
}

export async function acknowledgeAlert(alertId: string): Promise<void> {
  await updateDoc(doc(db, 'alerts', alertId), {
    acknowledged: true,
    acknowledged_at: new Date().toISOString(),
  });
}

export function subscribeToAlerts(callback: (alerts: Alert[]) => void, target?: 'public' | 'staff' | 'all') {
  let q = query(collection(db, 'alerts'), orderBy('created_at', 'desc'));
  
  if (target) {
    q = query(collection(db, 'alerts'), where('target', 'in', [target, 'all']), orderBy('created_at', 'desc'));
  }
  
  return onSnapshot(q, (snapshot) => {
    const alerts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Alert));
    callback(alerts);
  });
}

// ============================================
// AMBULANCE OPERATIONS
// ============================================

export async function getAmbulances(): Promise<Ambulance[]> {
  const snapshot = await getDocs(collection(db, 'ambulances'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ambulance));
}

export async function getActiveAmbulances(): Promise<Ambulance[]> {
  const q = query(collection(db, 'ambulances'), where('status', '==', 'en_route'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ambulance));
}

export async function updateAmbulanceStatus(
  ambulanceId: string,
  status: Ambulance['status'],
  routeData?: Partial<Ambulance>
): Promise<void> {
  await updateDoc(doc(db, 'ambulances', ambulanceId), {
    status,
    ...routeData,
    updated_at: new Date().toISOString(),
  });
}

export function subscribeToAmbulances(callback: (ambulances: Ambulance[]) => void) {
  return onSnapshot(collection(db, 'ambulances'), (snapshot) => {
    const ambulances = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ambulance));
    callback(ambulances);
  });
}

export function subscribeToActiveAmbulances(callback: (ambulances: Ambulance[]) => void) {
  const q = query(collection(db, 'ambulances'), where('status', '==', 'en_route'));
  return onSnapshot(q, (snapshot) => {
    const ambulances = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ambulance));
    callback(ambulances);
  });
}

// ============================================
// TRENDING DISEASES OPERATIONS
// ============================================

export async function getTrendingDiseases(city?: string): Promise<TrendingDisease[]> {
  let q = query(collection(db, 'trending_diseases'), orderBy('cases_count', 'desc'));
  
  if (city) {
    q = query(collection(db, 'trending_diseases'), where('city', '==', city), orderBy('cases_count', 'desc'));
  }
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TrendingDisease));
}

export function subscribeToTrendingDiseases(callback: (diseases: TrendingDisease[]) => void, city?: string) {
  let q = query(collection(db, 'trending_diseases'), orderBy('cases_count', 'desc'));
  
  if (city) {
    q = query(collection(db, 'trending_diseases'), where('city', '==', city), orderBy('cases_count', 'desc'));
  }
  
  return onSnapshot(q, (snapshot) => {
    const diseases = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TrendingDisease));
    callback(diseases);
  });
}
