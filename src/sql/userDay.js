export const UPSERT_USER_DAY = 'insert or replace into user_day(day_key, user_id, mind_score, body_score, food_score, photo_uri, weight_lbs, steps) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?);'

export const GET_USER_DAY_SQL = 'select ROWID, * from user_day where user_day.day_key = ? AND user_day.user_id = ?;'