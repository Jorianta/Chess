
export function insertSorted<T>(x: T, arr: T[], metric: (a: T, b:T) => number)
{
    if(arr.length===0)
    {
        arr[0] = x;
        return;
    }

    let i = 0;
    for(; i<arr.length; i++)
    {
        if(metric(x, arr[i])<0)break;
    }

    arr.splice(i,0, x)
}

// returns index of the most extreme element, whatever that means. metric is a function that returns the difference between two elements, positive if a>b
export function extreme<T>(arr: T[], metric: (a:T,b:T)=>number){
    if(arr.length <= 0) throw 'length must be > 0'

    let extreme = 0;
    for(let i=1; i<arr.length; i++){
        const a = arr[extreme],
            b = arr[i]
        if(metric(a, b)>=0) continue

        extreme = i
    }

    return extreme
}

export function shuffle<T>(array: T[]): T[] {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array
}
