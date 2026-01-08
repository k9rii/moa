import os
import torch
import requests
from io import BytesIO
from PIL import Image
from transformers import CLIPProcessor, CLIPModel
from rembg import remove
from dotenv import load_dotenv

load_dotenv()

# fashion-CLIP 모델 로드
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
MODEL_NAME = "patrickjohncyh/fashion-clip"

print(f"📦 Fashion-CLIP 모델 로드 중... ({DEVICE})")
model = CLIPModel.from_pretrained(MODEL_NAME).to(DEVICE)
processor = CLIPProcessor.from_pretrained(MODEL_NAME)

def get_features_from_url(image_url: str):
    try:
        # 1. 이미지 다운로드
        response = requests.get(image_url, timeout=10)
        img = Image.open(BytesIO(response.content)).convert("RGBA")

        # 2. 배경 제거
        no_bg_img = remove(img)
        
        # 3. 전처리(224*224 사이즈 & 회색 배경)
        target_size = (224, 224)
        no_bg_img.thumbnail(target_size, Image.Resampling.LANCZOS)

        analysis_img = Image.new("RGB", target_size, (128, 128, 128))
        analysis_img.paste(
            no_bg_img, 
            ((target_size[0] - no_bg_img.size[0]) // 2, (target_size[1] - no_bg_img.size[1]) // 2), 
            mask=no_bg_img.split()[3]
        )

        # 4. Fashion-CLIP 특징 추출
        inputs = processor(images=analysis_img, return_tensors="pt").to(DEVICE)
        
        with torch.no_grad():
            features = model.get_image_features(**inputs)
        
        # 5. L2 정규화(정확도 위해) 및 리스트 변환(Supabase에 저장하기 위해)
        features /= features.norm(dim=-1, keepdim=True)
        
        return features.squeeze().cpu().tolist()

    except Exception as e:
        print(f"❌ 벡터화 오류 발생: {e}")
        return None