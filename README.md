# Real-Time Face Mask Detection

**University project | Advanced Programming, Group C**

**Technische Hochschule Deggendorf** · January 2026

**Author:** Shady Nemat

A computer vision project exploring how transfer learning and OpenCV can be combined to classify face-mask use from webcam video. The project includes a TensorFlow training pipeline, a saved MobileNetV2 classifier, and a real-time webcam detection script.

> **Academic project showcase:** this repository presents the implementation and results submitted for a university course. The React dashboard included here is a separate interface prototype; its on-screen detections and statistics are simulated and are not connected to the Python model.

## Project at a glance

| | |
| --- | --- |
| **Course** | Advanced Programming, Group C |
| **Institution** | Technische Hochschule Deggendorf |
| **Focus** | Transfer learning, image classification, and real-time computer vision |
| **Tools** | Python, TensorFlow/Keras, MobileNetV2, OpenCV, Haar cascades |
| **Classes** | Mask and no mask |
| **Input** | Webcam video |

## What I built

- A TensorFlow training pipeline using a frozen ImageNet MobileNetV2 feature extractor and a custom classification head.
- Training data preparation with augmentation and minority-class oversampling.
- A webcam inference script that detects faces with an OpenCV Haar cascade, classifies face crops, and overlays labels and confidence scores.
- Training curves, a confusion-matrix artifact, and a university poster describing the project and its evaluation.

## How the system works

1. OpenCV captures frames from the webcam and locates frontal faces with a Haar cascade.
2. Each face crop is resized to 224 × 224, converted from BGR to RGB, and scaled to [0, 1].
3. The MobileNetV2-based classifier estimates the mask and no-mask probabilities.
4. The detector draws a label and confidence score over each face. It uses a 0.80 mask-confidence threshold.

The model predicts two classes only. It does not identify people or distinguish incorrectly worn masks.

## Reported results

The supplied model confusion-matrix image shows 150 correct predictions among 154 examples (97.4% accuracy). It records 10/10 correct no-mask predictions. These figures are calculated from the supplied matrix; the original data split and raw predictions were not included, so I have not independently reproduced the evaluation.

![Confusion matrix supplied with the project](model/confusion_matrix.png)

The repository also includes training and validation accuracy/loss curves:

![Training history supplied with the project](model/training_history.png)

The poster contains a separate 34-image validation matrix and additional dataset and speed claims. Some values differ from the supplied 154-example matrix and from the source settings. See [verification notes](docs/verification.md) for the comparison and limits before citing results.

## Repository guide

- [`training/train_tfdata.py`](training/train_tfdata.py) — data loading, augmentation, training, and evaluation
- [`detection/detect.py`](detection/detect.py) — webcam capture, face detection, and classification
- [`model/`](model/) — supplied classifier, class mapping, and result plots
- [`sort_dataset.py`](sort_dataset.py) — annotation-to-folder helper; read the caveats below before using
- [`docs/poster-public.pdf`](docs/poster-public.pdf) — poster copy with student ID removed
- [`client/`](client/) — React dashboard prototype, with simulated display data

## Run the webcam detector

Choose a Python version supported by the TensorFlow release you install. The supplied requirements list is inferred from source imports; it is unpinned and was not validated as a complete environment.

```sh
python -m venv .venv
```

Activate the environment in PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

Or in macOS/Linux:

```sh
source .venv/bin/activate
```

Install the dependencies and start the webcam application from the repository root:

```sh
python -m pip install -r requirements.txt
python detection/detect.py
```

The script opens camera index 0 in an OpenCV window. Press `q` to exit. The FPS overlay reports the camera's property value; it is not a measurement of model inference speed. The public copy does not save webcam frames.

## Train the classifier

Provide images you have permission to use in this structure:

```text
dataset/
  mask/
  no_mask/
```

Then run:

```sh
python training/train_tfdata.py
```

Training may download ImageNet weights and will replace the supplied checkpoint and plots under `model/`. Back up those artifacts before training.

The included `sort_dataset.py` copies full images using only the first XML object's class. Its three output class names also differ from the two labels expected by the classifier. Review and crop annotations, map labels deliberately, and keep images from the same person or source together when creating evaluation splits.

## Dashboard prototype

The repository also includes a React/TypeScript dashboard concept. To start its frontend with Node.js 22.12 or newer:

```sh
npm ci
npm run dev:client
```

The webcam preview is real, but its detection boxes, identities, confidence scores, event stream, and charts are randomly simulated. The dashboard does not call the Python model. This UI is included as a prototype companion to the academic project, not as a live inference result.

## Limitations and reproducibility

The submitted model and source are included, but I have not established that the supplied plots, checkpoint, and poster were produced by one identical run. The poster and code also differ on sample counts, stopping patience, augmentation, and face size. TensorFlow model loading, dependency installation, webcam inference, and training have not been verified as part of preparing this repository. Full details are in [`docs/verification.md`](docs/verification.md).

The face dataset and annotations are not included. No dataset redistribution permission or separate project license text was supplied. The poster's student-ID line has been removed from the public copy; university marks and third-party components remain subject to their owners' terms.
