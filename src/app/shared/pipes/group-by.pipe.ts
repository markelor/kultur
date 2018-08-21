import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'groupBy'
})
export class GroupByPipe implements PipeTransform {

  transform(value: Array<any>, field: string): Array<any>  {
    if(!value) {
        return null;
    }
    const groupedObj = value.reduce((prev, cur)=> {;
      if(field==='originCommentId'&&!cur.originCommentId.length){
        cur.firstOriginCommentId=cur._id;
        cur.reply=false;
      }else if(field==='originCommentId'&&cur.originCommentId.length){
        cur.firstOriginCommentId=cur.originCommentId[0];       
        cur.reply=true;
      }else if(field==='firstParentId'&&!cur.firstParentId){
        cur.firstParentId=cur._id;   
      }  
      if(!prev[cur[field]]) {
        prev[cur[field]] = [cur];
      } else {
        prev[cur[field]].push(cur);
      }
      return prev;
    }, {});
    return Object.keys(groupedObj).map(key => ({ key, value: groupedObj[key] }));
  }
}
