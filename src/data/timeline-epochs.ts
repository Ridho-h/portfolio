export interface EpochMilestone {
  epoch: number;
  totalEpochs: number;
  step: number;
  valLoss: number;
  trainLoss: number;
  learningRate: string;
  id: string;
  title: string;
  role: string;
  period: string;
  kind: 'DEGREE' | 'AWARD' | 'PROGRAM' | 'ENTERPRISE' | 'LEADERSHIP';
  summary: string;
  keyOutputs: string[];
  metrics: [string, string][];
  tags: string[];
}

export const trainingEpochs: EpochMilestone[] = [
  {
    epoch: 1,
    totalEpochs: 6,
    step: 1200,
    valLoss: 0.082,
    trainLoss: 0.095,
    learningRate: '1.0e-3',
    id: 'unsri',
    title: 'Universitas Sriwijaya',
    role: 'B.Sc. in Computer Science / Informatics',
    period: '2021 — 2025',
    kind: 'DEGREE',
    summary: 'Graduated with highest distinction (GPA 3.92 / 4.00, Cum Laude). Published comparative research on deep learning architectures for chest X-ray lung segmentation.',
    keyOutputs: [
      'Comparative study on U-Net, U-Net++, and SegFormer-B0 for lung lesion isolation.',
      'Core coursework in Algorithms, Neural Networks, Database Systems, and Discrete Math.',
      'Achieved cumulative GPA of 3.92 / 4.00 with academic honors.',
    ],
    metrics: [
      ['GPA', '3.92 / 4.00'],
      ['Standing', 'Cum Laude'],
      ['Thesis Focus', 'SegFormer'],
    ],
    tags: ['Algorithms', 'Deep Learning', 'PyTorch', 'Research'],
  },
  {
    epoch: 2,
    totalEpochs: 6,
    step: 2400,
    valLoss: 0.061,
    trainLoss: 0.072,
    learningRate: '8.0e-4',
    id: 'sic',
    title: 'Samsung Innovation Campus',
    role: 'Batch 5 AI & IoT Semi-Finalist',
    period: '2024',
    kind: 'AWARD',
    summary: 'Selected among top national cohorts for intensive machine learning and IoT pipeline training, building intelligent edge sensing prototypes.',
    keyOutputs: [
      'Developed edge-compatible ML classification pipeline for IoT sensor telemetry.',
      'Engineered automated anomaly detection with constrained latency and memory footprint.',
      'Ranked as Semi-Finalist across nationwide university submissions.',
    ],
    metrics: [
      ['Award', 'Semi-Finalist'],
      ['Domain', 'IoT + AI'],
      ['Cohort', 'Batch 5'],
    ],
    tags: ['Edge AI', 'Anomaly Detection', 'IoT', 'Python'],
  },
  {
    epoch: 3,
    totalEpochs: 6,
    step: 3600,
    valLoss: 0.045,
    trainLoss: 0.052,
    learningRate: '5.0e-4',
    id: 'bangkit',
    title: 'Bangkit Academy',
    role: 'Machine Learning Cohort Graduate',
    period: '2024',
    kind: 'PROGRAM',
    summary: 'Led by Google, Tokopedia, Gojek & Traveloka. Completed 900+ hours of advanced machine learning, computer vision, and cloud engineering.',
    keyOutputs: [
      'Engineered end-to-end ML capstone combining Named Entity Recognition and content-based recommendation.',
      'Applied GANs, sequence modeling, and TensorFlow Extended (TFX) production pipelines.',
      'Graduated with distinction among top percentile of 5,000+ national applicants.',
    ],
    metrics: [
      ['Curriculum', 'Google-Led 900h'],
      ['Certification', 'TensorFlow ML'],
      ['Status', 'Distinction'],
    ],
    tags: ['TensorFlow', 'Cloud Deployment', 'NER', 'Recommendation'],
  },
  {
    epoch: 4,
    totalEpochs: 6,
    step: 4800,
    valLoss: 0.034,
    trainLoss: 0.039,
    learningRate: '3.0e-4',
    id: 'bank-jambi',
    title: 'Bank Pembangunan Daerah Jambi',
    role: 'Enterprise Data & ML Engineering Intern',
    period: '2024',
    kind: 'ENTERPRISE',
    summary: 'Designed automated SQL data transformation workflows, financial reporting pipelines, and internal business intelligence dashboards.',
    keyOutputs: [
      'Automated recurring transaction reporting queries across enterprise databases, reducing generation time by 60%.',
      'Implemented data validation checks ensuring 100% reconciliation accuracy across financial summaries.',
      'Collaborated directly with banking operations teams on business intelligence integration.',
    ],
    metrics: [
      ['Efficiency', '+60% Speedup'],
      ['Accuracy', '100% Reconciled'],
      ['Scope', 'Enterprise BI'],
    ],
    tags: ['SQL', 'Data Pipelines', 'ETL', 'Business Intelligence'],
  },
  {
    epoch: 5,
    totalEpochs: 6,
    step: 6000,
    valLoss: 0.021,
    trainLoss: 0.026,
    learningRate: '1.5e-4',
    id: 'gdg-unsri',
    title: 'Google Developer Group on Campus UNSRI',
    role: 'Machine Learning Member & Technical Lead',
    period: '2025',
    kind: 'LEADERSHIP',
    summary: 'Mentored university members in NLP and computer vision, built community RAG systems, and organized technical hands-on workshops.',
    keyOutputs: [
      'Built hybrid RAG system combining e-commerce product catalogs with live web search APIs.',
      'Conducted 4 technical workshops on modern NLP architectures and PyTorch fundamentals.',
      'Developed real-time sales performance tracking dashboard with interactive filters.',
    ],
    metrics: [
      ['Sessions Led', '4 Workshops'],
      ['Students Mentored', '80+'],
      ['Project', 'ShopAI Hybrid RAG'],
    ],
    tags: ['RAG', 'Technical Mentorship', 'NLP', 'Community'],
  },
  {
    epoch: 6,
    totalEpochs: 6,
    step: 7200,
    valLoss: 0.009,
    trainLoss: 0.012,
    learningRate: '5.0e-5',
    id: 'apac-challenge',
    title: 'Google APAC Solution Challenge 2025',
    role: 'Project "Lungify" — Core ML Lead',
    period: 'Jul 2025',
    kind: 'AWARD',
    summary: 'Built "Lungify", an AI-powered respiratory diagnosis and multimodal symptom analysis engine powered by Google Gemini, shipping a production prototype in a 2-week sprint.',
    keyOutputs: [
      'Engineered real-time multilingual symptom triaging agent utilizing Gemini 1.5 with structured JSON schema outputs.',
      'Designed zero-shot chest sound diagnostic pipeline with audio feature embeddings.',
      'Delivered fully functional cross-platform prototype deployed to test flight users in 14 days.',
    ],
    metrics: [
      ['Recognition', 'APAC Winner'],
      ['Model', 'Gemini 1.5 Pro'],
      ['Sprint', '14 Days to Ship'],
    ],
    tags: ['Gemini 1.5', 'Multilingual NLP', 'Healthcare AI', 'Rapid Prototyping'],
  },
];
