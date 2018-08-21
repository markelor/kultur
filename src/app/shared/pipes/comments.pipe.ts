import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'commentsPipe'
})
export class CommentsPipe implements PipeTransform {

  transform(comments: any): any {
  	var commentator=[];
    var response ='';
    var j=0;
    for (var i = comments.length - 1; i >= 0; i--) {
      if(commentator.indexOf(comments[i].createdBy)<0){
        commentator.push(comments[i].createdBy);
        if(j!=0){
          response+='\n';
        }
        response+=comments[i].createdBy;
        j++;
      }
    }
    return response;
  }

}
