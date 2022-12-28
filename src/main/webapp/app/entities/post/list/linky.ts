import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'linkify',
})
export class LinkifyPipe implements PipeTransform {
  transform(content: string): string {
    let link: string;
    let text: string;

    // Extract the link from the content
    if (content.includes('http')) {
      let index = content.indexOf('http');
      link = content.substring(index);
      text = content.substring(0, index);
    } else {
      text = content;
    }

    return link ? `<a href="${link}">${text}</a>` : text;
  }
}
