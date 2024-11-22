import google.generativeai as genai
import pandas as pd
import faiss
from sentence_transformers import SentenceTransformer
import re
import pandasql as ps
import numpy as np
from ast import literal_eval
import pickle
import time
from datetime import datetime

genai.configure(api_key="AIzaSyDndA4vlnZdh1jQ37BKEkOlQ3B3t1XMkyk")
assistant = genai.GenerativeModel("gemini-1.5-flash")

def response_1(question):
    now = datetime.now()
    formatted_time = now.strftime("%m-%d-%A-%p-%I-%M")
    print(f"현재 시간: {formatted_time}")
    print("---------------------------------------------response_1-----------------------------------------")
    with open('/home/skdudgns/Festival/backend/api/ai/data/final.pkl', 'rb') as file:  # 'rb'는 바이너리 읽기 모드
        data_ = pickle.load(file)
    response_1 = assistant.generate_content(f"""system: 너는 제주도 맛집 추천을 위한 데이터 filter야. 주어진 질문을 보고 이 중 답변에 필요한 사전정보를 얻기 위한 pandasql에 적용 가능한 쿼리를 작성하고, 왜 그렇게 생각했는지 이유를 "reason"태그를 달아서 작성해줘

Tip: '근처'의 정의는 주소 컬럼의 값이 같다.
영업시간 - [아침, 점심, 저녁, 늦은 저녁, 새벽]의 값 중 포함되는 값들을 지니고 있는 "아침, 점심" 과 같은 형태를 가지고 있어 쿼리문 작성할때는 %점심% 같은 방식으로 작성해
휴무일 - "월, 화, 수, 목"과 같은 방식으로 되어 있어. 마찬가지로 %월% 같은 방식으로 작성해
업종-대분류 - [일반 음식점, 술집, 카페/디저트] 중 하나의 값을 가지고 있어
주소는 "해변가", "산 주위" 와 같은 데이터는 가지고 있지 않아
리뷰 컬럼에서는 %한라산%, %바닷가%, %성산일출봉%과 같은 형식을 사용해도 좋아.
테이블의 이름은 df야
현재 시간: {formatted_time}

columns:'가맹점명', '개설일자', '업종-대분류', '주소', '이용 건수 상위 퍼센트', '이용 금액 상위 퍼센트',
'건당 평균 이용 금액 상위 퍼센트', '제주도민 이용자 건수 퍼센트', '최근 12개월 남성 이용자 퍼센트',
'최근 12개월 여성 이용자 퍼센트', '최근 12개월 20대 이하 이용자 퍼센트', '최근 12개월 30대 이용자 퍼센트',
'최근 12개월 40대 이용자 퍼센트', '최근 12개월 50대 이용자 퍼센트', '최근 12개월 60대 이상 이용자 퍼센트',
'휴무일', '영업시간', '리뷰'
질문: {question}""")
    print("-----response-----")
    print(response_1.text)
    query = response_1.text.split("```")
    query = query[1][4:]
    query = re.sub(r"^SELECT\s+[^\s]+", "SELECT *", query)
    print("-----query-----")
    print(query[1][4:])
    try:
        result_df = ps.sqldf(query, {'df': data_})
    except:
        result_df, _ = response_1(question)
    print("-----query_result-----")
    print(result_df)
    if len(result_df) <= 9: 
        data = data_
    else:
        data = result_df
        data["embedding"] = data["primary_key"].apply(lambda x: data_.iloc[int(x)]["embedding"])
    data_embeded = data['embedding']
    embedding_dim = len(data_embeded[0])
    try:
        data_embeded = np.array(data_embeded.tolist(), dtype=np.float32)
    except:
        data['embedding'] = data['embedding'].apply(lambda x: np.frombuffer(x, dtype=np.float32))
        embedding_dim = len(data_embeded[0])
        data_embeded = np.array(data_embeded.tolist(), dtype=np.float32)

    index = faiss.IndexFlatL2(embedding_dim)
    index.add(data_embeded)
    model = SentenceTransformer("intfloat/multilingual-e5-large-instruct")
    query_vector = model.encode(question)
    query_vector = query_vector.reshape(1, -1)
    query_vector = np.array(query_vector, dtype=np.float32)
    k = 9
    _, labels = index.search(query_vector, k)
    if len(result_df) <= 3:
        result_df = pd.concat([result_df, data.iloc[labels[0]]], axis=0, ignore_index=True)
    elif len(result_df) >= 10:
        result_df = data.iloc[labels[0]]
    return result_df

def response_3(question, filtered_df):
    now = datetime.now()
    formatted_time = now.strftime("%m-%d-%A-%p-%I-%M")
    filtered_data = []
    filtered_df = filtered_df.drop(columns = "embedding")
    for i in range(len(filtered_df)):
        filtered_data.append(" ".join([col + ":"+ str(filtered_df.iloc[i][col]) for col in filtered_df.columns]))
    filtered_data = "\n".join(filtered_data)
    print("-----filtered_data-----")
    print(filtered_data)
    print("\n---------------------------------------------response_3-----------------------------------------\n")
    response_3 = assistant.generate_content(f"""system: 현지인 가이드처럼, 추천한 이유를 격식있게 말해야 해. 
각 음식점 추천이 끝난 뒤에는 "https://search.naver.com/search.naver?where=nexearch&query=제주+" 뒤에 해당 음식점 이름을 붙인 링크를 주석으로 달아줘.
맛집 추천은 최대 5개까지만!
과하지 않은 이모티콘은 사용해도 돼.
현재 시간: {formatted_time}
네 이름: 돌하르방
question: {question}
음식점 리스트: {filtered_data}""")
    print("-----final_response-----")
    print(response_3.text.replace("*", ""))
    text = re.sub(r"(\]\(https?://[^\)]+\))(?!\n)", r"\1\n", response_3.text.replace("*", ""))
    return text

def generate_response(question):
    result_df = response_1(question)

    final_answer = response_3(question, result_df)

    return final_answer

if __name__ == "__main__":
    question = '중문 숙성도처럼 숙성고기 파는데 웨이팅은 적은 식당 있을까'
    generate_response(question)

