export function convertTime(time: number): string {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time - hours * 3600) / 60);
    const seconds = time - hours * 3600 - minutes * 60;

    return (
        (hours.toString().length == 2
            ? hours.toString()
            : "0" + hours.toString()) +
        " : " +
        (minutes.toString().length == 2
            ? minutes.toString()
            : "0" + minutes.toString()) +
        " : " +
        (seconds.toString().length == 2
            ? seconds.toString()
            : "0" + seconds.toString())
    );
}
