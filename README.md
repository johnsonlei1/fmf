have python, node.js installed
cd backend
python -m venv venv
venv\Scripts\activate
pip install flask flask-cors pandas python-dotenv
cd..
cd frontend
npm install

To Run:
cd backend
python app.py
cd ..
cd frontend
npm run dev
