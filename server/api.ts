import { Router, Request, Response, NextFunction } from 'express';
import {
  getDb,
  saveDb,
  hashPassword,
  verifyPassword,
  createToken,
  verifyToken,
  User,
  ApplicationItem,
  ConsultationRequest,
  Article,
  Announcement,
  ContactInquiry,
  SiteSettings
} from './db';

export const apiRouter = Router();

// Middleware to extract user from authorization header
export interface AuthenticatedRequest extends Request {
  user?: { id: string; email: string; role: string };
}

function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }
  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);
  if (payload) {
    req.user = payload;
  }
  next();
}

function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required. Please log in.' });
  }
  next();
}

function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Administrative privileges required.' });
  }
  next();
}

apiRouter.use(authMiddleware);

// --- AUTHENTICATION ROUTES ---

apiRouter.post('/auth/register', (req: Request, res: Response) => {
  const { fullName, companyName, email, mobile, designation, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ error: 'Full name, email, and password are required.' });
  }

  const db = getDb();
  const normalizedEmail = email.trim().toLowerCase();

  const existing = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (existing) {
    return res.status(409).json({ error: 'An account with this email address already exists.' });
  }

  const { hash, salt } = hashPassword(password);
  const newUser: User = {
    id: 'user-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    fullName: fullName.trim(),
    companyName: (companyName || '').trim(),
    email: normalizedEmail,
    mobile: (mobile || '').trim(),
    designation: (designation || 'Engineer').trim(),
    passwordHash: hash,
    salt,
    role: 'user',
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  saveDb(db);

  const token = createToken({ id: newUser.id, email: newUser.email, role: newUser.role });

  return res.status(201).json({
    message: 'Account registered successfully',
    token,
    user: {
      id: newUser.id,
      fullName: newUser.fullName,
      companyName: newUser.companyName,
      email: newUser.email,
      mobile: newUser.mobile,
      designation: newUser.designation,
      role: newUser.role
    }
  });
});

apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const db = getDb();
  const normalizedEmail = email.trim().toLowerCase();
  const user = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);

  if (!user || !verifyPassword(password, user.passwordHash, user.salt)) {
    return res.status(401).json({ error: 'Invalid email address or password.' });
  }

  const token = createToken({ id: user.id, email: user.email, role: user.role });

  return res.json({
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      fullName: user.fullName,
      companyName: user.companyName,
      email: user.email,
      mobile: user.mobile,
      designation: user.designation,
      role: user.role
    }
  });
});

apiRouter.get('/auth/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const db = getDb();
  const user = db.users.find((u) => u.id === req.user!.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  return res.json({
    user: {
      id: user.id,
      fullName: user.fullName,
      companyName: user.companyName,
      email: user.email,
      mobile: user.mobile,
      designation: user.designation,
      role: user.role,
      createdAt: user.createdAt
    }
  });
});

apiRouter.put('/auth/profile', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { fullName, companyName, mobile, designation } = req.body;
  const db = getDb();
  const userIndex = db.users.findIndex((u) => u.id === req.user!.id);

  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found.' });
  }

  if (fullName) db.users[userIndex].fullName = fullName.trim();
  if (companyName !== undefined) db.users[userIndex].companyName = companyName.trim();
  if (mobile !== undefined) db.users[userIndex].mobile = mobile.trim();
  if (designation !== undefined) db.users[userIndex].designation = designation.trim();

  saveDb(db);

  return res.json({
    message: 'Profile updated successfully',
    user: {
      id: db.users[userIndex].id,
      fullName: db.users[userIndex].fullName,
      companyName: db.users[userIndex].companyName,
      email: db.users[userIndex].email,
      mobile: db.users[userIndex].mobile,
      designation: db.users[userIndex].designation,
      role: db.users[userIndex].role
    }
  });
});

// --- APPLICATIONS ROUTES ---

apiRouter.get('/applications', (req: Request, res: Response) => {
  const db = getDb();
  return res.json({ applications: db.applications });
});

apiRouter.get('/applications/:id', (req: Request, res: Response) => {
  const db = getDb();
  const app = db.applications.find((a) => a.id === req.params.id || a.slug === req.params.id);
  if (!app) {
    return res.status(404).json({ error: 'Application not found' });
  }
  return res.json({ application: app });
});

apiRouter.post('/admin/applications', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const data = req.body;
  if (!data.name || !data.category) {
    return res.status(400).json({ error: 'Name and category are required.' });
  }

  const db = getDb();
  const newApp: ApplicationItem = {
    id: 'app-' + Date.now(),
    name: data.name,
    slug: data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    category: data.category,
    shortDescription: data.shortDescription || '',
    fullDescription: data.fullDescription || '',
    features: Array.isArray(data.features) ? data.features : [],
    targetUsers: data.targetUsers || '',
    iconName: data.iconName || 'Layers',
    appType: data.appType || 'coming_soon',
    androidDownloadUrl: data.androidDownloadUrl || '',
    webAppUrl: data.webAppUrl || '',
    version: data.version || '1.0.0',
    latestUpdateDate: new Date().toISOString().split('T')[0],
    isPublished: data.isPublished !== false,
    technicalHighlights: Array.isArray(data.technicalHighlights) ? data.technicalHighlights : [],
    systemRequirements: data.systemRequirements || 'Modern web browser or Android 10+'
  };

  db.applications.push(newApp);
  saveDb(db);

  return res.status(201).json({ message: 'Application created successfully', application: newApp });
});

apiRouter.put('/admin/applications/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const db = getDb();
  const index = db.applications.findIndex((a) => a.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Application not found' });
  }

  db.applications[index] = {
    ...db.applications[index],
    ...req.body,
    latestUpdateDate: new Date().toISOString().split('T')[0]
  };

  saveDb(db);
  return res.json({ message: 'Application updated successfully', application: db.applications[index] });
});

apiRouter.delete('/admin/applications/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const db = getDb();
  const index = db.applications.findIndex((a) => a.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Application not found' });
  }

  const deleted = db.applications.splice(index, 1);
  saveDb(db);
  return res.json({ message: 'Application deleted', application: deleted[0] });
});

// --- CONSULTING REQUESTS ROUTES ---

apiRouter.post('/consultations', (req: AuthenticatedRequest, res: Response) => {
  const {
    fullName,
    companyName,
    designation,
    email,
    mobile,
    plantLocation,
    plantType,
    consultingTopic,
    problemDescription,
    currentOperatingParameters,
    expectedImprovement,
    preferredMethod,
    attachments
  } = req.body;

  if (!fullName || !companyName || !email || !consultingTopic || !problemDescription) {
    return res.status(400).json({ error: 'Please provide all mandatory consulting request fields.' });
  }

  // Validate email format
  if (!email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  // Validate attachments (max 5 attachments, size limit per file 15MB)
  const safeAttachments = Array.isArray(attachments)
    ? attachments.slice(0, 5).map((att: any) => ({
        name: String(att.name || 'file').slice(0, 100),
        size: Number(att.size) || 0,
        type: String(att.type || 'application/octet-stream'),
        dataUrl: typeof att.dataUrl === 'string' ? att.dataUrl.slice(0, 15000000) : undefined
      }))
    : [];

  const db = getDb();

  // Generate unique industrial reference number: ITDS-YYYY-XXXX (e.g. ITDS-2026-7842)
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const currentYear = new Date().getFullYear();
  const refId = `ITDS-${currentYear}-${randomSuffix}`;

  const newConsultation: ConsultationRequest = {
    id: refId,
    userId: req.user ? req.user.id : undefined,
    fullName: fullName.trim(),
    companyName: companyName.trim(),
    designation: (designation || 'Engineer').trim(),
    email: email.trim().toLowerCase(),
    mobile: (mobile || '').trim(),
    plantLocation: (plantLocation || '').trim(),
    plantType: (plantType || 'Integrated Steel Plant').trim(),
    consultingTopic: consultingTopic.trim(),
    problemDescription: problemDescription.trim(),
    currentOperatingParameters: (currentOperatingParameters || '').trim(),
    expectedImprovement: (expectedImprovement || '').trim(),
    preferredMethod: (preferredMethod || 'Remote engineering audit').trim(),
    attachments: safeAttachments,
    status: 'New',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.consultations.unshift(newConsultation);
  saveDb(db);

  return res.status(201).json({
    message: 'Consultation request submitted successfully.',
    referenceId: refId,
    consultation: {
      id: refId,
      fullName: newConsultation.fullName,
      companyName: newConsultation.companyName,
      consultingTopic: newConsultation.consultingTopic,
      status: newConsultation.status,
      createdAt: newConsultation.createdAt
    }
  });
});

apiRouter.get('/consultations/track/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const db = getDb();
  const found = db.consultations.find(
    (c) => c.id.toLowerCase() === id.trim().toLowerCase()
  );

  if (!found) {
    return res.status(404).json({ error: `No consultation found with reference ${id}. Please verify your reference number.` });
  }

  // Return sanitized record for public tracking
  return res.json({
    consultation: {
      id: found.id,
      companyName: found.companyName,
      consultingTopic: found.consultingTopic,
      status: found.status,
      plantType: found.plantType,
      preferredMethod: found.preferredMethod,
      adminNotes: found.adminNotes || 'Your request is in our queue and will be reviewed by our principal ironmaking team shortly.',
      createdAt: found.createdAt,
      updatedAt: found.updatedAt
    }
  });
});

apiRouter.get('/consultations/my', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const db = getDb();
  const userEmail = req.user!.email.toLowerCase();
  const userId = req.user!.id;

  const userConsultations = db.consultations.filter(
    (c) => (c.userId && c.userId === userId) || c.email.toLowerCase() === userEmail
  );

  return res.json({ consultations: userConsultations });
});

apiRouter.get('/admin/consultations', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const db = getDb();
  return res.json({ consultations: db.consultations });
});

apiRouter.patch('/admin/consultations/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { status, adminNotes } = req.body;
  const validStatuses = ['New', 'Under Review', 'Information Required', 'In Progress', 'Completed', 'Closed'];

  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
  }

  const db = getDb();
  const item = db.consultations.find((c) => c.id === req.params.id);
  if (!item) {
    return res.status(404).json({ error: 'Consultation request not found' });
  }

  if (status) item.status = status;
  if (adminNotes !== undefined) item.adminNotes = adminNotes;
  item.updatedAt = new Date().toISOString();

  saveDb(db);
  return res.json({ message: 'Consultation updated successfully', consultation: item });
});

// --- TECHNICAL ARTICLES ROUTES ---

apiRouter.get('/articles', (req: Request, res: Response) => {
  const db = getDb();
  return res.json({ articles: db.articles });
});

apiRouter.post('/admin/articles', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const data = req.body;
  if (!data.title || !data.category || !data.summary) {
    return res.status(400).json({ error: 'Title, category, and summary are required.' });
  }

  const db = getDb();
  const newArticle: Article = {
    id: 'art-' + Date.now(),
    slug: data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    title: data.title,
    category: data.category,
    author: data.author || 'Ironmaking Technical Committee',
    readTime: data.readTime || '6 min read',
    publishedDate: new Date().toISOString().split('T')[0],
    summary: data.summary,
    sections: Array.isArray(data.sections) ? data.sections : [],
    keyFormulas: Array.isArray(data.keyFormulas) ? data.keyFormulas : [],
    tags: Array.isArray(data.tags) ? data.tags : ['Ironmaking']
  };

  db.articles.unshift(newArticle);
  saveDb(db);
  return res.status(201).json({ message: 'Article created successfully', article: newArticle });
});

apiRouter.put('/admin/articles/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const db = getDb();
  const index = db.articles.findIndex((a) => a.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Article not found' });
  }

  db.articles[index] = {
    ...db.articles[index],
    ...req.body
  };

  saveDb(db);
  return res.json({ message: 'Article updated successfully', article: db.articles[index] });
});

apiRouter.delete('/admin/articles/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const db = getDb();
  const index = db.articles.findIndex((a) => a.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Article not found' });
  }

  const deleted = db.articles.splice(index, 1);
  saveDb(db);
  return res.json({ message: 'Article deleted', article: deleted[0] });
});

// --- ANNOUNCEMENTS ROUTES ---

apiRouter.get('/announcements', (req: Request, res: Response) => {
  const db = getDb();
  return res.json({ announcements: db.announcements });
});

apiRouter.post('/admin/announcements', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const data = req.body;
  if (!data.title || !data.category || !data.shortDescription) {
    return res.status(400).json({ error: 'Title, category, and short description are required.' });
  }

  const db = getDb();
  const newAnn: Announcement = {
    id: 'ann-' + Date.now(),
    title: data.title,
    category: data.category,
    publicationDate: new Date().toISOString().split('T')[0],
    shortDescription: data.shortDescription,
    fullDetails: data.fullDetails || data.shortDescription,
    relatedAppOrService: data.relatedAppOrService || 'Platform',
    badge: data.badge || 'Update'
  };

  db.announcements.unshift(newAnn);
  saveDb(db);
  return res.status(201).json({ message: 'Announcement created successfully', announcement: newAnn });
});

apiRouter.put('/admin/announcements/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const db = getDb();
  const index = db.announcements.findIndex((a) => a.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Announcement not found' });
  }

  db.announcements[index] = {
    ...db.announcements[index],
    ...req.body
  };

  saveDb(db);
  return res.json({ message: 'Announcement updated successfully', announcement: db.announcements[index] });
});

apiRouter.delete('/admin/announcements/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const db = getDb();
  const index = db.announcements.findIndex((a) => a.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Announcement not found' });
  }

  const deleted = db.announcements.splice(index, 1);
  saveDb(db);
  return res.json({ message: 'Announcement deleted', announcement: deleted[0] });
});

// --- CONTACT & SETTINGS ROUTES ---

apiRouter.post('/contact', (req: Request, res: Response) => {
  const { name, company, email, phone, inquiryType, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  const db = getDb();
  const newContact: ContactInquiry = {
    id: 'msg-' + Date.now(),
    name: name.trim(),
    company: (company || '').trim(),
    email: email.trim().toLowerCase(),
    phone: (phone || '').trim(),
    inquiryType: inquiryType || 'General',
    message: message.trim(),
    createdAt: new Date().toISOString(),
    status: 'Unread'
  };

  db.contacts.unshift(newContact);
  saveDb(db);
  return res.status(201).json({ message: 'Your message has been received by our engineering team.' });
});

apiRouter.get('/admin/contacts', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const db = getDb();
  return res.json({ contacts: db.contacts });
});

apiRouter.get('/settings', (req: Request, res: Response) => {
  const db = getDb();
  return res.json({ settings: db.settings });
});

apiRouter.put('/admin/settings', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const db = getDb();
  db.settings = {
    ...db.settings,
    ...req.body
  };
  saveDb(db);
  return res.json({ message: 'Website settings updated successfully', settings: db.settings });
});

apiRouter.get('/admin/stats', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const db = getDb();
  const statusCounts = db.consultations.reduce(
    (acc, curr) => {
      acc[curr.status] = (acc[curr.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return res.json({
    totalUsers: db.users.length,
    totalApplications: db.applications.length,
    publishedApplications: db.applications.filter((a) => a.isPublished).length,
    totalConsultations: db.consultations.length,
    pendingConsultations: db.consultations.filter((c) => c.status === 'New' || c.status === 'Under Review').length,
    statusCounts,
    totalArticles: db.articles.length,
    totalAnnouncements: db.announcements.length,
    unreadInquiries: db.contacts.filter((c) => c.status === 'Unread').length
  });
});
