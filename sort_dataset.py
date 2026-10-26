import os
import shutil
import xml.etree.ElementTree as ET

ANNOTATIONS_DIR = "annotations"
IMAGES_DIR = "images"
OUTPUT_DIR = "dataset"

# Create output folders
classes = ["with_mask", "without_mask", "mask_weared_incorrect"]
for cls in classes:
    os.makedirs(os.path.join(OUTPUT_DIR, cls), exist_ok=True)

# Loop through each XML file
for xml_file in os.listdir(ANNOTATIONS_DIR):
    if not xml_file.endswith(".xml"):
        continue

    xml_path = os.path.join(ANNOTATIONS_DIR, xml_file)

    # Parse XML
    tree = ET.parse(xml_path)
    root = tree.getroot()

    # Extract filename
    filename = root.find("filename").text
    image_path = os.path.join(IMAGES_DIR, filename)

    # Extract class label
    label = root.find("object/name").text

    # Check if label folder exists
    if label not in classes:
        print(f"Skipping unknown label: {label}")
        continue

    # Move image into correct folder
    dest_path = os.path.join(OUTPUT_DIR, label, filename)
    shutil.copy(image_path, dest_path)

    print(f"Copied {filename} → {label}/")

print("Dataset sorting completed!")
