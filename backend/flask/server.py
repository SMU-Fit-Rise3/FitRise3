from flask import Flask, request, send_from_directory, send_file, url_for, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import subprocess
import sys
from werkzeug.utils import secure_filename
import os
from pathlib import Path
import uuid
import logging
import io
import cv2
import numpy as np
import boto3
from botocore.exceptions import ClientError
from dotenv import load_dotenv
import requests
import shutil

app = Flask(__name__, static_url_path='/output', static_folder='instance/output')
CORS(app)
socketio = SocketIO(app)
load_dotenv()

s3_client = boto3.client(
    's3',
    aws_access_key_id=os.environ.get('S3_KEY'),
    aws_secret_access_key=os.environ.get('S3_SECRET'),
    region_name=os.environ.get('S3_RESION')
)

def composite_head_on_body(fullbody_image_path, head_image_path, output_image_path, userId):
    head_scale_factor = 1.8

    # 얼굴 검출을 위한 Haar Cascade 분류기 로드
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

    # 합성할 이미지 로드
    image = cv2.imread(fullbody_image_path)  # 전신 이미지 경로
    overlay_image = cv2.imread(head_image_path, cv2.IMREAD_UNCHANGED)  # 머리 이미지 경로

    if image is None or overlay_image is None:
        print("이미지 로드 실패")
        return

    # 얼굴 검출
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray_image, scaleFactor=1.3, minNeighbors=2, minSize=(20, 20))

    if len(faces) == 0:
        print("얼굴 검출 실패")
        return

    for (x, y, w, h) in faces:
        # 얼굴 영역의 크기에 맞게 머리 이미지 사이즈 조정
        radius = int(max(w, h) * head_scale_factor / 2)
        center = (x + w // 2, y + h // 2)
        
        resized_overlay_image = cv2.resize(overlay_image, (2*radius, 2*radius), interpolation=cv2.INTER_AREA)

        # 원형 마스크 생성
        mask = np.zeros((resized_overlay_image.shape[0], resized_overlay_image.shape[1], 4), dtype=np.uint8)
        cv2.circle(mask, (resized_overlay_image.shape[1]//2, resized_overlay_image.shape[0]//2), radius, (255, 255, 255, 255), thickness=-1)  # 흰색 원
        cv2.circle(mask, (resized_overlay_image.shape[1]//2, resized_overlay_image.shape[0]//2), radius, (0, 0, 0, 255), thickness=0)  # 검은색 테두리

        # 원형으로 크롭
        overlay_image_cropped = np.bitwise_and(resized_overlay_image, mask)

        adjusted_x = x - 19
        adjusted_y = y - 22

        #크롭된 얼굴 주위를 투명하게 처리
        alpha_s = overlay_image_cropped[:, :, 3] / 255.0
        alpha_l = 1.0 - alpha_s

        for c in range(0, 3):
            end_x = min(adjusted_x + 2*radius, image.shape[1])
            end_y = min(adjusted_y + 2*radius, image.shape[0])
            start_x = max(adjusted_x, 0)
            start_y = max(adjusted_y, 0)

            image_crop = image[start_y:end_y, start_x:end_x, c]
            head_crop = overlay_image_cropped[0:(end_y-start_y), 0:(end_x-start_x), c]
            alpha_s_crop = alpha_s[0:(end_y-start_y), 0:(end_x-start_x)]
            alpha_l_crop = alpha_l[0:(end_y-start_y), 0:(end_x-start_x)]

            image[start_y:end_y, start_x:end_x, c] = (alpha_s_crop * head_crop +
                                                      alpha_l_crop * image_crop)

    # 최종 합성 이미지 저장
    cv2.imwrite(output_image_path, image)
    print(f"합성 이미지 저장 완료: {output_image_path}")

    #합성 이미지 s3저장
    try:
        response = s3_client.upload_file(
            output_image_path,
            os.environ.get('S3_BUCKET'),
            f"{userId}/character.png", 
            ExtraArgs={
                "ContentType": 'image/png',
                "ACL": 'public-read'
            }
        )
        character_url=f"https://{os.environ.get('S3_BUCKET')}.s3.amazonaws.com/{userId}/character.png"
    except ClientError as e:
        logging.error(e)
        return character_url
    return character_url

def process_image_and_create_gif(img_path, userId):
    output_dir = Path(app.instance_path, 'output').relative_to(app.root_path)  # 상대 경로로 변경
    if not output_dir.exists():
        output_dir.mkdir(parents=True, exist_ok=True)

    motion_files = [
        # VBH파일형식 새로 추출해야됨
        # Path('../examples/config/motion/dumbbell_curl_shoulder.yaml'), # 상대 경로로 변경
        # Path('../examples/config/motion/dumbbell_curl.yaml'),
        # Path('../examples/config/motion/dumbbell_floor_fly.yaml'),
        # Path('../examples/config/motion/dumbbell_tricep_extension.yaml'),
        # Path('../examples/config/motion/leg_raises.yaml'),
        # Path('../examples/config/motion/new_kneepushup.yaml'),
        # Path('../examples/config/motion/side_lateral_raises.yaml'),
        Path('AnimatedDrawings', 'examples', 'config', 'motion', 'dab.yaml')
    ]

    gif_paths = []
    for motion_cfg_path in motion_files:
        motion_name = motion_cfg_path.stem  # 파일 이름 추출
        animation_path = output_dir / f"{motion_name}.gif"
        
        # 경로 출력 (디버깅용)
        print(f"output_dir: {output_dir}")
        print(f"motion_cfg_path: {motion_cfg_path}")
        print(str(Path(img_path).relative_to(app.root_path)))
        
        try:
            # 상대 경로로 변경하여 subprocess 실행
            subprocess.run([
                sys.executable, './AnimatedDrawings/examples/image_to_animation.py',
                str(Path(img_path).relative_to(app.root_path)),  # img_path를 상대 경로로
                str(output_dir),  # output_dir도 상대 경로로
                str(motion_cfg_path)  # motion 파일도 상대 경로로
            ], check=True)
            
            # 강제로 이름을 변경
            corrected_gif_path = output_dir / f"{motion_name}.gif"
            actual_gif_path = output_dir / 'video.gif'
            if actual_gif_path.exists():
                if not corrected_gif_path.exists():
                    actual_gif_path.rename(corrected_gif_path)
                gif_paths.append(str(corrected_gif_path))
            #합성 이미지 s3저장
            try:
                response = s3_client.upload_file(
                    corrected_gif_path,
                    os.environ.get('S3_BUCKET'),
                    f"{userId}/gif/{motion_name}.gif", 
                    ExtraArgs={
                        "ContentType": 'image/gif',
                        "ACL": 'public-read'
                    }
                )
                gif_urls = []
                for motion_cfg_path in motion_files:
                    motion_name = motion_cfg_path.stem
                    corrected_gif_path = output_dir / f"{motion_name}.gif"
            
                    # S3에 업로드한 후 파일 URL을 가져옵니다.
                    gif_url = f"https://{os.environ.get('S3_BUCKET')}.s3.amazonaws.com/{userId}/gif/{motion_name}.gif"
                    gif_urls.append(gif_url)
                
            except ClientError as e:
                logging.error(e)
                return e
        except subprocess.CalledProcessError as e:
            app.logger.error(f'Error in animation creation: {e}')
            return e

    return gif_urls

@app.route('/upload-image', methods=['POST'])
def upload_image():
    print("이미지 업로드 시작")
    body_file = request.files['body_image']
    head_file = request.files['head_image']
    userId=request.form.get('userId')
    
    if body_file.filename == '' or head_file.filename == '':
        return 'No image selected for uploading', 400

    if body_file and head_file:
        body_filename = secure_filename(body_file.filename)
        head_filename = secure_filename(head_file.filename)
        body_img_path = Path(app.instance_path) / 'uploads' / body_filename
        head_img_path = Path(app.instance_path) / 'uploads' / head_filename
        body_img_path.parent.mkdir(parents=True, exist_ok=True)
        body_file.save(str(body_img_path))
        head_file.save(str(head_img_path))
        
        # 합성 이미지를 저장할 경로를 지정합니다.
        output_img_path = Path(app.instance_path) / 'processed' / f"processed_{body_filename}"
        output_img_path.parent.mkdir(parents=True, exist_ok=True)
        
        # 합성된 이미지의 경로를 받습니다.
        print("합성 이미지 생성 시작")
        character_url = composite_head_on_body(str(body_img_path), str(head_img_path), str(output_img_path), userId)
        print("합성 이미지 생성 완료")
        gif_urls = process_image_and_create_gif(str(output_img_path), userId)
        print(gif_urls)
        try:
            IP_URL = os.environ.get('NODE_IP_URL')
            PORT = os.environ.get('NODE_PORT')
            response = requests.patch(
                f"http://{IP_URL}:{PORT}/users/{userId}/gif", 
                json = {
                    "characterUrl" : character_url,
                    "gifUrls" : gif_urls
                    }
            )
            if response.status_code == 201:
                print("URLs successfully sent to Node.js server")
                # instance 디렉토리 경로 설정
                instance_dir = Path('./instance')

                # instance 디렉토리가 존재하는 경우 삭제
                if instance_dir.exists() and instance_dir.is_dir():
                    shutil.rmtree(instance_dir)
                    print(f"{instance_dir}가 삭제되었습니다.")
                else:
                    print(f"{instance_dir}가 존재하지 않거나 디렉토리가 아닙니다.")
                socketio.emit('gif_processed', gif_urls)
                return 'success', 201
            else:
                print(f"Failed to send URLs to Node.js server, status code: {response.status_code}", 500)
        except Exception as e:
            print(f"An error occurred: {e}")
    return 'Upload Failed', 400

if __name__ == '__main__':
    instance_dir = Path(app.instance_path)
    instance_dir.mkdir(exist_ok=True, parents=True)
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)