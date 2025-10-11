# SilentSpeechAI 🎥➡️💬

An **AI-driven silent communication tool** that decodes lip movements directly from videos using cutting-edge Computer Vision and Deep Learning techniques.

## ✨ Key Features

- 🎥 **Video-to-Text Conversion** — Transforms silent video into readable text
- 🧠 **Advanced Architecture** — Custom 3D CNN + Bi-LSTM LipNet model
- ⚡ **Real-Time Processing** — Fast frame extraction and prediction
- 💬 **User-Friendly Interface** — Seamless Streamlit-based web UI
- 🧩 **Modular Design** — Flexible backend-frontend separation

---

## 🏗️ System Architecture

```
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
```

---

## 📂 Repository Structure

```
SilentSpeechAI/
│
├── Backend/
│   ├── app/
│   │   ├── streamlitapp.py          # Streamlit UI launcher
│   │   ├── modelutil.py              # Model utilities
│   │   ├── utils.py                  # Helper functions
│   │   ├── test.video.mp4            # Sample input video
│   │   ├── debug_model.py
│   │   ├── diagnostics.ipynb
│   │   └── x.ipynb
│   │
│   ├── models/
│   │   ├── checkpoint.*              # Trained model weights
│   │   ├── data.zip                  # Dataset archive
│   │   └── LipNet.ipynb              # Model training notebook
│   │
│   └── FrameCaptureSystem/
│       ├── app.py                    # Frame extraction & lip detection
│       ├── requirements.txt
│       └── yolov8n.pt                # Pretrained YOLO model
│
├── Frontend/
│   ├── css/
│   │   ├── style.css
│   │   ├── home.css
│   │   └── components.css
│   │
│   ├── js/
│   │   ├── main.js
│   │   ├── lip-reading.js
│   │   └── utils.js
│   │
│   └── pages/
│       ├── index.html
│       ├── emotion.html
│       ├── help.html
│       ├── history.html
│       ├── language.html
│       ├── profile.html
│       └── training.html
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.8 or higher
- pip package manager
- Jupyter Notebook (for training)

### Installation

**1. Clone the Repository**

```bash
git clone https://github.com/yourusername/SilentSpeechAI.git
cd SilentSpeechAI
```

**2. Create Virtual Environment**

```bash
python -m venv env

# Activate environment
source env/bin/activate       # Linux / Mac
env\Scripts\activate          # Windows
```

**3. Install Dependencies**

```bash
pip install -r Backend/FrameCaptureSystem/requirements.txt
```

**4. Verify Model Files**

Ensure these files exist in `Backend/models/`:
- `checkpoint.data-*`
- `checkpoint.index`
- `LipNet.ipynb`
- `data.zip`

---

## 🧠 Model Training

Train the model using the provided Jupyter notebook:

```bash
cd Backend/models
jupyter notebook LipNet.ipynb
```

### Training Pipeline

1. **Preprocess** video frames using OpenCV
2. **Extract** lip region (ROI)
3. **Train** 3D CNN for spatial-temporal feature extraction
4. **Model** sequences using Bi-LSTM
5. **Decode** predictions with CTC (Connectionist Temporal Classification)

### Model Performance

| Metric | Value |
|--------|-------|
| **Architecture** | 3D CNN + Bi-LSTM |
| **Input Size** | 75 frames per clip |
| **Decoder** | CTC Loss |
| **Training Accuracy** | ~75% |
| **Validation Accuracy** | ~68% |
| **Character Error Rate** | ~15% |
| **Processing Time** | ~2–3s per video |

---

## 🖥️ Running the Application

After training (or with pretrained weights):

```bash
cd Backend/app
streamlit run streamlitapp.py
```

Open your browser at **http://localhost:8501**

### How It Works

1. 📤 Upload a silent video
2. 🔍 System extracts facial ROI frames
3. 🤖 Model predicts corresponding text
4. ✅ Output displayed in real-time

---

## 💡 Applications

- 🧏 **Accessibility** — Communication tools for the hearing-impaired
- 🛡️ **Security** — Surveillance and forensic analytics
- 🎬 **Media** — Automatic subtitle generation
- 🗣️ **Voice Assistants** — Silent operation in noisy environments
- 🧠 **Research** — Human-computer interaction studies

---

## 🔮 Future Enhancements

- 🔁 Real-time webcam-based inference
- 🌐 Multi-language lip reading support
- 📱 Mobile app integration
- 🧰 Expanded vocabulary dataset
- 💬 Emotion-aware sentiment decoding

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Languages** | Python, JavaScript, HTML, CSS |
| **Frameworks** | Streamlit, OpenCV, TensorFlow, Keras |
| **Model** | LipNet (3D CNN + BiLSTM + CTC) |
| **Detection** | YOLOv8 |
| **Frontend** | HTML/CSS/JS modular pages |
| **Environment** | Jupyter Notebook |

---

## 👥 Contributors

- **Ritik Pandey**
- **Shreya Doye**
- **Suraj Dhere**
- **Sahil Sheikh**

*Guided Research Project — Lip Reading & Silent Speech Recognition for AI-Powered Communication*

---

## 🏆 Project Impact

SilentSpeechAI redefines accessibility by allowing humans and machines to "listen" through vision. Our innovation fuses deep learning, computer vision, and natural language decoding to create AI that understands speech without sound.

### What Makes Us Stand Out

- 🧠 **Advanced Architecture** — State-of-the-art deep learning model
- 🌍 **Social Impact** — Empowering the hearing-impaired community
- ⚙️ **Real-World Usability** — Production-ready implementation
- 💡 **Research-Friendly** — Expandable and well-documented codebase

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).  
You may freely use, modify, and distribute this software with proper attribution.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📧 Contact

For questions or collaboration opportunities, please open an issue or reach out to the contributors.

---

<div align="center">

**Made with ❤️ for accessible AI communication**

⭐ Star this repo if you find it helpful!

</div>
