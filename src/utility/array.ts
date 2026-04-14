
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