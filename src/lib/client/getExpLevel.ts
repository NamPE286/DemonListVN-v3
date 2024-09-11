interface ExpLevel {
    level: number,
    lowerBound: number,
    upperBound: number,
    progress: number
}

export function getExpLevel(exp: number) {
    let res: ExpLevel = {
        level: 0,
        lowerBound: 0,
        upperBound: 0,
        progress: 0
    }

    while (true) {
        if (res.level == 0) {
            res.upperBound = 50
        } else if (res.level <= 3) {
            res.lowerBound = res.upperBound
            res.upperBound = Math.round(res.upperBound * 2)
        } else if (res.level <= 50) {
            res.lowerBound = res.upperBound
            res.upperBound = Math.round(res.upperBound * 1.2)
        } else {
            res.lowerBound = res.upperBound
            res.upperBound = Math.round(res.upperBound * 1.01)
        }

        res.level++;

        if (res.lowerBound <= exp && exp < res.upperBound) {
            break
        }
    }

    res.progress = Math.round(((res.upperBound - exp) / (res.upperBound - res.lowerBound)) * 1000) / 10

    return res
}