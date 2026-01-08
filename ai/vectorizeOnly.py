import os
from supabase import create_client
from dotenv import load_dotenv
from tqdm import tqdm

#실제 분석 로직 담겨 있는 파일(라이브러리라고 생각하면 됨)
import imageVectorization

load_dotenv()
supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))

def bulk_vectorize():
    print("🧬 [Pre-processing] 이미지 벡터화 시작...")
    
    #1. !inner 조인 및 null 필터링 적용
    response = supabase.table("outfit_items")\
        .select("id, category, outfits!inner(image_url, celebrity_id)")\
        .is_("embedding", "null")\
        .execute()
    
    items = response.data
    if not items:
        print("✅ 모든 유효한 이미지(데이터)의 벡터화 완료.")
        return

    print(f"📊 분석 대상: {len(items)}개")

    for item in tqdm(items, desc="임베딩 추출 중"):
        try:
            item_id = item['id']
            main_cat = item.get('category')
            
            #outfits 정보 추출
            outfit_info = item.get('outfits', {})
            image_url = outfit_info.get('image_url')
            celeb_id = outfit_info.get('celebrity_id')

            #2. 이미지, 카테고리(top, outer 등), 셀럽 없으면 분석하지 않음
            if not image_url or not main_cat or not celeb_id:
                print(f"\n⚠️ 데이터 불완전성으로 인해 분석하지 않음: ID {item_id}")
                continue

            #벡터 추출
            vector = imageVectorization.get_features_from_url(image_url)
            
            if vector:
                #Supabase의 embedding 컬럼 업데이트
                supabase.table("outfit_items")\
                    .update({"embedding": vector})\
                    .eq("id", item_id)\
                    .execute()
                    
        except Exception as e:
            print(f"\n❌ 처리 실패 (ID {item_id}): {e}")

if __name__ == "__main__":
    bulk_vectorize()