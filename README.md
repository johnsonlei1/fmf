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
To Run:
```
cd backend
python app.py
cd ..
cd frontend
npm run dev
```
