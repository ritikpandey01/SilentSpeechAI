from ultralytics import YOLO
import cv2
import os

model = YOLO("yolov8n.pt")
#i am shreya 

# folder to save frames
save_dir = "captured_frames"
os.makedirs(save_dir, exist_ok=True)

cap = cv2.VideoCapture(0)
if not cap.isOpened():
    print("Cannot access webcam.")
    exit()

frame_id = 0  # counter for frame filenames

while True:
    ret, frame = cap.read()
    if not ret:
        break

    results = model(frame)
    boxes = results[0].boxes
    count = len(boxes)

    annotated = results[0].plot()
    #cv2.putText(annotated, f"Objects Detected: {count}", (20, 40),
    #            cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
    cv2.imshow("Object Counter", annotated)

    # Save the frame
    frame_filename = os.path.join(save_dir, f"frame_{frame_id:05d}.jpg")
    cv2.imwrite(frame_filename, frame)
    frame_id += 1

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
