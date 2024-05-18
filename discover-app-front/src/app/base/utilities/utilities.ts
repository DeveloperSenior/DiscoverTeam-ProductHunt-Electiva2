import { Pipe, PipeTransform } from "@angular/core";
import moment from 'moment';

export enum StarRatingColor {
  primary = "primary",
  accent = "accent",
  warn = "warn"
}

@Pipe({
  name: 'dateformatter',
})
export class DateFormatterPipe implements PipeTransform {
  transform(value: any, format: string = 'YYYY-MM-DD'): string {

    const cntrlValue = moment(value)
    cntrlValue.year(cntrlValue.year());
    cntrlValue.month(cntrlValue.month());
    cntrlValue.day(cntrlValue.day());
    return cntrlValue.format(format);
  }
}
