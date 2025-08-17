🌿 FoodPrint API
An API to estimate the carbon footprint of food dishes and their ingredients, powered by Google's Gemini API and a robust backend infrastructure.

✨ Features
Image-based Analysis: Upload an image of a food dish to receive a detailed carbon footprint estimate of its components.

Text-based Analysis: Get a carbon footprint estimate for a specific dish by providing its name directly.

Intelligent Ingredient Inference: Uses a large language model (LLM) to intelligently infer ingredients from both images and dish names.

Data Caching: Utilizes Redis to cache common requests, reducing API costs and improving response times.

Containerized Development: Uses Docker and Docker Compose for a consistent, isolated development environment.

💻 Technology Stack
Backend: Node.js & Express

Language: TypeScript

LLM Integration: Google Gemini API

Caching: Redis

Containerization: Docker & Docker Compose

Logging: Pino (with pino-http)

Data Validation: Zod

🚀 Getting Started
Follow these steps to get the project up and running.

Prerequisites
Node.js (v18 or higher)

Docker & Docker Compose

A Google Gemini API key.

1. Clone the Repository
git clone https://github.com/suryasardar/Carbon-Footprint-Estimator.git
cd foodprint-api

2. Environment Setup
Create a .env file in the root directory and add the following variables.

For development with Docker Compose:

PORT=3000

RATE_LIMIT_PER_MINUTE=5

MAX_UPLOAD_MB=5

CORS_ORIGINS=http://localhost:5173,http://localhost:3000

GEMINI_API_KEY=<YOUR_GEMINI_API_KEY>

REDIS_HOST=redis

REDIS_PORT=6379

For local development (without Docker Compose):

PORT=3000

RATE_LIMIT_PER_MINUTE=5

MAX_UPLOAD_MB=5

CORS_ORIGINS=http://localhost:5173,http://localhost:3000

GEMINI_API_KEY=<YOUR_GEMINI_API_KEY>

REDIS_HOST=127.0.0.1

REDIS_PORT=6379

Note: The REDIS_HOST value is crucial. redis is used for inter-container communication, while 127.0.0.1 is for local machine access.

3. Installation
Install the project dependencies.

npm install

4. Running the Application
There are two primary ways to run the application:



# Build and start all services

sudo docker compose -f docker-compose.dev.yml up --build

A. With Docker Compose (Recommended)

This method runs all services (API and Redis) in isolated containers.

B. Locally (Requires a local Redis instance)

This method runs the API directly on your machine. Ensure a Redis instance is running on 127.0.0.1:6379 beforehand.
npm run dev


# Start the API server

The API will be available at http://localhost:3000.

📝 API Endpoints

The API provides two main endpoints for carbon footprint estimation.

1. Estimate Footprint from Image
   
Calculates the footprint of a dish by analyzing an uploaded image.

Endpoint: POST /estimate/image

Content-Type: multipart/form-data

Request: A file upload with the field name image.

Example Request (using Postman):

Set the request method to POST.

Enter the URL: http://localhost:3000/estimate/image

Navigate to the Body tab and select form-data.

In the key-value editor, set the Key to image and select the type as File.

Click Select File and choose your image file.

Click Send.

Example Response (Success):

{
    "dish": "Chicken Curry",
    "estimated_carbon_kg": 2.5,
    "ingredients": [
        {
            "name": "chicken",
            "carbon_kg": 2.0
        },
        {
            "name": "Oil",
            "carbon_kg": 0.5
        }
    ]
}

Example Response (Error - Not a food image):

{
    "error": "The provided image does not contain food. Please upload an image of a food dish."
}

2. Estimate Footprint from Dish Name
   
Calculates the footprint of a dish from a name provided in the request body.

Endpoint: POST /estimate

Content-Type: application/json

Example Request (using Postman):

Set the request method to POST.

Enter the URL: http://localhost:3000/estimate

Navigate to the Body tab and select raw.

From the dropdown next to raw, choose JSON.

Enter the following JSON object in the text editor:

{
  "dish": "Chicken Biryani"
}


Click Send.

Example Response (Success):

{
    "dish": "Chicken Biryani",
    "estimated_carbon_kg": 1.7,
    "ingredients": [
        {
            "name": "Chicken",
            "carbon_kg": 0.5
        },
        {
            "name": "Rice",
            "carbon_kg": 1.2
        }
    ]
}

Example Response (Error - Dish not found):

{
    "error": "The provided dish was not recognized. Please provide a valid food dish."
}

💡 Key Design Decisions

Loose Coupling: The infer and compute functions are separate, making the system modular. You can easily swap out the LLM (or even the data source) without changing the core footprint calculation logic.

Graceful Degradation: Instead of crashing, the code handles non-food images and invalid dish names by returning a specific error message. This provides a better experience for the API consumer and prevents server failures.

Predictable LLM Response: By explicitly instructing the LLM to return an empty array [] for unrecognized dishes, we make the API's behavior predictable and easier to handle in the downstream code.

⚠️ Limitations & Production Considerations

Carbon Footprint Data: The current carbon data (lookupCarbon and getDishCarbonKg) is a placeholder and should be replaced with a robust, well-researched database for production.

Scalability: The current implementation is single-threaded. For heavy traffic, consider a more scalable architecture with message queues for image processing and a load balancer.

API Key Management: The Gemini API key is stored in a .env file. For a production environment, this should be managed using a secure secrets management system.

LLM Performance & Costs: API calls to the LLM can be slow and costly. The Redis cache helps mitigate this, but further optimization or pre-computation may be necessary for high-volume use.
