import { Project, User, CredentialItem, EnvVariable, ProjectDocument } from '../types';

export const initialProjects: Project[] = [
  {
    id: 'prj-1',
    name: 'PayPulse FinTech Engine',
    slug: 'paypulse-fintech',
    description: 'High-throughput payment gateway and ledger processing microservices with sub-50ms latency.',
    status: 'active',
    leadName: 'Sarah Jenkins',
    leadAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    teamCount: 8,
    credentialsCount: 6,
    envCount: 14,
    docsCount: 5,
    repoUrl: 'https://github.com/company/paypulse-engine',
    color: 'from-blue-600 to-indigo-600',
    category: 'Financial Technology',
    createdAt: '2024-02-15',
  },
  {
    id: 'prj-2',
    name: 'AcreFlow Real Estate CRM',
    slug: 'acreflow-crm',
    description: 'Enterprise commercial real estate platform with land layout mapping, plot bookings, and commission payouts.',
    status: 'active',
    leadName: 'Alex Rivera',
    leadAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    teamCount: 6,
    credentialsCount: 4,
    envCount: 11,
    docsCount: 4,
    repoUrl: 'https://github.com/company/acreflow-crm',
    color: 'from-emerald-500 to-teal-600',
    category: 'PropTech CRM',
    createdAt: '2024-04-10',
  },
  {
    id: 'prj-3',
    name: 'PulseHealth Patient Portal',
    slug: 'pulsehealth-portal',
    description: 'HIPAA-compliant telemedicine consultation hub, EHR integration, and automated patient appointment reminders.',
    status: 'in_progress',
    leadName: 'Dr. Michael Chen',
    leadAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    teamCount: 5,
    credentialsCount: 5,
    envCount: 9,
    docsCount: 3,
    repoUrl: 'https://github.com/company/pulsehealth-telemed',
    color: 'from-rose-500 to-pink-600',
    category: 'HealthTech & Compliance',
    createdAt: '2024-06-01',
  },
  {
    id: 'prj-4',
    name: 'DataNexus BI Analytics',
    slug: 'datanexus-bi',
    description: 'Internal operational data warehouse, automated ETL pipeline with Apache Beam, BigQuery, and real-time executive dashboard.',
    status: 'active',
    leadName: 'Priya Sharma',
    leadAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    teamCount: 4,
    credentialsCount: 3,
    envCount: 8,
    docsCount: 6,
    repoUrl: 'https://github.com/company/datanexus-pipeline',
    color: 'from-amber-500 to-orange-600',
    category: 'Big Data & Analytics',
    createdAt: '2024-01-20',
  },
];

export const initialUsers: User[] = [
  {
    id: 'usr-1',
    name: 'Aman Sharma',
    email: 'admin@company.internal',
    role: 'Super Admin',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    department: 'Engineering Leadership',
    status: 'Active',
    assignedProjectIds: ['prj-1', 'prj-2', 'prj-3', 'prj-4'],
    joinedAt: '2023-01-10',
  },
  {
    id: 'usr-2',
    name: 'Sarah Jenkins',
    email: 'sarah.j@company.internal',
    role: 'Admin',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    department: 'FinTech Backend',
    status: 'Active',
    assignedProjectIds: ['prj-1', 'prj-4'],
    joinedAt: '2023-03-15',
  },
  {
    id: 'usr-3',
    name: 'Alex Rivera',
    email: 'alex.r@company.internal',
    role: 'Admin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    department: 'Frontend Engineering',
    status: 'Active',
    assignedProjectIds: ['prj-2'],
    joinedAt: '2023-05-20',
  },
  {
    id: 'usr-4',
    name: 'David Kim',
    email: 'david.k@company.internal',
    role: 'Employee',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
    department: 'Mobile & Cloud Infrastructure',
    status: 'Active',
    assignedProjectIds: ['prj-1', 'prj-3'],
    joinedAt: '2023-08-01',
  },
  {
    id: 'usr-5',
    name: 'Emily Watson',
    email: 'emily.w@company.internal',
    role: 'Employee',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    department: 'QA & Compliance',
    status: 'Active',
    assignedProjectIds: ['prj-3'],
    joinedAt: '2023-11-12',
  },
  {
    id: 'usr-6',
    name: 'Rahul Patel',
    email: 'rahul.p@company.internal',
    role: 'Employee',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    department: 'Fullstack Development',
    status: 'Active',
    assignedProjectIds: ['prj-2', 'prj-4'],
    joinedAt: '2024-01-05',
  },
];

export const initialCredentials: CredentialItem[] = [
  {
    id: 'cred-1',
    projectId: 'prj-1',
    name: 'PostgreSQL Database',
    service: 'Database',
    category: 'Database',
    environment: 'Production',
    username: 'paypulse_master',
    secretValue: 'p9$kX!98mQ_Live2026',
    endpoint: 'paypulse-db.internal:5432',
    notes: 'Main application database login for transactions.',
    updatedBy: 'Aman Sharma',
    updatedAt: '2026-09-12',
  },
  {
    id: 'cred-2',
    projectId: 'prj-1',
    name: 'Stripe Finance Portal',
    service: 'Payment Gateway',
    category: 'Payment Gateway',
    environment: 'Production',
    username: 'finance@paypulse.io',
    secretValue: 'Str!peLive#Sec_99214',
    endpoint: 'https://dashboard.stripe.com',
    notes: 'Handles payout processing and dispute reviews.',
    updatedBy: 'Sarah Jenkins',
    updatedAt: '2026-10-01',
  },
  {
    id: 'cred-3',
    projectId: 'prj-1',
    name: 'AWS Cloud Console',
    service: 'Cloud Provider',
    category: 'Cloud Provider',
    environment: 'Production',
    username: 'devops-lead@paypulse.io',
    secretValue: 'AwsCloud#P@ss2026',
    endpoint: 'https://console.aws.amazon.com',
    notes: 'Root console access for servers and monitoring.',
    updatedBy: 'Sarah Jenkins',
    updatedAt: '2026-08-15',
  },
  {
    id: 'cred-4',
    projectId: 'prj-2',
    name: 'MongoDB Atlas Admin',
    service: 'Database',
    category: 'Database',
    environment: 'Production',
    username: 'acreflow_app_rw',
    secretValue: 'M0ngoAtlas#AcreFlow!2026',
    endpoint: 'https://cloud.mongodb.com',
    notes: 'CRM database admin access for plots and bookings.',
    updatedBy: 'Alex Rivera',
    updatedAt: '2026-09-28',
  },
  {
    id: 'cred-5',
    projectId: 'prj-2',
    name: 'AcreFlow Admin Portal',
    service: 'Web Login',
    category: 'Web Login',
    environment: 'Production',
    username: 'superadmin@acreflow.io',
    secretValue: 'AdminPortal#9948!',
    endpoint: 'https://admin.acreflow.io',
    notes: 'Internal management dashboard superadmin login.',
    updatedBy: 'Alex Rivera',
    updatedAt: '2026-07-10',
  },
  {
    id: 'cred-6',
    projectId: 'prj-3',
    name: 'Twilio Video & SMS Portal',
    service: 'API Key',
    category: 'API Key',
    environment: 'Staging',
    username: 'telehealth@medpulse.io',
    secretValue: 'Twilio!Telehealth_8829',
    endpoint: 'https://console.twilio.com',
    notes: 'Doctor consultation video gateway and SMS service.',
    updatedBy: 'Aman Sharma',
    updatedAt: '2026-09-05',
  },
  {
    id: 'cred-7',
    projectId: 'prj-4',
    name: 'Google Cloud Platform Console',
    service: 'Cloud Provider',
    category: 'Cloud Provider',
    environment: 'Development',
    username: 'datanexus-admin@company.com',
    secretValue: 'Gcp#SecurePass99X!',
    endpoint: 'https://console.cloud.google.com',
    notes: 'Warehouse ingestion and analytics cloud portal.',
    updatedBy: 'Aman Sharma',
    updatedAt: '2026-06-18',
  },
];

export const initialEnvVariables: EnvVariable[] = [
  // PayPulse prj-1
  {
    id: 'env-1',
    projectId: 'prj-1',
    environment: 'production',
    key: 'PORT',
    value: '8080',
    isSecret: false,
    description: 'Server listening port',
    lastModified: '2026-09-10',
  },
  {
    id: 'env-2',
    projectId: 'prj-1',
    environment: 'production',
    key: 'DATABASE_URL',
    value: 'postgresql://paypulse_usr:live_pass_2026@rds.internal:5432/paypulse_prod',
    isSecret: true,
    description: 'Main relational database pool connection',
    lastModified: '2026-10-01',
  },
  {
    id: 'env-3',
    projectId: 'prj-1',
    environment: 'production',
    key: 'JWT_ACCESS_SECRET',
    value: 'f49b817c91e847cbb624e414c197368d19385012a9',
    isSecret: true,
    description: 'Cryptographic key for signing bearer tokens (256-bit)',
    lastModified: '2026-08-20',
  },
  {
    id: 'env-4',
    projectId: 'prj-1',
    environment: 'production',
    key: 'REDIS_CACHE_URL',
    value: 'redis://:authpass@redis-cluster.internal:6379/0',
    isSecret: true,
    description: 'In-memory ledger cache and rate-limiting store',
    lastModified: '2026-09-15',
  },
  {
    id: 'env-5',
    projectId: 'prj-1',
    environment: 'development',
    key: 'DATABASE_URL',
    value: 'postgresql://postgres:postgres@localhost:5432/paypulse_dev',
    isSecret: false,
    description: 'Local development database Docker container',
    lastModified: '2026-07-01',
  },
  {
    id: 'env-6',
    projectId: 'prj-1',
    environment: 'development',
    key: 'ENABLE_MOCK_PAYMENTS',
    value: 'true',
    isSecret: false,
    description: 'Bypasses live card networks for instant local dev checkout',
    lastModified: '2026-07-01',
  },
  {
    id: 'env-7',
    projectId: 'prj-1',
    environment: 'staging',
    key: 'DATABASE_URL',
    value: 'postgresql://stg_usr:stg_pass@rds-staging.internal:5432/paypulse_stg',
    isSecret: true,
    description: 'Staging integration environment DB',
    lastModified: '2026-09-02',
  },

  // AcreFlow prj-2
  {
    id: 'env-8',
    projectId: 'prj-2',
    environment: 'production',
    key: 'VITE_API_BASE_URL',
    value: 'https://api.acreflow.company.internal/api/v1',
    isSecret: false,
    description: 'Production REST API entrypoint',
    lastModified: '2026-09-12',
  },
  {
    id: 'env-9',
    projectId: 'prj-2',
    environment: 'production',
    key: 'MONGODB_URI',
    value: 'mongodb+srv://admin:secure_pass@acreflow.mongodb.net/crm_prod?retryWrites=true',
    isSecret: true,
    description: 'MongoDB database connection string',
    lastModified: '2026-09-12',
  },
  {
    id: 'env-10',
    projectId: 'prj-2',
    environment: 'production',
    key: 'AWS_S3_BUCKET_NAME',
    value: 'acreflow-production-media-vault',
    isSecret: false,
    description: 'S3 bucket name for real estate floorplans and contracts',
    lastModified: '2026-05-19',
  },
  {
    id: 'env-11',
    projectId: 'prj-2',
    environment: 'development',
    key: 'VITE_API_BASE_URL',
    value: 'http://localhost:5000/api/v1',
    isSecret: false,
    description: 'Local API server URL',
    lastModified: '2026-04-10',
  },

  // PulseHealth prj-3
  {
    id: 'env-12',
    projectId: 'prj-3',
    environment: 'production',
    key: 'HIPAA_AUDIT_LOG_ENDPOINT',
    value: 'https://audit-compliance.internal/v2/events',
    isSecret: false,
    description: 'Direct ingestion for mandatory patient record access audits',
    lastModified: '2026-08-11',
  },
  {
    id: 'env-13',
    projectId: 'prj-3',
    environment: 'production',
    key: 'ENCRYPTION_MASTER_KEY',
    value: 'enc_sec_991823901847192801948102983',
    isSecret: true,
    description: 'AES-256 GCM key for encrypting patient clinical notes at rest',
    lastModified: '2026-08-11',
  },
];

export const initialDocuments: ProjectDocument[] = [
  {
    id: 'doc-1',
    projectId: 'prj-1',
    title: 'High-Throughput Ledger Architecture & Consensus',
    category: 'Architecture',
    author: 'Sarah Jenkins',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    updatedAt: '2026-09-18',
    readTime: '6 min read',
    tags: ['Architecture', 'Kafka', 'PostgreSQL', 'Double-Entry'],
    content: `## PayPulse Ledger System Architecture

### 1. Overview
The PayPulse Ledger Service guarantees strict immutable double-entry bookkeeping. Every financial movement consists of at least one debit entry and one credit entry such that total debits equal total credits.

### 2. Transaction Lifecycle
1. **Request Intake**: Client initiates transaction through API gateway with idempotency key (\`Idempotency-Key: uuid\`).
2. **Locking & Validation**: Distributed Redis lock acquired on payer account to prevent double spending.
3. **Kafka Event Propagation**: Message posted to topic \`ledger.transactions.pending\` with SASL-authenticated producer.
4. **PostgreSQL Write**: Read-committed transaction inserts balanced journal entries into partitioned \`journal_lines\` table.

\`\`\`sql
-- Sample Double-Entry verification constraint
SELECT transaction_id, 
       SUM(CASE WHEN direction = 'DEBIT' THEN amount ELSE -amount END) as balance
FROM journal_lines
GROUP BY transaction_id
HAVING SUM(CASE WHEN direction = 'DEBIT' THEN amount ELSE -amount END) != 0;
\`\`\`

### 3. Disaster Recovery
Hot standby replicas are synced with streaming replication in \`us-east-2\`. Automatic failover threshold is set to 15 seconds.`,
  },
  {
    id: 'doc-2',
    projectId: 'prj-1',
    title: 'PCI-DSS & Tokenization API Specification',
    category: 'API Specification',
    author: 'Aman Sharma',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    updatedAt: '2026-10-04',
    readTime: '4 min read',
    tags: ['Security', 'API', 'Tokenization', 'Stripe'],
    content: `## Secure Tokenization API

Never accept raw card numbers in internal application microservices. All payment instruments must be tokenized via client-side SDK.

### Endpoints
- **POST /v1/tokens/exchange**
  - **Headers**: \`Authorization: Bearer <JWT>\`, \`X-Tenant-ID: <id>\`
  - **Body**:
  \`\`\`json
  {
    "client_token": "tok_1H8391823901",
    "currency": "USD",
    "customer_id": "cust_8829"
  }
  \`\`\`
  - **Response 201 Created**:
  \`\`\`json
  {
    "token_id": "ptok_99120938",
    "brand": "Visa",
    "last4": "4242",
    "expires_at": "2029-12-31"
  }
  \`\`\``,
  },
  {
    id: 'doc-3',
    projectId: 'prj-2',
    title: 'AcreFlow Real Estate CRM Layout & Plot Engine Guide',
    category: 'Deployment Guide',
    author: 'Alex Rivera',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    updatedAt: '2026-08-30',
    readTime: '5 min read',
    tags: ['AcreFlow', 'Plots', 'Interactive Canvas', 'GIS'],
    content: `## AcreFlow Land Layout Mapping Module

### 1. Interactive Land Layouts
Plots are visualized using HTML5 Canvas & SVG polygons. Coordinates are relative percentages to ensure consistent rendering across multi-resolution tablet displays.

### 2. Plot Status State Machine
- **Available** (Green): Free for booking.
- **Hold** (Amber): Locked by agent for 48 hours awaiting token advance.
- **Booked** (Blue): First deposit recorded, agreement pending.
- **Sold / Registered** (Purple): Registry completed, commission calculated.

### 3. Role Access
- **Super Admin**: Full CRUD on projects, plots, layouts, and commission configurations.
- **Employee / Agent**: View plots, create customer leads, place temporary holds.`,
  },
  {
    id: 'doc-4',
    projectId: 'prj-3',
    title: 'HIPAA Security & Telemedicine Video Encryption Spec',
    category: 'Security Policy',
    author: 'Dr. Michael Chen',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    updatedAt: '2026-09-22',
    readTime: '7 min read',
    tags: ['HIPAA', 'Encryption', 'WebRTC', 'Audit'],
    content: `## PulseHealth Compliance & Zero-Knowledge Encryption

### Encryption Standards
- In Transit: TLS 1.3 only with cipher suites offering Forward Secrecy.
- At Rest: AES-256 GCM envelope encryption.
- Video Consultations: WebRTC media streams are encrypted using DTLS-SRTP end-to-end.

### Mandatory Access Logging
Every clinician query that loads patient PHI triggers an immutable row in the audit log queue. Deletion of audit logs is programmatically prevented.`,
  },
  {
    id: 'doc-5',
    projectId: 'prj-4',
    title: 'BigQuery ETL Pipeline & Warehouse Ingestion Protocol',
    category: 'Architecture',
    author: 'Priya Sharma',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    updatedAt: '2026-07-29',
    readTime: '5 min read',
    tags: ['BigQuery', 'GCP', 'Dataform', 'ETL'],
    content: `## DataNexus Analytics Warehouse Pipeline

Data is ingested nightly from transactional PostgreSQL databases and Kafka streams into Google Cloud BigQuery.

### Transformations
- **Raw Layer**: Tables loaded as append-only partitioned by date.
- **Staging / Clean Layer**: Managed via Dataform and SQLX transformations with automated deduplication.
- **Mart Layer**: Materialized views power executive BI dashboards.`,
  },
  {
    id: 'doc-6',
    projectId: 'prj-1',
    title: 'PayPulse System Architecture Blueprint',
    category: 'Uploaded File',
    fileName: 'PayPulse_Cloud_Topology_v2.pdf',
    fileSize: '2.4 MB',
    fileType: 'pdf',
    isUploaded: true,
    author: 'Sarah Jenkins',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    updatedAt: '2026-10-12',
    readTime: '2.4 MB',
    tags: ['Architecture', 'PDF', 'Topology', 'AWS'],
    content: 'Attached system topology and AWS deployment blueprint for PayPulse ledger pods.',
  },
  {
    id: 'doc-7',
    projectId: 'prj-2',
    title: 'AcreFlow Master Sector Plots Map',
    category: 'Uploaded File',
    fileName: 'AcreFlow_Sector_Layout.pdf',
    fileSize: '4.8 MB',
    fileType: 'pdf',
    isUploaded: true,
    author: 'Alex Rivera',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    updatedAt: '2026-09-15',
    readTime: '4.8 MB',
    tags: ['GIS', 'Plots', 'Map', 'Survey'],
    content: 'Official GIS master survey map covering Phase 1 and Phase 2 residential plots.',
  },
];
