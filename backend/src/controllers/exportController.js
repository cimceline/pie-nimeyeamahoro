import ContactMessage from '../models/ContactMessage.js';
import Comment from '../models/Comment.js';
import ServiceRequest from '../models/ServiceRequest.js';
import Newsletter from '../models/Newsletter.js';
import AuditLog from '../models/AuditLog.js';
import AnalyticsEvent from '../models/AnalyticsEvent.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

function toCSV(rows, headers) {
  if (!rows.length) return '';
  const lines = [headers.join(',')];
  for (const row of rows) {
    lines.push(headers.map(h => {
      const val = row[h] ?? '';
      const str = Array.isArray(val) ? val.join('; ') : String(val);
      return `"${str.replace(/"/g, '""')}"`;
    }).join(','));
  }
  return lines.join('\n');
}

export const exportContacts = async (req, res, next) => {
  try {
    const items = await ContactMessage.find().sort({ createdAt: -1 }).lean();
    const csv = toCSV(items, ['name', 'email', 'subject', 'message', 'status', 'createdAt']);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=contacts.csv');
    return res.send(csv);
  } catch (error) { return next(error); }
};

export const exportComments = async (req, res, next) => {
  try {
    const items = await Comment.find().sort({ createdAt: -1 }).lean();
    const csv = toCSV(items, ['authorName', 'authorEmail', 'content', 'entityType', 'status', 'createdAt']);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=comments.csv');
    return res.send(csv);
  } catch (error) { return next(error); }
};

export const exportServiceRequests = async (req, res, next) => {
  try {
    const items = await ServiceRequest.find().sort({ createdAt: -1 }).lean();
    const csv = toCSV(items, ['name', 'email', 'organization', 'status', 'preferredContactMethod', 'projectDescription', 'createdAt']);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=service-requests.csv');
    return res.send(csv);
  } catch (error) { return next(error); }
};

export const exportAuditLogs = async (req, res, next) => {
  try {
    const items = await AuditLog.find().sort({ createdAt: -1 }).limit(10000).lean();
    const csv = toCSV(items, ['action', 'entityType', 'description', 'ipAddress', 'createdAt']);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=audit-logs.csv');
    return res.send(csv);
  } catch (error) { return next(error); }
};

export const exportAnalytics = async (req, res, next) => {
  try {
    const items = await AnalyticsEvent.find().sort({ createdAt: -1 }).limit(10000).lean();
    const csv = toCSV(items, ['eventType', 'entityType', 'entityId', 'ipAddress', 'timestamp']);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=analytics.csv');
    return res.send(csv);
  } catch (error) { return next(error); }
};
