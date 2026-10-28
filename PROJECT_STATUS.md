# NutriGuard Project Status

## Project
NutriGuard — Packaged Food Analyzer

## Goal
Analyze packaged food products based on:
- Selected user profile
- Nutrition information
- Ingredients
- Additives

The system should provide a dynamic health-oriented analysis rather than hardcoded results.

---

# Tech Stack

## Frontend
- React
- Vite
- Tailwind CSS
- Lucide React Icons

## Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose

## External Data
- Open Food Facts

---

# User Profiles

Current mock users:

1. John Doe — 24
2. Jane Smith — 35
3. Alex Johnson — 52

Health conditions/toggles:

- Diabetes
- Hypertension
- Celiac Disease
- Vegan
- Lactose Intolerance
- Avoid Artificial Additives

---

# Product Data Standard

All nutrition values are standardized to per 100g.

Current structure:

```js
nutrition: {
  basis: "100g",
  calories,
  carbohydrates,
  totalSugar,
  addedSugar,
  fat,
  saturatedFat,
  transFat,
  protein,
  fiber,
  sodiumMg
}

Important rules:
- Missing nutrition values are null.
- Missing values must NOT be treated as zero.
- Do not bring back the old nested perServing / per100g structure.
- Nutrition structure should remain consistent across MongoDB, Open Food Facts data, manual products, and OCR products.
Ingredients use:
{
  name,
  id,
  vegan,
  vegetarian,
  percentage
}

Products also contain:
- ingredientsText
- additives
- barcode
- name
- description
- category
Backend
Backend location:
backend/

Server:
node server.js

Runs on:
http://localhost:5000

MongoDB connection is working.
DO NOT run the old seed script again because it can delete existing products.
Open Food Facts
Barcode flow
Route:
GET /api/products/barcode/:barcode

Flow:
1. Check MongoDB first.
2. If product exists, return MongoDB product.
3. If not found, fetch from Open Food Facts.
4. Normalize product.
5. Save product to MongoDB.
6. Return product.
Nutella barcode tested successfully:
3017620422003

Name Search
Route:
GET /api/products/search?name=

Current intended flow:
1. Search MongoDB first.
2. If matching product exists, return it.
3. If not, search Open Food Facts.
4. Normalize the result.
5. Save it to MongoDB.
6. Return the product.
Current Open Food Facts search endpoint being used:
https://search.openfoodfacts.org/search?q=

This endpoint was tested successfully for Oreo and returned JSON results.
Frontend Main Flow
Current intended user flow:
Search
   ↓
If found → Product selected
   ↓
Analyze

If Search fails
   ↓
Barcode
   ↓
If found → Product selected
   ↓
Analyze

If BOTH Search and Barcode fail
   ↓
Add Product tab appears
   ↓
User manually adds product

Input Tabs
File:
frontend/src/components/search/InputTabs.jsx

Current tabs:
Initially:
Search | Barcode

After both Search and Barcode fail:
Search | Barcode | Add Product

There is also an orange Product Not Found message after both methods fail.
Current message:
Product Not Found

This product was not found using Name Search or Barcode.
Please use the Add Product tab above to add it manually.

The old duplicate + Add Product Manually button has been removed.
The Add Product tab currently opens the existing OCRTab.
SearchTab
File:
frontend/src/components/search/SearchTab.jsx

Search failure callback behavior has been fixed.
When search fails:
onSearchResult(true)

When search succeeds:
onSearchResult(false)

BarcodeTab
File:
frontend/src/components/scanner/BarcodeTab.jsx

Current behavior:
- Empty barcode → failure
- Backend failure → failure
- Successful product → selected product
- onBarcodeResult(true) means failure
- onBarcodeResult(false) means success
MainWorkspace
File:
frontend/src/components/main/MainWorkspace.jsx

Passes:
- onAnalyze
- setSelectedProduct
to InputTabs.
App
File:
frontend/src/App.jsx

Important state:
selectedUser
selectedProduct
conditions
isAnalyzing
showResults

selectedProduct is shared between input methods and the result dashboard.
Current Analyze flow:
MainWorkspace
    ↓
Analyze Product
    ↓
AIProcessing
    ↓
ResultDashboard

Do not redesign this flow unless required.
ResultDashboard
File:
frontend/src/components/dashboard/ResultDashboard.jsx

Receives:
- selectedUser
- conditions
- selectedProduct
Displays:
- Product analysis
- Verdict
- Score
- Warnings
- Nutrition
- Profile information
If no product is selected, it currently shows:
No Product Selected
Please search for a valid product before analyzing

Current Product Addition Strategy
The original OCR approach attempted:
Ingredients image
+
Nutrition table image
↓
OCR
↓
Product

Nutrition-table OCR was found to be unreliable for accurate structured nutrition extraction.
Therefore the new MVP strategy is:
Manual nutrition entry per 100g
+
Ingredients image
↓
Ingredient OCR
↓
Combine data
↓
Create Product
↓
Save to MongoDB
↓
Analyze Product

This avoids depending on unreliable nutrition-table OCR.
OCRTab Current State
File:
frontend/src/components/ocr/OCRTab.jsx

The current file still contains the OLD nutrition-image workflow.
Current state variables originally include:
const [ingredientsFile, setIngredientsFile] = useState(null);
const [nutritionFile, setNutritionFile] = useState(null);

We have JUST removed:
const [nutritionFile, setNutritionFile] = useState(null);

So the next task is to remove the remaining nutrition-image logic and replace it with manual nutrition input.
DO NOT rewrite the entire OCR system unnecessarily.
Current OCR Backend
Existing route:
POST /api/ocr/upload

Existing OCR flow was designed for:
ingredientsImage
nutritionImage

This will need to be changed later because the new MVP only needs ingredient-image OCR.
Manual Product MVP
Planned manual product fields:
Product information
- Product name
- Brand
- Category
Nutrition per 100g
- Calories
- Carbohydrates
- Total Sugar
- Added Sugar
- Fat
- Saturated Fat
- Trans Fat
- Protein
- Fiber
- Sodium
Ingredients
- Ingredients image
- OCR extracted ingredients text
The product should eventually be saved to MongoDB.
Important Design Decisions
Do NOT add yet
- Community submission counts
- Verification status
- Admin approval workflow
- Community voting
- Complex verification system
These are future-scope features.
If an unknown product/brand is manually added, the MVP can simply treat it as a new product.
Current Immediate Task
We are currently editing:
frontend/src/components/ocr/OCRTab.jsx

The first change already completed:
const [nutritionFile, setNutritionFile] = useState(null);

was removed.
Next:
1. Remove remaining nutrition-image UI/state references.
2. Add manual nutrition form per 100g.
3. Keep ingredients image upload.
4. Send ingredients image to OCR.
5. Combine manual nutrition + OCR ingredients.
6. Create standardized product object.
7. Save the new product to MongoDB.
8. Select the product.
9. Analyze it.
10. Later verify that searching the same product retrieves it from MongoDB.
Development Workflow
When continuing NutriGuard:
1. Preserve working functionality.
2. Do not redesign architecture unnecessarily.
3. Explain WHY a change is needed.
4. When several related changes belong to the SAME file, give them together rather than splitting every line into separate turns.
5. Before modifying a file whose current version is unknown, ask for the current file.
6. After completing a logical group of changes, test it before moving forward.
7. Use d as confirmation that the requested changes are completed.
8. Keep the implementation beginner-understandable and interview-defensible.
9. Finish MVP first; deeper conceptual learning can happen afterward.
Deployment Goal
Final goal:
NutriGuard
   ↓
Working frontend
   ↓
Working backend
   ↓
MongoDB
   ↓
Open Food Facts
   ↓
Manual product fallback
   ↓
Dynamic analysis
   ↓
Deployment

The project should be deployed successfully and remain technically explainable during interviews.