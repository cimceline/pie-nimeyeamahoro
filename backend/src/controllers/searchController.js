import Publication from '../models/Publication.js';
import Project from '../models/Project.js';
import Resource from '../models/Resource.js';
import Article from '../models/Article.js';
import Service from '../models/Service.js';
import Expertise from '../models/Expertise.js';
import Skill from '../models/Skill.js';
import Experience from '../models/Experience.js';
import Education from '../models/Education.js';
import analyticsService from '../services/analyticsService.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

export const search = async (req, res, next) => {
  try {
    const { q, type, limit: limitStr } = req.query;
    if (!q) return sendError(res, 400, 'Search query is required');

    const limit = Math.min(100, Math.max(1, parseInt(limitStr, 10) || 20));
    const escapedQ = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapedQ, 'i');
    const types = type ? type.split(',') : [
      'publication', 'project', 'resource', 'article', 'service',
      'expertise', 'skill', 'experience', 'education'
    ];
    const results = {};
    const counts = {};
    const queries = [];

    if (types.includes('publication')) {
      queries.push(
        Publication.find({ status: 'published', $or: [{ title: regex }, { abstract: regex }, { keywords: { $in: [regex] } }] })
          .select('title slug publicationType publicationDate authors').limit(limit).lean()
          .then(items => { results.publications = items; counts.publications = items.length; })
      );
    }
    if (types.includes('project')) {
      queries.push(
        Project.find({ $or: [{ title: regex }, { description: regex }] })
          .select('title slug category status').limit(limit).lean()
          .then(items => { results.projects = items; counts.projects = items.length; })
      );
    }
    if (types.includes('resource')) {
      queries.push(
        Resource.find({ status: 'published', $or: [{ title: regex }, { description: regex }, { tags: { $in: [regex] } }] })
          .select('title slug category tags').limit(limit).lean()
          .then(items => { results.resources = items; counts.resources = items.length; })
      );
    }
    if (types.includes('article')) {
      queries.push(
        Article.find({ status: 'published', $or: [{ title: regex }, { excerpt: regex }, { tags: { $in: [regex] } }] })
          .select('title slug category tags').limit(limit).lean()
          .then(items => { results.articles = items; counts.articles = items.length; })
      );
    }
    if (types.includes('service')) {
      queries.push(
        Service.find({ isActive: true, $or: [{ title: regex }, { shortDescription: regex }] })
          .select('title slug category').limit(limit).lean()
          .then(items => { results.services = items; counts.services = items.length; })
      );
    }
    if (types.includes('expertise')) {
      queries.push(
        Expertise.find({ isActive: true, $or: [{ title: regex }, { description: regex }, { keywords: { $in: [regex] } }] })
          .select('title slug category').limit(limit).lean()
          .then(items => { results.expertise = items; counts.expertise = items.length; })
      );
    }
    if (types.includes('skill')) {
      queries.push(
        Skill.find({ $or: [{ name: regex }, { category: regex }] })
          .select('name category proficiency').limit(limit).lean()
          .then(items => { results.skills = items; counts.skills = items.length; })
      );
    }
    if (types.includes('experience')) {
      queries.push(
        Experience.find({ $or: [{ title: regex }, { organization: regex }, { description: regex }] })
          .select('title organization employmentType startDate').limit(limit).lean()
          .then(items => { results.experience = items; counts.experience = items.length; })
      );
    }
    if (types.includes('education')) {
      queries.push(
        Education.find({ $or: [{ qualification: regex }, { institution: regex }, { fieldOfStudy: regex }] })
          .select('qualification degreeType institution fieldOfStudy').limit(limit).lean()
          .then(items => { results.education = items; counts.education = items.length; })
      );
    }

    await Promise.all(queries);
    const totalResults = Object.values(counts).reduce((a, b) => a + b, 0);

    analyticsService.trackEvent({ eventType: 'search', query: q, userId: req.user?._id, ip: req.ip, userAgent: req.headers['user-agent'] }).catch(() => {});

    return sendSuccess(res, 200, 'Search results', { results, counts, totalResults, query: q });
  } catch (error) {
    return next(error);
  }
};

export const autocomplete = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) return sendSuccess(res, 200, 'Suggestions', []);

    const regex = new RegExp(`^${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i');
    const lim = 5;

    const [publications, articles, services] = await Promise.all([
      Publication.find({ status: 'published', title: regex }).select('title slug').limit(lim).lean(),
      Article.find({ status: 'published', title: regex }).select('title slug').limit(lim).lean(),
      Service.find({ isActive: true, title: regex }).select('title slug').limit(lim).lean(),
    ]);

    const suggestions = [
      ...publications.map(p => ({ type: 'publication', title: p.title, slug: p.slug })),
      ...articles.map(a => ({ type: 'article', title: a.title, slug: a.slug })),
      ...services.map(s => ({ type: 'service', title: s.title, slug: s.slug })),
    ].slice(0, 10);

    return sendSuccess(res, 200, 'Suggestions', suggestions);
  } catch (error) {
    return next(error);
  }
};
