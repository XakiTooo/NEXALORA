import React from 'react';
import { VerificationStatus, DisciplineCluster } from '@/types';

interface StatusBadgeProps {
  status: VerificationStatus | string;
  label?: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, className = '' }) => {
  let bgClass = 'bg-surface-subtle text-text-secondary border-border-default';
  let icon = 'info';
  let displayLabel = label || 'Info';

  switch (status) {
    case 'terverifikasi':
      bgClass = 'bg-status-success-bg text-status-success-text border-green-200';
      icon = 'verified';
      displayLabel = label || 'Terverifikasi';
      break;
    case 'perlu_diperiksa':
      bgClass = 'bg-status-warning-bg text-status-warning-text border-amber-200';
      icon = 'warning';
      displayLabel = label || 'Perlu Diperiksa';
      break;
    case 'belum_tersedia':
      bgClass = 'bg-status-info-bg text-status-info-text border-indigo-200';
      icon = 'help_outline';
      displayLabel = label || 'Belum Tersedia';
      break;
    case 'sumber_lama':
      bgClass = 'bg-surface-subtle text-text-secondary border-border-default';
      icon = 'history';
      displayLabel = label || 'Sumber Lama';
      break;
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border tracking-wider select-none shrink-0 ${bgClass} ${className}`}
    >
      <span className="material-symbols-outlined text-[13px]">{icon}</span>
      <span>{displayLabel}</span>
    </span>
  );
};

interface ClusterBadgeProps {
  cluster: DisciplineCluster | string;
  className?: string;
}

export const ClusterBadge: React.FC<ClusterBadgeProps> = ({ cluster, className = '' }) => {
  let styleClass = 'bg-surface-subtle text-text-secondary';
  let label = cluster.toUpperCase();

  switch (cluster) {
    case 'informatika':
      styleClass = 'bg-pill-informatika-bg text-pill-informatika-text';
      label = 'INFORMATIKA';
      break;
    case 'industri':
      styleClass = 'bg-pill-industri-bg text-pill-industri-text';
      label = 'TEKNIK INDUSTRI';
      break;
    case 'dkv':
      styleClass = 'bg-pill-dkv-bg text-pill-dkv-text';
      label = 'DKV';
      break;
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase select-none shrink-0 ${styleClass} ${className}`}
    >
      {label}
    </span>
  );
};
