import os, json, gspread, boto3, datetime
gc = gspread.service_account()
s3 = boto3.client("s3")
for sheet in ["store_sheet","tour_notice_sheet","gov_policy_sheet","welfare_sheet","live_news_sheet","story_post_sheet"]:
    data = gc.open(sheet).sheet1.get_all_records()
    key = f"backup/{sheet}/{datetime.date.today()}.json"
    s3.put_object(Bucket="autorise-backup", Key=key, Body=json.dumps(data)) 