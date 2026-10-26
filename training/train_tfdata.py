import os
import json
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import GlobalAveragePooling2D, Dense, Dropout
from tensorflow.keras.models import Model
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping, ReduceLROnPlateau

from sklearn.metrics import classification_report, confusion_matrix
from sklearn.utils.class_weight import compute_class_weight

# ---------------- CONFIG ----------------
ROOT_DIR = os.path.dirname(os.path.dirname(__file__))
DATASET_DIR = os.path.join(ROOT_DIR, "dataset")
MODEL_DIR = os.path.join(ROOT_DIR, "model")
os.makedirs(MODEL_DIR, exist_ok=True)

MODEL_PATH = os.path.join(MODEL_DIR, "mask_detector.h5")
CLASS_INDICES_PATH = os.path.join(MODEL_DIR, "class_indices.json")
HISTORY_PNG = os.path.join(MODEL_DIR, "training_history.png")
CM_PNG = os.path.join(MODEL_DIR, "confusion_matrix.png")

IMG_SIZE = (224, 224)
BATCH_SIZE = 16     # good for MacBook Pro 2016
EPOCHS = 15
LR = 1e-4
VAL_SPLIT = 0.2
# ----------------------------------------


def create_datasets():
    print("📊 Loading dataset with tf.data ...")
    train_ds = tf.keras.utils.image_dataset_from_directory(
        DATASET_DIR,
        validation_split=VAL_SPLIT,
        subset="training",
        seed=42,
        image_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        label_mode="categorical"
    )

    val_ds = tf.keras.utils.image_dataset_from_directory(
        DATASET_DIR,
        validation_split=VAL_SPLIT,
        subset="validation",
        seed=42,
        image_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        label_mode="categorical"
    )

    class_names = train_ds.class_names
    class_indices = {name: i for i, name in enumerate(class_names)}
    print(f"✓ Classes: {class_names}")

    # Count samples per class in training set
    class_counts = {}
    for images, labels in train_ds:
        for label in labels.numpy():
            class_idx = tf.argmax(label).numpy()
            class_counts[class_idx] = class_counts.get(class_idx, 0) + 1

    print(f"✓ Training samples per class: {class_counts}")

    # Oversample minority classes to balance the dataset
    max_samples = max(class_counts.values())
    print(f"✓ Oversampling minority classes to {max_samples} samples each...")

    # Collect all samples by class
    class_samples = {i: [] for i in range(len(class_names))}
    for images, labels in train_ds:
        for img, label in zip(images, labels):
            class_idx = tf.argmax(label).numpy()
            class_samples[class_idx].append((img, label))

    # Oversample minority classes
    balanced_samples = []
    for class_idx, samples in class_samples.items():
        current_count = len(samples)
        balanced_samples.extend(samples)  # Add original samples

        # Oversample by repeating samples
        if current_count < max_samples:
            repeat_count = max_samples - current_count
            for _ in range(repeat_count):
                # Randomly select samples to repeat
                idx = tf.random.uniform([], 0, current_count, dtype=tf.int32).numpy()
                balanced_samples.append(samples[idx])

    # Shuffle the balanced dataset
    tf.random.set_seed(42)
    indices = tf.range(len(balanced_samples))
    indices = tf.random.shuffle(indices)
    balanced_samples = [balanced_samples[i] for i in indices]

    # Convert back to dataset
    images_list = [img for img, _ in balanced_samples]
    labels_list = [label for _, label in balanced_samples]

    train_ds = tf.data.Dataset.from_tensor_slices((images_list, labels_list))
    train_ds = train_ds.batch(BATCH_SIZE).prefetch(tf.data.AUTOTUNE)

    print(f"✓ Balanced training samples: {len(balanced_samples)}")

    # augmentation (GPU‑friendly)
    aug = tf.keras.Sequential([
        tf.keras.layers.RandomFlip("horizontal"),
        tf.keras.layers.RandomRotation(0.2),
        tf.keras.layers.RandomZoom(0.2),
        tf.keras.layers.RandomBrightness(0.2),
        tf.keras.layers.RandomContrast(0.2),
    ])

    def map_train(x, y):
        x = aug(x, training=True)
        x = tf.cast(x, tf.float32) / 255.0
        return x, y

    def map_val(x, y):
        x = tf.cast(x, tf.float32) / 255.0
        return x, y

    train_ds = train_ds.map(map_train).prefetch(tf.data.AUTOTUNE)
    val_ds = val_ds.map(map_val).prefetch(tf.data.AUTOTUNE)

    return train_ds, val_ds, class_names, class_indices


def compute_weights(train_ds, num_classes):
    print("⚖️ Computing class weights ...")
    labels = []
    for _, y in train_ds.unbatch():
        labels.append(np.argmax(y.numpy()))
    labels = np.array(labels)

    weights = compute_class_weight(
        class_weight="balanced",
        classes=np.arange(num_classes),
        y=labels
    )
    class_weight = {i: float(w) for i, w in enumerate(weights)}
    for i, w in class_weight.items():
        print(f"  class {i}: weight {w:.2f}")
    return class_weight


def build_model(num_classes):
    print("🏗️ Building MobileNetV2 model ...")
    base = MobileNetV2(
        weights="imagenet",
        include_top=False,
        input_shape=(IMG_SIZE[0], IMG_SIZE[1], 3)
    )
    base.trainable = False

    x = GlobalAveragePooling2D()(base.output)
    x = Dense(256, activation="relu")(x)
    x = Dropout(0.4)(x)
    x = Dense(128, activation="relu")(x)
    x = Dropout(0.3)(x)
    out = Dense(num_classes, activation="softmax")(x)

    model = Model(inputs=base.input, outputs=out)
    model.compile(
        optimizer=Adam(LR),
        loss="categorical_crossentropy",
        metrics=["accuracy"]
    )
    model.summary()
    return model


def plot_history(history):
    print("📈 Saving training curves ...")
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 4))

    ax1.plot(history.history["accuracy"], label="train")
    ax1.plot(history.history["val_accuracy"], label="val")
    ax1.set_title("Accuracy")
    ax1.legend()

    ax2.plot(history.history["loss"], label="train")
    ax2.plot(history.history["val_loss"], label="val")
    ax2.set_title("Loss")
    ax2.legend()

    plt.tight_layout()
    plt.savefig(HISTORY_PNG, dpi=300)
    plt.close()
    print(f"✓ Saved {HISTORY_PNG}")


def evaluate(model, val_ds, class_names):
    print("🎯 Evaluating on validation split ...")
    y_true, y_pred = [], []

    for x, y in val_ds:
        p = model.predict(x, verbose=0)
        y_pred.extend(np.argmax(p, axis=1))
        y_true.extend(np.argmax(y.numpy(), axis=1))

    y_true = np.array(y_true)
    y_pred = np.array(y_pred)

    print("\nClassification report:")
    print(classification_report(y_true, y_pred, target_names=class_names))

    cm = confusion_matrix(y_true, y_pred)
    plt.figure(figsize=(6, 5))
    sns.heatmap(cm, annot=True, fmt="d",
                xticklabels=class_names,
                yticklabels=class_names,
                cmap="Blues")
    plt.xlabel("Predicted")
    plt.ylabel("True")
    plt.tight_layout()
    plt.savefig(CM_PNG, dpi=300)
    plt.close()
    print(f"✓ Saved {CM_PNG}")


def main():
    print("="*60)
    print(" FACE MASK DETECTION – TRAINING (tf.data)")
    print("="*60)

    if not os.path.exists(DATASET_DIR):
        print(f"❌ Dataset folder not found: {DATASET_DIR}")
        return

    train_ds, val_ds, class_names, class_indices = create_datasets()
    num_classes = len(class_names)

    with open(CLASS_INDICES_PATH, "w") as f:
        json.dump(class_indices, f)
    print(f"✓ Saved class indices -> {CLASS_INDICES_PATH}")

    class_weight = compute_weights(train_ds, num_classes)
    model = build_model(num_classes)

    callbacks = [
        ModelCheckpoint(MODEL_PATH, monitor="val_accuracy",
                        save_best_only=True, mode="max", verbose=1),
        EarlyStopping(monitor="val_loss", patience=5,
                      restore_best_weights=True, verbose=1),
        ReduceLROnPlateau(monitor="val_loss", factor=0.5,
                          patience=3, min_lr=1e-7, verbose=1),
    ]

    history = model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=EPOCHS,
        class_weight=class_weight,
        callbacks=callbacks
    )

    print("✅ Training finished")
    plot_history(history)
    evaluate(model, val_ds, class_names)
    print(f"\nModel saved to: {MODEL_PATH}")


if __name__ == "__main__":
    main()
