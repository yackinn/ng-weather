import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlight',
})
export class HighlightPipe implements PipeTransform {
  transform(value: any, args: any): any {
    if (!args) {
      return value;
    }

    const regex = new RegExp(args, 'gi');
    const match = value.match(regex);

    if (!match) {
      return value;
    }

    return (value as string).replace(regex, function(match) {
      return `<span class='highlight'>${match}</span>`;
    });
  }
}
