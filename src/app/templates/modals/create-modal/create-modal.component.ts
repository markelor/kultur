import { Component, OnInit,Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ObservableService } from '../../../services/observable.service';
import { AuthService } from '../../../services/auth.service';
import { LocalizeRouterService } from 'localize-router';
@Component({
  selector: 'create-modal',
  styleUrls: ['./create-modal.component.css'],
  templateUrl: './create-modal.component.html'
})

export class CreateModalComponent implements OnInit {
  public modalHeader;
  public modalContent;
  @Input() headerClass;
  @Input() route;
  @Input() operation;
  @Input() animationClass;
  constructor(
    private localizeService:LocalizeRouterService,
    private activeModal: NgbActiveModal,
    private authService: AuthService,
    private observableService: ObservableService,
    private router: Router
    ) {
  }

  public closeModal() {
    this.activeModal.close();
    this.observableService.modalCount=this.observableService.modalCount-1;

  }  
  public homeModal(){
    this.router.navigate(['/',this.localizeService.parser.currentLang]); // Navigate to dashboard view
    this.closeModal();
  }
  public confirmModal() {
    this.closeModal();
  }
  public routeModal(){
    ///event-route','manage-route','edit-route',event._id
    this.router.navigate([this.route]);
    this.closeModal();
  }
  public handleSVG(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute('width', '%100');
    svg.setAttribute('height', '200');
    return svg;
  }
  ngOnInit() {
    this.observableService.modalCount=this.observableService.modalCount+1;
  }
}
