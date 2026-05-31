# AWS Deployment Guide

This guide provides step-by-step instructions for deploying the **Smart Tourist Safety Monitoring System** components to Amazon Web Services (AWS) using industry best practices.

---

## 🏗️ Architecture Overview

* **Frontend**: React application built with Vite, hosted on **Amazon S3** (static hosting) and distributed globally via **Amazon CloudFront** (CDN).
* **Backend**: Express.js server hosted in a Docker container on **Amazon ECS (Elastic Container Service) with AWS Fargate**.
* **ML Service**: FastAPI Python service hosted in a Docker container on **Amazon ECS (Elastic Container Service) with AWS Fargate**.
* **Database**: **MongoDB Atlas** (recommended for production) or **Amazon DocumentDB**.
* **Blockchain**: Persistent Ethereum RPC node via **Infura, Alchemy, or Amazon Managed Blockchain**.
* **Routing & Traffic**: **Application Load Balancer (ALB)** distributing traffic to ECS tasks, with domain names managed via **Amazon Route 53**.

---

## 🛠️ Step 1: Database Setup (MongoDB Atlas)

1. Sign up/log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new shared cluster (M0 free-tier or paid M10+).
3. Under **Network Access**, add `0.0.0.0/0` temporarily (or limit it later to your AWS ECS security group).
4. Under **Database Access**, create a user with read/write privileges.
5. Copy your connection string: `mongodb+srv://<username>:<password>@cluster.mongodb.net/tourist_safety`.

---

## 🚀 Step 2: Containerize and Push to Amazon ECR

You will need the AWS CLI and Docker installed on your local machine.

### 1. Create ECR Repositories
Create repositories for your backend and ML services:
```bash
aws ecr create-repository --repository-name smart-tourist-backend --region us-east-1
aws ecr create-repository --repository-name smart-tourist-ml-service --region us-east-1
```

### 2. Build & Push Backend Container
```bash
# Login to AWS ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com

# Build the Backend image
cd backend
docker build -t smart-tourist-backend .

# Tag & Push to ECR
docker tag smart-tourist-backend:latest <AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/smart-tourist-backend:latest
docker push <AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/smart-tourist-backend:latest
```

### 3. Build & Push ML Service Container
```bash
# Build the ML image
cd ../ml-service
docker build -t smart-tourist-ml-service .

# Tag & Push to ECR
docker tag smart-tourist-ml-service:latest <AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/smart-tourist-ml-service:latest
docker push <AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/smart-tourist-ml-service:latest
```

---

## 🌐 Step 3: Deploy Services on Amazon ECS (Fargate)

We will set up an ECS Cluster running backend and ML containers.

### 1. Create ECS Cluster
1. Open the **Amazon ECS Console**.
2. Click **Create Cluster**. Choose **Fargate (Serverless)** and name it `smart-tourist-cluster`.

### 2. Define ML Service Task Definition
1. Under ECS, select **Task Definitions** > **Create new Task Definition**.
2. Name it `smart-tourist-ml-task`. Select **Fargate**.
3. **Task Size**: `0.5 vCPU` and `1.0 GB RAM`.
4. **Container definition**:
   * Name: `ml-container`
   * Image URI: `<AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/smart-tourist-ml-service:latest`
   * Port Mapping: Container Port `8000` (TCP).
5. Click **Create**.

### 3. Define Backend Service Task Definition
1. Select **Create new Task Definition**.
2. Name it `smart-tourist-backend-task`. Select **Fargate**.
3. **Task Size**: `0.5 vCPU` and `1.0 GB RAM`.
4. **Container definition**:
   * Name: `backend-container`
   * Image URI: `<AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/smart-tourist-backend:latest`
   * Port Mapping: Container Port `5000` (TCP).
   * **Environment Variables**:
     * `NODE_ENV`: `production`
     * `PORT`: `5000`
     * `MONGO_URI`: `<YOUR_MONGODB_ATLAS_URI>`
     * `JWT_SECRET`: `<YOUR_SECURE_JWT_SECRET>`
     * `ML_SERVICE_URL`: `http://ml-service.local:8000/predict` (Configure AWS Cloud Map for internal communication or use the internal ALB target group DNS)
     * `BLOCKCHAIN_RPC_URL`: `<YOUR_ALCHEMY_OR_INFURA_RPC_URL>`
     * `BLOCKCHAIN_PRIVATE_KEY`: `<YOUR_DEPLOYER_PRIVATE_WALLET_KEY>`
     * `CONTRACT_ADDRESS`: `<DEPLOYED_TOURIST_IDENTITY_CONTRACT_ADDRESS>`
5. Click **Create**.

### 4. Create ECS Services
Create services within your cluster:
* Deploy the **ML Service** as a Fargate service mapping port `8000`.
* Deploy the **Backend Service** as a Fargate service mapping port `5000` behind an **Application Load Balancer (ALB)**.
* **Important**: Ensure the ALB allows traffic on port `5000` and configures target group health checks pointing to `/` (which returns `"Smart Tourist Safety API is running..."`).

---

## 🎨 Step 4: Deploy Frontend to S3 & CloudFront

Vite builds static JS, HTML, and CSS which can be hosted for pennies on S3.

### 1. Build Frontend Locally
Create a `.env.production` file in your `frontend` directory:
```env
VITE_API_URL=https://api.yourdomain.com/api/v1
VITE_SOCKET_URL=https://api.yourdomain.com
```
Then run:
```bash
cd frontend
npm run build
```
This generates the optimized bundle inside the `dist/` directory.

### 2. Upload to AWS S3
1. Open the **Amazon S3 Console** and click **Create Bucket** (e.g. `smart-tourist-frontend`).
2. Disable "Block all public access" (or let CloudFront access it securely using Origin Access Control/OAC).
3. Upload all contents of your frontend `dist/` directory directly into the bucket root.

### 3. Set Up CloudFront CDN (Recommended)
1. Open the **Amazon CloudFront Console** and click **Create Distribution**.
2. **Origin Domain**: Select your S3 bucket.
3. **Origin Access**: Choose **Origin Access Control (OAC)** and create a new control configuration.
4. **Viewer Protocol Policy**: Select **Redirect HTTP to HTTPS**.
5. **Default Root Object**: Enter `index.html`.
6. **Error Pages**: Add a Custom Error Response:
   * HTTP Error Code: `404: Not Found`
   * Customize Error Response: **Yes**
   * Response Page Path: `/index.html`
   * HTTP Status Code: `200: OK`
   *(This ensures client-side routing with `react-router-dom` works properly).*
7. Deploy the distribution. Copy the CloudFront distribution domain (e.g. `d1234567.cloudfront.net`).

---

## 🔒 Step 5: Route 53 & SSL (HTTPS) Setup

For WebSockets (`socket.io`) and geolocation APIs to function securely, traffic **must** be sent over HTTPS.

1. Request a free SSL Certificate using **AWS Certificate Manager (ACM)** for your domains (e.g. `yourdomain.com` and `api.yourdomain.com`).
2. Attach the ACM SSL Certificate to your CloudFront Distribution (for frontend).
3. Attach the ACM SSL Certificate to your ALB listener (for backend APIs on HTTPS port `443`, forwarding to target group port `5000`).
4. In **AWS Route 53**, create **Alias A Records**:
   * `yourdomain.com` -> Points to CloudFront Distribution.
   * `api.yourdomain.com` -> Points to Application Load Balancer.
