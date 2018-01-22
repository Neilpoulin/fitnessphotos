export const CREATE_USER_DAY_TABLE = `create table if not exists user_day(
  day_key string not null,
  user_id integer not null,
  mind_score integer,
  body_score integer,
  food_score integer,
  photo_uri text,
  weight_lbs real,
  steps integer,
  created_at integer default CURRENT_TIMESTAMP,
  modified_at integer default CURRENT_TIMESTAMP,

  CONSTRAINT uidx_userday_useriddaykey UNIQUE (user_id, day_key)
);`

export const ADD_STEPS = `alter table user_day add column steps integer`

export const CREATE_USER_DAY_TRIGGER = `CREATE TRIGGER if NOT EXISTS f_stamp_modified
  BEFORE
  UPDATE
  ON user_day
BEGIN
  UPDATE user_day
  SET modified_at = CURRENT_TIMESTAMP;
END;`