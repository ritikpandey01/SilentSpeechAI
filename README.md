# 🧠 SilentSpeechAI — AI‑Powered Silent Speech Translator

Transforming silent videos into text. Bridging vision and language through deep learning.


SilentSpeechAI decodes lip movements directly from video and converts them into readable text. Built with Computer Vision, Deep Learning, and an interactive Streamlit UI, it aims to revolutionize accessibility and enable silent communication anywhere.

---

## ✨ Highlights

- 🎥 Converts silent videos into text in near real time
- 🧠 3D CNN + Bi‑LSTM LipNet-inspired architecture
- ⚡ Frame‑wise processing and streaming prediction
- 💬 Streamlit-based, one‑click web interface
- 🧩 Modular backend–frontend design

---

## 🧩 System Architecture

```mermaid
graph LR
  A[Video Input] --> B[Frame Extraction (OpenCV)]
  B --> C[Feature Learning (3D CNN)]
  C --> D[Temporal Modeling (Bi-LSTM)]
  D --> E[CTC Decoder]
  E --> F[Text Output]
```

---

## 🗂️ Repository Structure

```
SilentSpeechAI/
├── Backend/
│   ├── app/
│   │   ├── streamlitapp.py         # Streamlit UI launcher
│   │   ├── utils.py                # Helper utilities
│   │   ├── modelutil.py            # Model loading / inference utils
│   │   ├── debug_model.py          # Debug / diagnostics
│   │   ├── test_video.mp4          # Sample input video
│   │   └── *.ipynb                 # Notebooks for quick tests
│   ├── models/
│   │   ├── checkpoint.*            # Trained model weights (place here)
│   │   └── data.zip                # Dataset archive (optional)
│   ├── LipNet.ipynb                # Training notebook
│   └── animation.gif               # Demo animation
├── FrameCaptureSystem/
│   ├── app.py                      # Frame extraction & lip ROI detection
│   ├── requirements.txt
│   └── yolov8n.pt                  # Pretrained YOLO model for detection
├── Frontend/
│   ├── css/                        # Styles
│   ├── js/                         # Client-side logic
│   ├── pages/                      # Static pages
│   └── index.html                  # Web entry point
├── LICENSE
└── README.md
```

---

## 🧰 Tech Stack

- Language: Python, JavaScript, HTML, CSS
- Frameworks: Streamlit, OpenCV, TensorFlow/Keras
- Model: LipNet‑style 3D CNN + Bi‑LSTM + CTC
- Detection: YOLOv8 (for face/lip ROI)
- Environment: Jupyter Notebook

---

## ⚙️ Setup

1) Clone the repository

```bash
git clone https://github.com/yourusername/SilentSpeechAI.git
cd SilentSpeechAI
```

2) Create & activate a virtual environment

```bash
python -m venv .venv
# Linux / macOS
source .venv/bin/activate
# Windows (PowerShell)
.venv\\Scripts\\Activate.ps1
```

3) Install dependencies

```bash
# Core CV / DL / utilities
pip install -r FrameCaptureSystem/requirements.txt
# If needed for notebooks & UI
pip install jupyter streamlit
```

4) Verify dataset & model checkpoints

Ensure the following exist under `Backend/models/` (create the folder if missing):

- `checkpoint.*` (model weights)
- `data.zip` (dataset archive, optional)

Training notebook location: `Backend/LipNet.ipynb` (or `Backend/models/LipNet.ipynb` if you prefer).

---

## 🧠 Training

The training pipeline is provided as a notebook.

```bash
# Option A: if the notebook is under Backend/
cd Backend
jupyter notebook LipNet.ipynb

# Option B: if you move it to Backend/models/
cd Backend/models
jupyter notebook LipNet.ipynb
```

Training pipeline overview:

- Preprocess video frames using OpenCV
- Extract lip ROI (with YOLOv8 + landmarks)
- Train 3D CNN for spatiotemporal feature extraction
- Use Bi‑LSTM for sequence modeling
- Decode with CTC (Connectionist Temporal Classification)

---

## 🖥️ Run the App

After training (or if you already have pretrained weights):

```bash
cd Backend/app
streamlit run streamlitapp.py
```

Open your browser at: http://localhost:8501

Quick test: use the bundled sample `test_video.mp4`.

---

## 🧭 Workflow

1) Upload a silent video
2) System extracts facial ROI frames
3) Model predicts corresponding text
4) Output is displayed in real time

---

## 📊 Benchmarks (sample)

- Architecture: 3D CNN + Bi‑LSTM + CTC
- Input: 75 frames per clip
- Training Accuracy: ~75%
- Validation Accuracy: ~68%
- Character Error Rate (CER): ~15%
- Processing Time: ~2–3 s per video (depending on hardware)

Note: Metrics vary based on dataset size, preprocessing, and compute.

---

## 💡 Applications

- 🧏 Accessibility for the hearing‑impaired
- 🧠 Silent communication systems
- 🛡️ Surveillance and security analytics
- 🎬 Automatic subtitle generation
- 🗣️ Voice assistants in noisy environments

---

## 🔮 Roadmap

- 🔁 Real‑time webcam inference
- 🌐 Multi‑language lip reading
- 📱 Mobile app integration
- 🧰 Expanded vocabulary dataset
- 💬 Emotion‑aware lip reading (sentiment decoding)

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request:

- Fork the repo
- Create a feature branch
- Commit with clear messages
- Open a PR with a concise description and screenshots/demos where relevant

---

## 🧑‍💻 Contributors

- Ritik Pandey  
- Shreya Doye  
- Suraj Dhere  
- Sahil Sheikh

Guided Research Project — Lip Reading & Silent Speech Recognition for AI‑Powered Communication

---

## 🏆 Hackathon Impact

SilentSpeechAI enables machines to “listen” through vision, fusing deep learning, computer vision, and natural language decoding to understand speech without sound.

- 🧠 Advanced architecture
- 🌍 Social impact
- ⚙️ Real‑world usability
- 💡 Expandable and research‑friendly design

---

## 📄 License

This project is open‑source under the MIT License. See the [LICENSE](LICENSE) file for details.
