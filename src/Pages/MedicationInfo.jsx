import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

/* ═══════════════════════════════════════════════════════════════
   JAN AUSHADHI KENDRA DIRECTORY — Guwahati
   ═══════════════════════════════════════════════════════════════ */
const JAN_AUSHADHI_KENDRAS = [
  { name: 'Jan Aushadhi Kendra – GS Road',     area: 'GS Road, Guwahati',     note: 'Near Christian Basti flyover' },
  { name: 'Jan Aushadhi Kendra – Dispur',       area: 'Dispur, Guwahati',       note: 'Near Assam Secretariat' },
  { name: 'Jan Aushadhi Kendra – Fancy Bazar',  area: 'Fancy Bazar, Guwahati',  note: 'Central market area' },
  { name: 'Jan Aushadhi Kendra – Paltan Bazar', area: 'Paltan Bazar, Guwahati', note: 'Near Railway Station' },
  { name: 'Jan Aushadhi Kendra – Ganeshguri',   area: 'Ganeshguri, Guwahati',   note: 'Near Ganeshguri Chariali' },
  { name: 'Jan Aushadhi Kendra – Bhangagarh',   area: 'Bhangagarh, Guwahati',   note: 'Near GMCH Hospital' },
  { name: 'Jan Aushadhi Kendra – Bhetapara',    area: 'Bhetapara, Guwahati',    note: 'Near Apollo Excelcare' },
  { name: 'Jan Aushadhi Kendra – Narengi',      area: 'Narengi, Guwahati',      note: 'Military colony area' },
];

/* ═══════════════════════════════════════════════════════════════
   MEDICATION DATABASE — 62 Essential Medicines
   ═══════════════════════════════════════════════════════════════ */
const MEDICATIONS = [
  // ── Analgesic / Antipyretic ────────────────────────────────────
  { id: 1, name: 'Paracetamol', generic: 'Acetaminophen', category: 'Analgesic / Antipyretic', brandNames: ['Calpol', 'Dolo 650', 'Crocin', 'Tylenol'], uses: 'Fever, mild-to-moderate pain, headache, toothache, muscle aches, cold & flu relief.', dosage: 'Adults: 500–1000mg every 4–6 hours. Max: 4g/day. Children: 10–15mg/kg per dose.', sideEffects: 'Generally well-tolerated. Rare: skin rash, allergic reactions.', warnings: '⚠️ Overdose causes severe liver damage. Avoid alcohol. Do not exceed recommended dose. Check all products for hidden paracetamol.', interactions: 'Warfarin, other paracetamol-containing products, rifampicin.', contraindications: 'Liver disease, severe kidney impairment, chronic alcohol use.', severity: 'low', emoji: '💊', janAushadhi: 'Paracetamol 500mg (₹2–5/strip)' },
  { id: 2, name: 'Ibuprofen', generic: 'Ibuprofen', category: 'NSAID / Anti-inflammatory', brandNames: ['Brufen', 'Advil', 'Combiflam', 'Nurofen'], uses: 'Pain, fever, inflammation, arthritis, menstrual cramps, dental pain, back pain.', dosage: 'Adults: 200–400mg every 4–6 hours with food. Max: 1200mg/day (OTC).', sideEffects: 'Stomach upset, nausea, heartburn, dizziness. Long-term: risk of ulcers.', warnings: '⚠️ Always take with food. Avoid on empty stomach. Risk of GI bleeding with prolonged use. Avoid in pregnancy (3rd trimester).', interactions: 'Aspirin, warfarin, ACE inhibitors, lithium, methotrexate, other NSAIDs.', contraindications: 'Peptic ulcer, kidney disease, heart failure, 3rd trimester pregnancy.', severity: 'medium', emoji: '💊', janAushadhi: 'Ibuprofen 400mg (₹8–12/strip)' },
  { id: 3, name: 'Diclofenac', generic: 'Diclofenac Sodium', category: 'NSAID / Anti-inflammatory', brandNames: ['Voveran', 'Voltaren', 'Diclogesic'], uses: 'Arthritis pain, dental pain, musculoskeletal pain, post-operative pain, migraine.', dosage: 'Adults: 50mg 2–3 times daily with food. Sustained-release: 75–100mg once daily.', sideEffects: 'GI upset, stomach pain, nausea. Long-term: increased cardiovascular risk.', warnings: '⚠️ Higher cardiovascular risk than other NSAIDs. Avoid in heart disease patients. Take with food or milk.', interactions: 'Anticoagulants, lithium, antihypertensives, cyclosporine.', contraindications: 'Heart failure, active GI bleeding, severe kidney/liver disease, pregnancy.', severity: 'medium', emoji: '💊', janAushadhi: 'Diclofenac Sodium 50mg (₹10–15/strip)' },
  { id: 4, name: 'Tramadol', generic: 'Tramadol HCl', category: 'Analgesic (Opioid-Like)', brandNames: ['Ultram', 'Tramazac', 'Ultracet', 'Tramatas'], uses: 'Moderate to severe pain, post-operative pain, chronic pain conditions.', dosage: 'Adults: 50–100mg every 4–6 hours. Max: 400mg/day. Start low, go slow.', sideEffects: 'Nausea, dizziness, constipation, headache, sweating, drowsiness.', warnings: '⚠️ Risk of dependence. Avoid with alcohol or other CNS depressants. Can cause seizures at high doses. Do not drive.', interactions: 'SSRIs (serotonin syndrome risk), MAOIs, CNS depressants, warfarin.', contraindications: 'Seizure disorder, head injury, substance dependence, MAOIs within 14 days.', severity: 'high', emoji: '⚠️', janAushadhi: 'Tramadol 50mg (₹15–25/strip)' },
  { id: 5, name: 'Pregabalin', generic: 'Pregabalin', category: 'Neuropathic Pain / Anticonvulsant', brandNames: ['Lyrica', 'Pregabalin Cipla', 'Pregalin', 'Rejunuron'], uses: 'Neuropathic pain (diabetic neuropathy, post-herpetic neuralgia), fibromyalgia, epilepsy (adjunct), generalised anxiety.', dosage: 'Neuropathic pain: 75–150mg twice daily. Max: 600mg/day. Adjust for kidney function.', sideEffects: 'Dizziness, drowsiness, weight gain, peripheral oedema, blurred vision.', warnings: '⚠️ Impairs driving and cognition. Do not stop abruptly. Addiction potential reported. Reduce dose in kidney disease.', interactions: 'CNS depressants (additive sedation), opioids (respiratory depression risk), alcohol.', contraindications: 'Myopathy history. Caution in heart failure, kidney disease.', severity: 'medium', emoji: '🧠', janAushadhi: 'Pregabalin 75mg (₹25–40/strip)' },

  // ── Antibiotics ───────────────────────────────────────────────
  { id: 6, name: 'Amoxicillin', generic: 'Amoxicillin', category: 'Antibiotic (Penicillin)', brandNames: ['Mox', 'Novamox', 'Amoxil', 'Trimox'], uses: 'Bacterial infections: ear, throat, chest, urinary tract, skin. H. pylori (with other drugs).', dosage: 'Adults: 250–500mg 3 times daily for 7–14 days. Complete the full course.', sideEffects: 'Diarrhoea, nausea, skin rash, allergic reactions (rare but serious).', warnings: '⚠️ Do NOT take if allergic to penicillin. Complete the full course even if you feel better.', interactions: 'Methotrexate, warfarin, oral contraceptives (may reduce efficacy).', contraindications: 'Penicillin/beta-lactam allergy, infectious mononucleosis.', severity: 'medium', emoji: '💉', janAushadhi: 'Amoxicillin 500mg (₹12–18/strip)' },
  { id: 7, name: 'Azithromycin', generic: 'Azithromycin', category: 'Antibiotic (Macrolide)', brandNames: ['Azithral', 'Zithromax', 'Azee', 'Azicip'], uses: 'Respiratory infections, pneumonia, sinusitis, ear infections, chlamydia.', dosage: 'Adults: 500mg on Day 1, then 250mg for 4 days. Or 500mg for 3 days.', sideEffects: 'Nausea, stomach pain, diarrhoea, vomiting. Rarely: abnormal heart rhythm.', warnings: '⚠️ Cardiac risk — avoid in QT prolongation. Do not use with antacids simultaneously.', interactions: 'Antacids (separate by 1 hour), warfarin, digoxin, antiarrhythmics.', contraindications: 'QT prolongation, myasthenia gravis, severe liver disease.', severity: 'medium', emoji: '💉', janAushadhi: 'Azithromycin 500mg (₹20–30/strip)' },
  { id: 8, name: 'Ciprofloxacin', generic: 'Ciprofloxacin HCl', category: 'Antibiotic (Fluoroquinolone)', brandNames: ['Ciprobid', 'Ciplox', 'Cifran', 'Ciprolet'], uses: 'Urinary tract infections, typhoid fever, respiratory infections, traveller\'s diarrhoea, skin infections.', dosage: 'Adults: 250–750mg twice daily. UTI: 250mg twice daily for 3–7 days.', sideEffects: 'Nausea, diarrhoea, headache, dizziness. Rarely: tendon rupture (especially Achilles).', warnings: '⚠️ Avoid in children under 18 (cartilage damage). Risk of tendon rupture — stop and report tendon pain. Avoid antacids/dairy 2 hours before/after.', interactions: 'Antacids, dairy (reduces absorption), warfarin, NSAIDs, theophylline.', contraindications: 'Children < 18 years (except specific indications), pregnancy, QT prolongation.', severity: 'medium', emoji: '💉', janAushadhi: 'Ciprofloxacin 500mg (₹10–18/strip)' },
  { id: 9, name: 'Metronidazole', generic: 'Metronidazole', category: 'Antibiotic / Antiprotozoal', brandNames: ['Flagyl', 'Metrogyl', 'Aristogyl'], uses: 'Anaerobic bacterial infections, amoebiasis, giardiasis, H. pylori (with other drugs), trichomoniasis.', dosage: 'Adults: 400–500mg 3 times daily for 5–10 days with food.', sideEffects: 'Nausea, metallic taste, dark urine, diarrhoea, headache.', warnings: '⚠️ STRICTLY avoid alcohol during and 48 hours after course — causes severe reaction. Avoid in 1st trimester pregnancy.', interactions: 'Alcohol (severe disulfiram-like reaction), warfarin, lithium, phenytoin.', contraindications: '1st trimester pregnancy, CNS diseases, blood dyscrasias.', severity: 'high', emoji: '💉', janAushadhi: 'Metronidazole 400mg (₹8–12/strip)' },
  { id: 10, name: 'Doxycycline', generic: 'Doxycycline Hyclate', category: 'Antibiotic (Tetracycline)', brandNames: ['Doxinate', 'Doxt', 'Doxylin', 'Vibramycin'], uses: 'Malaria prevention, respiratory infections, chlamydia, Lyme disease, acne, typhus.', dosage: 'Adults: 100mg twice daily on Day 1, then 100mg once daily. Take with a full glass of water; remain upright 30 min after.', sideEffects: 'Nausea, vomiting, photosensitivity (sun sensitivity), oesophageal irritation.', warnings: '⚠️ Avoid dairy and antacids within 2 hours. Use sunscreen. Do NOT use in pregnancy or children under 8 (permanent tooth staining).', interactions: 'Antacids, dairy products, warfarin, oral contraceptives (reduced efficacy).', contraindications: 'Pregnancy, children < 8 years, severe liver disease.', severity: 'medium', emoji: '💉', janAushadhi: 'Doxycycline 100mg (₹10–15/strip)' },
  { id: 11, name: 'Cefixime', generic: 'Cefixime', category: 'Antibiotic (Cephalosporin)', brandNames: ['Zifi', 'Taxim-O', 'Cefolac', 'Cefspan'], uses: 'Urinary tract infections, typhoid fever, ear infections, tonsillitis, gonorrhoea, respiratory infections.', dosage: 'Adults: 200–400mg once daily or in two divided doses for 7–14 days.', sideEffects: 'Diarrhoea, stomach upset, nausea, rash, headache.', warnings: '⚠️ Complete the full course. Allergic cross-reactivity with penicillins (rare). Monitor for severe diarrhoea (C. difficile).', interactions: 'Warfarin (increases INR), carbamazepine.', contraindications: 'Cephalosporin allergy. Caution in penicillin allergy.', severity: 'low', emoji: '💉', janAushadhi: 'Cefixime 200mg (₹25–35/strip)' },
  { id: 12, name: 'Co-amoxiclav', generic: 'Amoxicillin + Clavulanate', category: 'Antibiotic (Penicillin + Inhibitor)', brandNames: ['Augmentin', 'Clavam', 'Moxikind-CV', 'Taxim-AZ'], uses: 'Resistant bacterial infections, sinusitis, pneumonia, skin infections, dental infections, UTIs.', dosage: 'Adults: 625mg (500/125mg) twice or three times daily for 5–14 days. Take with meals.', sideEffects: 'Diarrhoea (common), nausea, skin rash, candida overgrowth, liver enzyme elevation.', warnings: '⚠️ Higher risk of liver injury than amoxicillin alone. Monitor liver function. Not for prolonged courses without medical supervision.', interactions: 'Warfarin (increased INR), methotrexate, oral contraceptives.', contraindications: 'Penicillin allergy, history of jaundice with co-amoxiclav, severe kidney impairment.', severity: 'medium', emoji: '💉', janAushadhi: 'Amoxicillin+Clavulanate 625mg (₹45–65/strip)' },

  // ── GI Medications ────────────────────────────────────────────
  { id: 13, name: 'Omeprazole', generic: 'Omeprazole', category: 'Proton Pump Inhibitor', brandNames: ['Prilosec', 'Omez', 'Ocid', 'Omesec'], uses: 'Acid reflux (GERD), heartburn, peptic ulcers, H. pylori eradication, Zollinger-Ellison syndrome.', dosage: 'Adults: 20–40mg once daily before meals for 4–8 weeks.', sideEffects: 'Headache, nausea, diarrhoea, stomach pain, flatulence.', warnings: '⚠️ Long-term use may increase fractures, low magnesium, and C. difficile infection.', interactions: 'Clopidogrel (reduced effect), methotrexate, iron supplements, HIV drugs.', contraindications: 'PPI hypersensitivity. Caution in liver disease.', severity: 'low', emoji: '💊', janAushadhi: 'Omeprazole 20mg (₹5–8/strip)' },
  { id: 14, name: 'Pantoprazole', generic: 'Pantoprazole Sodium', category: 'Proton Pump Inhibitor', brandNames: ['Pan', 'Pantocid', 'Protonix', 'Pantodac'], uses: 'GERD, gastric ulcers, erosive esophagitis, H. pylori, prevention of stress ulcers.', dosage: 'Adults: 20–40mg once daily before breakfast for 4–8 weeks.', sideEffects: 'Headache, diarrhoea, nausea, flatulence, stomach pain.', warnings: '⚠️ Do not crush enteric-coated tablets. Long-term use risks similar to omeprazole.', interactions: 'Methotrexate, antiretrovirals, iron, clopidogrel.', contraindications: 'PPI hypersensitivity. Caution in severe liver disease.', severity: 'low', emoji: '💊', janAushadhi: 'Pantoprazole 40mg (₹6–10/strip)' },
  { id: 15, name: 'Famotidine', generic: 'Famotidine', category: 'H2 Blocker / Antacid', brandNames: ['Pepcid', 'Facid', 'Topcid', 'Famocid'], uses: 'Heartburn, acid indigestion, GERD, peptic ulcers, Zollinger-Ellison syndrome.', dosage: 'Adults: 20–40mg once or twice daily. Heartburn: 10–20mg as needed.', sideEffects: 'Headache, dizziness, constipation, diarrhoea, fatigue.', warnings: '⚠️ Less interaction-prone than PPIs. Suitable for short-term heartburn relief. Reduce dose in kidney disease.', interactions: 'Atazanavir, delavirdine (avoid), ketoconazole, itraconazole (reduced absorption).', contraindications: 'Hypersensitivity. Reduce dose in severe kidney impairment.', severity: 'low', emoji: '💊', janAushadhi: 'Famotidine 20mg (₹8–12/strip)' },
  { id: 16, name: 'Ondansetron', generic: 'Ondansetron HCl', category: 'Antiemetic', brandNames: ['Zofran', 'Ondem', 'Emeset', 'Vomit-Stop'], uses: 'Nausea and vomiting after chemotherapy, radiation, surgery; severe morning sickness.', dosage: 'Adults: 4–8mg every 8 hours. IV: 4–8mg slow infusion. Children: 0.1–0.15mg/kg.', sideEffects: 'Constipation, headache, flushing, dizziness. Rarely: QT prolongation.', warnings: '⚠️ Avoid in QT prolongation. May cause serotonin syndrome with other serotonergic drugs.', interactions: 'Serotonergic drugs, apomorphine (contraindicated), other QT-prolonging drugs.', contraindications: 'Congenital long QT syndrome, concurrent apomorphine use.', severity: 'medium', emoji: '💊', janAushadhi: 'Ondansetron 4mg (₹12–20/strip)' },
  { id: 17, name: 'Domperidone', generic: 'Domperidone', category: 'Antiemetic / Prokinetic', brandNames: ['Motilium', 'Domstal', 'Vometa', 'Nausim'], uses: 'Nausea, vomiting, gastroparesis, acid reflux, to improve gastric emptying.', dosage: 'Adults: 10mg 3 times daily, 15–30 minutes before meals. Max: 30mg/day.', sideEffects: 'Dry mouth, headache, diarrhoea, breast tenderness/lactation (rare).', warnings: '⚠️ Avoid with other QT-prolonging drugs. Not for long-term use — cardiac risk. Do not exceed recommended dose.', interactions: 'QT-prolonging drugs, ketoconazole (contraindicated), erythromycin.', contraindications: 'QT prolongation, GI bleeding/obstruction, prolactinoma, severe liver disease.', severity: 'medium', emoji: '💊', janAushadhi: 'Domperidone 10mg (₹8–12/strip)' },
  { id: 18, name: 'Loperamide', generic: 'Loperamide HCl', category: 'Antidiarrhoeal', brandNames: ['Imodium', 'Lopamide', 'Eldoper'], uses: 'Acute and chronic diarrhoea, traveller\'s diarrhoea, to reduce ileostomy output.', dosage: 'Adults: 4mg initially, then 2mg after each loose stool. Max: 16mg/day.', sideEffects: 'Constipation, abdominal cramps, nausea, dizziness.', warnings: '⚠️ Do not use in bloody diarrhoea or with high fever. Stop if no improvement after 48 hours. Avoid in children under 2.', interactions: 'CNS depressants (increases sedation). QT-prolonging drugs.', contraindications: 'Bloody diarrhoea, pseudomembranous colitis, children under 2 years.', severity: 'low', emoji: '💊', janAushadhi: 'Loperamide 2mg (₹5–8/strip)' },
  { id: 19, name: 'ORS (Oral Rehydration Salts)', generic: 'ORS (WHO formula)', category: 'Rehydration Therapy', brandNames: ['Electral', 'Pedialyte', 'ORS-L', 'Walyte'], uses: 'Dehydration due to diarrhoea, vomiting, heatstroke, or excessive sweating.', dosage: 'Dissolve 1 sachet in 1L boiled cooled water. Drink slowly. Children: per weight guidance on pack.', sideEffects: 'None with standard use. Hypernatraemia if excessive amount given to infants.', warnings: '⚠️ Always use boiled cooled water. Do not add sugar or salt to commercial ORS. Discard unused solution after 24 hours.', interactions: 'None significant.', contraindications: 'Intestinal obstruction (IV fluids preferred). Severe dehydration (may need IV).', severity: 'low', emoji: '💧', janAushadhi: 'ORS Sachet (₹2–4/sachet)' },
  { id: 20, name: 'Sucralfate', generic: 'Sucralfate', category: 'Gastric Mucosal Protectant', brandNames: ['Sucral', 'Sulcrate', 'Ulsanic', 'Mucosel'], uses: 'Peptic ulcers, duodenal ulcers, stress ulcer prophylaxis, GERD.', dosage: 'Adults: 1g (10ml suspension) 4 times daily on an empty stomach, 1 hour before meals and at bedtime.', sideEffects: 'Constipation (most common), dry mouth, nausea, indigestion, rash (rare).', warnings: '⚠️ Take on an empty stomach — works as a physical barrier. May reduce absorption of other drugs. Take all other medications 2 hours before sucralfate.', interactions: 'Reduces absorption of fluoroquinolones, levothyroxine, digoxin, phenytoin. Separate all drugs by 2 hours.', contraindications: 'Chronic kidney disease (aluminium accumulation risk). Avoid in dialysis patients.', severity: 'low', emoji: '💊', janAushadhi: 'Sucralfate 1g (₹15–25/strip)' },

  // ── Cardiovascular ────────────────────────────────────────────
  { id: 21, name: 'Amlodipine', generic: 'Amlodipine Besylate', category: 'Calcium Channel Blocker', brandNames: ['Amlip', 'Norvasc', 'Stamlo', 'Amcard'], uses: 'High blood pressure (hypertension), angina (chest pain), coronary artery disease.', dosage: 'Adults: 2.5–10mg once daily. Elderly: start at 2.5mg.', sideEffects: 'Ankle swelling (oedema), flushing, dizziness, headache, fatigue.', warnings: '⚠️ Do not stop suddenly. Monitor blood pressure. Oedema is common — inform doctor if severe.', interactions: 'Simvastatin (max 20mg), CYP3A4 inhibitors (ketoconazole), cyclosporine.', contraindications: 'Severe aortic stenosis, cardiogenic shock.', severity: 'medium', emoji: '❤️', janAushadhi: 'Amlodipine 5mg (₹5–8/strip)' },
  { id: 22, name: 'Losartan', generic: 'Losartan Potassium', category: 'ARB (Antihypertensive)', brandNames: ['Cosaar', 'Losacar', 'Repace', 'Xartan'], uses: 'Hypertension, heart failure, diabetic nephropathy, stroke prevention.', dosage: 'Adults: 25–100mg once daily. Blood pressure response in 3–6 weeks.', sideEffects: 'Dizziness (especially initially), back pain, upper respiratory infections.', warnings: '⚠️ Do not use in pregnancy (harms fetus). Monitor potassium and kidney function.', interactions: 'NSAIDs (reduce efficacy), potassium supplements, ACE inhibitors, diuretics.', contraindications: 'Pregnancy, severe kidney/liver disease, hyperkalemia.', severity: 'medium', emoji: '❤️', janAushadhi: 'Losartan 50mg (₹10–15/strip)' },
  { id: 23, name: 'Telmisartan', generic: 'Telmisartan', category: 'ARB (Antihypertensive)', brandNames: ['Telma', 'Telsartan', 'Pritor', 'Corbis'], uses: 'Hypertension, cardiovascular risk reduction, diabetic nephropathy.', dosage: 'Adults: 40–80mg once daily. Can be taken with or without food.', sideEffects: 'Dizziness, back pain, upper respiratory tract infection, diarrhoea.', warnings: '⚠️ Do not use in pregnancy (causes fetal harm). Monitor kidney function and electrolytes. Avoid dual RAAS blockade.', interactions: 'NSAIDs, potassium-sparing diuretics, lithium, digoxin.', contraindications: 'Pregnancy, severe liver disease, biliary obstruction, diabetes with aliskiren.', severity: 'medium', emoji: '❤️', janAushadhi: 'Telmisartan 40mg (₹12–18/strip)' },
  { id: 24, name: 'Atorvastatin', generic: 'Atorvastatin Calcium', category: 'Statin / Lipid-Lowering', brandNames: ['Lipitor', 'Atorva', 'Tonact', 'Storvas'], uses: 'High cholesterol (hyperlipidaemia), prevention of heart attacks and stroke, cardiovascular disease.', dosage: 'Adults: 10–80mg once daily at any time. Evening preferred for maximum effect.', sideEffects: 'Muscle pain (myalgia), headache, nausea, joint pain. Rare: rhabdomyolysis.', warnings: '⚠️ Report unexplained muscle pain immediately. Avoid grapefruit juice. Regular liver function monitoring needed.', interactions: 'Grapefruit juice, amlodipine (limit to 20mg), fibrates, erythromycin, antifungals.', contraindications: 'Active liver disease, pregnancy, breastfeeding.', severity: 'medium', emoji: '❤️', janAushadhi: 'Atorvastatin 10mg (₹8–14/strip)' },
  { id: 25, name: 'Furosemide', generic: 'Furosemide', category: 'Loop Diuretic', brandNames: ['Lasix', 'Frusenex', 'Frusemide'], uses: 'Oedema from heart failure, liver cirrhosis, or kidney disease; hypertension.', dosage: 'Adults: 20–80mg once or twice daily (oral). IV: 20–40mg slow injection.', sideEffects: 'Increased urination, low potassium (hypokalemia), dehydration, dizziness.', warnings: '⚠️ Monitor electrolytes, especially potassium. Avoid salt substitutes with potassium. Orthostatic hypotension risk.', interactions: 'NSAIDs (reduce effect), lithium (toxicity risk), digoxin, ototoxic drugs.', contraindications: 'Anuria, severe hypovolaemia, sulfonamide allergy.', severity: 'medium', emoji: '💊', janAushadhi: 'Furosemide 40mg (₹3–6/strip)' },
  { id: 26, name: 'Aspirin (Low Dose)', generic: 'Acetylsalicylic Acid 75–150mg', category: 'Antiplatelet / Cardiac', brandNames: ['Disprin', 'Ecosprin', 'Cardiprin', 'Loprin'], uses: 'Prevention of blood clots, heart attack (secondary prevention), stroke prevention, after coronary stents.', dosage: 'Adults: 75–150mg once daily after meals.', sideEffects: 'GI irritation, stomach pain, increased bleeding tendency.', warnings: '⚠️ Do not give to children under 16 (Reye\'s syndrome risk). Increases bleeding risk — inform surgeons/dentists before procedures.', interactions: 'Warfarin (increased bleeding), NSAIDs (GI risk), clopidogrel, methotrexate.', contraindications: 'Active GI bleeding, haemophilia, children under 16, severe kidney/liver disease.', severity: 'medium', emoji: '❤️', janAushadhi: 'Aspirin 75mg (₹3–5/strip)' },
  { id: 27, name: 'Bisoprolol', generic: 'Bisoprolol Fumarate', category: 'Beta-Blocker', brandNames: ['Biselect', 'Cardicor', 'Concor', 'Bisol'], uses: 'Hypertension, heart failure (stable), angina, arrhythmias, post-MI cardioprotection.', dosage: 'Heart failure: start 1.25mg once daily, titrate to 10mg. Hypertension: 5–10mg once daily.', sideEffects: 'Bradycardia (slow pulse), fatigue, cold extremities, dizziness, impotence.', warnings: '⚠️ Never stop abruptly — risk of rebound angina or MI. Masks hypoglycaemia symptoms in diabetics. Worsens asthma/COPD.', interactions: 'Calcium channel blockers (severe bradycardia), antidiabetics (mask hypoglycaemia signs), NSAIDs.', contraindications: 'Acute decompensated heart failure, asthma, COPD, bradycardia, sick sinus syndrome.', severity: 'medium', emoji: '❤️', janAushadhi: 'Bisoprolol 5mg (₹10–15/strip)' },
  { id: 28, name: 'Enalapril', generic: 'Enalapril Maleate', category: 'ACE Inhibitor', brandNames: ['Enam', 'Envas', 'Vasotec', 'Glioten'], uses: 'Hypertension, heart failure, diabetic nephropathy, left ventricular dysfunction.', dosage: 'Hypertension: 5–40mg/day in 1–2 divided doses. Heart failure: 2.5–20mg twice daily.', sideEffects: 'Dry cough (most common), dizziness, headache, elevated potassium, angioedema (rare but serious).', warnings: '⚠️ Stop immediately if angioedema occurs (throat swelling). Avoid in pregnancy (causes fetal harm). Monitor potassium and kidney function.', interactions: 'Potassium-sparing diuretics, NSAIDs, lithium, aliskiren (with diabetes).', contraindications: 'Pregnancy, previous ACE inhibitor-associated angioedema, renovascular disease.', severity: 'medium', emoji: '❤️', janAushadhi: 'Enalapril 5mg (₹6–10/strip)' },

  // ── Antidiabetic ──────────────────────────────────────────────
  { id: 29, name: 'Metformin', generic: 'Metformin HCl', category: 'Antidiabetic (Biguanide)', brandNames: ['Glycomet', 'Glucophage', 'Obimet', 'Riomet'], uses: 'Type 2 diabetes management, PCOS (polycystic ovary syndrome), pre-diabetes.', dosage: 'Start: 500mg twice daily with meals. Maximum: 2550mg/day. Increase gradually to reduce GI side effects.', sideEffects: 'Nausea, diarrhoea, stomach upset (especially initially), metallic taste.', warnings: '⚠️ Take with food to reduce GI side effects. Rare: lactic acidosis — stop if ill or dehydrated. Hold before contrast dye procedures.', interactions: 'Alcohol, contrast dyes (hold before imaging), diuretics, corticosteroids.', contraindications: 'Kidney disease (eGFR < 30), liver disease, heart failure, excessive alcohol use.', severity: 'medium', emoji: '💊', janAushadhi: 'Metformin 500mg (₹8–12/strip)' },
  { id: 30, name: 'Glimepiride', generic: 'Glimepiride', category: 'Antidiabetic (Sulphonylurea)', brandNames: ['Amaryl', 'Glimer', 'Glimpid', 'Glimisave'], uses: 'Type 2 diabetes, to stimulate insulin secretion from the pancreas.', dosage: 'Start: 1–2mg once daily with breakfast. Max: 8mg/day.', sideEffects: 'Hypoglycaemia (low blood sugar), weight gain, dizziness, nausea.', warnings: '⚠️ High risk of hypoglycaemia — do not skip meals. Carry glucose tablets/sweets. Avoid excess alcohol.', interactions: 'Alcohol, NSAIDs (increase hypoglycaemia risk), warfarin, beta-blockers (mask hypoglycaemia).', contraindications: 'Type 1 diabetes, diabetic ketoacidosis, severe kidney/liver disease, pregnancy.', severity: 'medium', emoji: '💊', janAushadhi: 'Glimepiride 1mg (₹8–14/strip)' },
  { id: 31, name: 'Sitagliptin', generic: 'Sitagliptin Phosphate', category: 'Antidiabetic (DPP-4 Inhibitor)', brandNames: ['Januvia', 'Istavel', 'Sitaglu', 'Zita'], uses: 'Type 2 diabetes — lowers blood glucose by increasing incretin levels.', dosage: 'Adults: 100mg once daily. Reduce to 50mg if eGFR 30–50; 25mg if eGFR <30.', sideEffects: 'Nasopharyngitis (cold-like symptoms), upper respiratory infections, headache, joint pain (rare).', warnings: '⚠️ Rare: pancreatitis — stop and seek care if severe abdominal pain occurs. Joint pain (arthralgia) reported.', interactions: 'Insulin and sulphonylureas (increase hypoglycaemia risk), digoxin.', contraindications: 'Type 1 diabetes, diabetic ketoacidosis, history of pancreatitis (caution).', severity: 'low', emoji: '💊', janAushadhi: 'Sitagliptin 100mg (₹80–120/strip)' },
  { id: 32, name: 'Empagliflozin', generic: 'Empagliflozin', category: 'Antidiabetic (SGLT-2 Inhibitor)', brandNames: ['Jardiance', 'Empaglu', 'Empaglif'], uses: 'Type 2 diabetes, cardiovascular risk reduction, heart failure with reduced ejection fraction, chronic kidney disease.', dosage: 'Diabetes: 10mg once daily in the morning (may increase to 25mg). Heart failure: 10mg once daily.', sideEffects: 'Genital yeast infections (common), UTIs, increased urination, volume depletion, DKA (rare).', warnings: '⚠️ Risk of diabetic ketoacidosis (DKA) — hold before major surgery. Genital hygiene important. Do not use in type 1 diabetes.', interactions: 'Diuretics (volume depletion risk), insulin/sulphonylureas (hypoglycaemia).', contraindications: 'Type 1 diabetes, eGFR <30 (for diabetes indication), history of recurrent UTIs.', severity: 'medium', emoji: '💊', janAushadhi: 'Empagliflozin 10mg (₹120–180/strip)' },
  { id: 33, name: 'Insulin Glargine', generic: 'Insulin Glargine (Long-Acting)', category: 'Insulin (Long-Acting)', brandNames: ['Lantus', 'Basaglar', 'Toujeo', 'Glaritus'], uses: 'Type 1 and Type 2 diabetes requiring basal insulin for blood glucose control.', dosage: 'Individualised. Typically 10 units subcutaneously once daily at the same time. Adjust per blood glucose.', sideEffects: 'Hypoglycaemia, injection site reactions (lipohypertrophy), weight gain.', warnings: '⚠️ Do NOT mix with other insulins. Must be refrigerated (2–8°C); once opened, store at room temperature for up to 28 days. Monitor blood glucose closely.', interactions: 'Alcohol, beta-blockers (mask hypoglycaemia signs), corticosteroids, other antidiabetics.', contraindications: 'Hypoglycaemia episodes (hold), allergic to insulin glargine.', severity: 'high', emoji: '💉', janAushadhi: 'Insulin Glargine 100IU (₹350–500/vial)' },

  // ── Antihistamines ────────────────────────────────────────────
  { id: 34, name: 'Cetirizine', generic: 'Cetirizine HCl', category: 'Antihistamine', brandNames: ['Zyrtec', 'Okacet', 'Cetzine', 'Alerid'], uses: 'Seasonal allergies, hay fever, hives (urticaria), allergic rhinitis, itching.', dosage: 'Adults: 10mg once daily. Children 6–12: 5mg twice daily.', sideEffects: 'Mild drowsiness, dry mouth, headache, fatigue.', warnings: '⚠️ May cause drowsiness. Avoid driving. Avoid alcohol.', interactions: 'Alcohol, CNS depressants, theophylline.', contraindications: 'Kidney impairment (reduced dose). Pregnancy: consult doctor.', severity: 'low', emoji: '💊', janAushadhi: 'Cetirizine 10mg (₹3–5/strip)' },
  { id: 35, name: 'Levocetirizine', generic: 'Levocetirizine Dihydrochloride', category: 'Antihistamine', brandNames: ['Xyzal', 'Levocet', 'Rcin-L', 'L-Cet'], uses: 'Allergic rhinitis, chronic urticaria, atopic dermatitis, dust/pollen allergy.', dosage: 'Adults: 5mg once daily in the evening. Children 6–11: 2.5mg once daily.', sideEffects: 'Drowsiness, dry mouth, headache, fatigue.', warnings: '⚠️ Evening dosing helps reduce daytime drowsiness. Avoid alcohol and activities requiring alertness.', interactions: 'Alcohol, theophylline, sedatives, ritonavir.', contraindications: 'Severe kidney impairment, children under 6, first trimester pregnancy.', severity: 'low', emoji: '💊', janAushadhi: 'Levocetirizine 5mg (₹5–8/strip)' },

  // ── Thyroid ───────────────────────────────────────────────────
  { id: 36, name: 'Levothyroxine', generic: 'Levothyroxine Sodium (T4)', category: 'Thyroid Hormone', brandNames: ['Eltroxin', 'Thyronorm', 'Thyrox', 'Synthroid'], uses: 'Hypothyroidism (underactive thyroid), goitre, thyroid cancer (post-surgery), cretinism.', dosage: 'Adults: 25–200mcg once daily, 30–60 minutes before breakfast on empty stomach.', sideEffects: 'With correct dose: none. Overdose symptoms: palpitations, tremor, heat intolerance, insomnia.', warnings: '⚠️ Take on empty stomach (30–60 min before food). Calcium/iron supplements interfere — separate by 4 hours. Dose adjusted by TSH blood test.', interactions: 'Calcium/iron supplements (separate by 4 hours), antacids, warfarin, antidepressants.', contraindications: 'Untreated adrenal insufficiency, untreated thyrotoxicosis, recent MI.', severity: 'medium', emoji: '💊', janAushadhi: 'Levothyroxine 50mcg (₹8–14/strip)' },
  { id: 37, name: 'Carbimazole', generic: 'Carbimazole', category: 'Antithyroid', brandNames: ['Neo-Mercazole', 'Carbimazole', 'CMZ'], uses: 'Hyperthyroidism (overactive thyroid), Graves\' disease, before thyroid surgery or radioactive iodine.', dosage: 'Adults: 20–60mg/day in divided doses initially; maintenance: 5–15mg/day. Dose titrated by TFTs.', sideEffects: 'Nausea, rash, joint pain, headache. Rare: agranulocytosis (severe — stop immediately if fever/sore throat).', warnings: '⚠️ Seek emergency care immediately if sore throat, fever, or mouth ulcers develop (agranulocytosis risk). Regular blood counts needed.', interactions: 'Warfarin (increased effect), digoxin.', contraindications: 'Agranulocytosis history. Caution in pregnancy (propylthiouracil preferred in 1st trimester).', severity: 'high', emoji: '💊', janAushadhi: 'Carbimazole 5mg (₹12–18/strip)' },

  // ── Pulmonary ─────────────────────────────────────────────────
  { id: 38, name: 'Salbutamol', generic: 'Albuterol', category: 'Bronchodilator (Beta-2 Agonist)', brandNames: ['Asthalin', 'Ventolin', 'Salbair', 'Proair'], uses: 'Asthma attacks, bronchospasm, COPD, wheezing.', dosage: 'Inhaler: 1–2 puffs every 4–6 hours as needed. Use spacer device for children.', sideEffects: 'Tremors, rapid heartbeat, nervousness, headache.', warnings: '⚠️ For relief only — not prevention. If using > 3×/week, reassess asthma control with doctor.', interactions: 'Beta-blockers (antagonistic), diuretics, digoxin.', contraindications: 'Severe tachyarrhythmia. Caution in hypertension, hyperthyroidism.', severity: 'medium', emoji: '🫁', janAushadhi: 'Salbutamol Inhaler (₹50–80/inhaler)' },
  { id: 39, name: 'Budesonide Inhaler', generic: 'Budesonide (Inhaled Corticosteroid)', category: 'Inhaled Corticosteroid', brandNames: ['Pulmicort', 'Budecort', 'Foracort (with formoterol)'], uses: 'Asthma prevention (controller), COPD management, allergic rhinitis (nasal spray).', dosage: 'Adults: 200–400mcg twice daily (inhaled). Rinse mouth after each use.', sideEffects: 'Oral thrush (candidiasis), hoarseness of voice, mild cough.', warnings: '⚠️ NOT for acute attacks — use salbutamol instead. Rinse mouth with water after each dose to prevent oral thrush.', interactions: 'Ketoconazole, itraconazole (increase budesonide levels), ritonavir.', contraindications: 'Acute asthma attack (IV steroids needed). Not for primary use in emergencies.', severity: 'low', emoji: '🫁', janAushadhi: 'Budesonide Inhaler 200mcg (₹80–130/inhaler)' },
  { id: 40, name: 'Ambroxol', generic: 'Ambroxol HCl', category: 'Expectorant / Mucolytic', brandNames: ['Mucosolvan', 'Ambrolite', 'Brozil', 'Ambrex'], uses: 'Productive cough, acute and chronic respiratory tract disorders, bronchitis, pneumonia adjunct.', dosage: 'Adults: 30mg 3 times daily (syrup or tablet). Children: dose by weight/age per label.', sideEffects: 'Nausea, vomiting, diarrhoea, taste disturbance, mild rash.', warnings: '⚠️ Not for dry, unproductive cough. Ensure adequate fluid intake to help thin mucus. Caution in severe liver/kidney disease.', interactions: 'Antibiotics (ambroxol increases their penetration into lung tissue — beneficial combination).', contraindications: 'Pregnancy (1st trimester — safety uncertain). Caution in peptic ulcer disease.', severity: 'low', emoji: '🫁', janAushadhi: 'Ambroxol 30mg (₹5–8/strip)' },
  { id: 41, name: 'Bromhexine', generic: 'Bromhexine HCl', category: 'Expectorant / Mucolytic', brandNames: ['Bisolvon', 'Bromhexine Cipla', 'Brophylline'], uses: 'Loosening and clearing mucus/phlegm in chest, bronchitis, COPD, asthma with productive cough.', dosage: 'Adults: 8–16mg 3 times daily. Children 5–10 years: 4mg 3 times daily.', sideEffects: 'Nausea, stomach upset, headache, dizziness, skin rash (rare).', warnings: '⚠️ Drink plenty of fluids. Not for dry cough. Avoid in peptic ulcer disease.', interactions: 'Antibiotics (may increase lung tissue penetration of some antibiotics).', contraindications: 'Peptic ulcer disease. Caution in pregnancy (especially 1st trimester).', severity: 'low', emoji: '🫁', janAushadhi: 'Bromhexine 8mg (₹5–8/strip)' },

  // ── Vitamins & Supplements ────────────────────────────────────
  { id: 42, name: 'Vitamin D3', generic: 'Cholecalciferol', category: 'Vitamin / Supplement', brandNames: ['D-Rise', 'Calcirol', 'Ostocalcium', 'Uprise D3'], uses: 'Vitamin D deficiency, rickets, osteoporosis, muscle weakness, immune support.', dosage: 'Deficiency treatment: 60,000 IU weekly for 8–12 weeks, then maintenance 800–2000 IU daily. (Per doctor\'s advice.)', sideEffects: 'Toxicity with excessive doses: nausea, weakness, confusion, kidney stones.', warnings: '⚠️ Do NOT self-supplement high doses without blood test (25-OH Vitamin D). Excess Vitamin D is toxic.', interactions: 'Thiazide diuretics (hypercalcaemia risk), digoxin, antiepileptics (reduce D3 levels).', contraindications: 'Hypercalcaemia, sarcoidosis, hyperparathyroidism.', severity: 'low', emoji: '☀️', janAushadhi: 'Vitamin D3 60,000IU (₹15–25/sachet)' },
  { id: 43, name: 'Vitamin B12', generic: 'Cyanocobalamin / Methylcobalamin', category: 'Vitamin / Supplement', brandNames: ['Mecobalamin', 'Neurobion', 'Nervijen', 'Cobadex'], uses: 'B12 deficiency, pernicious anaemia, peripheral neuropathy (tingling/numbness), megaloblastic anaemia.', dosage: 'Deficiency: 1000mcg/day oral, or IM injection as per doctor. Maintenance: 500mcg/day.', sideEffects: 'Generally very safe. Rarely: mild diarrhoea, itching.', warnings: '⚠️ Vegans and vegetarians are at high risk for B12 deficiency. Metformin reduces B12 absorption — regular monitoring needed.', interactions: 'Metformin (reduces absorption), omeprazole, colchicine, antibiotics (reduce absorption).', contraindications: 'Leber\'s hereditary optic neuropathy (cyanocobalamin form).', severity: 'low', emoji: '💊', janAushadhi: 'Methylcobalamin 500mcg (₹8–15/strip)' },
  { id: 44, name: 'Iron (Ferrous Sulphate)', generic: 'Ferrous Sulphate', category: 'Vitamin / Supplement', brandNames: ['Fersolate', 'Orofer', 'Autrin', 'Ferrous 200'], uses: 'Iron deficiency anaemia, pregnancy supplementation, prevention in infants.', dosage: 'Adults: 200mg (65mg elemental iron) 2–3 times daily between meals. Take with Vitamin C-rich drink to enhance absorption.', sideEffects: 'Constipation, nausea, stomach pain, dark stools (normal).', warnings: '⚠️ Dark stools are normal with iron — do not confuse with GI bleeding. Keep away from children (iron overdose is dangerous). Take 2 hours apart from antacids/calcium.', interactions: 'Antacids, calcium, tetracyclines, fluoroquinolones, levothyroxine, proton pump inhibitors.', contraindications: 'Haemochromatosis, haemolytic anaemia, primary haemosiderosis.', severity: 'low', emoji: '💊', janAushadhi: 'Ferrous Sulphate 200mg (₹5–8/strip)' },
  { id: 45, name: 'Folic Acid', generic: 'Folic Acid (Vitamin B9)', category: 'Vitamin / Supplement', brandNames: ['Folvite', 'Folic Acid 5mg', 'Folsafe', 'Preganews'], uses: 'Prevention of neural tube defects in pregnancy, megaloblastic anaemia, folate deficiency.', dosage: 'Prevention: 400–800mcg/day (women planning pregnancy). Treatment/pregnancy: 5mg/day as prescribed.', sideEffects: 'Very safe. Rare: allergic reaction, bitter taste.', warnings: '⚠️ High doses can mask Vitamin B12 deficiency — always check B12 before high-dose folic acid.', interactions: 'Methotrexate (antagonist), antiepileptics (reduce absorption), trimethoprim.', contraindications: 'Untreated Vitamin B12 deficiency (correct B12 first).', severity: 'low', emoji: '🌿', janAushadhi: 'Folic Acid 5mg (₹3–5/strip)' },
  { id: 46, name: 'Zinc Sulphate', generic: 'Zinc Sulphate', category: 'Vitamin / Supplement', brandNames: ['Zincovit', 'Zinconia', 'Z-Plus', 'Zinkovit'], uses: 'Zinc deficiency, diarrhoea in children (WHO recommendation), wound healing, immune support, acne.', dosage: 'Supplement: 10–40mg elemental zinc/day. Diarrhoea (children <5): 10–20mg/day for 10–14 days.', sideEffects: 'Nausea, stomach upset (take with food), metallic taste, copper deficiency with long-term high doses.', warnings: '⚠️ Long-term high-dose zinc (>40mg/day) can cause copper deficiency and anaemia. Take with food if GI upset.', interactions: 'Iron, calcium, tetracyclines, fluoroquinolones (reduce zinc absorption — take 2 hours apart).', contraindications: 'Excessive zinc intake. Caution in kidney disease.', severity: 'low', emoji: '💊', janAushadhi: 'Zinc Sulphate 20mg (₹5–8/strip)' },

  // ── Antifungal ────────────────────────────────────────────────
  { id: 47, name: 'Fluconazole', generic: 'Fluconazole', category: 'Antifungal', brandNames: ['Diflucan', 'Forcan', 'Flucos', 'Fluconac'], uses: 'Vaginal yeast infections, oral thrush, systemic candida infections, cryptococcal meningitis, prevention in immunocompromised.', dosage: 'Vaginal yeast: 150mg single dose. Oral thrush: 50–100mg/day for 7–14 days.', sideEffects: 'Nausea, headache, abdominal pain, diarrhoea. Rarely: liver damage.', warnings: '⚠️ Can interact with many medications. Monitor liver function with prolonged use. Use with caution in pregnancy (consult doctor).', interactions: 'Warfarin (increased INR), statins, midazolam, tacrolimus, cyclosporine, many others.', contraindications: 'Pregnancy (single high-dose; 1st trimester), liver disease, hypersensitivity to azoles.', severity: 'medium', emoji: '💊', janAushadhi: 'Fluconazole 150mg (₹15–25/tablet)' },
  { id: 48, name: 'Clotrimazole', generic: 'Clotrimazole', category: 'Antifungal (Topical)', brandNames: ['Candid', 'Canesten', 'Clotrimix', 'Surfaz'], uses: 'Athlete\'s foot (tinea pedis), ringworm, vaginal thrush (pessaries), oral thrush (lozenges), pityriasis versicolor.', dosage: 'Topical cream: apply 2–3 times daily for 2–4 weeks. Vaginal pessary: 100mg/day for 6 nights.', sideEffects: 'Local burning, itching, redness (mild, usually transient).', warnings: '⚠️ Topical form is generally very safe. Do not use near eyes. Vaginal pessaries may damage condoms/diaphragms.', interactions: 'Topical has minimal systemic interactions. Vaginal form: may degrade latex products.', contraindications: 'Hypersensitivity to imidazoles.', severity: 'low', emoji: '💊', janAushadhi: 'Clotrimazole 1% cream (₹18–30/tube)' },

  // ── Antiviral ─────────────────────────────────────────────────
  { id: 49, name: 'Acyclovir', generic: 'Acyclovir (Aciclovir)', category: 'Antiviral', brandNames: ['Zovirax', 'Acivir', 'Herpex', 'Acifar'], uses: 'Herpes simplex (cold sores, genital herpes), varicella (chickenpox), herpes zoster (shingles), prevention in immunocompromised.', dosage: 'Cold sores: 200mg 5 times/day for 5 days. Shingles: 800mg 5 times/day for 7 days. Topical cream: apply 5 times/day.', sideEffects: 'Nausea, headache, diarrhoea. IV high-dose: kidney problems, neurological effects.', warnings: '⚠️ Drink plenty of fluids to protect kidneys. Start treatment at first sign of outbreak for best effect.', interactions: 'Probenecid (increases acyclovir levels), mycophenolate, nephrotoxic drugs.', contraindications: 'Kidney impairment (dose reduction required). Caution in pregnancy.', severity: 'low', emoji: '💊', janAushadhi: 'Acyclovir 400mg (₹15–22/strip)' },
  { id: 50, name: 'Oseltamivir', generic: 'Oseltamivir Phosphate', category: 'Antiviral (Influenza)', brandNames: ['Tamiflu', 'Antiflu', 'Fluvir', 'Oseflu'], uses: 'Treatment and prevention of influenza (flu) types A and B, including H1N1 swine flu.', dosage: 'Treatment: 75mg twice daily for 5 days. Prevention: 75mg once daily for 10 days.', sideEffects: 'Nausea, vomiting, headache, abdominal pain. Rarely: neuropsychiatric effects.', warnings: '⚠️ Start within 48 hours of flu symptoms for effectiveness. Not a substitute for flu vaccination.', interactions: 'Probenecid (increases oseltamivir levels). Flu vaccine — avoid nasal flu vaccine for 2 weeks after.', contraindications: 'Severe kidney impairment (dose reduction). Children under 1 year only with severe influenza.', severity: 'medium', emoji: '💊', janAushadhi: 'Oseltamivir 75mg (₹80–120/strip)' },

  // ── Anti-anxiety / Psychiatric ────────────────────────────────
  { id: 51, name: 'Alprazolam', generic: 'Alprazolam', category: 'Benzodiazepine / Anxiolytic', brandNames: ['Xanax', 'Restyl', 'Tranax', 'Alprax'], uses: 'Anxiety disorders, panic disorder, short-term anxiety relief.', dosage: 'Adults: 0.25–0.5mg 3 times daily. Max: 4mg/day. Start at lowest effective dose.', sideEffects: 'Sedation, dizziness, cognitive impairment, unsteadiness, memory problems.', warnings: '⚠️ HIGH ADDICTION POTENTIAL — short-term use only (2–4 weeks max). Never stop abruptly (withdrawal seizures). Avoid alcohol. Impairs driving.', interactions: 'Alcohol (dangerous — severe CNS depression), opioids, antifungals (ketoconazole), antiretrovirals.', contraindications: 'Myasthenia gravis, severe respiratory disease, sleep apnea, substance dependence.', severity: 'high', emoji: '⚠️', janAushadhi: 'Alprazolam 0.25mg (₹10–18/strip)' },
  { id: 52, name: 'Sertraline', generic: 'Sertraline HCl', category: 'Antidepressant (SSRI)', brandNames: ['Zoloft', 'Serta', 'Daxid', 'Serline'], uses: 'Depression, OCD (obsessive-compulsive disorder), panic disorder, PTSD, social anxiety, premenstrual dysphoric disorder.', dosage: 'Start: 50mg once daily (morning or evening). May increase to 100–200mg after 4 weeks. Takes 4–6 weeks for full effect.', sideEffects: 'Nausea (initially), insomnia, sexual dysfunction, diarrhoea, dry mouth, tremors.', warnings: '⚠️ Do not stop abruptly (discontinuation syndrome). Increased suicidal thoughts risk in first weeks (monitor closely). Report unusual mood changes immediately.', interactions: 'MAOIs (absolutely contraindicated — serotonin syndrome), tramadol, triptans, other SSRIs.', contraindications: 'MAOIs within 14 days, pimozide, concomitant use with other serotonergic drugs.', severity: 'medium', emoji: '🧠', janAushadhi: 'Sertraline 50mg (₹20–30/strip)' },
  { id: 53, name: 'Zolpidem', generic: 'Zolpidem Tartrate', category: 'Hypnotic / Sleep Aid', brandNames: ['Ambien', 'Stilnox', 'Nitrest', 'Zipsydon'], uses: 'Short-term treatment of insomnia (difficulty falling or staying asleep).', dosage: 'Adults: 5–10mg immediately before bedtime. Elderly/women: start at 5mg. Maximum 4 weeks use.', sideEffects: 'Drowsiness, dizziness, headache, nausea. Complex sleep behaviours (sleep-driving, sleep-eating — rare but serious).', warnings: '⚠️ Take only when able to sleep for 7–8 hours. Do not drive next morning. Habit-forming — strictly short-term use only. Avoid alcohol.', interactions: 'CNS depressants (severe sedation), CYP3A4 inhibitors, alcohol.', contraindications: 'Sleep apnea, myasthenia gravis, severe liver disease, respiratory failure, pregnancy.', severity: 'high', emoji: '⚠️', janAushadhi: 'Zolpidem 5mg (₹15–25/strip)' },
  { id: 54, name: 'Melatonin', generic: 'Melatonin', category: 'Sleep Aid / Chronobiotic', brandNames: ['Meloset', 'Melarest', 'Circadin', 'Melzap'], uses: 'Jet lag, shift work sleep disorder, insomnia, delayed sleep phase syndrome, improving sleep onset.', dosage: 'Adults: 0.5–5mg 30–60 minutes before bedtime. For jet lag: 0.5–5mg at bedtime for 2–5 nights.', sideEffects: 'Drowsiness, headache, nausea, dizziness. Generally very safe.', warnings: '⚠️ Avoid driving after taking. Not habit-forming. Longer-term effects in children not fully established.', interactions: 'Warfarin (increased anticoagulant effect), CNS depressants, fluvoxamine (increases melatonin levels).', contraindications: 'Pregnancy (limited data). Autoimmune conditions (may worsen). Children: consult paediatrician.', severity: 'low', emoji: '🌙', janAushadhi: 'Melatonin 3mg (₹12–20/strip)' },

  // ── Antiparasitic ─────────────────────────────────────────────
  { id: 55, name: 'Albendazole', generic: 'Albendazole', category: 'Antiparasitic (Anthelmintic)', brandNames: ['Albenza', 'Zentel', 'Noworm', 'Abentel'], uses: 'Intestinal worms (roundworm, hookworm, whipworm, pinworm, tapeworm), neurocysticercosis, hydatid disease.', dosage: 'Deworming (adults/children > 2 yrs): 400mg single dose. Complex infections: 400mg twice daily for 28 days (with food).', sideEffects: 'Abdominal pain, nausea, vomiting, headache. Liver enzyme elevation with prolonged use.', warnings: '⚠️ Avoid in pregnancy (teratogenic — use contraception). Take with fatty meal for better absorption in systemic infections. Monitor liver function with long courses.', interactions: 'Dexamethasone (increases albendazole levels), cimetidine, praziquantel.', contraindications: 'Pregnancy, retinal lesions.', severity: 'medium', emoji: '💊', janAushadhi: 'Albendazole 400mg (₹5–8/tablet)' },
  { id: 56, name: 'Ivermectin', generic: 'Ivermectin', category: 'Antiparasitic', brandNames: ['Stromectol', 'Ivecop', 'Mectizan', 'Vermact'], uses: 'Scabies, head lice, strongyloidiasis (threadworm), river blindness (onchocerciasis), lymphatic filariasis.', dosage: 'Scabies (topical lotion): apply once, repeat after 1 week. Oral (strongyloides/filariasis): 150–200mcg/kg single dose, on empty stomach.', sideEffects: 'Mazzotti reaction (fever, rash, itching — due to dying parasites), dizziness, nausea.', warnings: '⚠️ Do not use oral form in pregnancy. Neurological side effects in patients with high worm burden. Lotions safe for topical scabies use.', interactions: 'Warfarin (increases INR), CNS depressants (sedation risk).', contraindications: 'Pregnancy (oral), children under 5 or < 15kg.', severity: 'low', emoji: '💊', janAushadhi: 'Ivermectin 6mg (₹10–18/tablet)' },

  // ── Antiepileptic ─────────────────────────────────────────────
  { id: 57, name: 'Sodium Valproate', generic: 'Valproic Acid / Sodium Valproate', category: 'Antiepileptic', brandNames: ['Epilex', 'Valprol', 'Depakene', 'Encorate'], uses: 'Epilepsy (all seizure types), bipolar disorder (mood stabiliser), migraine prevention.', dosage: 'Epilepsy: 200–400mg twice daily initially; up to 1000–2500mg/day. Monitored by serum levels.', sideEffects: 'Weight gain, hair thinning, tremor, nausea, liver enzyme elevation, polycystic ovary risk.', warnings: '⚠️ HIGHLY TERATOGENIC — causes serious birth defects. MUST NOT be used in women of childbearing potential without strict contraception and specialist oversight. Regular liver function monitoring required.', interactions: 'Carbamazepine, phenytoin, aspirin (increases valproate levels), lamotrigine (increase lamotrigine levels).', contraindications: 'Pregnancy (major birth defects), liver disease, family history of liver problems with valproate.', severity: 'high', emoji: '🧠', janAushadhi: 'Sodium Valproate 200mg (₹15–22/strip)' },
  { id: 58, name: 'Levetiracetam', generic: 'Levetiracetam', category: 'Antiepileptic', brandNames: ['Keppra', 'Levera', 'Levetiracetam Cipla', 'Eviracetam'], uses: 'Partial (focal) seizures, myoclonic seizures, tonic-clonic seizures, adjunct therapy.', dosage: 'Adults: start 250–500mg twice daily; increase to 1000–1500mg twice daily as needed.', sideEffects: 'Drowsiness, dizziness, behavioural changes (irritability, depression), headache.', warnings: '⚠️ Mood/behavioural changes are common — report to doctor. Do not stop abruptly. Psychiatric monitoring recommended, especially in patients with prior mental health issues.', interactions: 'Carbamazepine, phenytoin, probenecid (reduces renal clearance).', contraindications: 'Severe kidney impairment (dose reduction). Caution in psychiatric history.', severity: 'medium', emoji: '🧠', janAushadhi: 'Levetiracetam 250mg (₹25–40/strip)' },

  // ── Steroids ──────────────────────────────────────────────────
  { id: 59, name: 'Prednisolone', generic: 'Prednisolone', category: 'Corticosteroid', brandNames: ['Omnacortil', 'Wysolone', 'Deltacortril'], uses: 'Allergic reactions, asthma exacerbations, autoimmune conditions (SLE, rheumatoid arthritis), inflammatory bowel disease, severe asthma.', dosage: 'Adults: 5–60mg/day depending on condition. Taper slowly when stopping long-term therapy.', sideEffects: 'Weight gain, increased blood sugar, mood swings, insomnia, increased infection risk, osteoporosis (long-term), adrenal suppression.', warnings: '⚠️ NEVER stop abruptly after prolonged use (adrenal crisis). Avoid live vaccines. Carry steroid card. Increases blood glucose significantly in diabetics — monitor closely.', interactions: 'NSAIDs (GI bleeding risk), vaccines (reduced immune response), antifungals (increase steroid levels), rifampicin (reduces efficacy).', contraindications: 'Systemic infections (without antimicrobials), live vaccines during therapy.', severity: 'high', emoji: '⚠️', janAushadhi: 'Prednisolone 5mg (₹5–8/strip)' },
  { id: 60, name: 'Dexamethasone', generic: 'Dexamethasone', category: 'Corticosteroid (Potent)', brandNames: ['Decadron', 'Dexona', 'Defcort', 'Dexoren'], uses: 'Severe allergic reactions, cerebral oedema, COVID-19 (severe), anti-nausea (chemotherapy), croup, antenatal lung maturation.', dosage: 'Anti-inflammatory: 0.5–20mg/day IV/oral. COVID-19 (severe): 6mg once daily for up to 10 days.', sideEffects: 'Same as prednisolone but more potent. Significant hyperglycaemia.', warnings: '⚠️ Very potent — 25× more potent than cortisol. Same warnings as prednisolone, with heightened caution. Must be tapered gradually.', interactions: 'Same as prednisolone. Also: cyclosporine, anticoagulants (variable effects).', contraindications: 'Systemic infections without coverage, live vaccines. Caution in diabetes, peptic ulcers.', severity: 'high', emoji: '⚠️', janAushadhi: 'Dexamethasone 0.5mg (₹4–7/strip)' },

  // ── Antimalarial ──────────────────────────────────────────────
  { id: 61, name: 'Chloroquine / Hydroxychloroquine', generic: 'Hydroxychloroquine Sulphate', category: 'Antimalarial / Antirheumatic', brandNames: ['Plaquenil', 'HCQS', 'Hydroxychloroquine Cipla'], uses: 'Malaria treatment & prevention, rheumatoid arthritis, systemic lupus erythematosus (SLE), Sjögren\'s syndrome.', dosage: 'RA/SLE: 200–400mg/day (max 5mg/kg/day). Malaria prophylaxis: 400mg weekly, started 1–2 weeks before travel.', sideEffects: 'GI upset, skin rash, headache. Long-term: retinal toxicity (maculopathy), QT prolongation.', warnings: '⚠️ Annual eye examination essential for long-term use (retinal toxicity). Avoid in QT prolongation. Avoid concurrent drugs that lower seizure threshold.', interactions: 'QT-prolonging drugs (serious), antacids (reduce absorption), digoxin, ciclosporin.', contraindications: 'Retinal disease, G6PD deficiency (malaria indication), porphyria, QT prolongation.', severity: 'medium', emoji: '💊', janAushadhi: 'Hydroxychloroquine 200mg (₹15–25/strip)' },

  // ── Cough & Cold ──────────────────────────────────────────────
  { id: 62, name: 'Dextromethorphan', generic: 'Dextromethorphan HBr', category: 'Cough Suppressant', brandNames: ['Delsym', 'Robitussin DM', 'Dextopen', 'Koflet-DX'], uses: 'Dry, non-productive cough relief; cough associated with cold, flu, and bronchitis.', dosage: 'Adults: 10–30mg every 4–8 hours. Max: 120mg/day. Do NOT use for productive cough.', sideEffects: 'Dizziness, drowsiness, nausea, stomach upset.', warnings: '⚠️ Do not use for productive cough (expectorant needed instead). Can cause "DXM abuse" in high doses — keep away from adolescents.', interactions: 'MAOIs (severe serotonin syndrome — contraindicated), SSRIs, other CNS depressants.', contraindications: 'MAOIs within 14 days, chronic bronchitis/COPD (suppresses needed cough reflex), productive cough.', severity: 'low', emoji: '🫁', janAushadhi: 'Dextromethorphan 15mg (₹5–8/strip)' },
];

/* ── Derived categories ───────────────────────────────────── */
const CATEGORIES = ['All', ...new Set(MEDICATIONS.map(m => m.category.split(' (')[0].trim()))];

const SEVERITY_STYLES = {
  low:    { bg: '#f0fdf4', color: '#15803d', border: '#a7f3d0', label: '🟢 Low Risk' },
  medium: { bg: '#fff7ed', color: '#c2410c', border: '#fed7aa', label: '🟡 Moderate Risk' },
  high:   { bg: '#fff1f2', color: '#e11d48', border: '#fecdd3', label: '🔴 High Risk – Use Caution' },
};

/* ─── WhatsApp Share for a medicine ─────────────────────────── */
const shareMedViaWhatsApp = (med) => {
  const message =
`💊 *${med.name}* (${med.generic})
📋 *Category:* ${med.category}

✅ *Uses:* ${med.uses}

⚖️ *Dosage:* ${med.dosage}

⚠️ *Key Warning:* ${med.warnings}

🏛️ *Jan Aushadhi Generic:* ${med.janAushadhi || med.generic + ' (available at Jan Aushadhi Kendras)'}

_Source: Dr. AI Medication Reference — Guwahati, Assam_
_⚠️ Always consult a doctor or pharmacist before taking any medicine._`;

  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank', 'noreferrer');
};

/* ─── Jan Aushadhi Section (collapsible) ────────────────────── */
const JanAushadhiSection = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="jan-aushadhi-section" style={{ marginTop: '1.25rem' }}>
      <button className="jan-aushadhi-toggle" onClick={() => setOpen(p => !p)}>
        <span>🏥 Affordable Alternatives &amp; Nearby Guwahati Pharmacies (Jan Aushadhi Hubs)</span>
        <span className={`jan-aushadhi-toggle-chevron ${open ? 'open' : ''}`}>▼</span>
      </button>
      {open && (
        <div className="jan-aushadhi-body">
          <div className="jan-aushadhi-tip">
            💡 <strong>Save 50–90%</strong> by asking your pharmacist for generic equivalents at Jan Aushadhi Kendras.
            These are government-approved, same-formula medicines. Toll-free: <strong>1800-111-255</strong>
          </div>
          <div style={{ fontWeight: 700, fontSize: '0.78rem', color: '#065f46', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.625rem' }}>
            📍 Jan Aushadhi Kendras in Guwahati
          </div>
          <div className="jan-aushadhi-grid">
            {JAN_AUSHADHI_KENDRAS.map(k => (
              <div key={k.name} className="jan-aushadhi-card">
                <div className="jan-aushadhi-card-name">{k.name}</div>
                <div className="jan-aushadhi-card-area">📍 {k.area}</div>
                <div style={{ fontSize: '0.68rem', color: '#6b7280', marginTop: '0.15rem' }}>{k.note}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */
const MedicationInfo = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery]     = useState('');
  const [selectedCategory, setCategory]  = useState('All');
  const [expandedId, setExpandedId]      = useState(null);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return MEDICATIONS.filter(med => {
      const matchSearch = !q ||
        med.name.toLowerCase().includes(q) ||
        med.generic.toLowerCase().includes(q) ||
        med.brandNames.some(b => b.toLowerCase().includes(q)) ||
        med.uses.toLowerCase().includes(q) ||
        med.category.toLowerCase().includes(q);
      const catKey = med.category.split(' (')[0].trim();
      const matchCat = selectedCategory === 'All' || catKey === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="medication-info-page">
      <style>{`
        .med-header { text-align: center; margin-bottom: 2rem; }
        .med-header-badge { display: inline-flex; align-items: center; gap: 0.5rem; background: linear-gradient(135deg, rgba(147,51,234,0.1), rgba(37,99,235,0.08)); border: 1px solid rgba(147,51,234,0.2); color: #7c3aed; padding: 0.35rem 1rem; border-radius: 999px; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 1rem; }
        .med-header h1 { font-family: 'Outfit', sans-serif; font-size: clamp(1.8rem, 3vw, 2.4rem); font-weight: 800; color: #0f172a; margin-bottom: 0.5rem; letter-spacing: -0.02em; }
        .med-header p { color: #64748b; font-size: 1rem; max-width: 560px; margin: 0 auto; }
        .med-stats { display: flex; gap: 2rem; justify-content: center; flex-wrap: wrap; margin: 1rem 0 2rem; }
        .med-stat-num { font-family: 'Outfit', sans-serif; font-size: 1.6rem; font-weight: 800; color: #0f172a; text-align: center; }
        .med-stat-label { font-size: 0.75rem; color: #64748b; font-weight: 500; text-align: center; }
        .med-search-bar { display: flex; gap: 0.75rem; margin-bottom: 1.25rem; align-items: center; flex-wrap: wrap; }
        .med-cat-tabs { display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 1.75rem; }
        .med-cat-btn { padding: 0.4rem 0.875rem; border-radius: 999px; border: 2px solid #e2e8f0; background: white; font-size: 0.78rem; font-weight: 600; cursor: pointer; transition: all 0.18s; color: #64748b; font-family: 'Inter', sans-serif; }
        .med-cat-btn.active { background: linear-gradient(135deg, #7c3aed, #2563eb); color: white; border-color: transparent; box-shadow: 0 3px 12px rgba(124,58,237,0.28); }
        .med-cat-btn:hover:not(.active) { border-color: #7c3aed; color: #7c3aed; }
        .med-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 1.25rem; align-items: start; }
        .med-card { background: white; border-radius: 1.25rem; border: 1px solid #e2e8f0; box-shadow: 0 2px 10px rgba(0,0,0,0.05); transition: box-shadow 0.22s, border-color 0.22s, transform 0.22s; overflow: hidden; }
        .med-card:hover { box-shadow: 0 8px 28px rgba(15,23,42,0.1); border-color: rgba(124,58,237,0.2); transform: translateY(-3px); }
        .med-card-header { padding: 1.25rem 1.5rem; cursor: pointer; display: flex; align-items: flex-start; gap: 1rem; position: relative; }
        .med-body-inner { max-width: 760px; margin: 0 auto; }
        .med-emoji { width: 52px; height: 52px; border-radius: 0.875rem; background: linear-gradient(135deg, #faf5ff, #eff6ff); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; flex-shrink: 0; border: 1px solid #e9d5ff; }
        .med-card-meta { flex: 1; min-width: 0; }
        .med-name { font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 1.05rem; color: #0f172a; margin-bottom: 0.15rem; }
        .med-generic { color: #94a3b8; font-size: 0.78rem; margin-bottom: 0.4rem; }
        .med-cat-badge { display: inline-block; font-size: 0.7rem; font-weight: 700; padding: 0.2rem 0.6rem; border-radius: 999px; background: #f5f3ff; color: #7c3aed; }
        .med-chevron { color: #94a3b8; font-size: 0.9rem; transition: transform 0.25s; flex-shrink: 0; margin-top: 0.25rem; }
        .med-chevron.open { transform: rotate(180deg); }
        .med-body { padding: 0 1.5rem 1.5rem; border-top: 1px solid #f1f5f9; }
        .med-row { margin-top: 1rem; }
        .med-row-label { font-size: 0.72rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 0.3rem; display: flex; align-items: center; gap: 0.4rem; }
        .med-row-text { font-size: 0.875rem; color: #334155; line-height: 1.6; }
        .warning-box { background: #fff7ed; border: 1px solid #fed7aa; border-radius: 0.5rem; padding: 0.7rem 0.875rem; margin-top: 0.75rem; font-size: 0.82rem; color: #92400e; line-height: 1.6; }
        .high-warning { background: #fff1f2; border-color: #fecdd3; color: #9f1239; }
        .brands-row { display: flex; gap: 0.4rem; flex-wrap: wrap; margin-top: 0.5rem; }
        .brand-tag { background: #f1f5f9; color: #475569; padding: 0.2rem 0.625rem; border-radius: 999px; font-size: 0.75rem; font-weight: 500; }
        .med-count { color: #64748b; font-size: 0.85rem; margin-bottom: 1rem; }
        .med-ja-row { display: flex; align-items: center; gap: 0.5rem; margin-top: 0.875rem; padding: 0.625rem 0.875rem; background: #f0fdf4; border: 1px solid #a7f3d0; border-radius: 0.5rem; }
        .med-ja-label { font-size: 0.7rem; font-weight: 700; color: #065f46; }
        .med-ja-text { font-size: 0.78rem; color: #047857; }
        .med-share-row { display: flex; gap: 0.625rem; flex-wrap: wrap; margin-top: 1.25rem; align-items: center; }
        @media (max-width: 640px) { .med-cards { grid-template-columns: 1fr; } }
      `}</style>

      <div className="medication-content-container">
        {/* Header */}
        <div className="med-header">
          <div className="med-header-badge">💊 Medication Reference</div>
          <h1>Medication Information</h1>
          <p>Comprehensive reference for {MEDICATIONS.length}+ essential medicines — dosage, side effects, interactions, safety warnings, and Jan Aushadhi generic alternatives.</p>
        </div>

        {/* Stats */}
        <div className="med-stats">
          {[
            { num: `${MEDICATIONS.length}+`, label: 'Medications' },
            { num: `${CATEGORIES.length - 1}`, label: 'Categories' },
            { num: '100%', label: 'Free to Access' },
            { num: `${JAN_AUSHADHI_KENDRAS.length}`, label: 'Jan Aushadhi Locations' },
          ].map(s => (
            <div key={s.label}>
              <div className="med-stat-num">{s.num}</div>
              <div className="med-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Educational Warning Banner */}
        <div className="edu-warning-banner" role="alert" style={{ marginBottom: '1.5rem' }}>
          <span className="edu-warning-banner-icon">⚕️</span>
          <div className="edu-warning-banner-text">
            <strong>Disclaimer: For Educational Purposes Only</strong>
            <p>This medication information is for general educational reference only. Always consult a licensed pharmacist or doctor before taking any medicine. Dosages vary by individual.</p>
          </div>
        </div>

        {/* Search */}
        <div className="med-search-bar">
          <input
            type="text"
            placeholder="🔍  Search by name, brand, category, or condition…"
            className="medication-search-input"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            id="medication-search"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ background: '#f1f5f9', border: 'none', borderRadius: '999px', padding: '0.65rem 1rem', cursor: 'pointer', color: '#64748b', fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap' }}
            >
              ✕ Clear
            </button>
          )}
        </div>

        {/* Category Tabs */}
        <div className="med-cat-tabs">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`med-cat-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <p className="med-count">
          Showing <strong>{filtered.length}</strong> of {MEDICATIONS.length} medications
          {searchQuery && ` for "${searchQuery}"`}
        </p>

        {/* Cards */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <p style={{ fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>No medications found</p>
            <p style={{ fontSize: '0.875rem' }}>Try a different search term or category.</p>
          </div>
        ) : (
          <div className="med-cards">
            {filtered.map((med, idx) => {
              const sc     = SEVERITY_STYLES[med.severity];
              const isOpen = expandedId === med.id;
              return (
                <div
                  key={med.id}
                  className="med-card"
                  style={{
                    animation: `fadeInUp 0.45s ease ${(idx % 6) * 0.06}s both`,
                    gridColumn: isOpen ? '1 / -1' : 'auto',
                    transition: 'grid-column 0s',
                  }}
                >
                  <div className="med-card-header" onClick={() => setExpandedId(isOpen ? null : med.id)}>
                    <div className="med-emoji">{med.emoji}</div>
                    <div className="med-card-meta">
                      <div className="med-name">{med.name}</div>
                      <div className="med-generic">{med.generic}</div>
                      <span className="med-cat-badge">{med.category.split(' (')[0]}</span>
                      <div style={{ marginTop: '0.4rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <span style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, padding: '0.15rem 0.5rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 700 }}>
                          {sc.label}
                        </span>
                        {med.janAushadhi && (
                          <span className="generic-badge">🏛️ Jan Aushadhi</span>
                        )}
                      </div>
                    </div>
                    <span className={`med-chevron ${isOpen ? 'open' : ''}`}>▼</span>
                  </div>

                  {isOpen && (
                    <div className="med-body">
                    <div className="med-body-inner">
                      <div className="med-row">
                        <div className="med-row-label">🏷️ Brand Names</div>
                        <div className="brands-row">{med.brandNames.map(b => <span key={b} className="brand-tag">{b}</span>)}</div>
                      </div>
                      <div className="med-row">
                        <div className="med-row-label">✅ Uses &amp; Indications</div>
                        <div className="med-row-text">{med.uses}</div>
                      </div>
                      <div className="med-row">
                        <div className="med-row-label">⚖️ Typical Dosage</div>
                        <div className="med-row-text" style={{ background: '#f8fafc', padding: '0.625rem 0.875rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>{med.dosage}</div>
                      </div>
                      <div className="med-row">
                        <div className="med-row-label">⚡ Common Side Effects</div>
                        <div className="med-row-text">{med.sideEffects}</div>
                      </div>
                      <div className={`warning-box ${med.severity === 'high' ? 'high-warning' : ''}`}>{med.warnings}</div>
                      <div className="med-row">
                        <div className="med-row-label">🔄 Drug Interactions</div>
                        <div className="med-row-text">{med.interactions}</div>
                      </div>
                      <div className="med-row">
                        <div className="med-row-label">🚫 Contraindications</div>
                        <div className="med-row-text" style={{ color: '#be123c' }}>{med.contraindications}</div>
                      </div>

                      {/* Jan Aushadhi Generic Row */}
                      {med.janAushadhi && (
                        <div className="med-ja-row">
                          <span>🏛️</span>
                          <div>
                            <div className="med-ja-label">PM Jan Aushadhi Generic Alternative</div>
                            <div className="med-ja-text">{med.janAushadhi}</div>
                          </div>
                        </div>
                      )}

                      {/* Share & Consult Row */}
                      <div className="med-share-row">
                        <button
                          className="whatsapp-share-btn"
                          onClick={() => shareMedViaWhatsApp(med)}
                          style={{ fontSize: '0.78rem', padding: '0.6rem 1.1rem' }}
                        >
                          📲 Share via WhatsApp
                        </button>
                        <div style={{ fontSize: '0.73rem', color: '#78350f', background: '#fffbeb', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #fde68a', flex: 1 }}>
                          💡 Always consult a pharmacist or doctor before starting, stopping, or changing any medication.
                        </div>
                      </div>
                    </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Jan Aushadhi Section */}
        <JanAushadhiSection />

        <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
          <button className="back-btn" onClick={() => navigate('/')} style={{ display: 'inline-flex' }}>
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicationInfo;