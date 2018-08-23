import { Component, OnInit, Input,PLATFORM_ID, APP_ID, Inject } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { LocalizeRouterService } from 'localize-router';
import { Comment } from '../../class/comment';
import { AuthService } from '../../services/auth.service';
import { CommentService } from '../../services/comment.service';
import { AuthGuard} from '../../pages/guards/auth.guard';
import { ActivatedRoute,Router,NavigationEnd } from '@angular/router';
import { GroupByPipe } from '../../shared/pipes/group-by.pipe';
import { isPlatformBrowser, CommonModule } from '@angular/common';
declare let $: any;
@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css'],
})
export class CommentComponent implements OnInit {
  public form:FormGroup;
  public comment:AbstractControl;
  public formEdit:FormGroup;
  public commentEdit:AbstractControl;
  private editId;
  public message;
  public messageClass;
  private commentClass:Comment=new Comment();
  public comments;
  public submitted:boolean = false;
  public submittedEdit:boolean = false;
  @Input() inputEventId: string;
  private parentId=null;
  private firstParentId=null;
  private level;
  public isArrow;
  public browser=false;
  constructor(
  @Inject(PLATFORM_ID) private platformId: Object,  
  private formBuilder:FormBuilder,
  private localizeService: LocalizeRouterService,
  private authService:AuthService,
  private commentService:CommentService,
  private router:Router,
  private activatedRoute: ActivatedRoute,
  private authGuard:AuthGuard,
  private groupByPipe:GroupByPipe
  ) {
    this.createForm();  //Create Angular form when components load
  }
  // Function to create registration form
  private createForm() {
    this.form = this.formBuilder.group({
      // Comment Input
      'comment': ['', Validators.compose([Validators.required,Validators.maxLength(300)])]
    });
    this.formEdit = this.formBuilder.group({
      // Comment edit Input
      'commentEdit': ['', Validators.compose([Validators.required,Validators.maxLength(300)])]
    });
    this.comment = this.form.controls['comment'];
    this.commentEdit = this.formEdit.controls['commentEdit'];
  }
  public froalaOptions= {
     fileUpload: false,
     imageUpload: false,
     imageInsertButtons:[],
     videoUpload: false,
     videoInsertButtons:[]
  }
  public initializeFroala(initControls) {
    initControls.initialize();
  }
  private  markdown(string) {
    string = string.replace(/(^|[^@\w])@(\w{1,15})\b/g, '<span class="ks-reply-to">@$2</span>');
    string = string.replace(/\*\*(.+)\*\*/g, '<strong>$1</strong>');
    string = string.replace(/__(.+)__/g, '<strong>$1</strong>');
    string = string.replace(/\*(.+)\*/g, '<em>$1</em>');
    string = string.replace(/_(.+)_/g, '<em>$1</em>');
    string = string.replace(/``(.+)``/g, '<code>$1</code>');
    string = string.replace(/`(.+)`/g, '<code>$1</code>');
    return string;
  };
  private editComment(comment){
    this.editId=comment._id;
    this.commentEdit.setValue(comment.comment);
  }
  private deleteComment(comment,index){
    this.editId=undefined;
    if(this.comments[index].groupComments.some(c=> c.parentId === comment._id)){
      //edit comment
      comment.deleted=true;
      this.onSubmitEdit(comment);
 
    }else{
      //delete comment   
      this.commentService.deleteComment(this.authService.user.username,comment._id,this.localizeService.parser.currentLang).subscribe(data=>{
        if(data.success){ 
          this.messageClass = 'alert alert-success ks-solid'; // Set bootstrap success class
          this.message = data.message; // Set success messag
          this.getComments();
        }else{
          this.messageClass = 'alert alert-danger ks-solid'; // Set bootstrap error class
          this.message = data.message; // Set error message
        }
      });       
    }
  }
  private recoverComment(comment){
    comment.deleted=false;
    this.onSubmitEdit(comment);
  }

  private addReply(comment){
    this.parentId=comment._id;
    this.level=comment.level+1;
    if(comment.firstParentId){
      this.firstParentId=comment.firstParentId;
    }else{
      this.firstParentId=comment._id;
    }
    if (!this.form.get('comment').value) {
      this.form.controls['comment'].setValue('');
    }
    if(this.form.get('comment').value.search('@' + comment.createdBy)===-1){
      if (this.form.get('comment').value.substring(
        this.form.get('comment').value.lastIndexOf("<p>") + 3, 
        this.form.get('comment').value.lastIndexOf("</p>")
      )[0] === '@') {
        console.log("a");
        this.form.controls['comment'].setValue(', '+this.form.get('comment').value.substring(
        this.form.get('comment').value.lastIndexOf("<p>") + 3, 
        this.form.get('comment').value.lastIndexOf("</p>")
        ));
      }else {
        console.log("b");
        this.form.controls['comment'].setValue(' '+this.form.get('comment').value.substring(
        this.form.get('comment').value.lastIndexOf("<p>") + 3, 
        this.form.get('comment').value.lastIndexOf("</p>")
        ));      
      }
       this.form.controls['comment'].setValue('@' + comment.createdBy + this.form.get('comment').value);
       if (isPlatformBrowser(this.platformId)) {
        $("#textareaComment").focus();
      }  
    } 

  }
  public onSubmitEdit(comment){
    // Get authentication to send comment
    this.authService.getAuthentication(this.localizeService.parser.currentLang).subscribe(authentication => {
      if(!authentication.success){
        if (isPlatformBrowser(this.platformId)) {
          this.authService.logout();
          this.authGuard.redirectUrl=this.router.url;
          this.router.navigate([this.localizeService.translateRoute('/sign-in-route')]); // Return error and route to login page
        }
      }else{
        if(this.formEdit.get('commentEdit').value){
          if(this.formEdit.get('commentEdit').value.match(/(^|[^@\w])@(\w{1,15})\b/)){
            var mentionedUsers = this.formEdit.get('commentEdit').value.replace(/(^|[^@\w])@(\w{1,15})\b/g,'@271$2@272').match(/@271(.*?)@272/g).join().replace(/@271/g,'').replace(/@272/g,'').split(',');
          }                                                                                      
          console.log(this.formEdit.get('commentEdit').value);
          var span= this.markdown(this.formEdit.get('commentEdit').value.substring(
          this.formEdit.get('commentEdit').value.lastIndexOf("<p>") + 3, 
          this.formEdit.get('commentEdit').value.lastIndexOf("</p>")
          ));
            console.log(span)
            console.log(mentionedUsers);
            
            comment.comment=span;
            comment.mentionedUsers=mentionedUsers; 
        }
        comment.language=this.localizeService.parser.currentLang;                     
        this.submittedEdit = true;
        // Function to save comment into database
        this.commentService.editComment(comment).subscribe(data => {
          console.log(data);
          // Check if event was saved to database or not
          if (!data.success) {

            this.submittedEdit = false; // Enable submit button
          } else {
            this.createForm(); // Reset all form fields
            this.submittedEdit = false; // Enable submit button
        
          }
        });
      }
    });                 
  }   
  public onSubmit(){
    // Get authentication to send comment
    this.authService.getAuthentication(this.localizeService.parser.currentLang).subscribe(authentication => {
      if(!authentication.success){
        if (isPlatformBrowser(this.platformId)) {
          this.authService.logout();
          this.authGuard.redirectUrl=this.router.url;
          this.router.navigate([this.localizeService.translateRoute('/sign-in-route')]); // Return error and route to login page
        }
      }else{
        if(this.form.get('comment').value.match(/(^|[^@\w])@(\w{1,15})\b/)){
            var mentionedUsers = this.form.get('comment').value.replace(/(^|[^@\w])@(\w{1,15})\b/g,'@271$2@272').match(/@271(.*?)@272/g).join().replace(/@271/g,'').replace(/@272/g,'').split(',');
        }                                                                                      
        console.log(this.form.get('comment').value);
        var span= this.markdown(this.form.get('comment').value.substring(
        this.form.get('comment').value.lastIndexOf("<p>") + 3, 
        this.form.get('comment').value.lastIndexOf("</p>")
        ));                            
        console.log(span)
        console.log(mentionedUsers);
        this.commentClass.setEventId=this.inputEventId;
        this.commentClass.language=this.localizeService.parser.currentLang;
        this.commentClass.setCreatedBy=this.authService.user.username;
        this.commentClass.setComment=span;
        this.commentClass.setMentionedUsers=mentionedUsers;
        if(mentionedUsers){
          this.commentClass.setParentId=this.parentId;
          this.commentClass.firstParentId=this.firstParentId; 
          this.commentClass.level=this.level;
        }     
        this.submitted = true;
        // Function to save comment into database
        this.commentService.newComment(this.commentClass).subscribe(data => {
          console.log(data);
          // Check if event was saved to database or not
          if (!data.success) {
            this.submitted = false; // Enable submit button
          } else {
            this.createForm(); // Reset all form fields
            this.submitted = false; // Enable submit button
            this.getComments();
          }
        });
      }
    });                 
  }     
  private getComments(){
    this.commentService.getComments(this.inputEventId,this.localizeService.parser.currentLang).subscribe(data => {
      // Check if event was saved to database or not
      if (!data.success) {
        this.submitted = false; // Enable submit button
      } else {
        this.createForm(); // Reset all form fields
        this.submitted = false; // Enable submit button
        this.comments=data.comments;
      }
    });
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.browser=true
    } 
    this.getComments();
  }

}