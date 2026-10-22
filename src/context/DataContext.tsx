import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ItemReport, OwnershipClaim, AdminAuditLog, AppNotification, ReportStatus, ClaimStatus } from '../types';
import { 
  fetchItemReports, 
  fetchOwnershipClaims, 
  fetchAdminAuditLogs, 
  fetchNotificationsForUser,
  saveNewReport,
  updateReportStatus,
  withdrawReport,
  submitOwnershipClaim,
  reviewOwnershipClaim,
  markNotificationRead
} from '../lib/storage';
import { useAuth } from './AuthContext';

interface DataContextType {
  reports: ItemReport[];
  claims: OwnershipClaim[];
  logs: AdminAuditLog[];
  notifications: AppNotification[];
  loading: boolean;
  refreshData: () => Promise<void>;
  createReport: (reportData: Omit<ItemReport, 'id' | 'referenceNo' | 'createdAt' | 'updatedAt' | 'isSample'>) => Promise<ItemReport>;
  changeReportStatus: (reportId: string, newStatus: ReportStatus) => Promise<ItemReport | null>;
  deleteUserReport: (reportId: string) => Promise<boolean>;
  submitClaim: (claimData: Omit<OwnershipClaim, 'id' | 'claimReferenceNo' | 'createdAt' | 'updatedAt' | 'status'>) => Promise<OwnershipClaim>;
  decideClaim: (claimId: string, status: ClaimStatus, adminNotes: string) => Promise<OwnershipClaim | null>;
  markNotifAsRead: (notifId: string) => void;
  stats: {
    totalReports: number;
    lostCount: number;
    foundCount: number;
    pendingClaims: number;
    recoveredCount: number;
    activeReports: number;
  };
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [reports, setReports] = useState<ItemReport[]>([]);
  const [claims, setClaims] = useState<OwnershipClaim[]>([]);
  const [logs, setLogs] = useState<AdminAuditLog[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      const [allReports, allClaims, allLogs] = await Promise.all([
        fetchItemReports(),
        fetchOwnershipClaims(),
        fetchAdminAuditLogs(),
      ]);
      setReports(allReports);
      setClaims(allClaims);
      setLogs(allLogs);

      if (user) {
        const notifs = fetchNotificationsForUser(user.id);
        setNotifications(notifs);
      } else {
        setNotifications([]);
      }
    } catch (err) {
      console.error('Failed to load application data:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const createReport = async (
    reportData: Omit<ItemReport, 'id' | 'referenceNo' | 'createdAt' | 'updatedAt' | 'isSample'>
  ): Promise<ItemReport> => {
    const created = await saveNewReport(reportData);
    await refreshData();
    return created;
  };

  const changeReportStatus = async (reportId: string, newStatus: ReportStatus): Promise<ItemReport | null> => {
    const adminEmail = user?.email || 'admin@findback.lk';
    const updated = await updateReportStatus(reportId, newStatus, adminEmail);
    await refreshData();
    return updated;
  };

  const deleteUserReport = async (reportId: string): Promise<boolean> => {
    if (!user) return false;
    const ok = await withdrawReport(reportId, user.id);
    if (ok) {
      await refreshData();
    }
    return ok;
  };

  const submitClaim = async (
    claimData: Omit<OwnershipClaim, 'id' | 'claimReferenceNo' | 'createdAt' | 'updatedAt' | 'status'>
  ): Promise<OwnershipClaim> => {
    const created = await submitOwnershipClaim(claimData);
    await refreshData();
    return created;
  };

  const decideClaim = async (
    claimId: string, 
    status: ClaimStatus, 
    adminNotes: string
  ): Promise<OwnershipClaim | null> => {
    const adminEmail = user?.email || 'admin@findback.lk';
    const updated = await reviewOwnershipClaim(claimId, status, adminNotes, adminEmail);
    await refreshData();
    return updated;
  };

  const markNotifAsRead = (notifId: string) => {
    markNotificationRead(notifId);
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, isRead: true } : n));
  };

  const stats = {
    totalReports: reports.length,
    lostCount: reports.filter(r => r.reportType === 'lost').length,
    foundCount: reports.filter(r => r.reportType === 'found').length,
    pendingClaims: claims.filter(c => c.status === 'pending' || c.status === 'under_review').length,
    recoveredCount: reports.filter(r => r.status === 'recovered').length,
    activeReports: reports.filter(r => r.status === 'approved' || r.status === 'under_claim').length,
  };

  return (
    <DataContext.Provider
      value={{
        reports,
        claims,
        logs,
        notifications,
        loading,
        refreshData,
        createReport,
        changeReportStatus,
        deleteUserReport,
        submitClaim,
        decideClaim,
        markNotifAsRead,
        stats,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
