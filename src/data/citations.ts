import { connect } from '../db.js'

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

export function tallyCitations(guildId: string, cited: string): Promise<number>
{   
  const SQL = connect()
  if(SQL == null) return;

  let sql = 'SELECT COUNT(*) AS count FROM citations WHERE `guild` = ' + guildId +
              ' AND `culprit_user` = ' + cited

  //Mariadb should automagically assign a timestamp
  
  return new Promise((resolve, reject) => {
    SQL.query(sql, (err, result) =>
    {
      try{

        result = result[0]?.count ?? 0
        if(err || typeof result !== "number"){
          console.error(err)
          reject(err)
          return
        }
          
        resolve(result)
      }
      catch(E){
        reject(E)
      }
    })
  })
}