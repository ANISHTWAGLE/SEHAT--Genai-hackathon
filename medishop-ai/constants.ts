import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'm1',
    name: 'Paracetamol (Acetaminophen)',
    category: 'Fever & Pain',
    price: 30.00,
    description: 'Widely used for fever reduction and mild to moderate pain relief. Gentle on the stomach.',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80', // Classic blister pack
    benefits: ['Reduces Fever', 'Headache Relief', 'Safe for most']
  },
  {
    id: 'm2',
    name: 'Ibuprofen 400mg',
    category: 'Pain & Inflammation',
    price: 45.00,
    description: 'Non-steroidal anti-inflammatory drug (NSAID) for treating pain, fever, and inflammation.',
    image: 'https://images.unsplash.com/photo-1550572788-ccfa117b5921?auto=format&fit=crop&w=800&q=80', // Distinct red pills
    benefits: ['Anti-inflammatory', 'Muscle Pain', 'Joint Pain']
  },
  {
    id: 'm3',
    name: 'Diclofenac Sodium',
    category: 'Pain Relief',
    price: 55.00,
    description: 'Effective for joint pain, muscular pain, and inflammation. Often prescribed for arthritis.',
    image: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&w=800&q=80', // White tablets
    benefits: ['Joint Pain', 'Swelling Reduction', 'Arthritis Care']
  },
  {
    id: 'm4',
    name: 'Amoxicillin + Clavulanate',
    category: 'Antibiotics',
    price: 180.00,
    description: 'Broad-spectrum antibiotic for bacterial infections (respiratory, ear, urinary).',
    image: 'https://images.unsplash.com/photo-1471864190280-a9413061558c?auto=format&fit=crop&w=800&q=80', // Capsules
    benefits: ['Bacterial Infection', 'Respiratory Tract', 'Doctor Prescribed']
  },
  {
    id: 'm5',
    name: 'Azithromycin 500mg',
    category: 'Antibiotics',
    price: 120.00,
    description: 'Treats respiratory infections, throat infections, and other bacterial conditions. Short course.',
    image: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&w=800&q=80', // Medicine close up (amber bottle context)
    benefits: ['Once Daily', 'Throat Infection', 'Fast Acting']
  },
  {
    id: 'm6',
    name: 'Metformin 500mg',
    category: 'Diabetes Care',
    price: 40.00,
    description: 'First-line medication for type-2 diabetes management and blood sugar control.',
    image: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&w=800&q=80', // Scattered white pills
    benefits: ['Blood Sugar Control', 'Diabetes Management', 'Long-term Safety']
  },
  {
    id: 'm7',
    name: 'Atorvastatin 10mg',
    category: 'Heart Health',
    price: 95.00,
    description: 'Lipid-lowering medication. Reduces bad cholesterol and risk of heart disease.',
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=800&q=80', // Professional pharmacy shot
    benefits: ['Lowers Cholesterol', 'Heart Protection', 'Lipid Profile']
  },
  {
    id: 'm8',
    name: 'Omeprazole 20mg',
    category: 'Gastrointestinal',
    price: 60.00,
    description: 'Treats acid reflux, gastric ulcers, and heartburn by reducing stomach acid.',
    image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=800&q=80', // Capsules in hand
    benefits: ['Acid Reflux', 'Heartburn Relief', 'Ulcer Healing']
  },
  {
    id: 'm9',
    name: 'Amlodipine 5mg',
    category: 'Hypertension',
    price: 35.00,
    description: 'Calcium channel blocker for high blood pressure and chest pain (angina).',
    image: 'https://images.unsplash.com/photo-1563213126-a4273aed2016?auto=format&fit=crop&w=800&q=80', // Boxed/Packaged medicine
    benefits: ['Controls BP', 'Heart Health', 'Chest Pain Relief']
  },
  {
    id: 'm10',
    name: 'Levocetirizine',
    category: 'Allergy',
    price: 50.00,
    description: 'Non-drowsy antihistamine for allergic rhinitis, seasonal allergies, and skin rashes.',
    image: 'https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?auto=format&fit=crop&w=800&q=80', // Small pills
    benefits: ['Allergy Relief', 'Runny Nose', 'Sneezing']
  },
  {
    id: 'm11',
    name: 'Cefixime 200mg',
    category: 'Antibiotics',
    price: 150.00,
    description: 'Oral cephalosporin antibiotic for respiratory and urinary tract infections.',
    image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=800&q=80', // Pharmacy shelf background
    benefits: ['Broad Spectrum', 'UTI Relief', 'Respiratory Care']
  },
  {
    id: 'm12',
    name: 'Pantoprazole 40mg',
    category: 'Gastrointestinal',
    price: 80.00,
    description: 'Proton-pump inhibitor (PPI) for GERD, acidity, and stomach ulcers.',
    image: 'https://images.unsplash.com/photo-1551190463-8a30641113e6?auto=format&fit=crop&w=800&q=80', // Hand holding pills
    benefits: ['GERD Relief', 'Acidity Control', 'Stomach Comfort']
  },
  {
    id: 'm13',
    name: 'Losartan 50mg',
    category: 'Heart Health',
    price: 70.00,
    description: 'Treats high blood pressure and protects kidneys in diabetic patients.',
    image: 'https://images.unsplash.com/photo-1583088580009-2d947c3e9e2e?auto=format&fit=crop&w=800&q=80', // Assorted pills
    benefits: ['BP Control', 'Kidney Protection', 'Cardiovascular']
  },
  {
    id: 'm14',
    name: 'Glimepiride 1mg',
    category: 'Diabetes Care',
    price: 55.00,
    description: 'Used for type-2 diabetes to help control blood sugar levels by increasing insulin.',
    image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&w=800&q=80', // Medical context
    benefits: ['Insulin Secretion', 'Sugar Control', 'Daily Use']
  },
  {
    id: 'm15',
    name: 'Cough & Cold Syrup',
    category: 'Cold & Flu',
    price: 110.00,
    description: 'Relief for common cold, cough, and flu-like symptoms. Contains decongestants.',
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80', // Liquid bottle
    benefits: ['Cough Relief', 'Soothing', 'Cold Symptoms']
  }
];