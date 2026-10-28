
# NutriGuard 

# Personalized packaged food analysis application that evaluates product nutrition and ingredients

NutriGuard is a web application designed to help users understand packaged food products using nutrition information, ingredient analysis, and personalized health preferences.

The project aims to make food labels easier to understand and help users make more informed food choices.

## Features

- **Product Search:** Search for food products by name.
- **Barcode Lookup:** Retrieve product information using a barcode.
- **Manual Product Entry:** Add product details when a product cannot be found.
- **Nutrition Analysis:** Evaluate available nutrition information using rule-based logic.
- **Ingredient Image OCR:** Extract ingredient text from uploaded images.
- **Ingredient Analysis:** Identify and explain selected ingredients using the available ingredient-decoding logic.
- **Personalized Screening:** Consider selected health conditions and dietary preferences.

## Technology Stack

**Frontend**
- React
- Vite
- Tailwind CSS
- Lucide icons

**Backend**
- Node.js
- Express.js
- MongoDB
- Tesseract.js
- Sharp

**External Data**
- Open Food Facts

## Project Structure

```text
NutriGuard/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   └── data/
│   └── package.json
├── PROJECT_STATUS.md
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js and npm
- MongoDB connection
- Required environment variables for the backend

### 1. Clone the repository

```bash
git clone https://github.com/swarupa2007/NutriGuard.git
cd NutriGuard
```

### 2. Install dependencies

Install root dependencies if needed:

```bash
npm install
```

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies in a separate terminal:

```bash
cd frontend
npm install
```

### 3. Configure environment variables

Create a `.env` file in the backend directory and configure the environment variables required by your backend, such as your MongoDB connection string and API keys.

Never commit `.env` files or expose API keys publicly.

### 4. Run the application

Use the scripts defined in the root, backend, and frontend `package.json` files to start each service. Configure MongoDB and required environment variables before running the backend.

## Important Note

NutriGuard is an ongoing student project. Its nutrition rules and ingredient interpretations are intended for informational screening, not medical diagnosis or a substitute for professional advice. Results depend on the accuracy and completeness of the available product data.

## Future Improvements

- Improve nutrition scoring and missing-data handling.
- Expand ingredient references using authoritative sources.
- Integrate retrieval-augmented generation (RAG) for evidence-grounded ingredient explanations.
- Improve testing, deployment, and documentation.

## Author

Developed as a student project focused on food-label understanding and personalized nutrition screening.
