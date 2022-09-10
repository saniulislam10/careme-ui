import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, NgForm, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subscription, EMPTY } from 'rxjs';
import { pluck, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Collection } from 'src/app/interfaces/collection';
import { AdminService } from 'src/app/services/admin.service';
import { CollectionService } from 'src/app/services/collection.service';
import { ReloadService } from 'src/app/services/reload.service';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.scss']
})
export class CollectionsComponent implements OnInit {

  createCollection = false;
  editCollectionData = false;
  dataForm: FormGroup;
  collections: Collection[] = [];
  id: any;
  subRouteOne: Subscription;
  searchQuery: any;

  @ViewChild('searchForm') searchForm: NgForm;
  holdPrevData: Collection[];
  searchCollections: any[];
  isLoading: boolean;
  searchInput: any;
  isFocused: any;
  isOpen: boolean;
  overlay: boolean;

  constructor(
    private fb : FormBuilder,
    private message: NzMessageService,
    private collectionService: CollectionService,
    private reloadService: ReloadService,
  ) { }

  ngOnInit(): void {

    this.reloadService.refreshCollections$
      .subscribe(() => {
        this.getAllCollections();
      });
    this.getAllCollections();

    if(this.createCollection){
      this.initModule();
    }
  }
  getAllCollections() {
    this.subRouteOne = this.collectionService.getAll()
    .subscribe( res => {
      this.collections = res.data;
      console.log(this.collections);
      this.holdPrevData = this.collections;
    }, err => {
      console.log(err);
      this.message.create('error', err.error.message);
    })
  }
  initModule() {
    this.dataForm = this.fb.group({
      name: [null, Validators.required],
      link: [null, Validators.required],
      logo: [null],
    });
  }
  /***
   * Control Create Vendor
   */
  hideCreate(){
    this.createCollection = false;
    this.id = null;
    this.editCollectionData = false;
  }
  showCreate(){
    this.editCollectionData = false;
    this.createCollection = true;
    this.initModule();
  }

  onSubmit(){
    let collection = {
      name: this.dataForm.value.name,
      link: this.dataForm.value.link,
    }
    console.log(this.id);
    if(this.id && this.editCollectionData){
      let finaldata = {...collection, ...{_id: this.id}};
      console.log(finaldata);
      this.editCollection(finaldata);
    }
    else if(this.dataForm.invalid){
      this.message.create('warning', 'Please input the required fields');
      return
    }
    else if(this.dataForm.value.password !== this.dataForm.value.confirmPassword){
      this.message.create('warning', 'Password Mismatch');
      return
    }else{
      this.addCollection(collection);
    }
  }


  editCollection(data : Collection){
    this.collectionService.editById(data)
      .subscribe( res => {
        console.log(res.message);
        this.message.create('success', res.message);
        this.reloadService.needRefreshCollections$();
        this.createCollection = false;

      }, err => {
        this.message.create('error', err.error.message);
      })
  }

  addCollection(data : Collection){
    this.collectionService.add(data)
      .subscribe( res => {
        console.log(res.message);
        this.message.create('success', res.message);
        this.reloadService.needRefreshCollections$();
      }, err => {
        this.message.create('error', err.error.messase);
      })
  }

  edit(data){
    this.id = data._id;
    this.initModule();
    this.createCollection = true;
    this.editCollectionData = true;
    this.dataForm.patchValue(data);
  }

  ngOnDestroy(){
    this.subRouteOne.unsubscribe();
  }

  ngAfterViewInit(): void {
    // this.searchAnim();
    const formValue = this.searchForm.valueChanges;

    formValue
      .pipe(
        // map(t => t.searchTerm)
        // filter(() => this.searchForm.valid),
        pluck('searchTerm'),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((data) => {
          this.searchQuery = data.trim();

          if (this.searchQuery) {
            return this.collectionService.getSearchCollections(this.searchQuery);
          } else {
            this.collections = this.holdPrevData;
            this.searchQuery = null;
            return EMPTY;
          }
        })
      )
      .subscribe(
        (res) => {
          this.searchCollections = res.data;
          this.collections = this.searchCollections;
        },
        () => {
          this.isLoading = false;
        }
      );
  }

  handleFocus(event: FocusEvent): void {
    this.searchInput.nativeElement.focus();

    if (this.isFocused) {
      return;
    }
    if (this.searchCollections.length > 0) {
      this.setPanelState(event);
    }
    this.isFocused = true;
  }

  private setPanelState(event: FocusEvent): void {
    if (event) {
      event.stopPropagation();
    }
    this.isOpen = false;
    this.handleOpen();
  }

  handleOpen(): void {
    if (this.isOpen || (this.isOpen && !this.isLoading)) {
      return;
    }
    if (this.searchCollections.length > 0) {
      this.isOpen = true;
      this.overlay = true;
    }
  }

  handleOutsideClick(): void {
    if (!this.isOpen) {
      // this.isFocused = false;
      return;
    }
    this.isOpen = false;
    this.overlay = false;
    this.isFocused = false;
  }

  handleCloseOnly(): void {
    if (!this.isOpen) {
      this.isFocused = false;
      return;
    }
    this.isOpen = false;
    this.overlay = false;
    this.isFocused = false;
  }

  handleCloseAndClear(): void {
    if (!this.isOpen) {
      this.isFocused = false;
      return;
    }
    this.isOpen = false;
    this.overlay = false;
    this.searchCollections = [];
    this.isFocused = false;
  }

  onClickSearchArea(event: MouseEvent): void {
    event.stopPropagation();
  }

}
