import { ItemReport, OwnershipClaim, AdminAuditLog, AppNotification, ReportStatus, ClaimStatus } from '../types';
import { INITIAL_SAMPLE_REPORTS, INITIAL_SAMPLE_CLAIMS, INITIAL_SAMPLE_LOGS } from '../data/sampleData';
import { getSupabaseClient, isSupabaseConfigured } from './supabase';

const LOCAL_STORAGE_REPORTS_KEY = 'findback_lk_reports_v1';
const LOCAL_STORAGE_CLAIMS_KEY = 'findback_lk_claims_v1';
const LOCAL_STORAGE_LOGS_KEY = 'findback_lk_logs_v1';
const LOCAL_STORAGE_NOTIFS_KEY = 'findback_lk_notifs_v1';

// Local storage fallbacks
const getStoredReports = (): ItemReport[] => {
  const data = localStorage.getItem(LOCAL_STORAGE_REPORTS_KEY);
  if (!data) {
    localStorage.setItem(LOCAL_STORAGE_REPORTS_KEY, JSON.stringify(INITIAL_SAMPLE_REPORTS));
    return INITIAL_SAMPLE_REPORTS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_SAMPLE_REPORTS;
  }
};

const setStoredReports = (reports: ItemReport[]): void => {
  localStorage.setItem(LOCAL_STORAGE_REPORTS_KEY, JSON.stringify(reports));
};

const getStoredClaims = (): OwnershipClaim[] => {
  const data = localStorage.getItem(LOCAL_STORAGE_CLAIMS_KEY);
  if (!data) {
    localStorage.setItem(LOCAL_STORAGE_CLAIMS_KEY, JSON.stringify(INITIAL_SAMPLE_CLAIMS));
    return INITIAL_SAMPLE_CLAIMS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_SAMPLE_CLAIMS;
  }
};

const setStoredClaims = (claims: OwnershipClaim[]): void => {
  localStorage.setItem(LOCAL_STORAGE_CLAIMS_KEY, JSON.stringify(claims));
};

const getStoredLogs = (): AdminAuditLog[] => {
  const data = localStorage.getItem(LOCAL_STORAGE_LOGS_KEY);
  if (!data) {
    localStorage.setItem(LOCAL_STORAGE_LOGS_KEY, JSON.stringify(INITIAL_SAMPLE_LOGS));
    return INITIAL_SAMPLE_LOGS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_SAMPLE_LOGS;
  }
};

const setStoredLogs = (logs: AdminAuditLog[]): void => {
  localStorage.setItem(LOCAL_STORAGE_LOGS_KEY, JSON.stringify(logs));
};

const getStoredNotifications = (): AppNotification[] => {
  const data = localStorage.getItem(LOCAL_STORAGE_NOTIFS_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
};

const setStoredNotifications = (notifs: AppNotification[]): void => {
  localStorage.setItem(LOCAL_STORAGE_NOTIFS_KEY, JSON.stringify(notifs));
};

export const generateReportRef = (): string => {
  const random4 = Math.floor(1000 + Math.random() * 9000);
  return `FB-2026-${random4}`;
};

export const generateClaimRef = (): string => {
  const random4 = Math.floor(1000 + Math.random() * 9000);
  return `CLM-2026-${random4}`;
};

/**
 * REPORT OPERATIONS
 */
export const fetchItemReports = async (): Promise<ItemReport[]> => {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('item_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetch reports returned error, falling back to local cache:', error.message);
        return getStoredReports();
      }

      if (data) {
        // Map database columns to application model
        const mapped: ItemReport[] = data.map((item: any) => ({
          id: item.id,
          referenceNo: item.reference_no,
          userId: item.user_id,
          userEmail: item.user_email,
          userName: item.user_name,
          reportType: item.report_type,
          title: item.title,
          category: item.category,
          description: item.description,
          privateIdentifyingDetails: item.private_identifying_details,
          district: item.district,
          approximateLocation: item.approximate_location,
          dateOccurred: item.date_occurred,
          contactPreference: item.contact_preference,
          contactPhone: item.contact_phone,
          imageUrl: item.image_url,
          status: item.status,
          isSample: item.is_sample ?? false,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
        }));

        // If Supabase table is empty, merge sample reports so the app has initial content
        if (mapped.length === 0) {
          return getStoredReports();
        }

        // Cache locally for offline/resilience
        setStoredReports(mapped);
        return mapped;
      }
    } catch (err) {
      console.warn('Supabase query error:', err);
    }
  }

  return getStoredReports();
};

export const saveNewReport = async (
  reportData: Omit<ItemReport, 'id' | 'referenceNo' | 'createdAt' | 'updatedAt' | 'isSample'>
): Promise<ItemReport> => {
  const newReport: ItemReport = {
    ...reportData,
    id: `rep-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    referenceNo: generateReportRef(),
    isSample: false, // Live user report
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('item_reports')
        .insert({
          reference_no: newReport.referenceNo,
          user_id: newReport.userId.startsWith('anon-') || newReport.userId.startsWith('usr-') ? null : newReport.userId,
          user_email: newReport.userEmail,
          user_name: newReport.userName,
          report_type: newReport.reportType,
          title: newReport.title,
          category: newReport.category,
          description: newReport.description,
          private_identifying_details: newReport.privateIdentifyingDetails,
          district: newReport.district,
          approximate_location: newReport.approximateLocation,
          date_occurred: newReport.dateOccurred,
          contact_preference: newReport.contactPreference,
          contact_phone: newReport.contactPhone,
          image_url: newReport.imageUrl,
          status: newReport.status,
          is_sample: false,
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase real insert failed:', error.message);
      } else if (data) {
        newReport.id = data.id;
      }
    } catch (e) {
      console.error('Failed to insert directly to Supabase:', e);
    }
  }

  // Also maintain local store
  const current = getStoredReports();
  const updated = [newReport, ...current];
  setStoredReports(updated);

  return newReport;
};

export const updateReportStatus = async (
  reportId: string, 
  newStatus: ReportStatus, 
  adminEmail: string
): Promise<ItemReport | null> => {
  const current = getStoredReports();
  const index = current.findIndex(r => r.id === reportId);
  const targetReport = index !== -1 ? current[index] : null;

  const client = getSupabaseClient();
  if (client) {
    try {
      await client
        .from('item_reports')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', reportId);
    } catch (e) {
      console.warn('Supabase update status failed:', e);
    }
  }

  if (targetReport) {
    const updatedReport: ItemReport = {
      ...targetReport,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    };
    current[index] = updatedReport;
    setStoredReports(current);

    // Audit log
    addAdminAuditLog({
      adminId: 'admin-action',
      adminEmail,
      action: `UPDATE_REPORT_STATUS_${newStatus.toUpperCase()}`,
      targetType: 'report',
      targetId: targetReport.referenceNo,
      details: `Status transitioned from ${targetReport.status} to ${newStatus}.`,
    });

    if (targetReport.userId) {
      createNotification({
        userId: targetReport.userId,
        title: `Report Status Updated: ${targetReport.referenceNo}`,
        message: `Your report for "${targetReport.title}" is now marked as ${newStatus.replace('_', ' ')}.`,
        link: `/items/${targetReport.id}`,
      });
    }

    return updatedReport;
  }

  return null;
};

export const withdrawReport = async (reportId: string, userId: string): Promise<boolean> => {
  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('item_reports').delete().eq('id', reportId);
    } catch (e) {
      console.warn('Supabase delete error:', e);
    }
  }

  const current = getStoredReports();
  const updated = current.filter(r => r.id !== reportId);
  setStoredReports(updated);

  return true;
};

/**
 * OWNERSHIP CLAIMS OPERATIONS
 */
export const fetchOwnershipClaims = async (): Promise<OwnershipClaim[]> => {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('ownership_claims')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((item: any) => ({
          id: item.id,
          claimReferenceNo: item.claim_reference_no,
          itemId: item.item_id,
          itemTitle: item.item_title,
          claimantId: item.claimant_id || '',
          claimantName: item.claimant_name,
          claimantEmail: item.claimant_email,
          claimantPhone: item.claimant_phone,
          privateEvidenceNotes: item.private_evidence_notes,
          privateProofImageUrl: item.private_proof_image_url,
          status: item.status,
          adminNotes: item.admin_notes,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
        }));
      }
    } catch (e) {
      console.warn('Supabase fetch claims error:', e);
    }
  }

  return getStoredClaims();
};

export const submitOwnershipClaim = async (
  claimData: Omit<OwnershipClaim, 'id' | 'claimReferenceNo' | 'createdAt' | 'updatedAt' | 'status'>
): Promise<OwnershipClaim> => {
  const newClaim: OwnershipClaim = {
    ...claimData,
    id: `clm-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    claimReferenceNo: generateClaimRef(),
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('ownership_claims')
        .insert({
          claim_reference_no: newClaim.claimReferenceNo,
          item_id: newClaim.itemId.startsWith('sample-') || newClaim.itemId.startsWith('rep-') ? null : newClaim.itemId,
          claimant_id: newClaim.claimantId.startsWith('claimant-') || newClaim.claimantId.startsWith('usr-') ? null : newClaim.claimantId,
          claimant_name: newClaim.claimantName,
          claimant_email: newClaim.claimantEmail,
          claimant_phone: newClaim.claimantPhone,
          private_evidence_notes: newClaim.privateEvidenceNotes,
          private_proof_image_url: newClaim.privateProofImageUrl,
          status: 'pending',
        })
        .select()
        .single();

      if (!error && data) {
        newClaim.id = data.id;
      }
    } catch (e) {
      console.warn('Supabase claim insert warning:', e);
    }
  }

  const current = getStoredClaims();
  const updated = [newClaim, ...current];
  setStoredClaims(updated);

  createNotification({
    userId: 'admin',
    title: `New Ownership Claim: ${newClaim.claimReferenceNo}`,
    message: `${newClaim.claimantName} filed an ownership claim for "${newClaim.itemTitle || 'an item'}".`,
    link: `/admin`,
  });

  return newClaim;
};

export const reviewOwnershipClaim = async (
  claimId: string,
  status: ClaimStatus,
  adminNotes: string,
  adminEmail: string
): Promise<OwnershipClaim | null> => {
  const claims = getStoredClaims();
  const idx = claims.findIndex(c => c.id === claimId);
  const targetClaim = idx !== -1 ? claims[idx] : null;

  const client = getSupabaseClient();
  if (client) {
    try {
      await client
        .from('ownership_claims')
        .update({
          status,
          admin_notes: adminNotes,
          updated_at: new Date().toISOString()
        })
        .eq('id', claimId);
    } catch (e) {
      console.warn('Supabase claim update warning:', e);
    }
  }

  if (targetClaim) {
    const updatedClaim: OwnershipClaim = {
      ...targetClaim,
      status,
      adminNotes,
      updatedAt: new Date().toISOString(),
    };
    claims[idx] = updatedClaim;
    setStoredClaims(claims);

    if (status === 'approved') {
      const reports = getStoredReports();
      const repIdx = reports.findIndex(r => r.id === targetClaim.itemId);
      if (repIdx !== -1) {
        reports[repIdx].status = 'under_claim';
        reports[repIdx].updatedAt = new Date().toISOString();
        setStoredReports(reports);
      }
    }

    addAdminAuditLog({
      adminId: 'admin-action',
      adminEmail,
      action: `CLAIM_${status.toUpperCase()}`,
      targetType: 'claim',
      targetId: targetClaim.claimReferenceNo,
      details: `Admin decision: ${status}. Admin notes: ${adminNotes || 'None'}`,
    });

    createNotification({
      userId: targetClaim.claimantId,
      title: `Ownership Claim ${status === 'approved' ? 'Approved' : 'Reviewed'}: ${targetClaim.claimReferenceNo}`,
      message: `Your claim for "${targetClaim.itemTitle}" has been marked as ${status.replace('_', ' ')}. ${adminNotes ? 'Note: ' + adminNotes : ''}`,
      link: `/dashboard`,
    });

    return updatedClaim;
  }

  return null;
};

/**
 * NOTIFICATIONS & AUDIT LOGS
 */
export const fetchNotificationsForUser = (userId: string): AppNotification[] => {
  const notifs = getStoredNotifications();
  return notifs.filter(n => n.userId === userId || (userId.includes('admin') && n.userId === 'admin'));
};

export const createNotification = (notif: Omit<AppNotification, 'id' | 'createdAt' | 'isRead'>): AppNotification => {
  const newNotif: AppNotification = {
    ...notif,
    id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
    isRead: false,
    createdAt: new Date().toISOString(),
  };

  const current = getStoredNotifications();
  setStoredNotifications([newNotif, ...current]);
  return newNotif;
};

export const markNotificationRead = (notifId: string): void => {
  const current = getStoredNotifications();
  const updated = current.map(n => n.id === notifId ? { ...n, isRead: true } : n);
  setStoredNotifications(updated);
};

export const fetchAdminAuditLogs = (): AdminAuditLog[] => {
  return getStoredLogs();
};

export const addAdminAuditLog = (log: Omit<AdminAuditLog, 'id' | 'createdAt'>): AdminAuditLog => {
  const newLog: AdminAuditLog = {
    ...log,
    id: `log-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  const current = getStoredLogs();
  setStoredLogs([newLog, ...current]);
  return newLog;
};
