import { connect } from "../db.js";
import { Query } from "mysql";



export function submitQuote(guildId: string, quoted: string, clipper: string)
{
  const SQL = connect()

  //Mariadb should automagically assign a timestamp
  SQL.query(`INSERT INTO quotes (guild, quoted_user, clipping_user) VALUES ('${guildId}', '${quoted}', '${clipper}');`, (err, result) =>
  {
    if(err) throw err
    console.log("Quote saved")
  })
}

export function tallyQuotes(guildId: string, quoted: string): Promise<number>
{   
  const SQL = connect()
  if(SQL == null) return;

  let sql = 'SELECT COUNT(*) FROM quotes WHERE `guild` = ' + guildId +
              ' AND `quoted_user = ' + quoted

  //Mariadb should automagically assign a timestamp
  
  return new Promise((resolve, reject) => {
    SQL.query(sql, (err, result) =>
    {
      if(err || typeof result !== "number"){
        console.error(err)
        reject(err)
        return
      }
        
        resolve(result)
    })
  })
}