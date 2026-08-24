import mongoose from 'mongoose';
import os from 'os';
import config from '../config/index.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

/**
 * Basic health check (public).
 */
export const healthCheck = async (req, res) => {
  return sendSuccess(res, 200, 'Healthy', {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.nodeEnv,
    nodeVersion: process.version,
  });
};

/**
 * Detailed database health (admin only).
 */
export const databaseHealth = async (req, res) => {
  try {
    const state = mongoose.connection.readyState;
    const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
    const pingResult = await mongoose.connection.db.admin().ping();

    return sendSuccess(res, 200, 'Database healthy', {
      status: state === 1 ? 'healthy' : 'warning',
      state: states[state] || 'unknown',
      ping: pingResult,
      host: mongoose.connection.host,
      name: mongoose.connection.name,
    });
  } catch (error) {
    return sendSuccess(res, 200, 'Database status', { status: 'critical', error: error.message });
  }
};

/**
 * System resources health (admin only).
 */
export const systemHealth = async (req, res) => {
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const memPercent = Math.round((usedMem / totalMem) * 100);

  const cpus = os.cpus();
  const loadAvg = os.loadavg();

  return sendSuccess(res, 200, 'System health', {
    status: memPercent > 90 ? 'critical' : memPercent > 75 ? 'warning' : 'healthy',
    memory: {
      total: Math.round(totalMem / 1024 / 1024),
      used: Math.round(usedMem / 1024 / 1024),
      free: Math.round(freeMem / 1024 / 1024),
      percentUsed: memPercent,
    },
    cpu: {
      model: cpus[0]?.model || 'Unknown',
      cores: cpus.length,
      loadAverage: { '1m': loadAvg[0], '5m': loadAvg[1], '15m': loadAvg[2] },
    },
    platform: os.platform(),
    arch: os.arch(),
    nodeVersion: process.version,
    uptime: Math.round(process.uptime()),
    environment: config.nodeEnv,
  });
};

/**
 * Storage health (admin only).
 */
export const storageHealth = async (req, res) => {
  return sendSuccess(res, 200, 'Storage health', {
    status: 'healthy',
    uploadDir: config.uploadDir,
    maxFileSize: config.maxFileSize,
  });
};
