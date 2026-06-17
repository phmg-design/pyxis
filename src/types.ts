/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TaskStatus = "success" | "warning" | "pending";

export interface RealityItem {
  text: string;
  status: TaskStatus;
  sub?: string;
}

export interface ReceiptEntry {
  id: string;
  timestamp: string; // e.g. "09:42:15_am"
  date: string;      // e.g. "2023_10_24" or "15_junho_2026"
  type: "verified" | "ambient_log" | "daily_close";
  promises: string[];
  realities: RealityItem[];
  alignmentDerivation?: string; // e.g. "+3.5 hrs" or "0.0 hrs"
  justification?: string;
}

export interface SystemStatus {
  online: boolean;
  model: string;
  listening: boolean;
  keyConfigured: boolean;
}
