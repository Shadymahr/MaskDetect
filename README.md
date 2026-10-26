# MaskDetect — Face Mask Detection Dashboard (Prototype)

A TypeScript/React web dashboard prototype for visualizing face-mask compliance events and webcam footage, developed alongside an academic project on real-time face mask detection.

> **Important: This repository is a UI prototype, not a deployed trained face-mask classifier.** The visible bounding boxes, mask/no-mask labels, confidence values, event history, and dashboard statistics are **simulated/randomly generated**. The repository does not currently contain the MobileNetV2 training/inference implementation, trained weights, or the underlying dataset. The app must not be represented as performing real AI inference.

## Features
- Webcam video display using `react-webcam` (camera permission required).
- Simulated mask/no-mask bounding box overlays and events.
- Dashboard statistics, charts, and event log.
- React/TypeScript frontend with Vite and Tailwind-based UI.
- Express server skeleton.

## Tech stack
- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Recharts, React Webcam
- **Backend:** Node.js, Express
- **Academic ML work described separately:** MobileNetV2 transfer learning and OpenCV Haar Cascade face detection (the training/inference source files are **not included here**).

## Running locally
Requires a recent Node.js release with npm.

```bash
npm install
npm run dev
```

Follow the terminal output for the local URL. Webcam access may require localhost or an HTTPS environment.

## Related academic project (January 2026)
**Real-Time Face Mask Detection Using Transfer Learning and OpenCV**  
Advanced Programming, Deggendorf Institute of Technology — Shady Nemat

The accompanying academic poster reports:
- MobileNetV2-based classification of faces detected with OpenCV Haar Cascades.
- 34-image validation set, with **33/34 correct predictions (97.1% accuracy)** according to its confusion matrix.
- **5/5 no-mask images correctly identified** in this validation set; this is too small to establish reliable performance on unseen populations.
- A separately reported 25–29 FPS CPU-only result, which cannot be independently reproduced using the files in this repository.
- Dataset size and class balance descriptions that need reconciliation before reproducing the experiment.

These are **reported academic results**, not demonstrated performance of this dashboard. The current repository lacks model code, dataset preprocessing/training scripts, test harness, and weights to verify the claims.

## Known limitations
- Simulated predictions and confidence scores; no model inference API wired to the frontend.
- Simulated event log and aggregate statistics.
- No real-world evaluation or privacy/security review for use with people or surveillance.
- Model training and inference source code not included.

## Recommended next steps
1. Locate and review the original Python model training and inference code.
2. Add a requirements file and reproducible inference example **only after verifying the source**.
3. Resolve dataset split/oversampling inconsistencies documented in the poster.
4. Connect a verified model-inference API to the UI.
5. Add a licensed evaluation dataset (or download instructions), tests, and performance benchmarks.

## Credits
Academic project by Shady Nemat. Third-party UI dependencies retain their respective licenses. No license to third-party datasets or model weights is implied.
