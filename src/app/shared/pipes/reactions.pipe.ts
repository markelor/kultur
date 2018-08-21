import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reactionsPipe'
})
export class ReactionsPipe implements PipeTransform {

  transform(reactions: any,amount: any): any {
  	var reactioner=[];
    var response ='';
    var j=0;
    if(amount==1){
      for (var i = reactions.length - 1; i >= 0; i--) {
        if(reactioner.indexOf(reactions[i])<0){
          reactioner.push(reactions[i]);
          if(j!=0){
            response+='\n';
          }
          response+=reactions[i];
          j++;
        }
      }
    }else{
      var reaction;

      for(var k=0;k<amount;k++){
        if(k==0){reaction=reactions.likeBy}
        else if(k==1){reaction=reactions.loveBy}
        else if(k==2){reaction=reactions.hahaBy}
        else if(k==3){reaction=reactions.wowBy}
        else if(k==4){reaction=reactions.angryBy}
        else if(k==5){reaction=reactions.sadBy}
        for (var i = reaction.length - 1; i >= 0; i--) {
          if(reactioner.indexOf(reaction[i])<0){
            reactioner.push(reaction[i]);
            if(j!=0){
              response+='\n';
            }
            response+=reaction[i];
            j++;
          }
        }
      }
    }
    return response;
  }

}
