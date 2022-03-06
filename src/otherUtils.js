/**
 * @param {number} time 
 * @returns {string} 
 */
module.exports.formatDuration = (time) => {

    const units = [
        {
            timeInSeconds: 365 * 24 * 60 * 60,
            singularName: "an",
            plurialName: "ans"
        },
        {
            timeInSeconds: 30 * 24 * 60 * 60,
            singularName: "mois",
            plurialName: "mois"
        },
        {
            timeInSeconds: 24 * 60 * 60,
            singularName: "jour",
            plurialName: "jours"
        },
        {
            timeInSeconds: 60 * 60,
            singularName: "heure",
            plurialName: "heures"
        },
        {
            timeInSeconds: 60,
            singularName: "minute",
            plurialName: "minutes"
        },
        {
            timeInSeconds: 1,
            singularName: "seconde",
            plurialName: "secondes"
        }
    ];

    units.sort((a, b) => b.timeInSeconds - a.timeInSeconds);
    time /= 1000;

    let result = units.map((unit) => {

        let amount = 0;
        while (time >= unit.timeInSeconds) {
            amount++;
            time -= unit.timeInSeconds;
        }

        return amount > 0 ? `${amount} ${amount > 1 ? unit.plurialName : unit.singularName}` : null;

    }).filter((amount) => !!amount).join(", ");

    const i = result.lastIndexOf(",");
    if (i > 0) result = result.substring(0, i) + " et" + result.substring(i + 1);

    return result || "Moins d'une seconde";
}