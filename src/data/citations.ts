import { connect } from '../db'

export function submitCitation(guildId: string, culprit: string, reason: string = "vore")
{
  const SQL = connect()
  if(SQL == null) return;
  SQL.query(`INSERT INTO citations (guild, culprit_user, reason) VALUES ('${guildId}', '${culprit}', '${reason}');`, (err, result) =>
    {
      if(err) console.error(err)
      else console.log("Citation saved")
    })
}