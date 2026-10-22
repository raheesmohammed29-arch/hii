export type ReportType = 'lost' | 'found';

export type ItemCategory = 
  | 'Electronics'
  | 'Documents'
  | 'Bags'
  | 'Keys'
  | 'Jewellery'
  | 'Clothing'
  | 'Pets'
  | 'Books'
  | 'Other';

export type ReportStatus = 
  | 'pending_review'
  | 'approved'
  | 'under_claim'
  | 'recovered'
  | 'closed';

export type ClaimStatus = 
  | 'pending'
  | 'under_review'
  | 'approved'
  | 'rejected';

export type UserRole = 'user' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  district?: string;
  role: UserRole;
  createdAt: string;
}

export interface ItemReport {
  id: string;
  referenceNo: string; // e.g. "FB-2026-9812"
  userId: string;
  userEmail?: string;
  userName?: string;
  reportType: ReportType;
  title: string;
  category: ItemCategory;
  description: string;
  privateIdentifyingDetails?: string; // Private, only owner/admin can see
  district: string;
  approximateLocation: string; // Public-safe (e.g. "Fort Railway Station Platform 3")
  dateOccurred: string;
  contactPreference: 'platform_only' | 'email' | 'phone_masked';
  contactPhone?: string;
  imageUrl?: string;
  status: ReportStatus;
  isSample: boolean; // True for pre-seeded demonstration records
  createdAt: string;
  updatedAt: string;
}

export interface OwnershipClaim {
  id: string;
  claimReferenceNo: string; // e.g. "CLM-2026-4401"
  itemId: string;
  itemTitle?: string;
  claimantId: string;
  claimantName: string;
  claimantEmail: string;
  claimantPhone: string;
  privateEvidenceNotes: string; // Serial no, distinctive marks, contents
  privateProofImageUrl?: string;
  status: ClaimStatus;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface AdminAuditLog {
  id: string;
  adminId: string;
  adminEmail: string;
  action: string;
  targetType: 'report' | 'claim' | 'user' | 'system';
  targetId: string;
  details: string;
  createdAt: string;
}

export const SRI_LANKA_DISTRICTS = [
  'Colombo',
  'Gampaha',
  'Kalutara',
  'Kandy',
  'Matale',
  'Nuwara Eliya',
  'Galle',
  'Matara',
  'Hambantota',
  'Jaffna',
  'Kilinochchi',
  'Mannar',
  'Vavuniya',
  'Mullaitivu',
  'Batticaloa',
  'Ampara',
  'Trincomalee',
  'Kurunegala',
  'Puttalam',
  'Anuradhapura',
  'Polonnaruwa',
  'Badulla',
  'Monaragala',
  'Ratnapura',
  'Kegalle'
] as const;

export const ITEM_CATEGORIES: ItemCategory[] = [
  'Electronics',
  'Documents',
  'Bags',
  'Keys',
  'Jewellery',
  'Clothing',
  'Pets',
  'Books',
  'Other'
];
