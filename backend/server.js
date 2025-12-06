require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const db = require('./db');
const cloudinary = require('./cloudinary');
const streamifier = require('streamifier');
const Document = require('./models/Document');
const Version = require('./models/Version');
const { router: authRouter, authenticateToken } = require('./auth');
const crmRoutes = require('./routes/crm');
const auditRoutes = require('./routes/audit');
const tareasRoutes = require('./routes/tareas');
const propiedadesRoutes = require('./routes/propiedades');
const clientesRoutes = require('./routes/clientes');
const agentesRoutes = require('./routes/agentes');
const operacionesRoutes = require('./routes/operaciones');
const citasRoutes = require('./routes/citas');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// optional request logger (morgan) if installed
try {
  // eslint-disable-next-line global-require
  const morgan = require('morgan');
  app.use(morgan('dev'));
} catch (e) {
  // morgan not installed, ignore
}

// Auth routes
app.use('/auth', authRouter);
app.use('/crm', crmRoutes);
app.use('/audit', auditRoutes);
app.use('/crm/tareas', tareasRoutes);
// CRM entity routes
app.use('/crm/propiedades', propiedadesRoutes);
app.use('/crm/clientes', clientesRoutes);
app.use('/crm/agentes', agentesRoutes);
app.use('/crm/operaciones', operacionesRoutes);
app.use('/crm/citas', citasRoutes);

// Multer memory storage for Cloudinary upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
// Root route - API info
app.get('/', (req, res) => {
  res.json({
    name: 'CRM Admin API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: 'GET /health',
      auth: {
        login: 'POST /auth/login',
        register: 'POST /auth/register'
      },
      crm: {
        propiedades: 'GET/POST/PUT/DELETE /crm/propiedades',
        clientes: 'GET/POST/PUT/DELETE /crm/clientes',
        agentes: 'GET/POST/PUT/DELETE /crm/agentes',
        operaciones: 'GET/POST/PUT/DELETE /crm/operaciones',
        citas: 'GET/POST/PUT/DELETE /crm/citas',
        tareas: 'GET/POST/PUT/DELETE /crm/tareas'
      },
      documents: {
        list: 'GET /documents',
        upload: 'POST /documents',
        download: 'GET /documents/:id/download',
        delete: 'DELETE /documents/:id'
      }
    }
  });
});

app.get('/health', (req, res) => res.json({ ok: true, timestamp: new Date().toISOString() }));

// List documents (simple query, supports search query param)
app.get('/documents', async (req, res) => {
  try {
    const q = req.query.q || '';
    const filter = q ? { nombre: new RegExp(q, 'i') } : {};
    const docs = await Document.find(filter).sort({ _id: -1 }).limit(500).exec();
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upload documents
app.post('/documents', authenticateToken, upload.array('files'), async (req, res) => {
  const files = req.files || [];
  if (files.length === 0) return res.status(400).json({ error: 'No files uploaded' });
  try {
    const uploaded = [];
    for (const f of files) {
      const ext = (f.originalname.split('.').pop() || '').toUpperCase();
      const tipo = ext === 'PDF' ? 'PDF' : (ext === 'DOCX' || ext === 'DOC') ? 'Word' : (ext === 'ZIP' ? 'ZIP' : 'Imagen');
      const tamano = +(f.size / (1024 * 1024)).toFixed(2);
      // upload to cloudinary stream
      const streamUpload = (buffer) => new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
          if (result) resolve(result); else reject(error);
        });
        streamifier.createReadStream(buffer).pipe(stream);
      });
      const result = await streamUpload(f.buffer);
      const doc = new Document({ nombre: f.originalname, tipo, tamano, url: result.secure_url, cloudinary_id: result.public_id });
      await doc.save();
      const version = new Version({ document: doc._id, filename: f.originalname, url: result.secure_url, cloudinary_id: result.public_id });
      await version.save();
      doc.versions.push(version._id);
      await doc.save();
      uploaded.push(doc);
    }
    res.status(201).json({ uploaded });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Download document by id
app.get('/documents/:id/download', async (req, res) => {
  try {
    const id = req.params.id;
    const doc = await Document.findById(id).exec();
    if (!doc) return res.status(404).json({ error: 'Not found' });
    // increase accesos
    doc.accesos = (doc.accesos || 0) + 1;
    await doc.save();
    // redirect to cloudinary url or stream
    return res.redirect(doc.url);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete document
app.delete('/documents/:id', authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const doc = await Document.findById(id).exec();
    if (!doc) return res.status(404).json({ error: 'Not found' });
    // delete from cloudinary
    if (doc.cloudinary_id) await cloudinary.uploader.destroy(doc.cloudinary_id, { resource_type: 'auto' });
    await Version.deleteMany({ document: doc._id });
    await doc.remove();
    res.json({ deletedId: id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Webhook endpoint for CRM to notify document actions (example)
app.post('/webhook/crm', (req, res) => {
  // Ejemplo: { action: 'link_document', crmId: '123', documentId: 5 }
  const payload = req.body;
  console.log('CRM webhook received', payload);
  // Aquí se mapearía crmId -> relacionado u otra lógica
  // Para ejemplo, si nos envían documentId y crmId, actualizamos campo 'relacionado'
  if (payload.documentId && payload.crmId) {
    // Use Mongoose to update the Document.relacionado field
    const docId = payload.documentId;
    Document.findByIdAndUpdate(docId, { relacionado: payload.crmId }, { new: true }).then(updated => {
      if (!updated) return res.status(404).json({ error: 'Not found' });
      return res.json({ ok: true, updated: updated._id });
    }).catch(err => res.status(500).json({ error: err.message }));
    return;
  }
  res.json({ ok: true });
});

// Serve uploaded files (optional) - define uploadDir for backward compatibility with earlier prototype
const uploadDir = path.join(__dirname, 'uploads');
if (!require('fs').existsSync(uploadDir)) {
  // it's fine if uploads folder doesn't exist (we use Cloudinary), but create for compatibility
  try { require('fs').mkdirSync(uploadDir, { recursive: true }); } catch(e) { /* ignore */ }
}
app.use('/uploads', express.static(uploadDir));

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Document backend listening on http://localhost:${PORT}`);
  });
} else {
  // when required (for tests) export the app without listening
  module.exports = app;
}
