export const STATUS_COLORS = {
  draft: 'bg-gray-100 text-gray-700',
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  published: 'bg-blue-100 text-blue-700',
  archived: 'bg-purple-100 text-purple-700',
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-gray-100 text-gray-700',
  open: 'bg-blue-100 text-blue-700',
  closed: 'bg-gray-100 text-gray-700',
  resolved: 'bg-green-100 text-green-700',
  unread: 'bg-red-100 text-red-700',
  read: 'bg-gray-100 text-gray-700',
  replied: 'bg-green-100 text-green-700',
  scheduled: 'bg-indigo-100 text-indigo-700',
  cancelled: 'bg-red-100 text-red-700',
  confirmed: 'bg-green-100 text-green-700',
  attended: 'bg-blue-100 text-blue-700',
  new: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-green-100 text-green-700',
  spam: 'bg-orange-100 text-orange-700',
  unsubscribed: 'bg-gray-100 text-gray-700',
  verified: 'bg-green-100 text-green-700',
};

export const STATUS_LABELS = {
  draft: 'Draft',
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  published: 'Published',
  archived: 'Archived',
  active: 'Active',
  inactive: 'Inactive',
  open: 'Open',
  closed: 'Closed',
  resolved: 'Resolved',
  unread: 'Unread',
  read: 'Read',
  replied: 'Replied',
  scheduled: 'Scheduled',
  cancelled: 'Cancelled',
  confirmed: 'Confirmed',
  attended: 'Attended',
  new: 'New',
  in_progress: 'In Progress',
  completed: 'Completed',
  spam: 'Spam',
  unsubscribed: 'Unsubscribed',
  verified: 'Verified',
};

export const CONTENT_TYPES = {
  publication: 'Publication',
  research_project: 'Research Project',
  project: 'Project',
  resource: 'Resource',
  article: 'Article',
  service: 'Service',
  education: 'Education',
  experience: 'Experience',
  skill: 'Skill',
  profile: 'Profile',
};

export const RESOURCE_TYPES = {
  document: 'Document',
  image: 'Image',
  video: 'Video',
  audio: 'Audio',
  link: 'Link',
  code: 'Code',
  dataset: 'Dataset',
  presentation: 'Presentation',
  other: 'Other',
};

export const PUBLICATION_TYPES = {
  journal_article: 'Journal Article',
  conference_paper: 'Conference Paper',
  book_chapter: 'Book Chapter',
  book: 'Book',
  thesis: 'Thesis',
  report: 'Report',
  preprint: 'Preprint',
  other: 'Other',
};

export const ROLE_LABELS = {
  admin: 'Administrator',
  editor: 'Editor',
  viewer: 'Viewer',
  user: 'User',
};

export const ITEMS_PER_PAGE = 10;

export const DEBOUNCE_DELAY = 300;
