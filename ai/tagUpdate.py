import os
import torch
from supabase import create_client
from dotenv import load_dotenv
from tqdm import tqdm
import json

#실제 분석 로직 담겨 있는 파일(라이브러리라고 생각하면 됨)
import autoTagging

# 1. DB 연결 설정
load_dotenv()
supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))

def run_main_process():
    print("🚀 MOA AI: 자동 태깅 시작...")

    # 2. 분석할 데이터 읽어오기
    # - 조건: 임베딩은 있고(not.is_null), 세부 카테고리는 없는(is_null) 데이터
    # - 조인: affiliate_products에서 product_name도 같이 가져옴
    response = supabase.table("outfit_items")\
        .select("id, category, embedding, affiliate_products!outfit_item_id(product_name)")\
        .not_.is_("embedding", "null")\
        .is_("sub_category", "null")\
        .limit(2)\
        .execute()
    
    items = response.data
    
    if not items:
        print("✅ 새로 분석할 데이터가 없습니다.")
        return

    # 3. 데이터 루프 돌며 분석 지시
    for item in tqdm(items, desc="데이터 정밀 분석 중"):
        try:
            item_id = item['id']
            main_cat = item['category']
            vector = item['embedding']
            
            if isinstance(vector, str):
                vector = json.loads(vector)

            vector = [float(x) for x in vector]

            # affiliate_products에서 product_name 추출
            affiliate_info = item.get('affiliate_products', [])
            product_name = affiliate_info[0].get('product_name') if affiliate_info else None

            # 4. autoTagging 모듈
            img_features = torch.tensor([vector]).to(autoTagging.DEVICE)
            analysis_results = autoTagging.analyze_item(img_features, main_cat, product_name)

            # 5. Supabase에 정보 업데이트
            supabase.table("outfit_items")\
                .update(analysis_results)\
                .eq("id", item_id)\
                .execute()

        except Exception as e:
            print(f"\n❌ 오류 발생 (ID {item_id}): {e}")

if __name__ == "__main__":
    run_main_process()