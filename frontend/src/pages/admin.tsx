import { useState, useEffect, useCallback } from 'react';
import { confessionApi, adminApi } from '@/api/client';
import { useToastContext } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import type { Confession, AdminStatsResponse } from '@/../../shared/types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Inbox,
  CheckCircle2,
  XCircle,
  Send,
  LogOut,
  Loader2,
  AlertCircle,
  Shield,
  RefreshCw,
  Clock,
  Hash,
  ExternalLink,
  Copy,
  Check,
  Edit2,
  Activity,
  Zap,
  BarChart3,
  ArrowLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatedClouds } from '@/components/ui-custom/animated-clouds';
import { ScrollReveal } from '@/components/ui-custom/scroll-reveal';
import { ThreadsIcon } from '@/components/ui-custom/threads-icon';

// ============================================================================
// TYPES
// ============================================================================

interface ActivityItem {
  id: number;
  action: 'approved' | 'rejected' | 'posted';
  confessionId: number;
  timestamp: string;
  details?: string;
}

// ============================================================================
// LOGIN FORM COMPONENT
// ============================================================================

interface LoginFormProps {
  onLogin: (apiKey: string) => void;
  isLoading: boolean;
  error: string | null;
}

function LoginForm({ onLogin, isLoading, error }: LoginFormProps) {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(apiKey);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#FFFBF5] relative overflow-hidden">
      {/* Animated Decorative Clouds */}
      <AnimatedClouds />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <ScrollReveal>
          <div className="text-center mb-8">
            <motion.div
              className="w-20 h-20 rounded-full bg-[#FFD93D] border-[3px] border-[#2D3436] flex items-center justify-center mx-auto mb-4 shadow-[4px_4px_0px_#2D3436]"
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
              <Shield className="w-10 h-10 text-[#2D3436]" />
            </motion.div>
            <h1 className="font-display text-3xl font-bold text-[#2D3436] mb-2">
              Admin Portal
            </h1>
            <p className="font-body text-[#636E72]">
              Secure access to moderation panel
            </p>
          </div>
        </ScrollReveal>

        {/* Login Card */}
        <ScrollReveal delay={0.1}>
          <motion.div
            className="bg-white rounded-[32px] border-[3px] border-[#2D3436] shadow-[8px_8px_0px_#2D3436] p-8"
            whileHover={{
              y: -4,
              boxShadow: "10px 10px 0px #2D3436",
            }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block font-display font-semibold text-[#2D3436] mb-2">
                  API Key
                </label>
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your admin API key"
                    className="w-full px-4 py-3 rounded-2xl font-body text-[#2D3436] bg-[#FFFBF5] border-[3px] border-[#2D3436] shadow-[3px_3px_0px_#2D3436] outline-none focus:shadow-[5px_5px_0px_#2D3436] focus:-translate-y-0.5 transition-all placeholder:text-[#B2BEC3]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 font-body text-sm text-[#636E72] hover:text-[#2D3436] transition-colors"
                  >
                    {showKey ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              {error && (
                <motion.div
                  className="flex items-center gap-2 p-4 rounded-xl bg-[#FF6B6B]/10 border-[2px] border-[#FF6B6B] text-[#FF6B6B] font-body text-sm"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}>
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  {error}
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={isLoading || !apiKey.trim()}
                className="w-full h-12 rounded-full font-display font-bold text-base bg-[#FF7EB3] text-white border-[3px] border-[#2D3436] shadow-[4px_4px_0px_#2D3436] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{
                  scale: 1.02,
                  boxShadow: "6px 6px 0px #2D3436",
                  y: -2,
                }}
                whileTap={{
                  scale: 0.98,
                  boxShadow: "2px 2px 0px #2D3436",
                  y: 0,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    Access Dashboard
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-6 pt-6 border-t-[2px] border-dashed border-[#DFE6E9] text-center">
              <motion.a
                href="/"
                className="font-body text-[#636E72] hover:text-[#2D3436] text-sm transition-colors flex items-center justify-center gap-1"
                whileHover={{ x: -2 }}>
                <ArrowLeft className="w-4 h-4" />
                Back to Website
              </motion.a>
            </div>
          </motion.div>
        </ScrollReveal>

        {/* Security Note */}
        <motion.p
          className="text-center font-body text-[#B2BEC3] text-xs mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}>
          Secure connection • End-to-end encrypted
        </motion.p>
      </div>
    </div>
  );
}

// ============================================================================
// STAT CARD COMPONENT
// ============================================================================

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend?: string;
  color: 'yellow' | 'green' | 'red' | 'blue' | 'pink';
  delay?: number;
}

const colorVariants = {
  yellow: { bg: 'bg-[#FFD93D]', text: 'text-[#2D3436]', border: 'border-[#2D3436]', hex: '#FFD93D' },
  green: { bg: 'bg-[#1DD1A1]', text: 'text-white', border: 'border-[#2D3436]', hex: '#1DD1A1' },
  red: { bg: 'bg-[#FF6B6B]', text: 'text-white', border: 'border-[#2D3436]', hex: '#FF6B6B' },
  blue: { bg: 'bg-[#4A90E2]', text: 'text-white', border: 'border-[#2D3436]', hex: '#4A90E2' },
  pink: { bg: 'bg-[#FF7EB3]', text: 'text-white', border: 'border-[#2D3436]', hex: '#FF7EB3' },
};

function StatCard({ title, value, icon, trend, color, delay = 0 }: StatCardProps) {
  const [mounted, setMounted] = useState(false);
  const colors = colorVariants[color];

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-3xl border-[3px] bg-white p-6 transition-all duration-500",
        colors.border,
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      )}
      style={{ boxShadow: `4px 4px 0px ${colors.hex}` }}
      whileHover={{
        y: -8,
        boxShadow: `8px 8px 0px ${colors.hex}`,
      }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}>
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <motion.div
            className={cn("w-12 h-12 rounded-2xl flex items-center justify-center border-[3px] border-[#2D3436] shadow-[2px_2px_0px_#2D3436]", colors.bg, colors.text)}
            whileHover={{ rotate: [0, -10, 10, 0], scale: 1.05 }}
            transition={{ duration: 0.5 }}>
            {icon}
          </motion.div>
          {trend && (
            <motion.span
              className="font-display text-xs font-semibold px-3 py-1 rounded-full bg-[#FF6B6B]/10 text-[#FF6B6B] border-[2px] border-[#FF6B6B]"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}>
              {trend}
            </motion.span>
          )}
        </div>

        <p className="font-body text-[#636E72] text-sm font-medium mb-1">
          {title}
        </p>
        <motion.p
          className="font-display text-3xl font-bold text-[#2D3436]"
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 17, delay: delay / 1000 + 0.2 }}>
          {value.toLocaleString()}
        </motion.p>
      </div>
    </motion.div>
  );
}

// ============================================================================
// CONFESSION CARD COMPONENT
// ============================================================================

interface ConfessionCardProps {
  confession: Confession;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  onEdit: (id: number, content: string) => void;
  isProcessing: boolean;
  selected: boolean;
  onSelect: (checked: boolean) => void;
}

function ConfessionCard({
  confession,
  onApprove,
  onReject,
  onEdit,
  isProcessing,
  selected,
  onSelect,
}: ConfessionCardProps) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(confession.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString.replace(' ', 'T') + 'Z');
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <motion.div
      className={cn(
        "group relative bg-white rounded-3xl border-[3px] transition-all duration-300",
        selected ? 'border-[#9B59B6] shadow-[4px_4px_0px_#9B59B6]' : 'border-[#2D3436] shadow-[4px_4px_0px_#2D3436]'
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -4,
        boxShadow: selected ? "6px 6px 0px #9B59B6" : "6px 6px 0px #2D3436",
      }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}>
      {/* Selection Checkbox */}
      <div className="absolute top-4 left-4 z-10">
        <input
          type="checkbox"
          checked={selected}
          onChange={(e) => onSelect(e.target.checked)}
          className="w-5 h-5 rounded-lg border-[3px] border-[#2D3436] bg-white text-[#9B59B6] focus:ring-[#9B59B6] cursor-pointer"
        />
      </div>

      {/* Header */}
      <div className="px-4 pt-4 pb-3 pl-12 border-b-[2px] border-dashed border-[#DFE6E9]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-xs text-white bg-[#9B59B6] px-2 py-1 rounded-lg border-[2px] border-[#2D3436] flex items-center gap-1">
              <Hash className="w-3 h-3" />
              {confession.id}
            </span>
          </div>
          <span className="font-body text-xs text-[#636E72] flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatDate(confession.created_at)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pl-12">
        <p className="font-body text-[#2D3436] text-sm leading-relaxed whitespace-pre-wrap">
          {confession.content}
        </p>
      </div>

      {/* Actions */}
      <div className="px-4 pb-4 pl-12">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <motion.button
              onClick={handleCopy}
              className="h-9 px-3 rounded-xl font-body text-sm text-[#636E72] hover:text-[#2D3436] hover:bg-[#F4F4F5] border-[2px] border-transparent hover:border-[#2D3436] transition-all flex items-center gap-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}>
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-[#1DD1A1]" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </>
              )}
            </motion.button>
            <motion.button
              onClick={() => onEdit(confession.id, confession.content)}
              disabled={isProcessing}
              className="h-9 px-3 rounded-xl font-body text-sm text-[#636E72] hover:text-[#2D3436] hover:bg-[#F4F4F5] border-[2px] border-transparent hover:border-[#2D3436] transition-all flex items-center gap-1 disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}>
              <Edit2 className="w-4 h-4" />
              <span>Edit</span>
            </motion.button>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              onClick={() => onReject(confession.id)}
              disabled={isProcessing}
              className="h-10 px-4 rounded-xl font-display font-semibold text-sm text-[#FF6B6B] bg-white border-[3px] border-[#FF6B6B] shadow-[2px_2px_0px_#FF6B6B] flex items-center gap-1 disabled:opacity-50"
              whileHover={{
                scale: 1.05,
                boxShadow: "4px 4px 0px #FF6B6B",
                y: -2,
              }}
              whileTap={{
                scale: 0.98,
                boxShadow: "1px 1px 0px #FF6B6B",
                y: 0,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}>
              <XCircle className="w-4 h-4" />
              <span>Reject</span>
            </motion.button>
            <motion.button
              onClick={() => onApprove(confession.id)}
              disabled={isProcessing}
              className="h-10 px-4 rounded-xl font-display font-semibold text-sm text-white bg-[#1DD1A1] border-[3px] border-[#2D3436] shadow-[2px_2px_0px_#2D3436] flex items-center gap-1 disabled:opacity-50"
              whileHover={{
                scale: 1.05,
                boxShadow: "4px 4px 0px #2D3436",
                y: -2,
              }}
              whileTap={{
                scale: 0.98,
                boxShadow: "1px 1px 0px #2D3436",
                y: 0,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}>
              <CheckCircle2 className="w-4 h-4" />
              <span>Approve</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// MAIN ADMIN DASHBOARD
// ============================================================================

export default function AdminPage() {
  const { toast } = useToastContext();
  
  // Auth state
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('admin_api_key') || '';
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('admin_api_key');
  });
  const [isVerifying, setIsVerifying] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Data state
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [stats, setStats] = useState<AdminStatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [processingIds, setProcessingIds] = useState<Set<number>>(new Set());
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  
  // Edit state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Activity feed
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  const limit = 10;

  // Set API key in localStorage
  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('admin_api_key', apiKey);
    }
  }, [apiKey]);

  // Fetch pending confessions
  const fetchConfessions = useCallback(async (newOffset = offset) => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await confessionApi.getPending(limit, newOffset);

      if (response.success && response.data) {
        setConfessions(response.data.confessions);
        setTotal(response.data.total);
        setHasMore(response.data.hasMore);
        setOffset(newOffset);
        setSelectedIds(new Set()); // Clear selection on refresh
      } else {
        if (response.error?.includes('Unauthorized')) {
          handleLogout();
          setAuthError('Session expired. Please login again.');
        } else {
          setError(response.error || 'Failed to load confessions');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, offset]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const response = await adminApi.getStats();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  }, [isAuthenticated]);

  // Initial load
  useEffect(() => {
    if (isAuthenticated) {
      fetchConfessions(0);
      fetchStats();
    }
  }, [isAuthenticated]);

  // Handle login
  const handleLogin = async (key: string) => {
    setIsVerifying(true);
    setAuthError(null);

    try {
      localStorage.setItem('admin_api_key', key);
      const response = await adminApi.getStats();

      if (response.success) {
        setApiKey(key);
        setIsAuthenticated(true);
        setStats(response.data || null);
      } else {
        localStorage.removeItem('admin_api_key');
        setAuthError(response.error || 'Invalid API key');
      }
    } catch (err) {
      localStorage.removeItem('admin_api_key');
      setAuthError('Failed to verify API key');
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('admin_api_key');
    setApiKey('');
    setIsAuthenticated(false);
    setConfessions([]);
    setStats(null);
  };

  // Add activity
  const addActivity = (action: ActivityItem['action'], confessionId: number, details?: string) => {
    const newActivity: ActivityItem = {
      id: Date.now(),
      action,
      confessionId,
      timestamp: new Date().toISOString(),
      details,
    };
    setActivities(prev => [newActivity, ...prev].slice(0, 10));
  };

  // Handle approve
  const handleApprove = async (id: number) => {
    setProcessingIds(prev => new Set(prev).add(id));

    try {
      const response = await confessionApi.approve(id);

      if (response.success && response.data) {
        const data = response.data;
        
        if (data.posted) {
          const threadInfo = data.threadCount && data.threadCount > 1 
            ? ` (${data.threadCount} posts)` 
            : '';
          toast({
            title: `Posted to Threads! 🎉`,
            description: (
              <div className="space-y-1">
                <p>Confession #{id} approved and posted{threadInfo}</p>
                {data.permalink && (
                  <a 
                    href={data.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#4A90E2] hover:underline text-sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View on Threads →
                  </a>
                )}
              </div>
            ),
            variant: 'success',
          });
          addActivity('posted', id, data.permalink);
        } else {
          toast({
            title: 'Approved! ✨',
            description: `Confession #${id} has been approved`,
            variant: 'success',
          });
          addActivity('approved', id);
        }
        
        setConfessions(prev => prev.filter(c => c.id !== id));
        setTotal(prev => prev - 1);
        setSelectedIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
        fetchStats();
      } else {
        toast({
          title: 'Approval Failed',
          description: response.error || 'Failed to approve confession',
          variant: 'destructive',
        });
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  // Handle reject
  const handleReject = async (id: number) => {
    setProcessingIds(prev => new Set(prev).add(id));

    try {
      const response = await confessionApi.reject(id);

      if (response.success) {
        toast({
          title: 'Rejected',
          description: `Confession #${id} has been rejected`,
          variant: 'default',
        });
        addActivity('rejected', id);
        
        setConfessions(prev => prev.filter(c => c.id !== id));
        setTotal(prev => prev - 1);
        setSelectedIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
        fetchStats();
      } else {
        toast({
          title: 'Rejection Failed',
          description: response.error || 'Failed to reject confession',
          variant: 'destructive',
        });
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  // Bulk actions
  const handleSelectAll = () => {
    if (selectedIds.size === confessions.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(confessions.map(c => c.id)));
    }
  };

  const handleSelectOne = (id: number, checked: boolean) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  };

  const handleBulkApprove = async () => {
    const ids = Array.from(selectedIds);
    for (const id of ids) {
      await handleApprove(id);
    }
  };

  const handleBulkReject = async () => {
    const ids = Array.from(selectedIds);
    for (const id of ids) {
      await handleReject(id);
    }
  };

  // Edit handlers
  const handleStartEdit = (id: number, content: string) => {
    setEditingId(id);
    setEditContent(content);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditContent('');
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editContent.trim()) return;
    
    setIsSavingEdit(true);
    
    try {
      const response = await confessionApi.edit(editingId, editContent.trim());
      
      if (response.success) {
        toast({
          title: 'Updated! ✨',
          description: `Confession #${editingId} has been updated`,
          variant: 'success',
        });
        setConfessions(prev => 
          prev.map(c => c.id === editingId ? { ...c, content: editContent.trim() } : c)
        );
        setEditingId(null);
        setEditContent('');
      } else {
        toast({
          title: 'Update Failed',
          description: response.error || 'Failed to update confession',
          variant: 'destructive',
        });
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} isLoading={isVerifying} error={authError} />;
  }

  return (
    <div className="min-h-screen bg-[#FFFBF5]">
      {/* Animated Clouds Background */}
      <AnimatedClouds className="opacity-50" />

      {/* Header */}
      <motion.header
        className="sticky top-0 z-40 bg-[#FFFBF5]/90 backdrop-blur-sm border-b-[3px] border-[#2D3436]"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              className="w-10 h-10 rounded-full bg-[#FFD93D] border-[3px] border-[#2D3436] flex items-center justify-center shadow-[2px_2px_0px_#2D3436]"
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
              <LayoutDashboard className="w-5 h-5 text-[#2D3436]" />
            </motion.div>
            <div>
              <h1 className="font-display font-bold text-[#2D3436]">Dashboard</h1>
              <p className="font-body text-xs text-[#636E72]">Moderation Panel</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              onClick={() => fetchConfessions(0)}
              disabled={isLoading}
              className="h-10 px-4 rounded-xl font-display font-semibold text-sm text-[#636E72] bg-white border-[3px] border-[#2D3436] shadow-[2px_2px_0px_#2D3436] flex items-center gap-2 disabled:opacity-50"
              whileHover={{
                boxShadow: "4px 4px 0px #2D3436",
                y: -2,
              }}
              whileTap={{
                boxShadow: "1px 1px 0px #2D3436",
                y: 0,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}>
              <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
              Refresh
            </motion.button>
            <motion.button
              onClick={handleLogout}
              className="h-10 px-4 rounded-xl font-display font-semibold text-sm text-[#FF6B6B] bg-white border-[3px] border-[#FF6B6B] shadow-[2px_2px_0px_#FF6B6B] flex items-center gap-2"
              whileHover={{
                boxShadow: "4px 4px 0px #FF6B6B",
                y: -2,
              }}
              whileTap={{
                boxShadow: "1px 1px 0px #FF6B6B",
                y: 0,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}>
              <LogOut className="w-4 h-4" />
              Logout
            </motion.button>
          </div>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="Pending Review"
              value={stats.pending}
              icon={<Inbox className="w-6 h-6" />}
              color="yellow"
              trend={stats.pending > 5 ? 'Action needed' : undefined}
              delay={0}
            />
            <StatCard
              title="Approved"
              value={stats.approved}
              icon={<CheckCircle2 className="w-6 h-6" />}
              color="green"
              delay={100}
            />
            <StatCard
              title="Rejected"
              value={stats.rejected}
              icon={<XCircle className="w-6 h-6" />}
              color="red"
              delay={200}
            />
            <StatCard
              title="Posted to Threads"
              value={stats.posted}
              icon={<Send className="w-6 h-6" />}
              color="pink"
              delay={300}
            />
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Confessions List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Toolbar */}
            <motion.div
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl border-[3px] border-[#2D3436] shadow-[4px_4px_0px_#2D3436] p-4"
              whileHover={{
                y: -4,
                boxShadow: "6px 6px 0px #2D3436",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedIds.size === confessions.length && confessions.length > 0}
                  onChange={handleSelectAll}
                  className="w-5 h-5 rounded-lg border-[3px] border-[#2D3436] bg-white text-[#9B59B6] focus:ring-[#9B59B6] cursor-pointer"
                />
                <span className="font-body text-sm text-[#636E72]">
                  {selectedIds.size > 0 ? `${selectedIds.size} selected` : `${total} pending`}
                </span>
              </div>

              {selectedIds.size > 0 && (
                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={handleBulkReject}
                    disabled={isLoading}
                    className="h-10 px-4 rounded-xl font-display font-semibold text-sm text-[#FF6B6B] bg-white border-[3px] border-[#FF6B6B] shadow-[2px_2px_0px_#FF6B6B] flex items-center gap-1 disabled:opacity-50"
                    whileHover={{
                      boxShadow: "4px 4px 0px #FF6B6B",
                      y: -2,
                    }}
                    whileTap={{
                      boxShadow: "1px 1px 0px #FF6B6B",
                      y: 0,
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}>
                    <XCircle className="w-4 h-4" />
                    Reject All
                  </motion.button>
                  <motion.button
                    onClick={handleBulkApprove}
                    disabled={isLoading}
                    className="h-10 px-4 rounded-xl font-display font-semibold text-sm text-white bg-[#1DD1A1] border-[3px] border-[#2D3436] shadow-[2px_2px_0px_#2D3436] flex items-center gap-1 disabled:opacity-50"
                    whileHover={{
                      boxShadow: "4px 4px 0px #2D3436",
                      y: -2,
                    }}
                    whileTap={{
                      boxShadow: "1px 1px 0px #2D3436",
                      y: 0,
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}>
                    <CheckCircle2 className="w-4 h-4" />
                    Approve All
                  </motion.button>
                </div>
              )}
            </motion.div>

            {/* Confessions List */}
            {isLoading && confessions.length === 0 ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className="h-40 bg-white rounded-3xl border-[3px] border-[#2D3436] shadow-[4px_4px_0px_#2D3436]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}>
                    <div className="h-full w-full animate-pulse bg-gradient-to-r from-gray-100 to-gray-200 rounded-3xl" />
                  </motion.div>
                ))}
              </div>
            ) : error ? (
              <motion.div
                className="text-center py-12 bg-white rounded-3xl border-[3px] border-[#FF6B6B] shadow-[4px_4px_0px_#FF6B6B]"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}>
                <motion.div
                  className="w-20 h-20 rounded-full bg-[#FF6B6B]/10 flex items-center justify-center mx-auto mb-4 border-[3px] border-[#FF6B6B]"
                  animate={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
                  <AlertCircle className="w-10 h-10 text-[#FF6B6B]" />
                </motion.div>
                <p className="font-body text-[#636E72]">{error}</p>
                <motion.button
                  onClick={() => fetchConfessions(0)}
                  className="mt-4 h-10 px-6 rounded-xl font-display font-semibold text-sm text-[#2D3436] bg-white border-[3px] border-[#2D3436] shadow-[2px_2px_0px_#2D3436]"
                  whileHover={{
                    boxShadow: "4px 4px 0px #2D3436",
                    y: -2,
                  }}
                  whileTap={{
                    boxShadow: "1px 1px 0px #2D3436",
                    y: 0,
                  }}>
                  Try Again
                </motion.button>
              </motion.div>
            ) : confessions.length === 0 ? (
              <motion.div
                className="text-center py-16 bg-white rounded-3xl border-[3px] border-[#1DD1A1] shadow-[4px_4px_0px_#1DD1A1]"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{
                  y: -4,
                  boxShadow: "6px 6px 0px #1DD1A1",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}>
                <motion.div
                  className="w-20 h-20 rounded-full bg-[#1DD1A1]/10 flex items-center justify-center mx-auto mb-4 border-[3px] border-[#1DD1A1]"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}>
                  <CheckCircle2 className="w-10 h-10 text-[#1DD1A1]" />
                </motion.div>
                <h3 className="font-display text-xl font-bold text-[#2D3436] mb-2">
                  All caught up!
                </h3>
                <p className="font-body text-[#636E72] text-sm">
                  No pending confessions to review
                </p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {confessions.map((confession, index) => (
                    <motion.div
                      key={confession.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.05 }}>
                      <ConfessionCard
                        confession={confession}
                        onApprove={handleApprove}
                        onReject={handleReject}
                        onEdit={handleStartEdit}
                        isProcessing={processingIds.has(confession.id)}
                        selected={selectedIds.has(confession.id)}
                        onSelect={(checked) => handleSelectOne(confession.id, checked)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* Pagination */}
            {(hasMore || offset > 0) && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <motion.button
                  onClick={() => fetchConfessions(Math.max(0, offset - limit))}
                  disabled={offset === 0 || isLoading}
                  className="h-10 px-4 rounded-xl font-display font-semibold text-sm text-[#636E72] bg-white border-[3px] border-[#2D3436] shadow-[2px_2px_0px_#2D3436] disabled:opacity-50"
                  whileHover={{
                    boxShadow: "4px 4px 0px #2D3436",
                    y: -2,
                  }}
                  whileTap={{
                    boxShadow: "1px 1px 0px #2D3436",
                    y: 0,
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}>
                  Previous
                </motion.button>
                <span className="font-body text-sm text-[#636E72] px-4">
                  Page {Math.floor(offset / limit) + 1}
                </span>
                <motion.button
                  onClick={() => fetchConfessions(offset + limit)}
                  disabled={!hasMore || isLoading}
                  className="h-10 px-4 rounded-xl font-display font-semibold text-sm text-[#636E72] bg-white border-[3px] border-[#2D3436] shadow-[2px_2px_0px_#2D3436] disabled:opacity-50"
                  whileHover={{
                    boxShadow: "4px 4px 0px #2D3436",
                    y: -2,
                  }}
                  whileTap={{
                    boxShadow: "1px 1px 0px #2D3436",
                    y: 0,
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}>
                  Next
                </motion.button>
              </div>
            )}
          </div>

          {/* Sidebar - Activity & Quick Stats */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              className="bg-white rounded-3xl border-[3px] border-[#2D3436] shadow-[4px_4px_0px_#2D3436] p-6"
              style={{ boxShadow: "4px 4px 0px #FFD93D" }}
              whileHover={{
                y: -4,
                boxShadow: "6px 6px 0px #FFD93D",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}>
              <h3 className="font-display font-bold text-[#2D3436] mb-4 flex items-center gap-2">
                <motion.div
                  className="w-8 h-8 rounded-xl bg-[#FFD93D] border-[2px] border-[#2D3436] flex items-center justify-center"
                  whileHover={{ rotate: 10 }}
                  transition={{ type: "spring", stiffness: 400 }}>
                  <Zap className="w-4 h-4 text-[#2D3436]" />
                </motion.div>
                Quick Actions
              </h3>
              <div className="space-y-2">
                <motion.button
                  onClick={() => fetchConfessions(0)}
                  className="w-full h-10 px-4 rounded-xl font-body text-sm text-[#2D3436] bg-[#F4F4F5] border-[2px] border-[#2D3436] flex items-center justify-center gap-2"
                  whileHover={{
                    scale: 1.02,
                    backgroundColor: "#FFD93D",
                  }}
                  whileTap={{ scale: 0.98 }}>
                  <RefreshCw className="w-4 h-4" />
                  Refresh Queue
                </motion.button>
                <motion.a
                  href="https://threads.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center h-10 px-4 rounded-xl font-body text-sm text-[#2D3436] bg-[#F4F4F5] border-[2px] border-[#2D3436] gap-2"
                  whileHover={{
                    scale: 1.02,
                    backgroundColor: "#4A90E2",
                    color: "#ffffff",
                  }}
                  whileTap={{ scale: 0.98 }}>
                  <ExternalLink className="w-4 h-4" />
                  View Threads
                </motion.a>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              className="bg-white rounded-3xl border-[3px] border-[#2D3436] shadow-[4px_4px_0px_#2D3436] p-6"
              style={{ boxShadow: "4px 4px 0px #9B59B6" }}
              whileHover={{
                y: -4,
                boxShadow: "6px 6px 0px #9B59B6",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}>
              <h3 className="font-display font-bold text-[#2D3436] mb-4 flex items-center gap-2">
                <motion.div
                  className="w-8 h-8 rounded-xl bg-[#9B59B6] border-[2px] border-[#2D3436] flex items-center justify-center"
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
                  <Activity className="w-4 h-4 text-white" />
                </motion.div>
                Recent Activity
              </h3>
              {activities.length === 0 ? (
                <p className="font-body text-sm text-[#B2BEC3] text-center py-4">
                  No recent activity
                </p>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence>
                    {activities.map((activity) => (
                      <motion.div
                        key={activity.id}
                        className="flex items-start gap-3 text-sm"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}>
                        <motion.div
                          className={cn(
                            "w-3 h-3 rounded-full mt-1.5 border-[2px] border-[#2D3436]",
                            activity.action === 'approved' && "bg-[#1DD1A1]",
                            activity.action === 'rejected' && "bg-[#FF6B6B]",
                            activity.action === 'posted' && "bg-[#9B59B6]"
                          )}
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity }} />
                        <div className="flex-1">
                          <p className="font-body text-[#636E72]">
                            <span className="text-[#2D3436] font-semibold">
                              #{activity.confessionId}
                            </span>
                            {' '}{activity.action}
                          </p>
                          <p className="font-body text-[#B2BEC3] text-xs">
                            {new Date(activity.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>

            {/* Performance Stats */}
            {stats && (
              <motion.div
                className="bg-gradient-to-br from-[#9B59B6]/10 to-[#FF7EB3]/10 rounded-3xl border-[3px] border-[#9B59B6] p-6"
                style={{ boxShadow: "4px 4px 0px #9B59B6" }}
                whileHover={{
                  y: -4,
                  boxShadow: "6px 6px 0px #9B59B6",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}>
                <h3 className="font-display font-bold text-[#2D3436] mb-4 flex items-center gap-2">
                  <motion.div
                    className="w-8 h-8 rounded-xl bg-[#9B59B6] border-[2px] border-[#2D3436] flex items-center justify-center"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}>
                    <BarChart3 className="w-4 h-4 text-white" />
                  </motion.div>
                  Performance
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between font-body text-sm">
                    <span className="text-[#636E72]">Approval Rate</span>
                    <motion.span
                      className="text-[#2D3436] font-semibold"
                      key={stats.approved}
                      initial={{ scale: 1.5, color: "#1DD1A1" }}
                      animate={{ scale: 1, color: "#2D3436" }}>
                      {stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0}%
                    </motion.span>
                  </div>
                  <div className="flex justify-between font-body text-sm">
                    <span className="text-[#636E72]">Auto-posted</span>
                    <span className="text-[#2D3436] font-semibold">{stats.posted}</span>
                  </div>
                  <div className="flex justify-between font-body text-sm">
                    <span className="text-[#636E72]">Total Processed</span>
                    <span className="text-[#2D3436] font-semibold">{stats.total}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      {/* Edit Dialog */}
      <Dialog open={editingId !== null} onOpenChange={(open) => !open && handleCancelEdit()}>
        <DialogContent className="sm:max-w-lg bg-white border-[3px] border-[#2D3436] shadow-[8px_8px_0px_#2D3436] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-[#2D3436] flex items-center gap-2">
              <motion.div
                className="w-8 h-8 rounded-xl bg-[#9B59B6] border-[2px] border-[#2D3436] flex items-center justify-center"
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}>
                <Edit2 className="w-4 h-4 text-white" />
              </motion.div>
              Edit Confession #{editingId}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="Edit confession content..."
              className="w-full min-h-[150px] px-4 py-3 rounded-2xl font-body text-[#2D3436] bg-[#FFFBF5] border-[3px] border-[#2D3436] shadow-[3px_3px_0px_#2D3436] outline-none focus:shadow-[5px_5px_0px_#2D3436] focus:-translate-y-0.5 transition-all resize-none placeholder:text-[#B2BEC3]"
              maxLength={800}
            />
            <p className="font-body text-xs text-[#636E72] mt-2 text-right">
              {editContent.length}/800 characters
            </p>
          </div>
          <DialogFooter className="gap-2">
            <motion.button
              onClick={handleCancelEdit}
              disabled={isSavingEdit}
              className="h-10 px-4 rounded-xl font-display font-semibold text-sm text-[#636E72] bg-white border-[3px] border-[#2D3436] shadow-[2px_2px_0px_#2D3436] disabled:opacity-50"
              whileHover={{
                boxShadow: "4px 4px 0px #2D3436",
                y: -2,
              }}
              whileTap={{
                boxShadow: "1px 1px 0px #2D3436",
                y: 0,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}>
              Cancel
            </motion.button>
            <motion.button
              onClick={handleSaveEdit}
              disabled={isSavingEdit || !editContent.trim()}
              className="h-10 px-4 rounded-xl font-display font-semibold text-sm text-white bg-[#9B59B6] border-[3px] border-[#2D3436] shadow-[2px_2px_0px_#2D3436] flex items-center gap-2 disabled:opacity-50"
              whileHover={{
                boxShadow: "4px 4px 0px #2D3436",
                y: -2,
              }}
              whileTap={{
                boxShadow: "1px 1px 0px #2D3436",
                y: 0,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}>
              {isSavingEdit ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </motion.button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="bg-white border-t-[3px] border-[#2D3436] py-6 mt-8 relative z-10">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            className="flex flex-col items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}>
            {/* Logo */}
            <a
              href="/"
              className="font-display font-bold text-lg text-[#2D3436] hover:text-[#4A90E2] transition-colors">
              ceritaAnon
            </a>

            {/* Navigation Links */}
            <nav className="flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-5 gap-y-1">
              <a
                href="/about"
                className="font-body text-sm text-[#636E72] hover:text-[#2D3436] transition-colors">
                About
              </a>
              <a
                href="/faq"
                className="font-body text-sm text-[#636E72] hover:text-[#2D3436] transition-colors">
                FAQ
              </a>
              <a
                href="/privacy"
                className="font-body text-sm text-[#636E72] hover:text-[#2D3436] transition-colors">
                Privacy
              </a>
              <a
                href="/admin"
                className="font-body text-sm text-[#636E72] hover:text-[#2D3436] transition-colors">
                Admin
              </a>
              <span className="hidden sm:inline text-[#DFE6E9] mx-1">|</span>
              <span className="inline-flex items-center gap-3">
                <a
                  href="https://threads.net/@ceritaanon_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-sm text-[#636E72] hover:text-[#4A90E2] transition-colors inline-flex items-center gap-1.5 group whitespace-nowrap">
                  <span className="opacity-70 group-hover:opacity-100 transition-opacity">
                    <ThreadsIcon size={14} />
                  </span>
                  <span>Threads</span>
                </a>
                <a
                  href="https://www.buymeacoffee.com/ikhmalhanif"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-sm text-[#636E72] hover:text-[#FF7EB3] transition-colors inline-flex items-center gap-1 whitespace-nowrap">
                  <span>☕</span>
                  <span>Support</span>
                </a>
              </span>
            </nav>

            {/* Made with love */}
            <span className="font-body text-xs text-[#B2BEC3]">
              Made with 💕
            </span>
          </motion.div>

          <motion.p
            className="mt-4 pt-4 border-t border-[#DFE6E9] text-center font-body text-xs text-[#B2BEC3]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}>
            A safe space for the unspoken. Built with care and lots of doodles.
          </motion.p>
        </div>
      </footer>
    </div>
  );
}
