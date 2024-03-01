import { isValidDateString } from "../utils";

function parseAndValidateDate(dateString: string | undefined, today: Date): Date | undefined {
    return dateString ? isValidDateString(dateString, today) : undefined;
}

export function getDateFromParams(date: string | undefined, today: Date): { from: Date | undefined; to: Date | undefined } {
    const [fromString, toString] = date ? date.split('.') : ["", ""];
    const from = parseAndValidateDate(fromString, today);
    const to = parseAndValidateDate(toString, today);

    return { from, to };
}