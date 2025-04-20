Begin by having python and node.js installed

1. move into "backend" directory

```
cd backend
```

2. set up the virtual environment

```
python -m venv venv
venv\Scripts\activate
```

3. install backend requirements

```
pip install flask flask-cors pandas python-dotenv
```

4. Install frontend dependencies

```
cd..
cd frontend
npm install
```

5. Create a .env file in the frontend directory

```
VITE_FIREBASE_API_KEY=apiKey
VITE_FIREBASE_AUTH_DOMAIN=authDomain
VITE_FIREBASE_PROJECT_ID=projectId
VITE_FIREBASE_STORAGE_BUCKET=storageBucket
VITE_FIREBASE_MESSAGING_SENDER_ID=messagingSenderId
VITE_FIREBASE_APP_ID=appId
VITE_FIREBASE_MEASUREMENT_ID=measurementId
```

To Run:

```
cd backend
python app.py
```

Now, in a second terminal:
```
cd frontend
npm run dev
```
