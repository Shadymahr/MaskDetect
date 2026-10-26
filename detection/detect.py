import os
import cv2
import json
import numpy as np
from tensorflow.keras.models import load_model

# Paths
ROOT_DIR = os.path.dirname(os.path.dirname(__file__))
MODEL_PATH = os.path.join(ROOT_DIR, "model", "mask_detector.h5")
CLASS_INDICES_PATH = os.path.join(ROOT_DIR, "model", "class_indices.json")
FACE_CASCADE_PATH = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"

# Colors: BGR format
COLORS = {
    "mask": (0, 255, 0),        # Green
    "no_mask": (0, 0, 255),     # Red
}

def load_model_and_classes():
    """Load trained model and class indices."""
    if not os.path.exists(MODEL_PATH):
        print(f"❌ Model not found: {MODEL_PATH}")
        return None, None, None

    if not os.path.exists(CLASS_INDICES_PATH):
        print(f"❌ Class indices not found: {CLASS_INDICES_PATH}")
        return None, None, None

    try:
        model = load_model(MODEL_PATH)
        with open(CLASS_INDICES_PATH, 'r') as f:
            class_indices = json.load(f)

        # Reverse mapping: index -> class name
        idx_to_class = {v: k for k, v in class_indices.items()}

        print("✓ Model loaded")
        print(f"✓ Classes: {list(idx_to_class.values())}")
        return model, idx_to_class, class_indices
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        return None, None, None

def main():
    print("="*60)
    print("🎭 FACE MASK DETECTION - REAL-TIME")
    print("="*60)

    model, idx_to_class, class_indices = load_model_and_classes()
    if model is None:
        return

    # Load face detector
    face_cascade = cv2.CascadeClassifier(FACE_CASCADE_PATH)
    if face_cascade.empty():
        print("❌ Face cascade not found")
        return

    print("✓ Face detector loaded")

    # Open webcam
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("❌ Cannot open webcam")
        return

    print("✓ Webcam opened. Press 'q' to quit.\n")

    frame_count = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        frame_count += 1
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # Detect faces
        faces = face_cascade.detectMultiScale(gray, 1.1, 5, minSize=(60, 60))

        # Draw FPS and face count
        fps = cap.get(cv2.CAP_PROP_FPS) or 30
        cv2.putText(frame, f"Camera-reported FPS: {int(fps)}", (10, 30),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
        cv2.putText(frame, f"Faces Detected: {len(faces)}", (10, 70),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)

        # Process each face
        for (x, y, w, h) in faces:
            # Extract face ROI
            face_roi = frame[y:y+h, x:x+w]

            # 1) Resize to 224x224
            face_roi = cv2.resize(face_roi, (224, 224))

            # 2) Convert from BGR (OpenCV) to RGB (Keras expects RGB)
            face_rgb = cv2.cvtColor(face_roi, cv2.COLOR_BGR2RGB)

            # 3) Scale to [0,1] as in training
            face_rgb = face_rgb.astype("float32") / 255.0

            # 4) Add batch dimension
            face_input = np.expand_dims(face_rgb, axis=0)

            # Predict
            probs = model.predict(face_input, verbose=0)[0]
            p_mask = float(probs[class_indices["mask"]])
            p_no_mask = float(probs[class_indices["no_mask"]])

            # Decision threshold: be conservative about calling something "mask"
            if p_mask >= 0.8 and p_mask >= p_no_mask:
                class_name = "mask"
                confidence = p_mask
            else:
                class_name = "no_mask"
                confidence = p_no_mask

            # Color & label
            color = COLORS.get(class_name, (255, 255, 255))
            label = f"{class_name}: {confidence:.2f}"

            # Draw on original frame
            cv2.rectangle(frame, (x, y), (x+w, y+h), color, 2)
            cv2.putText(frame, label, (x, y-10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)

        # Display frame
        cv2.imshow("Face Mask Detection", frame)

        # Quit on 'q'
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()
    print("\n✓ Detection finished")

if __name__ == "__main__":
    main()
