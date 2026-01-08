import torch
from transformers import CLIPProcessor, CLIPModel

#fashion-CLIP 모델
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
MODEL_NAME = "patrickjohncyh/fashion-clip"

print(f"📦 [autoTagging] 모델 로드 중... ({DEVICE})")
model = CLIPModel.from_pretrained(MODEL_NAME).to(DEVICE)
processor = CLIPProcessor.from_pretrained(MODEL_NAME)

#category 보고 sub_category 정할 수 있도록 -> DB에 넘겨줄 것 (sub_cat)
CATEGORY_GROUPS = {
    "top": [
        "Short-sleeve T-shirt", "Long-sleeve T-shirt", "Short-sleeve Shirt", 
        "Long-sleeve Shirt", "Blouse", "Sweatshirt", "Hoodie", "Sweater", "Cardigan"
    ],
    "outer": ["Jacket"],
    "pants": ["Pants"],
    "skirt": ["Skirt"],
    "dress": ["Dress"],
    "shoes": ["Shoes"],
    "accessory": ["Cap", "Case"]
}

#소재, 색상, 패턴 정의 -> DB에 넘겨줄 것 
MATERIALS = ["cotton", "denim", "leather", "knit", "chiffon", "lace", "fur"] 
COLORS = ["black", "charcoal", "gray", "brown",
          "white", "beige", "ivory", "cream",
          "red", "pink", "orange", "yellow", "green", 
          "sky-blue", "blue", "navy-blue", "purple"]
PATTERNS = ["solid", "striped", "checkered", "leopard"]

#affiliate_products의 product_name을 이용하여 AI 결과 보정
# -> 소재, 색상, 패턴, 카테고리 최종 확정 
CORRECTION_MAP = {
    "sub_category": {
        "Hoodie": "Hoodie", "Sweatshirt": "Sweatshirt", "Cardigan": "Cardigan",
        "Sweater": "Sweater", "Knit": "Sweater", "T-shirt": "Short-sleeve T-shirt",
        "Tee": "Short-sleeve T-shirt", "Shirt": "Long-sleeve Shirt", "Blouse": "Blouse", 
        "Dress": "Dress", "One-piece": "Dress", "Cap": "Cap", "Phone": "Case","Jacket": "Jacket"
    },
    "material": {
        "Denim": "denim", "Leather": "leather", "Knit": "knit", "Wool": "knit",
        "Cotton": "cotton", "Chiffon": "chiffon", "Lace": "lace", "Fur": "fur"
    },
    "color": {
        "Black": "black", "Charcoal": "charcoal", "Gray": "gray", "Grey": "gray", "Brown": "brown",
        "White": "white", "Beige": "beige", "Ivory": "ivory", "Cream": "cream",
        "Red": "red", "Pink": "pink", "Orange": "orange", "Yellow": "yellow", "Green": "green",
        "Sky-blue": "sky-blue", "Navy": "navy-blue", "Blue": "blue", "Purple": "purple"
    },
    "pattern": {
        "Striped": "striped", "Checkered": "checkered", "Plaid": "checkered",
        "Leopard": "leopard", "Hopi": "leopard", "Animal": "leopard"
    }
}

def get_clip_label(image_features, labels, prompts):
    text_inputs = processor(text=prompts, return_tensors="pt", padding=True).to(DEVICE)
    with torch.no_grad():
        text_features = model.get_text_features(**text_inputs)
        text_features /= text_features.norm(dim=-1, keepdim=True)
    return labels[(image_features @ text_features.T).argmax().item()]

def get_structured_prompts(labels, type, context="clothing", mat=None):
    prompts = []
    for l in labels:
        if type == "category":
            if l == "Cardigan": prompts.append("a photo of a soft knitted cardigan with a visible front opening and buttons")
            elif l == "Sweater": prompts.append("a photo of a long-sleeved knitted pullover sweater with NO buttons")
            elif "Shirt" in l: prompts.append(f"a photo of a structured {l.lower()} with a stiff formal collar")
            elif l == "Blouse": prompts.append("a photo of a feminine, soft flowing blouse made of light and thin fabric")
            elif l == "Dress": prompts.append("a photo of a one-piece dress covering both top and bottom")
            elif l == "Case": prompts.append("a photo of a smartphone case or a protective electronic case")
            else: prompts.append(f"a photo of a {l.lower()}")
        elif type == "material":
            if l == "knit": prompts.append("soft knitted fabric with interlocking loops of wool yarn")
            elif l == "lace": prompts.append("delicate decorative fabric with a web-like pattern")
            elif l == "fur": prompts.append("soft thick hairy coat of a mammal, fuzzy texture")
            else: prompts.append(f"the material is {l}")
        elif type == "pattern":
            if l == "solid": prompts.append(f"plain {context} with no prints")
            else: prompts.append(f"{context} with a distinct {l} design")
        else:
            prompts.append(f"a photo of a {l} color {context}")
    return prompts

def analyze_item(img_features, main_cat, product_name=None):
    # [Step 1] 후보군 필터링
    candidates = CATEGORY_GROUPS.get(main_cat, [])
    if not candidates:
        return {"sub_category": "unknown", "material": "unknown", "color": "unknown", "pattern": "solid"}

    # [Step 2] 세부 카테고리 결정
    if len(candidates) == 1:
        sub_cat = candidates[0]
    else:
        if main_cat == "top":
            is_short = get_clip_label(img_features, [True, False], ["short sleeves", "long sleeves"])
            if is_short and "Sweater" in candidates:
                candidates = [c for c in candidates if c != "Sweater"]
        sub_cat = get_clip_label(img_features, candidates, get_structured_prompts(candidates, "category"))

    # [Step 3] 물리적 구조 검증
    has_opening = get_clip_label(img_features, [True, False], ["visible front opening with buttons", "closed front"]) if main_cat == "top" else False
    has_hood = get_clip_label(img_features, [True, False], ["with a fabric hood", "NO hood"]) if main_cat == "top" else False

    # [Step 4] 소재 분석
    mat = get_clip_label(img_features, MATERIALS, get_structured_prompts(MATERIALS, "material", sub_cat))
    
    # [Step 5] 상의(Top) 계층적 교정 로직
    if main_cat == "top":
        if has_opening and mat == "knit": sub_cat = "Cardigan"
        elif not has_opening and mat == "knit": sub_cat = "Sweater"
        if sub_cat == "Hoodie" and not has_hood: sub_cat = "Sweatshirt"
        elif has_hood and sub_cat in ["Sweatshirt", "Sweater"]: sub_cat = "Hoodie"
        if sub_cat == "Sweatshirt" and mat == "knit": sub_cat = "Sweater"
        elif sub_cat == "Sweater" and mat == "cotton": sub_cat = "Sweatshirt"
        if "Shirt" in sub_cat and mat == "chiffon": sub_cat = "Blouse"

    # [Step 6] 색상 및 패턴 분석
    color = get_clip_label(img_features, COLORS, get_structured_prompts(COLORS, "color", sub_cat))
    is_patterned = get_clip_label(img_features, [False, True], ["plain solid color", "clear printed patterns"])
    pattern = get_clip_label(img_features, PATTERNS, get_structured_prompts(PATTERNS, "pattern", sub_cat, mat)) if is_patterned else "solid"
    
    analysis = {
        "sub_category": sub_cat, "material": mat, "color": color, "pattern": pattern
    }

    # [Step 7] 하이브리드 보정 (상품명 기반 텍스트 오버라이드)
    if product_name:
        p_name_upper = product_name.upper()
        for attr, keywords in CORRECTION_MAP.items():
            for kw, val in keywords.items():
                if kw.upper() in p_name_upper:
                    analysis[attr] = val
                    break
    
    return analysis