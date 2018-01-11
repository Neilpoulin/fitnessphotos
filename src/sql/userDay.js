export const UPSERT_USER_DAY = 'insert or replace into user_day(day_key, user_id, mind_score, body_score, food_score, photo_uri, weight_lbs) VALUES ( ?, ?, ?, ?, ?, ?, ?);'

export const UPDATE_USER_DAY_SQL = 'update user_day set mind_score = ?, body_score = ?, food_score = ?, photo_uri = ?, weight_lbs = ? where user_day.day_key = ? AND user_day.user_id = ?;'

export const GET_USER_DAY_SQL = 'select ROWID, * from user_day where user_day.day_key = ? AND user_day.user_id = ?;'