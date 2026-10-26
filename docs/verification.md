# Inspection and publication review

Reviewed 26 October 2026. Nothing has been published; MaskDetect is untouched.

## Inputs and verification

The original Project.zip contained 112 entries, primarily a simulated dashboard and academic documents. Added training.zip, detection.zip, and model.zip supply the actual TensorFlow/OpenCV implementation and checkpoint. This supersedes the initial conclusion based on the original ZIP alone.

Archive paths were checked before extraction. Included Python files were read and parsed for syntax without executing their code. The class mapping is mask=0, no_mask=1. The 13,913,712-byte checkpoint has a valid HDF5 file signature. Model graphs and metadata have not been inspected: TensorFlow and h5py are unavailable in the inspection runtime. No dependencies were installed and no webcam, training, model prediction, or web build was executed.

Both new plot images were visually inspected. The confusion matrix [[140,4],[0,10]] yields 97.40% accuracy, 100% no-mask recall, 71.43% no-mask precision, and 83.33% no-mask F1. These are arithmetic from an image, not independently reproduced results. Training history shows 15 plotted epochs. No raw predictions, numeric histories, split manifests, dataset license, or result-to-checkpoint linkage was supplied. Dataset files and original environments were not inspected or included.

## Unresolved discrepancies

| Topic | Finding |
| --- | --- |
| Dataset | Poster says 170 but lists 144 mask + 10 no-mask = 154. |
| Evaluation | New matrix covers 154 examples; poster matrix [[28,1],[0,5]] covers 34. Whether either represents held-out subjects is unknown. |
| Metrics | Poster no-mask precision/F1 0.71/0.83 match the new matrix approximately, not its own matrix (0.8333/0.9091). |
| Epochs | New history has 15 points; presentation illustration/poster describe nine epochs. |
| Stopping | Source uses validation-loss patience five; poster says three. ReduceLROnPlateau uses patience three. |
| Rotation | Source factor 0.2 means roughly ±72 degrees, versus poster ±20 degrees. |
| Class weights | Computed after equal-count oversampling, making weights equal. |
| Model selection | Best validation-accuracy checkpoint can differ from validation-loss-restored model used for evaluation. |
| Preprocessing | Training and detection use [0,1], differing from standard MobileNetV2 preprocessing. |
| Face size | Detector minimum=(60,60), poster=(20,20). |
| Speed | CAP_PROP_FPS is camera-reported, not measured throughput. Poster 80–150 ms serial processing implies about 6.7–12.5 iterations/sec, not proof of 25–29 FPS. |
| Sorting | Full images are copied using only the first XML object's label; three output folder names conflict with binary detector keys. |
| Split | Random directory split does not enforce subject/source separation. |
| Guide | Excluded proposal describes ResNet50/PyTorch and recognition; actual code is MobileNetV2/TensorFlow without recognition. |

## Publishing copy

Included original training/sorting source, detector, supplied checkpoint, mapping, plots, and an inferred unpinned requirements file. Removed detector automatic debug-frame saving and relabeled FPS as camera-reported. Dashboard simulation labels and neutral replacement SVG remain. Poster student-ID line is removed in a rasterized copy; metrics remain unchanged and qualified in README.

Excluded debug_frame.jpg without viewing private content, datasets, annotations, venv, raw screenshots, stock photos without documented redistribution terms, redundant guides, loose logos, shell-command stub, and input ZIPs. A specific ignore exception permits the reviewed checkpoint; debug captures and generated/private artifacts remain ignored. No new project license is granted.

Source/configuration review found no obvious embedded credential; environment-variable references and password schema fields are not credentials. This is not an exhaustive secret-scanning guarantee. HDF5 contents were not deserialized or scanned as structured model metadata. Files are below ordinary GitHub per-file size limits.

## Release status

Proposed repository: Shadymahr/face-mask-detection-university. Earlier GitHub authentication identified Shadymahr and name lookup returned 404; recheck before creation. Available GitHub connector lacks repository creation, so publication requires a supported authenticated browser or another authorized client.

Public publishing awaits review of this updated package and confirmation of publishing rights. Do not overwrite or modify Shadymahr/MaskDetect. Runtime behavior and experiment results remain unverified.
