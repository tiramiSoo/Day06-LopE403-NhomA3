from fastapi import FastAPI, HTTPException
from contextlib import asynccontextmanager
import joblib, numpy as np, pandas as pd


@asynccontextmanager
async def lifespan(app: FastAPI):
    data = joblib.load("model/cf_artifacts.pkl")
    app.state.user_sim    = data["user_sim"]
    app.state.item_sim    = data["item_sim"]
    app.state.user_item   = data["user_item"]
    app.state.foods       = data["foods"].set_index("food_id")
    app.state.global_mean = data["global_mean"]
    yield

app = FastAPI(title="Vietnamese Food Recommender", lifespan=lifespan)


def _safe_div(num, den):
    out = np.zeros_like(num, dtype=float)
    mask = den > 0
    out[mask] = num[mask] / den[mask]
    return out


@app.get("/recommend/user/{user_id}")
def recommend_user_based(user_id: int, top_n: int = 5, top_k: int = 10):
    """Gợi ý món dựa trên user tương tự."""
    user_sim  = app.state.user_sim
    user_item = app.state.user_item
    foods     = app.state.foods

    if user_id not in user_sim.index:
        raise HTTPException(404, f"user_id {user_id} not found")

    rated      = user_item.loc[user_id].dropna().index
    candidates = user_item.columns.difference(rated)
    neighbors  = user_sim[user_id].drop(user_id, errors="ignore").nlargest(top_k)

    nb_mat = user_item.loc[neighbors.index, candidates]
    sims   = neighbors.values[:, None]
    mask   = nb_mat.notna().values
    num    = (nb_mat.fillna(0).values * sims).sum(axis=0)
    den    = (mask * np.abs(sims)).sum(axis=0)
    scores = pd.Series(_safe_div(num, den), index=candidates)

    top_ids = scores.nlargest(top_n).index
    return {
        "user_id": user_id,
        "method": "user-based",
        "recommendations": [
            {
                "food_id": int(fid),
                "dish_name": foods.loc[fid, "dish_name"],
                "score": round(float(scores[fid]), 4),
            }
            for fid in top_ids if fid in foods.index
        ],
    }


@app.get("/recommend/item/{user_id}")
def recommend_item_based(user_id: int, top_n: int = 5, threshold: float = 3.5):
    """Gợi ý món dựa trên món tương tự với món đã thích."""
    item_sim  = app.state.item_sim
    user_item = app.state.user_item
    foods     = app.state.foods

    if user_id not in user_item.index:
        raise HTTPException(404, f"user_id {user_id} not found")

    liked = user_item.loc[user_id].dropna()
    liked = liked[liked >= threshold]
    if liked.empty:
        raise HTTPException(400, "User has no highly-rated items to base recommendations on")

    rated      = user_item.loc[user_id].dropna().index
    candidates = user_item.columns.difference(rated)
    cands      = candidates.intersection(item_sim.index)
    l_cols     = liked.index.intersection(item_sim.columns)

    S   = item_sim.loc[cands, l_cols].values
    lv  = liked[l_cols].values
    den = np.abs(S).sum(axis=1)
    scores = pd.Series(_safe_div(S @ lv, den), index=cands)

    top_ids = scores.nlargest(top_n).index
    return {
        "user_id": user_id,
        "method": "item-based",
        "recommendations": [
            {
                "food_id": int(fid),
                "dish_name": foods.loc[fid, "dish_name"],
                "score": round(float(scores[fid]), 4),
            }
            for fid in top_ids if fid in foods.index
        ],
    }


@app.get("/foods/{food_id}")
def get_food(food_id: int):
    """Lấy thông tin chi tiết một món."""
    foods = app.state.foods
    if food_id not in foods.index:
        raise HTTPException(404, f"food_id {food_id} not found")
    return {"food_id": food_id, **foods.loc[food_id].to_dict()}