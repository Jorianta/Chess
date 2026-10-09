import { connect } from '../db.js'

export function registerWorkout(name: string, type?: string)
{
  const SQL = connect()
  if(SQL == null) return;
  SQL.query(`MERGE INTO workouts (workout_name, workout_type) VALUES ('${name}', '${type || "NULL"}' );`, (err, result) =>
    {
      if(err) console.error(err)
      else console.log("Citation saved")
    })
}

export function submitPR(guildId: string, culprit: string, reason: string = "vore")
{
  const SQL = connect()
  if(SQL == null) return;
  SQL.query(`MERGE INTO personal_records (guild, culprit_user, reason) VALUES ('${guildId}', '${culprit}', '${reason}');`, (err, result) =>
    {
      if(err) console.error(err)
      else console.log("Citation saved")
    })
}

export async function getPRs(user: string, workout_name?: string)
{
  const SQL = connect()
  if(SQL == null) return;
  let q = `SELECT workout, score FROM personal_records WHERE user = ${user}`

  if(workout_name) q += ` AND workout LIKE '%${workout_name}%'`
  SQL.query(q)
}

