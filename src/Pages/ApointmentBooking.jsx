import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/* ═══════════════════════════════════════════════════════════════
   GUWAHATI DOCTOR DIRECTORY — 22 Renowned Specialists
   ═══════════════════════════════════════════════════════════════ */
const DOCTORS = [
  // ── Cardiology ────────────────────────────────────────────────
  {
    id: 1,
    name: 'Dr. Bidyut Bikash Bora',
    qualification: 'MD (Medicine), DM (Cardiology), FESC',
    specialty: 'Cardiology',
    hospital: 'Gauhati Medical College & Hospital (GMCH)',
    area: 'Bhangagarh, Guwahati',
    experience: 22,
    rating: 4.9,
    image: '👨‍⚕️',
    about: 'Senior Cardiologist at GMCH with 22+ years in interventional cardiology, echocardiography, heart failure management, and preventive cardiac care. Former Head of Cardiology Department.',
    languages: ['Assamese', 'Bengali', 'Hindi', 'English'],
    specializations: ['Interventional Cardiology', 'Echocardiography', 'Heart Failure', 'Arrhythmia'],
    timings: 'Mon–Sat: 10AM–2PM (OPD)',
    phone: 'GMCH: 0361-2529457',
    location: 'Bhangagarh, Guwahati – 781032',
    mapQuery: 'Gauhati Medical College Guwahati',
  },
  {
    id: 2,
    name: 'Dr. Arun Kumar Kalita',
    qualification: 'MBBS, MD (Medicine), DM (Cardiology)',
    specialty: 'Cardiology',
    hospital: 'Apollo Excelcare Hospital',
    area: 'Bhetapara, Guwahati',
    experience: 16,
    rating: 4.8,
    image: '👨‍⚕️',
    about: 'Cardiologist at Apollo Excelcare specialising in interventional procedures, cardiac catheterisation, coronary angioplasty, and advanced heart imaging.',
    languages: ['Assamese', 'Hindi', 'English'],
    specializations: ['Coronary Angioplasty', 'Cardiac Catheterisation', 'Preventive Cardiology', 'ECG'],
    timings: 'Mon–Fri: 9AM–5PM',
    phone: 'Apollo Excelcare: 0361-2301084',
    location: 'Bhetapara, Guwahati – 781028',
    mapQuery: 'Apollo Excelcare Hospital Guwahati',
  },

  // ── Neurology ─────────────────────────────────────────────────
  {
    id: 3,
    name: 'Dr. Anurag Borthakur',
    qualification: 'MBBS, MD (Medicine), DM (Neurology)',
    specialty: 'Neurology',
    hospital: 'Apollo Excelcare Hospital',
    area: 'Bhetapara, Guwahati',
    experience: 18,
    rating: 4.8,
    image: '👨‍⚕️',
    about: 'Leading neurologist specialising in stroke management, epilepsy, Parkinson\'s disease, and neurodegenerative disorders. Trained at PGIMER Chandigarh.',
    languages: ['Assamese', 'Hindi', 'English'],
    specializations: ['Stroke Management', 'Epilepsy', "Parkinson's Disease", 'Migraine & Headache'],
    timings: 'Mon–Fri: 9AM–1PM, 4PM–7PM',
    phone: 'Apollo Excelcare: 0361-2301084',
    location: 'Bhetapara, Guwahati – 781028',
    mapQuery: 'Apollo Excelcare Hospital Guwahati',
  },
  {
    id: 4,
    name: 'Dr. Munindra Barua',
    qualification: 'MBBS, MD, DM (Neurology), FAAN',
    specialty: 'Neurology',
    hospital: 'Narayana Superspeciality Hospital',
    area: 'Guwahati',
    experience: 20,
    rating: 4.9,
    image: '👨‍⚕️',
    about: 'Senior neurologist with expertise in movement disorders, dementia, multiple sclerosis, and neuromuscular diseases. Widely published researcher.',
    languages: ['Assamese', 'Hindi', 'English'],
    specializations: ['Movement Disorders', 'Dementia', 'Multiple Sclerosis', 'Neuromuscular Disease'],
    timings: 'Mon–Sat: 10AM–4PM',
    phone: 'Narayana: 0361-6601000',
    location: 'NH-37, Guwahati – 781026',
    mapQuery: 'Narayana Superspeciality Hospital Guwahati',
  },

  // ── General Medicine / Internal Medicine ──────────────────────
  {
    id: 5,
    name: 'Dr. Sanjib Kakati',
    qualification: 'MBBS, MD (General Medicine)',
    specialty: 'General Medicine',
    hospital: 'Gauhati Medical College & Hospital (GMCH)',
    area: 'Bhangagarh, Guwahati',
    experience: 25,
    rating: 4.8,
    image: '👨‍⚕️',
    about: 'Senior physician at GMCH with 25 years of experience in internal medicine, infectious diseases, chronic disease management, diabetes, and hypertension care.',
    languages: ['Assamese', 'Hindi', 'English'],
    specializations: ['Diabetes Management', 'Hypertension', 'Thyroid Disorders', 'Fever & Infections'],
    timings: 'Mon–Sat: 8AM–12PM (OPD)',
    phone: 'GMCH: 0361-2529457',
    location: 'Bhangagarh, Guwahati – 781032',
    mapQuery: 'Gauhati Medical College Guwahati',
  },
  {
    id: 6,
    name: 'Dr. Bhupen Hazarika',
    qualification: 'MBBS, MD (Internal Medicine), DNB',
    specialty: 'General Medicine',
    hospital: 'Pratiksha Hospital',
    area: 'Lachit Nagar, Guwahati',
    experience: 14,
    rating: 4.7,
    image: '👨‍⚕️',
    about: 'Internal medicine specialist with a focus on tropical infections, metabolic disorders, and geriatric care. Known for thorough patient assessment.',
    languages: ['Assamese', 'Bengali', 'Hindi', 'English'],
    specializations: ['Tropical Diseases', 'Metabolic Disorders', 'Geriatric Care', 'Preventive Health'],
    timings: 'Mon–Sat: 10AM–6PM',
    phone: 'Pratiksha: 0361-2463210',
    location: 'Lachit Nagar, Guwahati – 781007',
    mapQuery: 'Pratiksha Hospital Guwahati',
  },

  // ── Gynecology & Obstetrics ───────────────────────────────────
  {
    id: 7,
    name: 'Dr. Priyanka Dutta',
    qualification: 'MBBS, MS (Obstetrics & Gynecology)',
    specialty: 'Gynecology & Obstetrics',
    hospital: 'Dispur Hospital',
    area: 'Dispur, Guwahati',
    experience: 14,
    rating: 4.9,
    image: '👩‍⚕️',
    about: 'Expert in high-risk obstetrics, laparoscopic gynecological surgeries, and reproductive medicine. Recognised for compassionate patient care and meticulous surgical skills.',
    languages: ['Assamese', 'Hindi', 'Bengali', 'English'],
    specializations: ['High-Risk Pregnancy', 'Laparoscopy', 'PCOS', 'Infertility Treatment'],
    timings: 'Mon–Sat: 9AM–3PM',
    phone: 'Dispur Hospital: 0361-2237800',
    location: 'Dispur, Guwahati – 781006',
    mapQuery: 'Dispur Hospital Guwahati',
  },
  {
    id: 8,
    name: 'Dr. Jayashree Goswami Mahanta',
    qualification: 'MBBS, MD (OBG), FRCOG (London)',
    specialty: 'Gynecology & Obstetrics',
    hospital: 'Gauhati Medical College & Hospital (GMCH)',
    area: 'Bhangagarh, Guwahati',
    experience: 28,
    rating: 4.9,
    image: '👩‍⚕️',
    about: 'Eminent gynecologist and former Head of OBG Dept at GMCH. Fellow of Royal College of Obstetricians and Gynaecologists (FRCOG). Expert in complex OBG surgeries.',
    languages: ['Assamese', 'Hindi', 'English'],
    specializations: ['Complex OBG Surgeries', 'Menopause Management', 'Urogynecology', 'Endometriosis'],
    timings: 'Mon–Wed: 11AM–2PM',
    phone: 'GMCH: 0361-2529457',
    location: 'Bhangagarh, Guwahati – 781032',
    mapQuery: 'Gauhati Medical College Guwahati',
  },

  // ── Orthopedics ───────────────────────────────────────────────
  {
    id: 9,
    name: 'Dr. Ranjan Kumar Kalita',
    qualification: 'MBBS, MS (Orthopedics), DNB',
    specialty: 'Orthopedics',
    hospital: 'GNRC Hospital (ILS)',
    area: 'Sixmile, Guwahati',
    experience: 20,
    rating: 4.7,
    image: '👨‍⚕️',
    about: 'Orthopedic surgeon with extensive expertise in joint replacement (knee & hip), complex spine surgeries, sports medicine, and fracture management.',
    languages: ['Assamese', 'Hindi', 'English'],
    specializations: ['Joint Replacement', 'Spine Surgery', 'Sports Medicine', 'Fracture Care'],
    timings: 'Mon–Fri: 11AM–4PM',
    phone: 'GNRC: 0361-2340700',
    location: 'Sixmile, Guwahati – 781022',
    mapQuery: 'GNRC Hospital Guwahati',
  },

  // ── Pediatrics ────────────────────────────────────────────────
  {
    id: 10,
    name: 'Dr. Dipankar Baruah',
    qualification: 'MBBS, MD (Pediatrics), DCH',
    specialty: 'Pediatrics',
    hospital: 'Narayana Superspeciality Hospital',
    area: 'Guwahati',
    experience: 15,
    rating: 4.9,
    image: '👨‍⚕️',
    about: 'Pediatrician and neonatologist with special interest in childhood nutrition, developmental delays, neonatal intensive care, and childhood respiratory conditions.',
    languages: ['Assamese', 'Hindi', 'Bengali', 'English'],
    specializations: ['Neonatology', 'Child Nutrition', 'Vaccination Programs', 'Developmental Pediatrics'],
    timings: 'Mon–Sat: 10AM–4PM',
    phone: 'Narayana: 0361-6601000',
    location: 'NH-37, Guwahati – 781026',
    mapQuery: 'Narayana Superspeciality Hospital Guwahati',
  },
  {
    id: 11,
    name: 'Dr. Himadri Borthakur',
    qualification: 'MBBS, MD (Pediatrics), Fellowship Neonatology',
    specialty: 'Pediatrics',
    hospital: 'Dispur Hospital',
    area: 'Dispur, Guwahati',
    experience: 12,
    rating: 4.8,
    image: '👨‍⚕️',
    about: 'Pediatric specialist focussing on neonatal care, childhood asthma, allergy management, and adolescent medicine. Approachable and child-friendly practice.',
    languages: ['Assamese', 'Hindi', 'English'],
    specializations: ['Neonatal Care (NICU)', 'Childhood Asthma', 'Allergy & Immunology', 'Adolescent Health'],
    timings: 'Mon–Sat: 9AM–1PM, 5PM–7PM',
    phone: 'Dispur Hospital: 0361-2237800',
    location: 'Dispur, Guwahati – 781006',
    mapQuery: 'Dispur Hospital Guwahati',
  },

  // ── Dermatology ───────────────────────────────────────────────
  {
    id: 12,
    name: 'Dr. Meena Sharma',
    qualification: 'MBBS, MD (Dermatology, Venereology & Leprology)',
    specialty: 'Dermatology',
    hospital: 'Nemcare Hospital',
    area: 'Bhangagarh, Guwahati',
    experience: 12,
    rating: 4.7,
    image: '👩‍⚕️',
    about: 'Dermatologist specialising in medical and cosmetic dermatology, phototherapy for psoriasis, advanced hair loss treatment, and skin allergy management.',
    languages: ['Assamese', 'Hindi', 'English'],
    specializations: ['Acne & Scarring', 'Hair Loss (PRP)', 'Psoriasis & Phototherapy', 'Cosmetic Procedures'],
    timings: 'Tue–Sun: 10AM–6PM',
    phone: 'Nemcare: 0361-2130700',
    location: 'Bhangagarh, Guwahati – 781032',
    mapQuery: 'Nemcare Hospital Guwahati',
  },

  // ── ENT ────────────────────────────────────────────────────────
  {
    id: 13,
    name: 'Dr. Nitu Borthakur',
    qualification: 'MBBS, MS (ENT), FICS',
    specialty: 'ENT (Ear, Nose & Throat)',
    hospital: 'Gauhati Medical College & Hospital (GMCH)',
    area: 'Bhangagarh, Guwahati',
    experience: 17,
    rating: 4.6,
    image: '👩‍⚕️',
    about: 'ENT specialist with expertise in endoscopic sinus surgery, cochlear implants, snoring & sleep apnea treatment, and thyroid/neck surgeries.',
    languages: ['Assamese', 'Hindi', 'English'],
    specializations: ['Endoscopic Sinus Surgery', 'Cochlear Implants', 'Sleep Apnea', 'Thyroid Surgery'],
    timings: 'Mon–Fri: 9AM–1PM',
    phone: 'GMCH: 0361-2529457',
    location: 'Bhangagarh, Guwahati – 781032',
    mapQuery: 'Gauhati Medical College Guwahati',
  },

  // ── Ophthalmology ─────────────────────────────────────────────
  {
    id: 14,
    name: 'Dr. Arup Kumar Nath',
    qualification: 'MBBS, MS (Ophthalmology), DNB',
    specialty: 'Ophthalmology',
    hospital: 'Sankardev Nethralaya',
    area: 'Beltola, Guwahati',
    experience: 16,
    rating: 4.8,
    image: '👨‍⚕️',
    about: 'Eye surgeon with expertise in cataract surgery (phacoemulsification), LASIK, glaucoma management, and retinal disorders including diabetic retinopathy.',
    languages: ['Assamese', 'Hindi', 'English'],
    specializations: ['Cataract Surgery (Phaco)', 'LASIK Refractive Surgery', 'Glaucoma', 'Diabetic Retinopathy'],
    timings: 'Mon–Sat: 9AM–5PM',
    phone: 'Sankardev Nethralaya: 0361-2228879',
    location: 'Beltola, Guwahati – 781028',
    mapQuery: 'Sankardev Nethralaya Guwahati',
  },

  // ── Gastroenterology ──────────────────────────────────────────
  {
    id: 15,
    name: 'Dr. Prabin Kumar Das',
    qualification: 'MBBS, MD (Medicine), DM (Gastroenterology)',
    specialty: 'Gastroenterology',
    hospital: 'Apollo Excelcare Hospital',
    area: 'Bhetapara, Guwahati',
    experience: 19,
    rating: 4.8,
    image: '👨‍⚕️',
    about: 'Senior gastroenterologist experienced in therapeutic endoscopy, liver cirrhosis, inflammatory bowel disease, GI oncology, and ERCP procedures.',
    languages: ['Assamese', 'Hindi', 'English'],
    specializations: ['Endoscopy & ERCP', 'Liver Disease', 'Inflammatory Bowel Disease', 'GI Oncology'],
    timings: 'Mon–Sat: 11AM–5PM',
    phone: 'Apollo Excelcare: 0361-2301084',
    location: 'Bhetapara, Guwahati – 781028',
    mapQuery: 'Apollo Excelcare Hospital Guwahati',
  },

  // ── Pulmonology ───────────────────────────────────────────────
  {
    id: 16,
    name: 'Dr. Gautam Borah',
    qualification: 'MBBS, MD (Pulmonary Medicine), FCCP',
    specialty: 'Pulmonology',
    hospital: 'Narayana Superspeciality Hospital',
    area: 'Guwahati',
    experience: 18,
    rating: 4.7,
    image: '👨‍⚕️',
    about: 'Pulmonologist specialising in asthma, COPD, interstitial lung disease, bronchoscopy, and sleep medicine. Fellow of the American College of Chest Physicians.',
    languages: ['Assamese', 'Hindi', 'English'],
    specializations: ['Asthma & COPD', 'Interstitial Lung Disease', 'Bronchoscopy', 'Sleep Medicine'],
    timings: 'Mon–Fri: 10AM–5PM',
    phone: 'Narayana: 0361-6601000',
    location: 'NH-37, Guwahati – 781026',
    mapQuery: 'Narayana Superspeciality Hospital Guwahati',
  },

  // ── Endocrinology ─────────────────────────────────────────────
  {
    id: 17,
    name: 'Dr. Subhash Medhi',
    qualification: 'MBBS, MD (Medicine), DM (Endocrinology)',
    specialty: 'Endocrinology',
    hospital: 'GNRC Hospital (ILS)',
    area: 'Sixmile, Guwahati',
    experience: 14,
    rating: 4.8,
    image: '👨‍⚕️',
    about: 'Endocrinologist specialising in diabetes mellitus (Type 1 & 2), thyroid disorders, adrenal diseases, pituitary tumours, and metabolic bone disease.',
    languages: ['Assamese', 'Hindi', 'English'],
    specializations: ['Diabetes (Type 1 & 2)', 'Thyroid Disorders', 'Adrenal Disease', 'Osteoporosis'],
    timings: 'Mon–Sat: 10AM–4PM',
    phone: 'GNRC: 0361-2340700',
    location: 'Sixmile, Guwahati – 781022',
    mapQuery: 'GNRC Hospital Guwahati',
  },

  // ── Nephrology ────────────────────────────────────────────────
  {
    id: 18,
    name: 'Dr. Bidyut Pran Deka',
    qualification: 'MBBS, MD (Medicine), DM (Nephrology)',
    specialty: 'Nephrology',
    hospital: 'Gauhati Medical College & Hospital (GMCH)',
    area: 'Bhangagarh, Guwahati',
    experience: 20,
    rating: 4.7,
    image: '👨‍⚕️',
    about: 'Nephrologist managing chronic kidney disease, dialysis, glomerulonephritis, renal hypertension, and kidney transplant follow-up care.',
    languages: ['Assamese', 'Hindi', 'English'],
    specializations: ['Chronic Kidney Disease', 'Hemodialysis', 'Glomerulonephritis', 'Kidney Transplant'],
    timings: 'Mon–Sat: 9AM–1PM',
    phone: 'GMCH: 0361-2529457',
    location: 'Bhangagarh, Guwahati – 781032',
    mapQuery: 'Gauhati Medical College Guwahati',
  },

  // ── Psychiatry ────────────────────────────────────────────────
  {
    id: 19,
    name: 'Dr. Rituraj Phukan',
    qualification: 'MBBS, MD (Psychiatry)',
    specialty: 'Psychiatry',
    hospital: 'Lokopriya Gopinath Bordoloi Regional Institute (LGB)',
    area: 'Tezpur / Guwahati OPD',
    experience: 15,
    rating: 4.6,
    image: '👨‍⚕️',
    about: 'Psychiatrist specialising in depression, anxiety disorders, schizophrenia, bipolar disorder, addiction medicine, and cognitive behavioural therapy.',
    languages: ['Assamese', 'Hindi', 'English'],
    specializations: ['Depression & Anxiety', 'Schizophrenia', 'Bipolar Disorder', 'Addiction Medicine'],
    timings: 'Mon–Fri: 10AM–3PM (by prior appointment)',
    phone: 'LGB RIMH: 03712-222474',
    location: 'Tezpur, Assam (Guwahati OPD available)',
    mapQuery: 'LGB Regional Institute Mental Health Tezpur',
  },

  // ── Oncology ──────────────────────────────────────────────────
  {
    id: 20,
    name: 'Dr. Nirmali Saikia',
    qualification: 'MBBS, MD (Radiation Oncology), DNB',
    specialty: 'Oncology',
    hospital: 'Gauhati Medical College & Hospital (GMCH)',
    area: 'Bhangagarh, Guwahati',
    experience: 16,
    rating: 4.7,
    image: '👩‍⚕️',
    about: 'Radiation oncologist managing a wide range of solid tumours including head & neck cancers, breast cancer, gynaecological cancers, and palliative radiation therapy.',
    languages: ['Assamese', 'Hindi', 'English'],
    specializations: ['Head & Neck Cancer', 'Breast Cancer', 'Gynaecological Cancer', 'Palliative Care'],
    timings: 'Mon–Fri: 9AM–2PM',
    phone: 'GMCH: 0361-2529457',
    location: 'Bhangagarh, Guwahati – 781032',
    mapQuery: 'Gauhati Medical College Guwahati',
  },

  // ── Urology ───────────────────────────────────────────────────
  {
    id: 21,
    name: 'Dr. Rajen Barua',
    qualification: 'MBBS, MS (General Surgery), MCh (Urology)',
    specialty: 'Urology',
    hospital: 'Apollo Excelcare Hospital',
    area: 'Bhetapara, Guwahati',
    experience: 17,
    rating: 4.8,
    image: '👨‍⚕️',
    about: 'Urologist specialising in kidney stones (PCNL, ESWL), prostate diseases, laparoscopic urological surgeries, bladder disorders, and male infertility.',
    languages: ['Assamese', 'Hindi', 'English'],
    specializations: ['Kidney Stones (PCNL)', 'Prostate Surgery', 'Laparoscopic Urology', 'Male Infertility'],
    timings: 'Mon–Sat: 9AM–4PM',
    phone: 'Apollo Excelcare: 0361-2301084',
    location: 'Bhetapara, Guwahati – 781028',
    mapQuery: 'Apollo Excelcare Hospital Guwahati',
  },

  // ── Rheumatology ──────────────────────────────────────────────
  {
    id: 22,
    name: 'Dr. Amit Kumar Sharma',
    qualification: 'MBBS, MD (Medicine), DM (Rheumatology)',
    specialty: 'Rheumatology',
    hospital: 'GNRC Hospital (ILS)',
    area: 'Sixmile, Guwahati',
    experience: 11,
    rating: 4.7,
    image: '👨‍⚕️',
    about: 'Rheumatologist managing rheumatoid arthritis, systemic lupus erythematosus (SLE), gout, ankylosing spondylitis, vasculitis, and connective tissue disorders.',
    languages: ['Assamese', 'Hindi', 'English'],
    specializations: ['Rheumatoid Arthritis', 'Lupus (SLE)', 'Gout & Uric Acid', 'Ankylosing Spondylitis'],
    timings: 'Mon–Fri: 10AM–3PM',
    phone: 'GNRC: 0361-2340700',
    location: 'Sixmile, Guwahati – 781022',
    mapQuery: 'GNRC Hospital Guwahati',
  },
  // ── Diabetology ───────────────────────────────────────────────
  {
    id: 23,
    name: 'Dr. Naba Kumar Barua',
    qualification: 'MBBS, MD (Medicine), DNB (Endocrinology)',
    specialty: 'Diabetology',
    hospital: 'Pratiksha Hospital',
    area: 'Lachit Nagar, Guwahati',
    experience: 19,
    rating: 4.8,
    image: '👨‍⚕️',
    about: 'Diabetologist with extensive experience in complex insulin therapy, diabetic foot management, gestational diabetes, continuous glucose monitoring, and lifestyle interventions.',
    languages: ['Assamese', 'Hindi', 'English'],
    specializations: ['Complex Insulin Therapy', 'Diabetic Foot Care', 'Gestational Diabetes', 'Continuous Glucose Monitoring'],
    timings: 'Mon–Sat: 9AM–5PM',
    phone: 'Pratiksha: 0361-2463210',
    location: 'Lachit Nagar, Guwahati – 781007',
    mapQuery: 'Pratiksha Hospital Guwahati',
  },
  {
    id: 24,
    name: 'Dr. Rituraj Das',
    qualification: 'MBBS, MD (General Medicine), PGDDE (Diabetology)',
    specialty: 'Diabetology',
    hospital: 'Apollo Excelcare Hospital',
    area: 'Bhetapara, Guwahati',
    experience: 13,
    rating: 4.7,
    image: '👨‍⚕️',
    about: 'Diabetes specialist with focused practice on Type 2 diabetes reversal programs, obesity management, PCOS-related metabolic issues, and cardiovascular risk reduction in diabetics.',
    languages: ['Assamese', 'Hindi', 'English'],
    specializations: ['Type 2 Diabetes Reversal', 'Obesity & Metabolic Syndrome', 'PCOS Metabolic Care', 'Cardiovascular Risk in Diabetes'],
    timings: 'Tue, Thu, Sat: 10AM–4PM',
    phone: 'Apollo Excelcare: 0361-2301084',
    location: 'Bhetapara, Guwahati – 781028',
    mapQuery: 'Apollo Excelcare Hospital Guwahati',
  },

  // ── Sports Medicine ───────────────────────────────────────────
  {
    id: 25,
    name: 'Dr. Partha Pratim Barua',
    qualification: 'MBBS, MS (Orthopedics), Fellowship Sports Medicine (IOC)',
    specialty: 'Sports Medicine',
    hospital: 'GNRC Hospital (ILS)',
    area: 'Sixmile, Guwahati',
    experience: 12,
    rating: 4.8,
    image: '👨‍⚕️',
    about: 'Sports medicine physician with IOC fellowship training. Expert in arthroscopic procedures, ACL ligament reconstruction, sports injury rehabilitation, and return-to-play protocols for athletes.',
    languages: ['Assamese', 'Hindi', 'English'],
    specializations: ['ACL Reconstruction', 'Arthroscopy', 'Sports Injury Rehab', 'Return-to-Play Protocols'],
    timings: 'Mon–Fri: 10AM–5PM',
    phone: 'GNRC: 0361-2340700',
    location: 'Sixmile, Guwahati – 781022',
    mapQuery: 'GNRC Hospital Guwahati',
  },

  // ── Radiology / Imaging ───────────────────────────────────────
  {
    id: 26,
    name: 'Dr. Pallabi Goswami',
    qualification: 'MBBS, MD (Radiodiagnosis), FRCR (London)',
    specialty: 'Radiology',
    hospital: 'Narayana Superspeciality Hospital',
    area: 'Guwahati',
    experience: 14,
    rating: 4.7,
    image: '👩‍⚕️',
    about: 'Radiologist with FRCR (London) training, specialising in CT-guided interventions, musculoskeletal MRI, neuroradiology, and advanced ultrasound-guided procedures.',
    languages: ['Assamese', 'Hindi', 'English'],
    specializations: ['CT-Guided Interventions', 'MRI Interpretation', 'Neuroradiology', 'Ultrasound-Guided Procedures'],
    timings: 'Mon–Sat: 9AM–4PM',
    phone: 'Narayana: 0361-6601000',
    location: 'NH-37, Guwahati – 781026',
    mapQuery: 'Narayana Superspeciality Hospital Guwahati',
  },

  // ── Plastic & Reconstructive Surgery ─────────────────────────
  {
    id: 27,
    name: 'Dr. Kaushik Handique',
    qualification: 'MBBS, MS (General Surgery), MCh (Plastic Surgery)',
    specialty: 'Plastic Surgery',
    hospital: 'Apollo Excelcare Hospital',
    area: 'Bhetapara, Guwahati',
    experience: 15,
    rating: 4.8,
    image: '👨‍⚕️',
    about: 'Plastic and reconstructive surgeon with expertise in burn reconstruction, cleft lip & palate repair, cosmetic surgery (rhinoplasty, liposuction), and complex wound management.',
    languages: ['Assamese', 'Hindi', 'English'],
    specializations: ['Burn Reconstruction', 'Cleft Lip & Palate', 'Cosmetic Surgery', 'Wound Care & Flaps'],
    timings: 'Mon, Wed, Fri: 10AM–3PM',
    phone: 'Apollo Excelcare: 0361-2301084',
    location: 'Bhetapara, Guwahati – 781028',
    mapQuery: 'Apollo Excelcare Hospital Guwahati',
  },

  // ── Additional Dermatology ────────────────────────────────────
  {
    id: 28,
    name: 'Dr. Pranjal Kumar Deka',
    qualification: 'MBBS, MD (DVL – Dermatology, Venereology & Leprology)',
    specialty: 'Dermatology',
    hospital: 'Gauhati Medical College & Hospital (GMCH)',
    area: 'Bhangagarh, Guwahati',
    experience: 21,
    rating: 4.7,
    image: '👨‍⚕️',
    about: 'Senior dermatologist and leprology specialist at GMCH managing leprosy, vitiligo, pemphigus, lichen planus, sexually transmitted infections, and complex skin disorders.',
    languages: ['Assamese', 'Hindi', 'English'],
    specializations: ['Leprosy & Leprology', 'Vitiligo Treatment', 'Pemphigus & Bullous Disorders', 'STI Management'],
    timings: 'Mon–Sat: 8AM–12PM (OPD)',
    phone: 'GMCH: 0361-2529457',
    location: 'Bhangagarh, Guwahati – 781032',
    mapQuery: 'Gauhati Medical College Guwahati',
  },

  // ── Additional Psychiatry / Mental Health ─────────────────────
  {
    id: 29,
    name: 'Dr. Bandana Baruah',
    qualification: 'MBBS, MD (Psychiatry)',
    specialty: 'Psychiatry',
    hospital: 'Nemcare Hospital',
    area: 'Bhangagarh, Guwahati',
    experience: 11,
    rating: 4.7,
    image: '👩‍⚕️',
    about: 'Psychiatrist specialising in mood disorders, obsessive-compulsive disorder, post-traumatic stress disorder, psychosomatic medicine, and cognitive behavioural therapy (CBT).',
    languages: ['Assamese', 'Hindi', 'English'],
    specializations: ['Mood Disorders', 'OCD', 'PTSD & Trauma', 'CBT Therapy'],
    timings: 'Mon–Fri: 11AM–5PM (by appointment)',
    phone: 'Nemcare: 0361-2130700',
    location: 'Bhangagarh, Guwahati – 781032',
    mapQuery: 'Nemcare Hospital Guwahati',
  },

  // ── Neurosurgery ──────────────────────────────────────────────
  {
    id: 30,
    name: 'Dr. Pradip Bhattacharyya',
    qualification: 'MBBS, MS (General Surgery), MCh (Neurosurgery)',
    specialty: 'Neurosurgery',
    hospital: 'Narayana Superspeciality Hospital',
    area: 'Guwahati',
    experience: 22,
    rating: 4.9,
    image: '👨‍⚕️',
    about: 'Chief Neurosurgeon at Narayana Hospital, specialising in brain tumour surgery, complex spine surgery, minimally invasive neurosurgery, skull base surgery, and neurotrauma management.',
    languages: ['Assamese', 'Hindi', 'English', 'Bengali'],
    specializations: ['Brain Tumour Surgery', 'Spine Surgery', 'Minimally Invasive Neurosurgery', 'Neurotrauma'],
    timings: 'Mon–Fri: 9AM–5PM',
    phone: 'Narayana: 0361-6601000',
    location: 'NH-37, Guwahati – 781026',
    mapQuery: 'Narayana Superspeciality Hospital Guwahati',
  },
];

const ALL_SPECIALTIES = ['All Specialties', ...new Set(DOCTORS.map(d => d.specialty))];

/* ── Specialty colour map ─────────────────────────────────── */
const SPEC_COLORS = {
  'Cardiology':              { bg: '#fff1f2', color: '#e11d48', border: '#fecdd3' },
  'Neurology':               { bg: '#fdf4ff', color: '#a21caf', border: '#f0abfc' },
  'General Medicine':        { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
  'Gynecology & Obstetrics': { bg: '#fdf2f8', color: '#be185d', border: '#f9a8d4' },
  'Orthopedics':             { bg: '#fff7ed', color: '#c2410c', border: '#fed7aa' },
  'Pediatrics':              { bg: '#f0fdf4', color: '#15803d', border: '#a7f3d0' },
  'Dermatology':             { bg: '#fffbeb', color: '#b45309', border: '#fde68a' },
  'ENT (Ear, Nose & Throat)':{ bg: '#f0f9ff', color: '#0369a1', border: '#bae6fd' },
  'Ophthalmology':           { bg: '#f0fdfa', color: '#0d9488', border: '#99f6e4' },
  'Gastroenterology':        { bg: '#fafaf9', color: '#44403c', border: '#d6d3d1' },
  'Pulmonology':             { bg: '#f0f9ff', color: '#075985', border: '#bae6fd' },
  'Endocrinology':           { bg: '#fefce8', color: '#854d0e', border: '#fef08a' },
  'Nephrology':              { bg: '#fdf4ff', color: '#7e22ce', border: '#e9d5ff' },
  'Psychiatry':              { bg: '#f5f3ff', color: '#6d28d9', border: '#ddd6fe' },
  'Oncology':                { bg: '#fff1f2', color: '#9f1239', border: '#fecdd3' },
  'Urology':                 { bg: '#ecfdf5', color: '#047857', border: '#a7f3d0' },
  'Rheumatology':            { bg: '#fff7ed', color: '#9a3412', border: '#fed7aa' },
};

/* ── Doctor Card ─────────────────────────────────────────────── */
const DoctorCard = ({ doctor }) => {
  const [expanded, setExpanded] = useState(false);
  const sc = SPEC_COLORS[doctor.specialty] || { bg: '#f1f5f9', color: '#475569', border: '#e2e8f0' };

  const handleCall = () => {
    window.open(`tel:${doctor.phone.replace(/[^0-9+]/g, '')}`, '_self');
  };
  const handleDirections = () => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(doctor.mapQuery)}`, '_blank', 'noreferrer');
  };

  return (
    <div className="dir-card">
      {/* Top accent bar */}
      <div className="dir-card-accent" style={{ background: `linear-gradient(90deg, ${sc.color}, ${sc.color}88)` }} />

      {/* Header row */}
      <div className="dir-card-header">
        <div className="dir-avatar" style={{ background: `linear-gradient(135deg, ${sc.color}22, ${sc.color}44)`, border: `2px solid ${sc.border}` }}>
          {doctor.image}
        </div>
        <div className="dir-meta">
          <div className="dir-name">{doctor.name}</div>
          <div className="dir-qual">{doctor.qualification}</div>
          <span className="dir-spec-badge" style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
            {doctor.specialty}
          </span>
          <div className="dir-rating-row">
            <span className="dir-star">★</span>
            <span className="dir-rating">{doctor.rating}</span>
            <span className="dir-exp">· {doctor.experience} yrs experience</span>
          </div>
        </div>
      </div>

      {/* About */}
      <p className="dir-about">{doctor.about}</p>

      {/* Specialty chips */}
      <div className="dir-chips">
        {doctor.specializations.map(s => (
          <span key={s} className="dir-chip">{s}</span>
        ))}
      </div>

      {/* Info grid */}
      <div className="dir-info-grid">
        <div className="dir-info-item">
          <span className="dir-info-label">🏥 Hospital</span>
          <span className="dir-info-val">{doctor.hospital}</span>
        </div>
        <div className="dir-info-item">
          <span className="dir-info-label">📍 Location</span>
          <span className="dir-info-val">{doctor.area}</span>
        </div>
        <div className="dir-info-item">
          <span className="dir-info-label">🕐 Timings</span>
          <span className="dir-info-val">{doctor.timings}</span>
        </div>
        <div className="dir-info-item">
          <span className="dir-info-label">📞 Contact</span>
          <span className="dir-info-val">{doctor.phone}</span>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="dir-expanded" style={{ animation: 'fadeInUp 0.3s ease' }}>
          <div className="dir-lang-row">
            <span className="dir-info-label">🌐 Languages</span>
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.35rem' }}>
              {doctor.languages.map(l => (
                <span key={l} className="dir-lang-tag">{l}</span>
              ))}
            </div>
          </div>
          <div className="dir-address-row">
            <span className="dir-info-label">📌 Address</span>
            <span className="dir-info-val" style={{ display: 'block', marginTop: '0.2rem' }}>{doctor.location}</span>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="dir-actions">
        <button className="dir-btn dir-btn-call" onClick={handleCall}>
          📞 Call Hospital
        </button>
        <button className="dir-btn dir-btn-map" onClick={handleDirections}>
          🗺️ Get Directions
        </button>
        <button className="dir-btn dir-btn-more" onClick={() => setExpanded(p => !p)}>
          {expanded ? '▲ Less' : '▼ More'}
        </button>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ══════════════════════════════════════════════════════════════ */
const AppointmentBooking = () => {
  const navigate = useNavigate();
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');
  const [searchQuery, setSearchQuery]             = useState('');

  const filtered = DOCTORS.filter(doc => {
    const matchSpec   = selectedSpecialty === 'All Specialties' || doc.specialty === selectedSpecialty;
    const q           = searchQuery.toLowerCase();
    const matchSearch = !q || doc.name.toLowerCase().includes(q) || doc.specialty.toLowerCase().includes(q) || doc.hospital.toLowerCase().includes(q) || doc.specializations.some(s => s.toLowerCase().includes(q));
    return matchSpec && matchSearch;
  });

  return (
    <div className="dir-page">
      <style>{`
        /* ── Directory Page ──────────────────────────────── */
        .dir-page {
          min-height: 100vh;
          background: linear-gradient(160deg, #f8fafc 0%, #f0f9ff 60%, #f0fdfa 100%);
          padding-top: 80px;
          padding-bottom: 4rem;
        }
        .dir-container { max-width: 1280px; margin: 0 auto; padding: 2rem 1.5rem; }

        /* ── Header ──────────────────────────────────────── */
        .dir-header { text-align: center; margin-bottom: 2.5rem; }
        .dir-header-badge {
          display: inline-flex; align-items: center; gap: 0.5rem;
          background: linear-gradient(135deg, rgba(13,148,136,0.1), rgba(37,99,235,0.08));
          border: 1px solid rgba(13,148,136,0.2);
          color: #0d9488; padding: 0.4rem 1.1rem; border-radius: 999px;
          font-size: 0.78rem; font-weight: 700; letter-spacing: 0.06em;
          text-transform: uppercase; margin-bottom: 1rem;
        }
        .dir-header h1 {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(1.9rem, 3.5vw, 2.75rem);
          font-weight: 800; color: #0f172a; margin-bottom: 0.75rem;
          letter-spacing: -0.02em;
        }
        .dir-header h1 span { background: linear-gradient(135deg, #0d9488, #2563eb); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .dir-header p { color: #64748b; font-size: 1.05rem; max-width: 600px; margin: 0 auto; line-height: 1.7; }

        /* ── Stats Row ───────────────────────────────────── */
        .dir-stats { display: flex; gap: 2rem; justify-content: center; flex-wrap: wrap; margin: 1.5rem 0 2rem; }
        .dir-stat { text-align: center; }
        .dir-stat-num { font-family: 'Outfit', sans-serif; font-size: 1.75rem; font-weight: 800; color: #0f172a; }
        .dir-stat-label { font-size: 0.78rem; color: #64748b; font-weight: 500; }

        /* ── Controls ────────────────────────────────────── */
        .dir-controls {
          background: white; border-radius: 1.25rem; padding: 1.5rem;
          margin-bottom: 2rem; box-shadow: 0 2px 16px rgba(0,0,0,0.06);
          border: 1px solid #e2e8f0;
        }
        .dir-search-wrap { position: relative; margin-bottom: 1.25rem; }
        .dir-search {
          width: 100%; padding: 0.875rem 1.25rem 0.875rem 3rem;
          border: 2px solid #e2e8f0; border-radius: 999px;
          font-size: 0.95rem; outline: none; font-family: 'Inter', sans-serif;
          transition: all 0.2s; color: #0f172a; background: #f8fafc;
        }
        .dir-search:focus { border-color: #14b8a6; background: white; box-shadow: 0 0 0 3px rgba(20,184,166,0.1); }
        .dir-search-icon { position: absolute; left: 1.1rem; top: 50%; transform: translateY(-50%); font-size: 1rem; pointer-events: none; }
        .dir-spec-tabs { display: flex; gap: 0.5rem; flex-wrap: wrap; }
        .dir-spec-tab {
          padding: 0.45rem 1rem; border-radius: 999px;
          border: 2px solid #e2e8f0; background: white;
          font-size: 0.78rem; font-weight: 600; cursor: pointer;
          transition: all 0.18s; color: #64748b; font-family: 'Inter', sans-serif;
          white-space: nowrap;
        }
        .dir-spec-tab.active {
          background: linear-gradient(135deg, #0d9488, #2563eb);
          color: white; border-color: transparent;
          box-shadow: 0 4px 14px rgba(13,148,136,0.28);
        }
        .dir-spec-tab:hover:not(.active) { border-color: #14b8a6; color: #0d9488; }

        /* ── Result Count ─────────────────────────────────── */
        .dir-count { color: #64748b; font-size: 0.85rem; margin-bottom: 1.25rem; }
        .dir-count strong { color: #0f172a; }

        /* ── Grid ─────────────────────────────────────────── */
        .dir-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 1.5rem; }

        /* ── Card ─────────────────────────────────────────── */
        .dir-card {
          background: white; border-radius: 1.25rem;
          border: 1px solid #e2e8f0;
          box-shadow: 0 2px 12px rgba(0,0,0,0.05);
          transition: all 0.28s ease; overflow: hidden; position: relative;
        }
        .dir-card:hover { transform: translateY(-5px); box-shadow: 0 16px 40px rgba(15,23,42,0.12); border-color: rgba(13,148,136,0.2); }
        .dir-card-accent { height: 4px; width: 100%; }
        .dir-card-header { display: flex; gap: 1rem; padding: 1.25rem 1.5rem 0.75rem; align-items: flex-start; }
        .dir-avatar { width: 68px; height: 68px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; flex-shrink: 0; }
        .dir-meta { flex: 1; min-width: 0; }
        .dir-name { font-weight: 800; font-size: 1rem; color: #0f172a; font-family: 'Outfit', sans-serif; margin-bottom: 0.15rem; }
        .dir-qual { font-size: 0.73rem; color: #64748b; margin-bottom: 0.4rem; line-height: 1.4; }
        .dir-spec-badge { display: inline-block; padding: 0.2rem 0.65rem; border-radius: 999px; font-size: 0.7rem; font-weight: 700; margin-bottom: 0.35rem; }
        .dir-rating-row { display: flex; align-items: center; gap: 0.4rem; }
        .dir-star { color: #f59e0b; font-size: 0.8rem; }
        .dir-rating { font-weight: 700; color: #0f172a; font-size: 0.82rem; }
        .dir-exp { color: #64748b; font-size: 0.76rem; }
        .dir-about { color: #475569; font-size: 0.8rem; line-height: 1.65; margin: 0 1.5rem 0.875rem; }
        .dir-chips { display: flex; gap: 0.375rem; flex-wrap: wrap; margin: 0 1.5rem 1rem; }
        .dir-chip { background: #f0fdfa; color: #0d9488; border: 1px solid #99f6e4; padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.7rem; font-weight: 600; }

        /* ── Info Grid ───────────────────────────────────── */
        .dir-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin: 0 1.5rem 1rem; }
        .dir-info-item { background: #f8fafc; border-radius: 0.625rem; padding: 0.5rem 0.75rem; border: 1px solid #f1f5f9; }
        .dir-info-label { display: block; font-size: 0.66rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.06em; font-weight: 700; margin-bottom: 0.2rem; }
        .dir-info-val { font-size: 0.78rem; color: #0f172a; font-weight: 600; line-height: 1.4; }

        /* ── Expanded ─────────────────────────────────────── */
        .dir-expanded { margin: 0 1.5rem 1rem; padding: 1rem; background: #f8fafc; border-radius: 0.75rem; border: 1px solid #e2e8f0; display: flex; flex-direction: column; gap: 0.75rem; }
        .dir-lang-tag { background: #eff6ff; color: #2563eb; padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.7rem; font-weight: 500; }

        /* ── Actions ─────────────────────────────────────── */
        .dir-actions { display: flex; gap: 0.625rem; padding: 0 1.5rem 1.5rem; flex-wrap: wrap; }
        .dir-btn { flex: 1; padding: 0.7rem 0.75rem; border-radius: 999px; border: none; font-weight: 700; font-size: 0.78rem; cursor: pointer; transition: all 0.2s; font-family: 'Inter', sans-serif; min-width: 90px; }
        .dir-btn-call { background: linear-gradient(135deg, #0d9488, #0891b2); color: white; box-shadow: 0 4px 12px rgba(13,148,136,0.25); }
        .dir-btn-call:hover { opacity: 0.9; transform: translateY(-1px); }
        .dir-btn-map { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; box-shadow: 0 4px 12px rgba(37,99,235,0.25); }
        .dir-btn-map:hover { opacity: 0.9; transform: translateY(-1px); }
        .dir-btn-more { background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0; flex: 0; padding: 0.7rem 1rem; }
        .dir-btn-more:hover { background: #e2e8f0; }

        /* ── No results ───────────────────────────────────── */
        .dir-empty { text-align: center; padding: 4rem 2rem; color: #94a3b8; }

        /* ── Disclaimer ───────────────────────────────────── */
        .dir-disclaimer {
          margin-top: 3rem; background: #fef9c3; border: 1px solid #fde68a;
          border-radius: 1rem; padding: 1.25rem 1.5rem;
          font-size: 0.82rem; color: #78350f; line-height: 1.7;
        }

        /* ── Responsive ───────────────────────────────────── */
        @media (max-width: 768px) {
          .dir-grid { grid-template-columns: 1fr; }
          .dir-info-grid { grid-template-columns: 1fr; }
          .dir-actions { flex-direction: column; }
          .dir-btn { flex: unset; }
          .dir-stats { gap: 1.25rem; }
        }
      `}</style>

      <div className="dir-container">
        {/* Header */}
        <div className="dir-header">
          <div className="dir-header-badge">🏥 Guwahati Medical Directory</div>
          <h1>Find Top Doctors in <span>Guwahati</span></h1>
          <p>
            Discover renowned specialists at GMCH, Apollo Excelcare, Narayana Superspeciality,
            Dispur Hospital, GNRC, and more across Guwahati, Assam.
          </p>
        </div>

        {/* Stats */}
        <div className="dir-stats">
          {[
            { num: `${DOCTORS.length}+`, label: 'Verified Doctors' },
            { num: `${ALL_SPECIALTIES.length - 1}`, label: 'Specialties' },
            { num: '8+', label: 'Top Hospitals' },
            { num: '100%', label: 'Free Directory' },
          ].map(s => (
            <div key={s.label} className="dir-stat">
              <div className="dir-stat-num">{s.num}</div>
              <div className="dir-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Educational Warning Banner */}
        <div className="edu-warning-banner" role="alert" style={{ marginBottom: '1.5rem' }}>
          <span className="edu-warning-banner-icon">🏥</span>
          <div className="edu-warning-banner-text">
            <strong>Informational Directory Only — Not a Booking Platform</strong>
            <p>
              This directory provides contact and specialty information for educational and navigational purposes only.
              Dr. AI does not book, manage, or confirm appointments. Always call the hospital directly to schedule visits.
              Doctor availability and timings are approximate — please verify before travelling.
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="dir-controls">
          <div className="dir-search-wrap">
            <span className="dir-search-icon">🔍</span>
            <input
              type="text"
              className="dir-search"
              placeholder="Search by doctor name, specialty, hospital, or condition…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              id="doctor-search"
            />
          </div>
          <div className="dir-spec-tabs">
            {ALL_SPECIALTIES.map(s => (
              <button
                key={s}
                className={`dir-spec-tab ${selectedSpecialty === s ? 'active' : ''}`}
                onClick={() => setSelectedSpecialty(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Count */}
        <p className="dir-count">
          Showing <strong>{filtered.length}</strong> doctor{filtered.length !== 1 ? 's' : ''}
          {selectedSpecialty !== 'All Specialties' ? ` in ${selectedSpecialty}` : ''}
          {searchQuery && ` matching "${searchQuery}"`}
        </p>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="dir-empty">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <p style={{ fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>No doctors found</p>
            <p>Try adjusting your search or specialty filter.</p>
          </div>
        ) : (
          <div className="dir-grid">
            {filtered.map((doc, idx) => (
              <div key={doc.id} style={{ animation: `fadeInUp 0.5s ease ${(idx % 6) * 0.07}s both` }}>
                <DoctorCard doctor={doc} />
              </div>
            ))}
          </div>
        )}

        {/* Disclaimer */}
        <div className="dir-disclaimer">
          ⚠️ <strong>Disclaimer:</strong> This directory provides information about doctors for general reference only.
          Contact information and timings are approximate — please call the hospital to confirm appointments.
          This is not an appointment booking platform. Always verify doctor details directly with the hospital before visiting.
        </div>

        <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
          <button className="back-btn" onClick={() => navigate('/')} style={{ display: 'inline-flex' }}>
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentBooking;