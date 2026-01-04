import json
import os
import time
from datetime import datetime, timezone

from bson import ObjectId
from pymongo import MongoClient


def parse_value(v):
    # Handle extended JSON for ObjectId and date
    if isinstance(v, dict):
        if "$oid" in v:
            return ObjectId(v["$oid"])
        if "$date" in v:
            d = v["$date"]
            if isinstance(d, dict) and "$numberLong" in d:
                ms = int(d["$numberLong"])
                return datetime.fromtimestamp(ms / 1000, tz=timezone.utc)
            if isinstance(d, str):
                try:
                    return datetime.fromisoformat(d.replace("Z", "+00:00"))
                except Exception:
                    pass
    return v


def transform_doc(doc):
    if isinstance(doc, dict):
        new = {}
        for k, v in doc.items():
            if isinstance(v, list):
                new[k] = [transform_doc(x) for x in v]
            else:
                new[k] = transform_doc(v)
        return new
    else:
        return parse_value(doc)


def load_json(path):
    with open(path, "r", encoding="utf-8") as f:
        raw = json.load(f)
    return [transform_doc(d) for d in raw]


def wait_for_mongo(client, timeout=30):
    start = time.time()
    while True:
        try:
            client.admin.command("ping")
            return True
        except Exception:
            if time.time() - start > timeout:
                return False
            time.sleep(1)


def main():
    mongo_uri = os.environ.get("MONGODB_URI", "mongodb://mongo:27017")
    db_name = os.environ.get("MONGODB_DB_NAME", "movie_explorer")

    client = MongoClient(mongo_uri)
    ok = wait_for_mongo(client, timeout=60)
    if not ok:
        print("Timed out waiting for MongoDB")
        raise SystemExit(1)

    db = client[db_name]

    base = os.path.join(os.path.dirname(__file__), "data")

    mapping = {
        "actors.json": "actors",
        "directors.json": "directors",
        "genres.json": "genres",
        "movies.json": "movies",
    }

    for fname, coll_name in mapping.items():
        path = os.path.join(base, fname)
        if not os.path.exists(path):
            print(f"Skipping missing {path}")
            continue
        docs = load_json(path)
        coll = db[coll_name]
        inserted = 0
        for doc in docs:
            # upsert by _id when present
            if "_id" in doc:
                coll.replace_one({"_id": doc["_id"]}, doc, upsert=True)
            else:
                coll.insert_one(doc)
            inserted += 1
        print(f"Upserted {inserted} documents into {coll_name}")


if __name__ == "__main__":
    main()
