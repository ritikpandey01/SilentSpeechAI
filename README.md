# 🧠 SilentSpeechAI — AI-Powered Silent Speech Translator
> **Transforming Silent Videos into Text**  
> Bridging vision and language through deep learning.  
> A system that reads lips from video footage and converts visual speech into text — enabling silent communication anywhere.

---

## 🚀 Overview

**SilentSpeechAI** is an **AI-driven silent communication tool** that decodes lip movements directly from videos.  
Built using **Computer Vision**, **Deep Learning**, and an **interactive web interface**, it aims to revolutionize accessibility and enhance human-computer interaction.

### ✨ Key Highlights
- 🎥 Converts silent video to readable text
- 🧠 Custom 3D CNN + Bi-LSTM LipNet architecture
- ⚡ Real-time frame processing and prediction
- 💬 Seamless Streamlit-based user interface
- 🧩 Modular backend–frontend design for flexibility

---

## 🧩 System Architecture

Video Input
↓
Frame Extraction (OpenCV)
↓
Feature Learning (3D CNN)
↓
Temporal Modeling (Bi-LSTM)
↓
CTC Decoder
↓
Text Output

yaml
Copy code

---

## 🗂️ Repository Structure

SilentSpeechAI/
│
├── Backend/
│ ├── app/
│ │ ├── debug_model.py
│ │ ├── diagnostics.ipynb
│ │ ├── modelutil.py
│ │ ├── streamlitapp.py ← Streamlit UI launcher
│ │ ├── test.video.mp4 ← Sample input video
│ │ ├── utils.py ← Helper functions
│ │ └── x.ipynb
│ │
│ ├── models/
│ │ ├── checkpoint.* ← Trained model weights
│ │ ├── data.zip ← Dataset archive
│ │ └── LipNet.ipynb ← Model training notebook
│ │
│ └── FrameCaptureSystem/
│ ├── app.py ← Frame extraction and lip region detection
│ ├── requirements.txt
│ └── yolov8n.pt ← Pretrained YOLO model for detection
│
├── Frontend/
│ ├── css/
│ │ ├── components.css
│ │ ├── home.css
│ │ └── style.css
│ │
│ ├── js/
│ │ ├── lip-reading.js
│ │ ├── main.js
│ │ └── utils.js
│ │
│ └── pages/
│ ├── index.html
│ ├── emotion.html
│ ├── help.html
│ ├── history.html
│ ├── language.html
│ ├── profile.html
│ └── training.html
│
└── README.md

yaml
Copy code

---

## ⚙️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/SilentSpeechAI.git
cd SilentSpeechAI
2. Create & Activate Virtual Environment
bash
Copy code
python -m venv env
source env/bin/activate       # Linux / Mac
env\Scripts\activate          # Windows
3. Install Dependencies
bash
Copy code
pip install -r Backend/FrameCaptureSystem/requirements.txt
4. Verify Dataset & Model Checkpoints
Ensure the following exist inside Backend/models/:

checkpoint.data-*

checkpoint.index

LipNet.ipynb

data.zip

If missing, download the dataset or pretrained weights before training.

🧠 Model Training
The training process is handled through the LipNet.ipynb notebook.

bash
Copy code
cd Backend/models
jupyter notebook LipNet.ipynb
🔍 Training Pipeline
Preprocess video frames using OpenCV

Extract lip region (ROI)

Train 3D CNN for spatial-temporal feature extraction

Use Bi-LSTM for sequence modeling

Decode predictions with CTC (Connectionist Temporal Classification)

📊 Model Summary
Component	Details
Architecture	3D CNN + Bi-LSTM
Input	75 video frames per clip
Decoder	CTC Loss
Accuracy	~75% (Training), ~68% (Validation)
CER	~15%
Processing Time	~2–3s per video

🖥️ Running the Application
After model training (or if pretrained weights exist):

bash
Copy code
cd Backend/app
streamlit run streamlitapp.py
Then open your browser at http://localhost:8501

🧭 Workflow
Upload a silent video

System extracts facial ROI frames

Model predicts corresponding text

Output is displayed in real-time

💡 Applications
🧏 Accessibility for the hearing-impaired

🧠 Silent communication systems

🛡️ Surveillance and security analytics

🎬 Automatic subtitle generation

🗣️ Voice assistants for noisy environments

🔮 Future Enhancements
🔁 Real-time webcam-based inference

🌐 Multi-language lip reading support

📱 Mobile app integration

🧰 Expanded vocabulary dataset

💬 Emotion-aware lip reading (sentiment decoding)

🧰 Tech Stack
Category	Technologies
Language	Python, JavaScript, HTML, CSS
Frameworks	Streamlit, OpenCV, TensorFlow, Keras
Model	LipNet (3D CNN + BiLSTM + CTC)
Detection	YOLOv8
Frontend	HTML/CSS/JS-based modular pages
Environment	Jupyter Notebook

🧑‍💻 Contributors
Ritik Pandey
Shreya Doye
Suraj Dhere
Sahil Sheikh

Guided Research Project — Lip Reading & Silent Speech Recognition for AI-Powered Communication

🏆 Hackathon Impact
SilentSpeechAI redefines accessibility by allowing humans and machines to “listen” through vision.
Our innovation lies in fusing deep learning, computer vision, and natural language decoding to create an AI that understands speech without sound.

This project stands out for:

🧠 Advanced architecture

🌍 Social impact

⚙️ Real-world usability


💡 Expandable and research-friendly design

📄 License
This project is open-source under the MIT License.
You may freely use, modify, and distribute this software with proper attribution.
