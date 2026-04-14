import { connect } from "../db";
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

export function tallyQuotes(guildId: string, quoted: string, callback: (count: number) => any)
{   
    const SQL = connect()
    if(SQL == null) return;

    let sql = 'SELECT COUNT(*) FROM quotes WHERE `guild` = ' + guildId +
                ' AND `quoted_user = ' + quoted

    //Mariadb should automagically assign a timestamp
    
    SQL.query(sql, (err, result: number) =>
    {
        if(err) throw err
        if(typeof result !== "number") throw("Expected query to return a number")

        
        callback(result);
    })
}