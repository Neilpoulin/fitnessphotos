const KG_TO_LB = 2.204622622

export function kgToLbs(kg) {
    return (Number(kg) * KG_TO_LB).toFixed(1)
}